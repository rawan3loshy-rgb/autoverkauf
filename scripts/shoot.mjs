/**
 * Screenshots der laufenden Anwendung – für die visuelle Kontrolle während der Entwicklung.
 * Aufruf: node scripts/shoot.mjs <port> <pfad> [desktop|mobile] [full|fold] [scrollY]
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [, , portArg, pathArg = '/', device = 'desktop', mode = 'fold', scrollArg = '0'] = process.argv;
const port = portArg || '57001';
const scrollY = Number(scrollArg) || 0;

const viewport =
  device === 'mobile'
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 };

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--no-sandbox', '--disable-dev-shm-usage'],
});

const page = await browser.newPage();
await page.setViewport(viewport);
page.on('console', (m) => {
  if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text().slice(0, 200));
});
page.on('pageerror', (e) => console.log('PAGE ERROR:', String(e).slice(0, 200)));
page.on('requestfailed', (r) => console.log('REQ FAILED:', r.url().slice(0, 120)));

const url = `http://localhost:${port}${pathArg}`;
const res = await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
console.log('status', res?.status());

// Alle Reveal-Animationen auslösen und Bilder laden lassen.
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let y = 0;
    const step = () => {
      y += window.innerHeight * 0.8;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight) setTimeout(step, 60);
      else {
        window.scrollTo(0, 0);
        setTimeout(resolve, 400);
      }
    };
    step();
  });
});
await new Promise((r) => setTimeout(r, 700));

if (scrollY) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await new Promise((r) => setTimeout(r, 500));
}

await fs.mkdir('scripts/.cache/shots', { recursive: true });
const name = `${pathArg.replace(/\W+/g, '_') || 'home'}-${device}${scrollY ? `-${scrollY}` : ''}`;
const out = `scripts/.cache/shots/${name}.png`;
await page.screenshot({ path: out, fullPage: mode === 'full' });
console.log('->', out);

await browser.close();
