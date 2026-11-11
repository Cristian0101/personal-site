/** Read-only resource acceptance checks. See test-origin.mjs for explicit remote opt-in. */
import assert from 'node:assert/strict';
import { base } from './test-origin.mjs';
import { readFile } from 'node:fs/promises';
import { resourceFixtures } from './resource-fixtures.mjs';
const canonical = 'https://www.cristiansanchezaguilera.com';
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }
const pages = ['/', '/businesses', '/blog', '/rules', '/blog/take-a-walk-with-me', '/resources', ...resourceFixtures.map(resource => `/resources/${resource.slug}`)];
const titles = new Set();
for (const path of pages) {
  const response = await fetch(base + path);
  check(response.status === 200, `${path}: HTTP 200`);
  const html = await response.text();
  check((html.match(/<h1(?:\s|>)/g)||[]).length === 1, `${path}: one H1 in initial HTML`);
  check((html.match(/<main(?:\s|>)/g)||[]).length === 1, `${path}: one main in initial HTML`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  check(title && !titles.has(title), `${path}: unique title`); titles.add(title);
  const expected = path === '/' ? canonical : canonical + path;
  check(html.includes(`rel="canonical" href="${expected}"`) || html.includes(`rel="canonical" href="${expected}/"`), `${path}: page-specific canonical`);
  check(html.includes('href="/resources"'), `${path}: Resources navigation`);
  const data = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  check(data.length > 0 || path === '/blog', `${path}: valid JSON-LD where defined`);
  if (path.startsWith('/resources')) {
    check(html.includes('content="summary_large_image"'), `${path}: large Twitter card`);
    check(html.includes(`content="${expected}"`), `${path}: Open Graph URL`);
    check(!html.includes('<form'), `${path}: no email form`);
    const image = await fetch(base + path + '/opengraph-image');
    check(image.status === 200 && image.headers.get('content-type')?.startsWith('image/png'), `${path}: PNG share image`);
    const bytes = Buffer.from(await image.arrayBuffer());
    check(bytes.readUInt32BE(16) === 1200 && bytes.readUInt32BE(20) === 630, `${path}: 1200x630 share image`);
    for(const href of new Set([...html.matchAll(/href="([^"#?]+)"/g)].map(m=>m[1]).filter(h=>h.startsWith('/') && !h.startsWith('/_next/')))) {
      check((await fetch(base + href, {method:'HEAD'})).status === 200, `${path}: link ${href}`);
    }
  }
}
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
for(const path of pages) check(sitemap.includes(canonical + (path === '/' ? '' : path)), `sitemap: ${path}`);
check((await (await fetch(base + '/robots.txt')).text()).includes(`${canonical}/sitemap.xml`), 'robots links sitemap');
check((await fetch(base+'/resources/missing')).status === 404, 'unknown resource returns 404');
const source = await readFile('content/resources/interview-prep-scorecard.html','utf8');
const htmlFile = await readFile('public/downloads/interview-prep-scorecard.html','utf8');
check(source === htmlFile, 'published HTML equals canonical source');
check(!/<script|<form|value="[^"\s]+"|checked(?:\s|>)/i.test(source), 'worksheet starts blank and has no script/submission');
check((source.match(/class="page(?: rubric)?"/g)||[]).length === 4, 'four worksheet sections');
check((source.match(/class="score"/g)||[]).length === 6, 'six blank score fields');
const pdf = await readFile('public/downloads/interview-prep-scorecard.pdf');
check(pdf.subarray(0,5).toString() === '%PDF-', 'real PDF file');
check(pdf.length > 10000, 'PDF is nonempty');
for (const { slug, pages } of resourceFixtures) {
  const source = await readFile(`content/resources/${slug}.html`, 'utf8');
  check(source === await readFile(`public/downloads/${slug}.html`, 'utf8'), `${slug}: canonical HTML equals download`);
  check(!/<(?:script|form)(?:\s|>)|<input[^>]*\schecked(?:[\s=>])/i.test(source), `${slug}: no scripts, submissions, or checked answers`);
  const pdfResponse = await fetch(`${base}/downloads/${slug}.pdf`);
  check(pdfResponse.status === 200 && pdfResponse.headers.get('content-type')?.includes('application/pdf'), `${slug}: served as PDF`);
  const bytes = Buffer.from(await pdfResponse.arrayBuffer());
  check(bytes.subarray(0, 5).toString() === '%PDF-' && bytes.length > 10000, `${slug}: real nonempty PDF`);
  check(bytes.equals(await readFile(`public/downloads/${slug}.pdf`)), `${slug}: downloaded bytes match artifact`);
  for (let i = 1; i <= pages; i++) {
    const image = await fetch(`${base}/downloads/${slug}-page-${i}.png`);
    check(image.status === 200 && image.headers.get('content-type')?.includes('image/png'), `${slug}: page ${i} PNG served`);
    const png = Buffer.from(await image.arrayBuffer());
    check(png.readUInt32BE(16) === 1632 && png.readUInt32BE(20) === 2112, `${slug}: page ${i} image dimensions`);
  }
}
console.log(`PASS: ${checks} read-only resource checks.`);
