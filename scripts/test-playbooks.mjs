import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { base } from './test-origin.mjs';
import { resourceFixtures } from './resource-fixtures.mjs';

const output = process.env.PLAYBOOK_QA_DIR || '/tmp/master-interviews-qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks++; };
const books = [
  { slug: 'master-interviews', title: 'Master Interviews', width: 2172, height: 1452, free: '/resources/interview-prep-scorecard', label: '' },
  { slug: 'sdr-bdr-job-mastery', title: 'SDR/BDR Job Mastery', width: 2150, height: 1436, free: '/resources/sdr-bdr-daily-checklist', label: 'job-' },
  { slug: 'break-up-your-tam', title: 'Break Up Your TAM', width: 2182, height: 1452, free: '/resources/tam-segmentation-worksheet', label: 'tam-' },
  { slug: 'science-of-a-cold-call', title: 'The Science of a Cold Call', width: 2182, height: 1456, free: '/resources/cold-call-practice-scorecard', label: 'call-' },
  { slug: 'science-of-a-cold-email', title: 'The Science of a Cold Email', width: 1546, height: 1024, free: '/resources/cold-email-teardown-checklist', label: 'email-' },
];
try {
  for (const book of books) for (const width of [390, 768, 1440]) for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    await context.addInitScript(theme => localStorage.setItem('theme', theme), theme);
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    const viewSlugs = [];
    page.on('request', req => { if (req.url().endsWith('/api/commerce/events') && req.method() === 'POST') viewSlugs.push(req.postDataJSON().slug); });
    await page.goto(base + '/resources/' + book.slug);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.book-hero__visual img').waitFor();
    await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    ok((await page.title()).includes(book.title));
    ok(await page.locator('h1').textContent() === book.title);
    ok(await page.locator('main').count() === 1);
    ok(await page.locator('nav a[aria-current="page"]').textContent() === 'Resources');
    ok(await page.locator('.book-modules li').count() === 6);
    ok(await page.locator('.book-availability').count() === 2);
    ok(await page.getByRole('button', { name: /Get the Playbook/ }).count() === 0);
    ok(await page.locator('#preview-heading').count() === 0);
    ok(await page.locator('link[rel="canonical"]').getAttribute('href') === 'https://www.cristiansanchezaguilera.com/resources/' + book.slug);
    ok((await page.locator('meta[property="og:image"]').getAttribute('content')).endsWith('/playbooks/' + book.slug + '/mockup.webp'));
    const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    ok(schema['@type'] === 'Product' && schema.name === book.title && !schema.offers && !schema.aggregateRating);
    ok(viewSlugs.includes(book.slug), 'Product-specific view event');
    ok(await page.locator('h1').evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'Long titles fit their column');
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Product overflow at ${width}/${theme}`);
    const image = await page.locator('.book-hero__visual img').evaluate(img => ({ w: img.clientWidth, h: img.clientHeight, nw: img.naturalWidth, nh: img.naturalHeight, fit: getComputedStyle(img).objectFit }));
    ok(Math.abs(image.w / image.h - book.width / book.height) < .01 && image.fit !== 'cover', 'Uncropped image aspect ratio');
    await page.screenshot({ path: `${output}/${book.label}product-${width}-${theme}.png`, fullPage: true });
    await page.screenshot({ path: `${output}/${book.label}hero-${width}-${theme}.png`, fullPage: false });
    // Existing appearance controls: actual settings change the product page.
    await page.getByRole('button', { name: /Customize/ }).click();
    await page.getByRole('button', { name: 'Toggle light and dark mode' }).click();
    ok(await page.locator('html').getAttribute('class').then(c => c.includes(theme === 'light' ? 'dark' : 'light')));
    await page.getByRole('tab', { name: /Sans/ }).click();
    ok(await page.locator('html').getAttribute('data-font') === 'sans');
    await page.getByRole('tab', { name: 'L', exact: true }).click();
    ok(await page.locator('html').getAttribute('data-size') === 'large');
    await page.getByRole('tab', { name: 'Max', exact: true }).click();
    ok(await page.locator('html').getAttribute('data-width') === 'max');
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Customized product overflow at ${width}`);
    await page.getByRole('button', { name: /Customize/ }).click();
    // The existing menu also opens on hover/focus; dismiss it with an outside click.
    await page.mouse.click(4, 950);
    await page.locator('.customize__panel').waitFor({ state: 'hidden' });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    ok(await page.getByRole('link', { name: '← All resources', exact: true }).getAttribute('href') === '/resources');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Resources', exact: true }).click();
    await page.waitForURL(base + '/resources');
    await page.getByRole('heading', { name: 'Premium Playbooks' }).waitFor();
    ok(await page.locator('.resource-card').count() === 5);
    ok(await page.getByRole('link', { name: 'Explore playbook', exact: false }).count() === 5);
    ok(await page.getByRole('heading', { name: 'Premium Playbooks', exact: true }).count() === 1);
    const order = await page.locator('.premium-listing h3').allTextContents();
    ok(JSON.stringify(order) === JSON.stringify(books.map(b => b.title)), 'Collection order');
    await page.getByRole('button', { name: /Interview prep/ }).click();
    ok(await page.locator('.resource-card').count() === 1);
    ok(await page.getByRole('heading', { name: 'Premium Playbooks' }).isVisible());
    await page.getByRole('button', { name: /All resources/ }).click();
    ok(await page.locator('.resource-card').count() === 5);
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Collection overflow at ${width}`);
    if (book.slug === 'master-interviews') await page.screenshot({ path: `${output}/resources-customized-${width}-${theme}.png`, fullPage: true });
    await page.locator('.premium-listing').filter({ has: page.getByRole('heading', { name: book.title, exact: true }) }).getByRole('link', { name: 'Explore playbook', exact: false }).click();
    await page.getByRole('heading', { name: book.title, exact: true, level: 1 }).waitFor();
    await page.getByRole('link', { name: /Want to start smaller/ }).click();
    await page.waitForURL(base + book.free);
    await page.locator('h1').waitFor();
    ok(new URL(page.url()).pathname === book.free);
    ok(errors.length === 0, errors.join('\n'));
    await context.close();
  }
  const request = await browser.newContext();
  const api = request.request;
  for (const resource of resourceFixtures) {
    const pdf = await api.get(`${base}/downloads/${resource.slug}.pdf`);
    ok(pdf.ok() && (await pdf.body()).subarray(0, 5).toString() === '%PDF-', `${resource.slug}: free PDF`);
    ok((await api.get(`${base}/downloads/${resource.slug}.html`)).ok(), `${resource.slug}: accessible HTML`);
  }
  for (const book of books) ok((await api.post(`${base}/api/commerce/checkout`, { data: { slug: book.slug, amount: 1 } })).status() === 503);
  ok((await api.post(`${base}/api/commerce/checkout`, { data: { slug: 'not-a-product' } })).status() === 503);
  ok((await api.post(`${base}/api/commerce/download`, { headers: { origin: base, authorization: 'Bearer forged' } })).status() === 401);
  ok((await api.post(`${base}/api/commerce/download`, { headers: { origin: 'https://untrusted.example' } })).status() === 403);
  ok((await api.get(`${base}/api/commerce/status?session_id=forged`)).status() === 400);
  ok((await api.get(`${base}/resources/unknown-playbook`)).status() === 404);
  const page = await request.newPage();
  await page.goto(`${base}/resources/purchase/success?session_id=forged`);
  await page.getByRole('heading', { name: "We couldn't find that purchase." }).waitFor();
  ok(await page.getByRole('link', { name: 'Recover purchase access →' }).isVisible());
  ok(await page.locator('meta[name="robots"]').getAttribute('content').then(c => c.includes('noindex')));
  await page.goto(`${base}/resources/purchase/cancelled`);
  ok(await page.getByRole('heading', { name: 'Checkout closed.' }).isVisible());
  await page.goto(`${base}/resources/access`);
  ok(await page.getByRole('button', { name: 'Email my access link' }).count() === 0);
  ok(await page.getByText('Purchasing is not open yet.', { exact: false }).isVisible());
  await request.close();
  console.log(`PASS: ${checks} product/browser checks for all five books at 390/768/1440px in light/dark, appearance controls, resource filters/navigation, five free downloads, launch gates and access states. Screenshots: ${output}`);
} finally { await browser.close(); }
