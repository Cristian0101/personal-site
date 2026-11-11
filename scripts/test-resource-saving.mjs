/** Simulated mobile capabilities. This tests UI branches, not physical iOS/Android save sheets. */
import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';
import { base } from './test-origin.mjs';
import { resourceFixtures } from './resource-fixtures.mjs';
const browser=await chromium.launch(); let checks=0;
try {
  for(const {slug,pages:count} of resourceFixtures) {
    const desktop=await browser.newContext(); const page=await desktop.newPage();
    await page.goto(`${base}/resources/${slug}`);
    assert.equal(await page.getByRole('link',{name:'Download the free PDF',exact:true}).getAttribute('download'),`${slug}.pdf`);checks++;
    await page.locator('.resource-image-saves summary').click();
    assert.equal(await page.locator('.resource-image-saves a[download]').count(),count);checks++;
    for(const a of await page.locator('.resource-image-saves a').all()) { const response=await page.request.get(new URL(await a.getAttribute('href'),base).href); assert.equal(response.status(),200); const bytes=await response.body(); assert.equal(bytes.readUInt32BE(16),1632);assert.equal(bytes.readUInt32BE(20),2112);checks++; }
    await desktop.close();
    const mobile=await browser.newContext({...devices['iPhone 13'],reducedMotion:'reduce'});
    await mobile.addInitScript(()=>{
      window.__shareCalls=[]; window.__shareMode='success';
      Object.defineProperty(navigator,'canShare',{value:data=>data.files?.[0]?.type==='application/pdf',configurable:true});
      Object.defineProperty(navigator,'share',{value:async data=>{window.__shareCalls.push(data.files[0].name);if(window.__shareMode!=='success'){const e=new Error('simulated');e.name=window.__shareMode==='cancel'?'AbortError':'NotAllowedError';throw e;}},configurable:true});
    });
    const m=await mobile.newPage();await m.goto(`${base}/resources/${slug}`);
    await m.locator('[data-save-device="apple"]').waitFor();
    assert.equal(await m.getByRole('link',{name:'Open the free PDF',exact:true}).getAttribute('download'),null);checks++;
    assert.ok(await m.getByText('For Files: open the PDF, then use Share → Save to Files. For Photos: use the image pages below.',{exact:true}).isVisible());checks++;
    await m.locator('.resource-image-saves summary').click();
    assert.equal(await m.locator('.resource-image-saves a[target="_blank"]:not([download])').count(),count);checks++;
    const share=m.getByRole('button',{name:'Share or save the PDF…',exact:true}); await share.waitFor();
    await share.click(); await m.getByRole('status').filter({hasText:'Check the destination'}).waitFor();
    assert.deepEqual(await m.evaluate(()=>window.__shareCalls),[`${slug}.pdf`]);checks++;
    await m.evaluate(()=>window.__shareMode='cancel');await share.click();
    await m.waitForFunction(()=>document.querySelector('.resource-save-status').textContent==='');checks++;
    await m.evaluate(()=>window.__shareMode='error');await share.click();
    await m.getByRole('status').filter({hasText:'Sharing is unavailable'}).waitFor();checks++;
    assert.ok((await m.evaluate(()=>document.documentElement.scrollWidth))<=390);checks++;
    await mobile.close();
    const android=await browser.newContext({...devices['Pixel 7']});
    await android.addInitScript(()=>{Object.defineProperty(navigator,'share',{value:undefined,configurable:true});Object.defineProperty(navigator,'canShare',{value:undefined,configurable:true});});
    const a=await android.newPage();await a.goto(`${base}/resources/${slug}`);await a.locator('[data-save-device="android"]').waitFor();
    assert.equal(await a.getByRole('button',{name:'Share or save the PDF…',exact:true}).count(),0);checks++;
    assert.ok(await a.getByRole('link',{name:'Open the free PDF',exact:true}).isVisible());checks++;
    assert.ok((await a.locator('.resource-downloads').innerText()).includes('For Files or Downloads'));checks++;
    await android.close();
  }
  for (const [kind, userAgent] of [['apple', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15'], ['touch', 'Generic touch browser']]) {
    const tablet = await browser.newContext({viewport:{width:1024,height:1366},hasTouch:true,userAgent});
    await tablet.addInitScript(() => {
      Object.defineProperty(navigator, 'platform', {value:'MacIntel',configurable:true});
      Object.defineProperty(navigator, 'maxTouchPoints', {value:5,configurable:true});
      Object.defineProperty(navigator, 'share', {value:undefined,configurable:true});
    });
    if (kind === 'touch') await tablet.addInitScript(() => Object.defineProperty(navigator, 'platform', {value:'Other',configurable:true}));
    const page = await tablet.newPage(); await page.goto(`${base}/resources/tam-segmentation-worksheet`);
    await page.locator(`[data-save-device="${kind}"]`).waitFor(); checks++;
    assert.equal(await page.getByRole('link',{name:'Open the free PDF',exact:true}).getAttribute('download'),null); checks++;
    await tablet.close();
  }
  console.log(`PASS: ${checks} device-save assertions. Desktop downloads, Apple/Android/tablet guidance, PNGs, and mocked native-share success/cancel/failure. Physical phone save destinations not certified.`);
} finally {await browser.close();}
