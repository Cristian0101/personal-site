/**
 * Render the SDR/BDR Job Mastery front cover (rebuilt at 4K from the approved design) from
 * private-work/northmark-press/sdr-bdr-job-mastery/cover/src/cover.html.
 *
 * Outputs (private, gitignored) in cover/:
 *   cover-background-3000x4000.jpg  bitmap layer: gradient sky, arc glow, grain
 *   sdr-bdr-job-mastery-cover-3000x4000.png  full cover, 3000×4000 (4K-class), for previews/site use
 *   sdr-bdr-job-mastery-cover.pdf  one-page 7.5×10 in PDF: bitmap background + vector type + photo
 *
 * Usage: node scripts/northmark-press/sdr-bdr-job-mastery/build_cover.mjs
 * Then:  node scripts/northmark-press/sdr-bdr-job-mastery/build.mjs --cover private-work/.../cover/sdr-bdr-job-mastery-cover.pdf
 */
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const dir = path.join(root, 'private-work/northmark-press/sdr-bdr-job-mastery/cover');
const src = pathToFileURL(path.join(dir, 'src/cover.html')).href;
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
try {
  // 720×960 CSS px = 7.5×10 in at 96 dpi; ×(3000/720) gives 3000×4000.
  const scale = 3000 / 720;
  const ctx = await browser.newContext({ viewport: { width: 720, height: 960 }, deviceScaleFactor: scale });
  const page = await ctx.newPage();
  await page.goto(src, { waitUntil: 'load' });
  await page.evaluate(() => document.body.classList.add('bg'));
  await page.screenshot({ path: path.join(dir, 'src/cover-background-3000x4000.jpg'), type: 'jpeg', quality: 92 });
  // Reload the freshly written background bitmap (the page loaded the previous one at startup).
  await page.evaluate(() => {
    document.body.classList.remove('bg'); document.body.classList.add('final');
    const img = document.querySelector('image.bgimg');
    img.setAttribute('href', `cover-background-3000x4000.jpg?v=${Date.now()}`);
  });
  await page.waitForTimeout(500);
  await page.waitForFunction(() => [...document.images].every(i => i.complete) && document.fonts.status === 'loaded');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(dir, 'sdr-bdr-job-mastery-cover-3000x4000.png') });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: path.join(dir, 'sdr-bdr-job-mastery-cover.pdf'), preferCSSPageSize: true, printBackground: true });
  console.log('Cover rendered: 3000×4000 PNG and vector-type PDF in', path.relative(root, dir));
} finally { await browser.close(); }
