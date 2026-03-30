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
    // Samarkan Puppeteer sebagai browser Chrome asli agar tidak diblokir sistem anti-bot (seperti Vercel Edge / Cloudflare)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    // deviceScaleFactor 2.4 menghasilkan resolusi tepat Full HD (1080x1920). Kualitas tertinggi.
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2.4 });

    // Dengarkan log console browser untuk debugging Vercel jika gagal
    page.on('console', msg => console.log('💻 [Browser Log]:', msg.type().toUpperCase(), msg.text()));

    const targetUrl = frontendUrl.includes('?') ? `${frontendUrl}&puppet=1` : `${frontendUrl}?puppet=1`;
    console.log('[RECORD] Membuka URL:', targetUrl);
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Tunggu sampai layar loading muter hilang DAN minimal 1 dot muncul (atau slide count > 0)
    await page.waitForFunction(() => {
      const isSpinning = document.querySelector('.animate-spin');
      const hasSlides = (window.__SLIDE_COUNT__ && window.__SLIDE_COUNT__ > 0) || document.querySelectorAll('[data-slide-dot]').length > 0;
      return !isSpinning && hasSlides;
    }, { timeout: 30000 }).catch(() => {
      console.log('[RECORD] Timeout menunggu loading selesai / data tidak termuat.');
    });

    await new Promise(r => setTimeout(r, 4000));

    const totalSlides = await page.evaluate(() => {
      if (window.__SLIDE_COUNT__ && window.__SLIDE_COUNT__ > 0) return window.__SLIDE_COUNT__;
      return document.querySelectorAll('[data-slide-dot]').length;
    });

    if (!totalSlides || totalSlides === 0) {
      // AMBIL SCREENSHOT JIKA GAGAL DIMUAT BIAR BISA DILIHAT
      const errImage = path.join(os.tmpdir(), 'error-puppet.png');
      await page.screenshot({ path: errImage });
      console.log('📸 Screenshot error tersimpan di:', errImage);
      const dom = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
      console.log('📝 DOM Awal:', dom);

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
        
        // Update progress bar frame demi frame (sync dengan Puppeteer)
        await page.evaluate((currentFrame, totalFrames) => {
          if (typeof window.__SET_PROGRESS === 'function') {
            window.__SET_PROGRESS((currentFrame / totalFrames) * 100);
          }
        }, f + 1, framesPerSlide);

        const framePath = path.join(tmpDir, `frame_${String(frameIndex).padStart(6, '0')}.jpg`);
        // quality 80 memperkecil ukuran gambar per frame agar memori lebih longgar
        await page.screenshot({ path: framePath, type: 'jpeg', quality: 80 });
        frameIndex++;
        
        const elapsed = Date.now() - startCap;
        const remainder = Math.max(0, CAPTURE_INTERVAL_MS - elapsed);
        if (remainder > 0) await new Promise(r => setTimeout(r, remainder));
      }
    }

    await browser.close();
    browser = null;
    
    // Opsional: tunggu 1 detik agar linux membebaskan RAM chromesense
    await new Promise(r => setTimeout(r, 1000));

    // Encode
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(tmpDir, 'frame_%06d.jpg'))
        .inputFPS(OUTPUT_FPS)
        .outputOptions([
          // Full HD Portrait! 1080 x 1920 (Habis dibagi 2 dengan sempurna)
          `-vf scale=1080:1920`,
          '-c:v libx264', 
          '-preset medium', // Sangat butuh agar CPU/RAM limit railway tdk ngos-ngosan
          '-crf 16', 
          '-pix_fmt yuv420p', 
          `-r ${OUTPUT_FPS}`, 
          '-movflags +faststart',
          '-threads 1' // BATASI 1 THREAD AGAR TIDAK OOM (Out Of Memory) SIGNAL KILL
        ])
        .output(outputPath)
        .on('end', resolve)
        .on('error', (err, stdout, stderr) => {
          console.error('[API] FFmpeg Error:', err.message);
          console.error('[API] FFmpeg Stderr:', stderr);
          reject(err);
        })
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
