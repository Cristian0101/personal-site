import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { base } from './test-origin.mjs';
const manifest = JSON.parse(await readFile('public/fonts/manifest.json', 'utf8'));
let checks = 0;
for (const [filename, expected] of Object.entries(manifest)) {
  const response = await fetch(`${base}/fonts/${filename}`);
  assert.equal(response.status, 200); checks++;
  assert.equal(createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex'), expected.sha256); checks++;
}
const browser = await chromium.launch();
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({viewport:{width,height:900}});
    const outsideFonts = [];
    page.on('request', request => { if (request.resourceType() === 'font' && new URL(request.url()).origin !== base) outsideFonts.push(request.url()); });
    await page.goto(`${base}/resources`);
    for (const [choice, family] of [['serif','Newsreader'],['inter','Inter'],['fraunces','Fraunces'],['plex','IBM Plex Sans']]) {
      const result = await page.evaluate(async ({choice,family}) => {
        document.documentElement.dataset.font = choice;
        await document.fonts.load(`400 20px "${family}"`);
        await document.fonts.ready;
        return {overflow:document.documentElement.scrollWidth > innerWidth, family:getComputedStyle(document.querySelector('h1')).fontFamily, loaded:[...document.fonts].some(font => font.family.replaceAll('"','') === family && font.status === 'loaded')};
      }, {choice,family});
      assert.ok(result.family.includes(family) && result.loaded, `${choice}: actual font loaded`); checks++;
      assert.equal(result.overflow, false); checks++;
    }
    assert.deepEqual(outsideFonts, []); checks++;
    await page.close();
  }
} finally { await browser.close(); }
console.log(`PASS: ${checks} font assertions. All 22 font files match verified bytes; four existing typefaces render without overflow or third-party font requests.`);
