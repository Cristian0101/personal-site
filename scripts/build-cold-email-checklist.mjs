/** Rebuild the free worksheet: node scripts/build-cold-email-checklist.mjs
 * Uses the existing Playwright Chromium installation. No network, fonts, or analytics.
 * The HTML is an ephemeral worksheet; PDF and PNG copies are blank and printable.
 */
import { chromium } from 'playwright';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stem = 'cold-email-teardown-checklist';
const source = path.join(root, 'content/resources', `${stem}.html`);
const output = path.join(root, 'public/downloads');
const previews = path.join(root, 'public/resources');
const html = await readFile(source, 'utf8');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 1200 }, deviceScaleFactor: 2 });
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.setContent(html, { waitUntil: 'load' });
  if (requests.length) throw new Error(`Unexpected worksheet requests: ${requests.join(', ')}`);
  if (await page.locator('.page').count() !== 3) throw new Error('Cold email checklist must have exactly three pages.');
  const unlabeled = await page.locator('input, textarea').evaluateAll(controls => controls.filter(control => !control.labels?.length).map(control => control.name));
  if (unlabeled.length) throw new Error(`Unlabeled worksheet controls: ${unlabeled.join(', ')}`);
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 1000 });
    const errors = await page.evaluate(() => {
      const errors = [];
      if (document.documentElement.scrollWidth > window.innerWidth) errors.push('horizontal page overflow');
      document.querySelectorAll('.page').forEach((section, index) => {
        const footer = section.querySelector('footer').getBoundingClientRect();
        for (const child of section.children) {
          if (child.tagName !== 'FOOTER' && child.getBoundingClientRect().bottom > footer.top - 8) errors.push(`page ${index + 1} footer overlap`);
        }
      });
      return errors;
    });
    if (errors.length) throw new Error(`At ${width}px: ${errors.join(', ')}`);
  }
  await page.setViewportSize({ width: 1100, height: 1200 });
  await page.emulateMedia({ media: 'print' });
  const pageErrors = await page.locator('.page').evaluateAll(pages => pages.flatMap((section, index) => {
    const errors = [];
    if (section.scrollHeight > section.clientHeight) errors.push(`page ${index + 1} overflow`);
    const footer = section.querySelector('footer').getBoundingClientRect();
    for (const child of section.children) {
      if (child.tagName !== 'FOOTER' && child.getBoundingClientRect().bottom > footer.top - 8) errors.push(`page ${index + 1} footer overlap: ${child.tagName}`);
    }
    return errors;
  }));
  if (pageErrors.length) throw new Error(pageErrors.join(', '));
  await mkdir(output, { recursive: true });
  await mkdir(previews, { recursive: true });
  await copyFile(source, path.join(output, `${stem}.html`));
  await page.pdf({ path: path.join(output, `${stem}.pdf`), preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  for (let index = 0; index < 3; index++) {
    await page.locator('.page').nth(index).screenshot({ path: path.join(output, `${stem}-page-${index + 1}.png`) });
  }
  await copyFile(path.join(output, `${stem}-page-1.png`), path.join(previews, `${stem}-preview.png`));
  console.log('Built three-page PDF, labeled HTML, 1632x2112 PNG pages, and first-page preview. Responsive checks passed at 320, 390, and 768px.');
} finally {
  await browser.close();
}
