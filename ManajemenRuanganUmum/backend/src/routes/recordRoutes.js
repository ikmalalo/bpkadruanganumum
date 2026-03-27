const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const WIDTH = 450;
const HEIGHT = 800;

router.get('/portrait', async (req, res) => {
  const frontendUrl = req.query.url || 'http://localhost:5173/preview-vertikal';
  const slideDurationMs = parseInt(req.query.slideDuration) || 5000;
  
  const OUTPUT_FPS = 30;
  const CAPTURE_INTERVAL_MS = Math.floor(1000 / OUTPUT_FPS);
  const framesPerSlide = Math.round(slideDurationMs / CAPTURE_INTERVAL_MS);

  // Buat temp dir di server cloud
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portrait-record-'));
  const timestamp = new Date().toISOString().slice(0, 10) + '-' + new Date().getHours() + new Date().getMinutes();
  
  // File sementara disimpan di server
  const outputPath = path.join(tmpDir, `preview-portrait-${timestamp}.mp4`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', `--window-size=${WIDTH},${HEIGHT}`]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

    const targetUrl = frontendUrl.includes('?') ? `${frontendUrl}&puppet=1` : `${frontendUrl}?puppet=1`;
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    await page.waitForFunction(() => {
      return !document.querySelector('.animate-spin');
    }, { timeout: 45000 }).catch(() => {});

    await new Promise(r => setTimeout(r, 6000));

    const totalSlides = await page.evaluate(() => {
      if (window.__SLIDE_COUNT__ && window.__SLIDE_COUNT__ > 0) return window.__SLIDE_COUNT__;
      return document.querySelectorAll('[data-slide-dot]').length;
    });

    if (!totalSlides || totalSlides === 0) {
      throw new Error('Tidak ada slide terdeteksi di halaman tersebut. Pastikan data tersedia.');
    }

    let frameIndex = 0;

    for (let slideIdx = 0; slideIdx < totalSlides; slideIdx++) {
      await page.evaluate((idx) => {
        const dots = document.querySelectorAll('[data-slide-dot]');
        if (dots[idx]) dots[idx].click();
      }, slideIdx);

      await new Promise(r => setTimeout(r, 500));

      for (let f = 0; f < framesPerSlide; f++) {
        const startCap = Date.now();
        const framePath = path.join(tmpDir, `frame_${String(frameIndex).padStart(6, '0')}.jpg`);
        await page.screenshot({ path: framePath, type: 'jpeg', quality: 90 });
        frameIndex++;
        
        const elapsed = Date.now() - startCap;
        const remainder = Math.max(0, CAPTURE_INTERVAL_MS - elapsed);
        if (remainder > 0) await new Promise(r => setTimeout(r, remainder));
      }
    }

    await browser.close();
    browser = null;

    // Encode
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(tmpDir, 'frame_%06d.jpg'))
        .inputFPS(OUTPUT_FPS)
        .outputOptions([
          `-vf scale=${WIDTH * 2}:${HEIGHT * 2}`,
          '-c:v libx264', '-preset fast', '-crf 22', '-pix_fmt yuv420p', `-r ${OUTPUT_FPS}`, '-movflags +faststart'
        ])
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // KIRIM FILE DARI SERVER CLOUD KE MAC/WINDOWS/HP KLIENT
    res.download(outputPath, `Preview-Portrait-${timestamp}.mp4`, (err) => {
      if (err) console.error('[API] Download Stream Error:', err);
      // Hapus sampah frame dan video di server agar tidak bocor
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

  } catch (err) {
    console.error('[RECORD] Error:', err);
    if (browser) await browser.close().catch(() => {});
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (!res.headersSent) res.status(500).json({ error: err.message || 'Recording failed' });
  }
});

module.exports = router;
