const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Portrait 9:16 dimensions
const WIDTH = 450;
const HEIGHT = 800;

/**
 * GET /api/record/portrait
 * Query params:
 *   - url: full URL of the preview-vertikal page (default: http://localhost:5173/preview-vertikal)
 *   - slideDuration: ms per slide (default: 5000)
 *   - fps: frames per second for output video (default: 25)
 */
router.get('/portrait', async (req, res) => {
  const frontendUrl = req.query.url || 'http://localhost:5173/preview-vertikal';
  const slideDurationMs = parseInt(req.query.slideDuration) || 5000;
  const fps = parseInt(req.query.fps) || 25;
  // frames captured per slide (we'll take a screenshot every captureInterval ms)
  const captureIntervalMs = 200; // 5 fps capture rate → smooth enough
  const framesPerSlide = Math.round(slideDurationMs / captureIntervalMs);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portrait-record-'));
  const outputPath = path.join(tmpDir, 'preview-portrait.mp4');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        `--window-size=${WIDTH},${HEIGHT}`
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

    // Open the page in puppet mode (hides back button & record button)
    const targetUrl = `${frontendUrl}?puppet=1`;
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for content to load (loading spinner to disappear)
    await page.waitForFunction(() => {
      const spinner = document.querySelector('.animate-spin');
      return !spinner;
    }, { timeout: 20000 }).catch(() => {});

    // Give extra time for Vanta + fonts
    await new Promise(r => setTimeout(r, 2000));

    // Get total number of slides by counting dot indicators
    const totalSlides = await page.evaluate(() => {
      // The dots are rendered as small divs in the page indicator row
      const dots = document.querySelectorAll('[data-slide-dot]');
      if (dots.length > 0) return dots.length;
      // Fallback: count via window.__SLIDE_COUNT__ if injected
      return window.__SLIDE_COUNT__ || 0;
    });

    console.log(`[RECORD] Total slides detected: ${totalSlides}`);

    if (totalSlides === 0) {
      await browser.close();
      fs.rmSync(tmpDir, { recursive: true, force: true });
      return res.status(400).json({ error: 'No slides detected. Make sure the preview page is accessible and has data.' });
    }

    // Capture frames for each slide
    let frameIndex = 0;
    const frameFiles = [];

    for (let slideIdx = 0; slideIdx < totalSlides; slideIdx++) {
      // Click the dot to jump to this slide
      await page.evaluate((idx) => {
        const dots = document.querySelectorAll('[data-slide-dot]');
        if (dots[idx]) dots[idx].click();
      }, slideIdx);

      // Wait for slide transition animation
      await new Promise(r => setTimeout(r, 600));

      // Capture frames for this slide duration
      for (let f = 0; f < framesPerSlide; f++) {
        const framePath = path.join(tmpDir, `frame_${String(frameIndex).padStart(6, '0')}.png`);
        await page.screenshot({ path: framePath, type: 'png' });
        frameFiles.push(framePath);
        frameIndex++;
        await new Promise(r => setTimeout(r, captureIntervalMs));
      }

      console.log(`[RECORD] Slide ${slideIdx + 1}/${totalSlides} captured (${framesPerSlide} frames)`);
    }

    await browser.close();
    browser = null;

    console.log(`[RECORD] Total frames: ${frameIndex}. Encoding video...`);

    // Encode frames to MP4 portrait 9:16
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(tmpDir, 'frame_%06d.png'))
        .inputFPS(1000 / captureIntervalMs) // input fps = 1000/200 = 5
        .outputOptions([
          `-vf scale=${WIDTH * 2}:${HEIGHT * 2}`,  // retina → match deviceScaleFactor:2
          '-c:v libx264',
          '-preset fast',
          '-crf 22',
          '-pix_fmt yuv420p',
          `-r ${fps}`,           // output fps (smooth playback)
          '-movflags +faststart'
        ])
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    console.log(`[RECORD] Video encoded: ${outputPath}`);

    // Stream the file back
    const stat = fs.statSync(outputPath);
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="preview-portrait-${Date.now()}.mp4"`);
    res.setHeader('Content-Length', stat.size);

    const readStream = fs.createReadStream(outputPath);
    readStream.pipe(res);
    readStream.on('close', () => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

  } catch (err) {
    console.error('[RECORD] Error:', err);
    if (browser) await browser.close().catch(() => {});
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Recording failed' });
    }
  }
});

module.exports = router;
