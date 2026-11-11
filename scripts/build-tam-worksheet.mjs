/** Rebuild: node scripts/build-tam-worksheet.mjs
 * Uses the existing Playwright dependency and installed Chromium.
 * All worksheet HTML, styles and controls are local; no external assets.
 */
import { chromium } from 'playwright';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'tam-segmentation-worksheet';
const source = path.join(root, `content/resources/${slug}.html`);
const output = path.join(root, 'public/downloads');
await mkdir(output, {recursive:true});
await mkdir(path.join(root, 'public/resources'), {recursive:true});
await copyFile(source, path.join(output, `${slug}.html`));
const browser = await chromium.launch({headless:true});
try {
  const page = await browser.newPage({viewport:{width:1100,height:1200},deviceScaleFactor:2});
  await page.setContent(await readFile(source, 'utf8'), {waitUntil:'load'});
  await page.emulateMedia({media:'print'});
  const pages = page.locator('.page');
  if (await pages.count() !== 3) throw new Error('TAM worksheet must have exactly three pages.');
  const issues = await pages.evaluateAll(nodes => nodes.flatMap((p,i) => {
    const errors = [];
    if (p.scrollHeight > p.clientHeight) errors.push({page:i+1,type:'overflow',content:p.scrollHeight,height:p.clientHeight});
    const footer = p.querySelector('footer').getBoundingClientRect();
    for (const child of p.children) if (child.tagName !== 'FOOTER' && child.getBoundingClientRect().bottom > footer.top-8) errors.push({page:i+1,type:'footer overlap',element:child.tagName});
    return errors;
  }));
  if (issues.length) throw new Error(JSON.stringify(issues));
  await page.pdf({path:path.join(output,`${slug}.pdf`),preferCSSPageSize:true,printBackground:true,tagged:true,outline:true});
  for (let i=0;i<3;i++) await pages.nth(i).screenshot({path:path.join(output,`${slug}-page-${i+1}.png`)});
  await pages.first().screenshot({path:path.join(root,`public/resources/${slug}-preview.png`)});
  for (let i=1;i<=3;i++) {
    const png = await readFile(path.join(output,`${slug}-page-${i}.png`));
    if (png.readUInt32BE(16)!==1632 || png.readUInt32BE(20)!==2112) throw new Error(`Page ${i} PNG dimensions are incorrect.`);
  }
  await page.emulateMedia({media:'screen'});
  for (const width of [320,390,768,1100]) {
    await page.setViewportSize({width,height:1000});
    const result = await page.evaluate(() => ({width:innerWidth,documentWidth:document.documentElement.scrollWidth,unlabeled:Array.from(document.querySelectorAll('input,textarea')).filter(c=>!c.labels?.length).map(c=>c.name),controls:document.querySelectorAll('input,textarea').length}));
    if (result.documentWidth > width || result.unlabeled.length) throw new Error(`Responsive or label check failed: ${JSON.stringify(result)}`);
    if (width <= 840) {
      const caption = await page.locator('caption').boundingBox();
      if (!caption || caption.width < width-100 || caption.height > 70) throw new Error(`Mobile table caption did not reflow at ${width}px.`);
    }
    console.log(`Responsive/label checks passed: ${JSON.stringify(result)}`);
  }
  console.log('Built 3-page PDF, labeled HTML, first-page preview, and three 1632x2112 PNG pages.');
} finally { await browser.close(); }
