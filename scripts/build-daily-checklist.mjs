/** Rebuild the free worksheet: node scripts/build-daily-checklist.mjs
 * Prerequisite: npm ci && npx playwright install chromium
 * Source HTML is deliberately self-contained; no network, analytics, or fonts.
 */
import { chromium } from 'playwright';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'content/resources/sdr-bdr-daily-checklist.html');
const output = path.join(root, 'public/downloads');
await mkdir(output, { recursive: true });
await copyFile(source, path.join(output, 'sdr-bdr-daily-checklist.html'));
const browser = await chromium.launch({headless: true});
try {
  const page = await browser.newPage({viewport:{width:1100,height:1200},deviceScaleFactor:2});
  await page.setContent(await readFile(source, 'utf8'), {waitUntil:'load'});
  await page.emulateMedia({media:'print'});
  if (await page.locator('.page').count() !== 2) throw new Error('Daily checklist must have exactly two pages.');
  const overflow = await page.locator('.page').evaluateAll(pages => pages.map((p,i)=>({page:i+1,content:p.scrollHeight,height:p.clientHeight})).filter(p=>p.content>p.height));
  const footerOverlaps = await page.locator('.page').evaluateAll(pages => pages.flatMap((p,i) => { const footer = p.querySelector('footer').getBoundingClientRect(); return Array.from(p.children).filter(c => c.tagName !== 'FOOTER' && c.getBoundingClientRect().bottom > footer.top - 8).map(c => ({page:i+1,element:c.tagName})); }));
  if (footerOverlaps.length) throw new Error(`Worksheet footer overlap: ${JSON.stringify(footerOverlaps)}`);
  if (overflow.length) throw new Error(`Worksheet page overflow: ${JSON.stringify(overflow)}`);
  await page.pdf({path:path.join(output,'sdr-bdr-daily-checklist.pdf'), preferCSSPageSize:true, printBackground:true, tagged:true, outline:true});
  await mkdir(path.join(root,'public/resources'),{recursive:true});
  for (let i = 0; i < await page.locator('.page').count(); i++) {
    await page.locator('.page').nth(i).screenshot({path:path.join(output,`sdr-bdr-daily-checklist-page-${i+1}.png`)});
  }
  await page.locator('.page').first().screenshot({path:path.join(root,'public/resources/sdr-bdr-daily-checklist-preview.png')});
  console.log('Built two-page PDF, labeled HTML, first-page preview, and two 2x PNG page images.');
} finally { await browser.close(); }
