/** Rebuild the original three-page practice aid with existing Playwright.
 * Run: node scripts/build-cold-call-scorecard.mjs
 * Self-contained HTML: no network, analytics, storage, or external fonts.
 */
import { chromium } from 'playwright';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'cold-call-practice-scorecard';
const source = path.join(root, `content/resources/${slug}.html`);
const output = path.join(root, 'public/downloads');
const html = await readFile(source, 'utf8');
await mkdir(output, { recursive: true });
await mkdir(path.join(root, 'public/resources'), { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 1200 }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'load' });
  if (await page.locator('.page').count() !== 3) throw new Error('The cold-call scorecard must have exactly three pages.');
  if (await page.locator('input:checked').count()) throw new Error('Practice choices must start blank.');
  const unlabeled = await page.locator('input,textarea').evaluateAll(controls => controls.filter(c => !c.labels?.length).map(c => c.name));
  if (unlabeled.length) throw new Error(`Unlabeled fields: ${JSON.stringify(unlabeled)}`);
  for (const width of [320, 390, 768, 1100]) {
    await page.setViewportSize({ width, height: 1200 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error(`Responsive HTML overflow at ${width}px`);
  }
  await page.setViewportSize({ width: 1100, height: 1200 });
  await page.emulateMedia({ media: 'print' });
  const overflow = await page.locator('.page').evaluateAll(pages => pages.map((p, i) => ({ page: i + 1, content: p.scrollHeight, height: p.clientHeight })).filter(p => p.content > p.height));
  const footerOverlaps = await page.locator('.page').evaluateAll(pages => pages.flatMap((p, i) => {
    const footer = p.querySelector('footer').getBoundingClientRect();
    return Array.from(p.children).filter(c => c.tagName !== 'FOOTER' && c.getBoundingClientRect().bottom > footer.top - 8).map(c => ({ page: i + 1, element: c.tagName, bottom: c.getBoundingClientRect().bottom, footer: footer.top }));
  }));
  if (overflow.length || footerOverlaps.length) throw new Error(`Print overflow: ${JSON.stringify({ overflow, footerOverlaps })}`);
  await copyFile(source, path.join(output, `${slug}.html`));
  await page.pdf({ path: path.join(output, `${slug}.pdf`), preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  for (let i = 0; i < 3; i++) {
    const size = await page.locator('.page').nth(i).boundingBox();
    if (size.width !== 816 || size.height !== 1056) throw new Error(`Unexpected export dimensions on page ${i + 1}`);
    await page.locator('.page').nth(i).screenshot({ path: path.join(output, `${slug}-page-${i + 1}.png`) });
  }
  await copyFile(path.join(output, `${slug}-page-1.png`), path.join(root, `public/resources/${slug}-preview.png`));
  console.log('Built three-page PDF, labeled responsive HTML, three 1632x2112 PNG page images, and first-page preview. All blank controls, labels, responsive widths, page dimensions, and print boundaries passed.');
} finally {
  await browser.close();
}
