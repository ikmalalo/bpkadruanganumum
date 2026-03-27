const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    page.on('console', msg => console.log('💻 [Browser Log]:', msg.type().toUpperCase(), msg.text()));
    
    console.log('Membuka Vercel...');
    await page.goto('https://bpkadruanganumum.vercel.app/preview-vertikal?puppet=1', { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('Menunggu...');
    await new Promise(r => setTimeout(r, 8000));
    
    const count = await page.evaluate(() => {
        return {
            slideCount: window.__SLIDE_COUNT__ || 0,
            dots: document.querySelectorAll('[data-slide-dot]').length,
            html: document.body.innerHTML.substring(0, 500)
        }
    });
    
    console.log('Hasil di Vercel:', count);
    await browser.close();
})();
