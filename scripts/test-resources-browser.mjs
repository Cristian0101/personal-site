/** Disposable headless test contexts for the local site; never attach to a user browser. */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { base } from './test-origin.mjs';
import { mkdir } from 'node:fs/promises';
import { resourceFixtures } from './resource-fixtures.mjs';
const browser = await chromium.launch();
await mkdir('output/resources-qa',{recursive:true});
let checks = 0;
try {
  for(const width of [320,390,768,1440]) for(const theme of ['light','dark']) {
    const context = await browser.newContext({viewport:{width,height:900}, reducedMotion:'reduce'});
    await context.addInitScript(theme => localStorage.setItem('theme',theme), theme);
    const page = await context.newPage(); const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    for(const path of ['/resources', ...resourceFixtures.map(resource => `/resources/${resource.slug}`)]) {
      await page.goto(base+path); await page.locator('h1').waitFor(); await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('h1').count(),1); checks++;
      assert.equal(await page.locator('main').count(),1); checks++;
      assert.equal(await page.locator('nav a[aria-current="page"]').textContent(),'Resources'); checks++;
      const sizes=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.equal(sizes.width,width); assert.ok(sizes.scroll<=width,`${path} overflow at ${width} ${theme}`); checks++;
      const nav=await page.locator('nav').boundingBox(); assert.ok(nav.x>=0 && nav.x+nav.width<=width+1); checks++;
      if(path !== '/resources') {
        await page.locator('.resource-sheet-preview > summary').press('Enter');
        await page.locator('details[open] img').waitFor({state:'visible'});
        await page.waitForFunction(()=>[...document.images].every(i=>i.complete && i.naturalWidth>0)); checks++;
        assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth))<=width); checks++;
        await page.locator('.resource-sheet-preview > summary').press('Enter'); assert.equal(await page.locator('details[open]').count(),0); checks++;
      }
      if(width===390 || width===1440) await page.screenshot({path:`output/resources-qa/${path.split('/').pop()}-${width}-${theme}.png`,fullPage:true});
    }
    assert.deepEqual(errors,[]); checks++; await context.close();
  }
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const page = await context.newPage();
  const settle=()=>page.locator('.page-pane.is-leaving').waitFor({state:'detached'});
  await page.goto(base+'/resources');
  for(let i=0;i<2;i++) {
    await page.getByRole('link',{name:'Get the scorecard',exact:true}).click(); await page.getByRole('heading',{name:'Interview Prep Scorecard',exact:true,level:1}).waitFor(); await settle();
    assert.equal(await page.locator('h1').textContent(),'Interview Prep Scorecard'); checks++;
    await page.goBack(); await page.getByRole('heading',{name:'Put the next step on paper.',exact:true,level:1}).waitFor(); await settle(); assert.equal(await page.locator('h1').textContent(),'Put the next step on paper.'); checks++;
    await page.goForward(); await page.getByRole('heading',{name:'Interview Prep Scorecard',exact:true,level:1}).waitFor(); await settle(); assert.equal(await page.locator('h1').textContent(),'Interview Prep Scorecard'); checks++;
    await page.getByRole('link',{name:'← All resources',exact:true}).first().click(); await page.getByRole('heading',{name:'Put the next step on paper.',exact:true,level:1}).waitFor(); await settle();
    assert.equal(await page.locator('main').count(),1); checks++;
  }
  await page.goto(base+'/blog/take-a-walk-with-me'); await page.getByRole('link',{name:'Get the free scorecard →',exact:true}).click(); await page.getByRole('heading',{name:'Interview Prep Scorecard',exact:true,level:1}).waitFor(); await settle();
  assert.equal(new URL(page.url()).pathname,'/resources/interview-prep-scorecard'); checks++;
  await page.getByRole('link',{name:'Read the accessible HTML version →',exact:true}).click(); await page.waitForURL('**/downloads/interview-prep-scorecard.html');
  assert.equal(await page.locator('input[aria-label$="score, 0, 1, or 2"]').count(),6); checks++;
  assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth))<=390); checks++;
  for (const { slug, title, action, pages } of resourceFixtures) {
    await page.goto(base + '/resources');
    await page.getByRole('link', { name: action, exact: true }).click();
    await page.getByRole('heading', { name: title, level: 1, exact: true }).waitFor(); await settle();
    assert.equal(new URL(page.url()).pathname, `/resources/${slug}`); checks++;
    assert.equal(await page.locator('h1').count(), 1); checks++;
    await page.goBack(); await page.getByRole('heading', { name: 'Put the next step on paper.', level: 1, exact: true }).waitFor(); await settle();
    await page.goForward(); await page.getByRole('heading', { name: title, level: 1, exact: true }).waitFor(); await settle(); checks++;
    await page.getByRole('link', { name: 'Read the accessible HTML version →', exact: true }).click();
    await page.waitForURL(`**/downloads/${slug}.html`);
    assert.equal(await page.locator('.page').count(), pages); checks++;
    const fields = await page.locator('input, textarea, select').evaluateAll(fields => fields.map(field => ({ label: field.getAttribute('aria-label') || field.labels?.[0]?.textContent, value: field.value, checked: field.checked, type: field.type })));
    assert.ok(fields.length > 0 && fields.every(field => field.label?.trim()), `${slug}: labeled controls`); checks++;
    assert.ok(fields.every(field => ['checkbox', 'radio'].includes(field.type) ? !field.checked : !field.value), `${slug}: fields start blank`); checks++;
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok((await page.evaluate(() => document.documentElement.scrollWidth)) <= width, `${slug}: HTML overflow at ${width}`); checks++;
    }
  }
  await context.close();
  console.log(`PASS: ${checks} browser assertions across 320/390/768/1440px, light/dark, preview, repeated navigation, Back/Forward, essay and HTML.`);
} finally { await browser.close(); }
