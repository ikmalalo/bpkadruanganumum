/**
 * record-portrait.js
 * Script standalone untuk merekam semua slide preview portrait menjadi MP4 9:16
 * 
 * Cara pakai:
 *   node record-portrait.js
 *   node record-portrait.js --url http://localhost:5173/preview-vertikal
 *   node record-portrait.js --url https://bpkadruanganumum.vercel.app/preview-vertikal
 * 
 * Output: preview-portrait-YYYY-MM-DD.mp4 di folder yang sama
 */

const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// --- Config ---
const args = process.argv.slice(2);
const urlArg = args.find(a => a.startsWith('--url='))?.split('=')[1]
  || (args[args.indexOf('--url') + 1])
  || null;

const TARGET_URL = urlArg || 'http://localhost:5173/preview-vertikal';
const SLIDE_DURATION_MS = 5000;     // durasi per slide dalam rekaman
const CAPTURE_INTERVAL_MS = 200;    // interval antar screenshot (dalam ms)
const OUTPUT_FPS = 25;              // fps output video
const WIDTH = 450;                  // portrait 9:16 width
const HEIGHT = 800;                 // portrait 9:16 height
// -----------------

const framesPerSlide = Math.round(SLIDE_DURATION_MS / CAPTURE_INTERVAL_MS);
const outputFile = path.join(process.cwd(), `preview-portrait-${new Date().toISOString().slice(0,10)}.mp4`);

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portrait-record-'));
  console.log(`\n🎬 Mulai rekam preview portrait...`);
  console.log(`📄 URL: ${TARGET_URL}`);
  console.log(`📁 Temp dir: ${tmpDir}`);
  console.log(`⏱  Durasi per slide: ${SLIDE_DURATION_MS}ms`);
  console.log('─'.repeat(50));

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

    // Buka halaman dalam mode puppet (sembunyikan tombol UI)
    const puppetUrl = TARGET_URL.includes('?')
      ? `${TARGET_URL}&puppet=1`
      : `${TARGET_URL}?puppet=1`;

    console.log(`\n🌐 Membuka halaman...`);
    await page.goto(puppetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Tunggu loading spinner hilang
    console.log(`⏳ Menunggu data dimuat...`);
    await page.waitForFunction(() => {
      return !document.querySelector('.animate-spin');
    }, { timeout: 20000 }).catch(() => {
      console.log('  ⚠️  Loading timeout, lanjut...');
    });

    // Tunggu ekstra untuk Vanta + font
    await new Promise(r => setTimeout(r, 2500));

    // Hitung jumlah slide via window.__SLIDE_COUNT__ atau dots
    const totalSlides = await page.evaluate(() => {
      if (window.__SLIDE_COUNT__ && window.__SLIDE_COUNT__ > 0) return window.__SLIDE_COUNT__;
      return document.querySelectorAll('[data-slide-dot]').length;
    });

    if (totalSlides === 0) {
      console.error('❌ Tidak ada slide yang terdeteksi!');
      console.error('   Pastikan halaman bisa diakses dan data agenda tersedia.');
      await browser.close();
      fs.rmSync(tmpDir, { recursive: true, force: true });
      process.exit(1);
    }

    console.log(`✅ Total slide: ${totalSlides}`);
    console.log(`🎞  Frames per slide: ${framesPerSlide}`);
    console.log(`📸 Total frame: ${totalSlides * framesPerSlide}`);
    console.log('─'.repeat(50));

    // Capture frame per slide
    let frameIndex = 0;

    for (let slideIdx = 0; slideIdx < totalSlides; slideIdx++) {
      // Klik dot untuk pindah ke slide ini
      await page.evaluate((idx) => {
        const dots = document.querySelectorAll('[data-slide-dot]');
        if (dots[idx]) (dots[idx] as HTMLElement).click();
      }, slideIdx);

      // Tunggu animasi slide
      await new Promise(r => setTimeout(r, 600));

      process.stdout.write(`  📷 Slide ${slideIdx + 1}/${totalSlides} `);

      for (let f = 0; f < framesPerSlide; f++) {
        const framePath = path.join(tmpDir, `frame_${String(frameIndex).padStart(6, '0')}.png`);
        await page.screenshot({ path: framePath, type: 'png' });
        frameIndex++;
        await new Promise(r => setTimeout(r, CAPTURE_INTERVAL_MS));

        if ((f + 1) % 10 === 0) process.stdout.write('.');
      }
      console.log(` ✓ (${framesPerSlide} frames)`);
    }

    await browser.close();
    browser = null;

    console.log('─'.repeat(50));
    console.log(`\n🎬 Encoding ${frameIndex} frames → MP4...`);

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(tmpDir, 'frame_%06d.png'))
        .inputFPS(1000 / CAPTURE_INTERVAL_MS)
        .outputOptions([
          `-vf scale=${WIDTH * 2}:${HEIGHT * 2}`,
          '-c:v libx264',
          '-preset fast',
          '-crf 22',
          '-pix_fmt yuv420p',
          `-r ${OUTPUT_FPS}`,
          '-movflags +faststart'
        ])
        .output(outputFile)
        .on('progress', (p) => {
          if (p.percent) process.stdout.write(`\r  ⚙️  Encoding: ${Math.round(p.percent)}%   `);
        })
        .on('end', () => { console.log('\r  ✅ Encoding selesai!              '); resolve(null); })
        .on('error', reject)
        .run();
    });

    fs.rmSync(tmpDir, { recursive: true, force: true });

    const sizeMB = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(1);
    console.log('─'.repeat(50));
    console.log(`\n✅ Video tersimpan!`);
    console.log(`📂 File: ${outputFile}`);
    console.log(`📦 Ukuran: ${sizeMB} MB`);
    console.log(`🎥 Format: MP4 Portrait 9:16 (${WIDTH * 2}×${HEIGHT * 2}px @ ${OUTPUT_FPS}fps)`);
    console.log(`⏱  Durasi: ~${Math.round((totalSlides * SLIDE_DURATION_MS) / 1000)} detik\n`);

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    if (browser) await browser.close().catch(() => {});
    fs.rmSync(tmpDir, { recursive: true, force: true });
    process.exit(1);
  }
}

main();
