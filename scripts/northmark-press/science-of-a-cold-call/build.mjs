/**
 * Northmark Press — The Science of a Cold Call PDF build (collection no. 04).
 * Adapted from scripts/northmark-press/master-interviews/build.mjs; same manuscript format and gates.
 *
 * Usage:
 *   node scripts/northmark-press/science-of-a-cold-call/build.mjs [--proof] [--cover path/to/flat-cover.png]
 *
 * Reads the private, gitignored manuscript from
 *   private-work/northmark-press/science-of-a-cold-call/manuscript/{front,ch1..ch6,back}.html
 * and writes everything to private-work/.../build and renders/. Nothing paid is written to public/ or Git.
 *
 * --proof  allows [[FLAG: …]] markers (highlighted) and the reserved cover slot.
 *          Without --proof the build fails if flags remain or no approved cover is supplied.
 * --cover  approved FLAT front-cover artwork (3:4). Never pass a mockup photo or a recreation
 *          unless Cristian has explicitly approved that source (see docs, "Provisional cover").
 * --cover-note "text"  proof-only label shown on page 1.
 */
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const args = process.argv.slice(2);
const proof = args.includes('--proof');
const coverArg = args.includes('--cover') ? args[args.indexOf('--cover') + 1] : null;
// --cover-note "text": small proof-only label on page 1 (e.g. to mark a provisional cover)
const coverNote = args.includes('--cover-note') ? args[args.indexOf('--cover-note') + 1] : null;
const ws = path.join(root, 'private-work/northmark-press/science-of-a-cold-call');
const manuscriptDir = args.includes('--manuscript') ? path.resolve(args[args.indexOf('--manuscript') + 1]) : path.join(ws, 'manuscript');
const buildDir = path.join(ws, 'build');
const renderDir = path.join(ws, 'renders');

// Safety: refuse to run unless the private workspace is gitignored.
try {
  execFileSync('git', ['check-ignore', '-q', path.join(ws, 'build/book.pdf')], { cwd: root });
} catch {
  throw new Error('private-work/ is not gitignored. Refusing to build paid content.');
}

const parts = ['front', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'back'];
const missing = parts.filter(p => !existsSync(path.join(manuscriptDir, `${p}.html`)));
if (missing.length && !proof) throw new Error(`Missing manuscript files: ${missing.join(', ')}`);

let coverHtml;
if (coverArg) {
  const coverPath = path.resolve(coverArg);
  if (!existsSync(coverPath)) throw new Error(`Cover not found: ${coverPath}`);
  // A one-page PDF cover (vector type) replaces page 1 after export; an image cover is placed directly.
  coverHtml = coverPath.endsWith('.pdf')
    ? `<section class="page cover" data-page="1" data-type="cover"></section>`
    : `<section class="page cover" data-page="1" data-type="cover"><img class="cover-art" src="${pathToFileURL(coverPath)}" alt="The Science of a Cold Call front cover">${proof && coverNote ? `<div class="cover-note">${coverNote.replace(/</g, '&lt;')}</div>` : ''}</section>`;
} else {
  if (!proof) throw new Error('No approved flat cover supplied. Use --cover <file>, or --proof for an internal proof.');
  coverHtml = `<section class="page cover" data-page="1" data-type="cover"><div class="cover-slot"><p class="slot-label">Production proof · page 1 reserved</p><p>The approved The Science of a Cold Call front cover is inserted here at final production. It is not recreated or approximated in this proof.</p></div></section>`;
}

// Static TrueType instances embed cleanly in PDF (variable fonts become Type 3). Generated from the
// site's bundled OFL fonts into a gitignored cache; falls back to the variable files if unavailable.
const staticFontDir = path.join(root, 'private-work/northmark-press/fonts-static-v2');
if (!existsSync(path.join(staticFontDir, 'fonts.css'))) {
  try {
    execFileSync('python3', ['-I', path.join(here, 'make_static_fonts.py'), path.join(root, 'public/fonts'), staticFontDir], { stdio: 'inherit' });
  } catch { console.warn('WARNING: static fonts unavailable (pip install fonttools brotli); using variable fonts.'); }
}
const fontsCss = existsSync(path.join(staticFontDir, 'fonts.css'))
  ? (await readFile(path.join(staticFontDir, 'fonts.css'), 'utf8')).replace(/url\(([^)]+)\)/g, (_, f) => `url(${pathToFileURL(path.join(staticFontDir, f))})`)
  : (await readFile(path.join(root, 'src/app/fonts.css'), 'utf8'))
    .replace(/url\(\/fonts\/([^)]+)\)/g, (_, f) => `url(${pathToFileURL(path.join(root, 'public/fonts', f))})`);
const bookCss = await readFile(path.join(here, 'book.css'), 'utf8');
const chunks = {};
for (const p of parts) chunks[p] = existsSync(path.join(manuscriptDir, `${p}.html`)) ? await readFile(path.join(manuscriptDir, `${p}.html`), 'utf8') : '';

const tocPlaceholder = `<section class="page toc" data-page="3" data-type="toc"></section>`;
// front.html holds pages 2 and 4; the TOC is inserted between them.
const frontWithToc = chunks.front.replace(/(<section[^>]*data-page="4")/, `${tocPlaceholder}\n$1`);
if (!frontWithToc.includes('data-page="3"')) throw new Error('front.html must contain a section with data-page="4"');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>The Science of a Cold Call — A Systematic Playbook for Opening, Engaging, and Booking More Meetings</title>
<style>${fontsCss}\n${bookCss}</style></head><body>
${coverHtml}
${frontWithToc}
${parts.slice(1).map(p => chunks[p]).join('\n')}
</body></html>`;

await rm(buildDir, { recursive: true, force: true });
await mkdir(buildDir, { recursive: true });
const sourcePath = path.join(buildDir, 'book.html');
await writeFile(sourcePath, html);

// CHROMIUM_PATH lets environments with a preinstalled browser reuse it.
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
let report;
try {
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  await page.emulateMedia({ media: 'print' });
  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  report = await page.evaluate(() => {
    const romanCh = n => String(n).padStart(2, '0');
    const pages = [...document.querySelectorAll('section.page')];
    const outline = [];
    const errors = [];
    let chapter = null;
    pages.forEach((sec, i) => {
      const n = Number(sec.dataset.page);
      if (n !== i + 1) errors.push(`Section ${i + 1} has data-page=${sec.dataset.page}`);
      sec.id = `p${n}`;
      const type = sec.dataset.type || 'teach';
      if (['opener', 'cover', 'toc'].includes(type)) sec.classList.add(type); // other types would collide with component classes
      if (type === 'cover') { outline.push({ title: 'Cover', page: n, level: 0 }); return; }
      if (type === 'opener') {
        chapter = { num: Number(sec.dataset.chapter), title: sec.dataset.chapterTitle, builds: sec.dataset.builds, page: n };
        sec.dataset.anchor = `ch${chapter.num}`;
      }
      if (n === 42) chapter = null;
      if (n === 2) sec.classList.add('front-legal');
      if (n === 44) sec.classList.add('dark');

      // Body wrapper
      const body = document.createElement('div');
      body.className = 'body';
      while (sec.firstChild) body.appendChild(sec.firstChild);
      sec.appendChild(body);

      // Chapter opener band
      if (type === 'opener') {
        const band = document.createElement('div');
        band.className = 'band';
        band.innerHTML = `
          <svg class="arc" viewBox="0 0 750 362" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="g${n}" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stop-color="#1164c8" stop-opacity="0"/>
              <stop offset=".55" stop-color="#2f8cff" stop-opacity=".6"/>
              <stop offset="1" stop-color="#9ff3fb" stop-opacity=".95"/></linearGradient></defs>
            <path d="M420 362 C 520 250, 630 170, 750 128" fill="none" stroke="url(#g${n})" stroke-width="1.6"/>
            <path d="M470 362 C 560 270, 655 205, 750 172" fill="none" stroke="#1be2f6" stroke-opacity=".16" stroke-width="0.8"/>
          </svg>
          <div class="ch-kicker">Chapter ${chapter.num} of 6</div>
          <div class="ch-num">${romanCh(chapter.num)}</div>
          <h1 class="ch-title">${chapter.title.replace(/&/g, '&amp;')}</h1>
          <div class="ch-builds"><span>You will build</span>${chapter.builds}</div>`;
        sec.insertBefore(band, body);
        outline.push({ title: `${chapter.num}. ${chapter.title}`, page: n, level: 0 });
      }

      // Running head and folio
      if (type !== 'toc') {
        const rh = document.createElement('div');
        rh.className = 'runhead';
        rh.setAttribute('aria-hidden', 'true');
        const right = chapter ? `<span class="rh-ch">Chapter ${chapter.num}</span> · ${chapter.title}` : (n < 5 ? 'Front matter' : 'Back matter');
        rh.innerHTML = `<span>The Science of a Cold Call</span><span>${right}</span>`;
        sec.appendChild(rh);
      }
      const folio = document.createElement('div');
      folio.className = 'folio';
      folio.setAttribute('aria-hidden', 'true');
      folio.innerHTML = `<span>Northmark Press</span><span class="num">${n}</span>`;
      sec.appendChild(folio);

      // Outline entries for page headings
      const h2 = body.querySelector('h2');
      if (h2) outline.push({ title: h2.textContent.trim(), page: n, level: chapter ? 1 : 0 });
      else if (type !== 'toc') errors.push(`Page ${n} has no h2`);

      // Components
      body.querySelectorAll('.lines').forEach(el => {
        const count = Number(el.dataset.n || 3);
        for (let k = 0; k < count; k++) { const r = document.createElement('div'); r.className = 'rule'; el.appendChild(r); }
      });
      body.querySelectorAll('figure.stack li').forEach(li => {
        const b = li.querySelector('b');
        const fig = li.closest('figure');
        const idx = [...li.parentNode.children].indexOf(li) + 1;
        const letter = li.dataset.letter || (fig.dataset.tiles === 'letter' && b ? b.textContent.trim()[0] : String(idx));
        const tile = document.createElement('span'); tile.className = 'tile'; tile.textContent = letter; tile.setAttribute('aria-hidden', 'true');
        const desc = document.createElement('span'); desc.className = 'desc';
        while (li.firstChild) desc.appendChild(li.firstChild);
        li.append(tile, desc);
      });
      body.querySelectorAll('.jd').forEach(jd => {
        const next = jd.nextElementSibling;
        if (next && next.matches('ol.annotations')) {
          const wrap = document.createElement('div'); wrap.className = 'jd-wrap';
          jd.parentNode.insertBefore(wrap, jd); wrap.append(jd, next);
        }
      });
      // Typographic quotes and apostrophes (manuscript is typed with straight quotes)
      const tw = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (tw.nextNode()) textNodes.push(tw.currentNode);
      let prevChar = ' ';
      textNodes.forEach(t => {
        let out = '';
        for (const ch of t.nodeValue) {
          if (ch === '"') out += /[\s(\[\u2014\u2013/-]/.test(prevChar) ? '\u201C' : '\u201D';
          else if (ch === "'") out += /[\s(\[\u201C]/.test(prevChar) ? '\u2018' : '\u2019';
          else out += ch;
          prevChar = ch;
        }
        t.nodeValue = out;
        if (t.parentElement && /^(P|LI|TD|TH|H2|H3|FIGCAPTION|CAPTION|DIV)$/.test(t.parentElement.tagName) && t === t.parentElement.lastChild) prevChar = ' ';
      });
      // Worksheet column widths: narrow short-header columns, cap prefilled label columns
      body.querySelectorAll('table.worksheet').forEach(tbl => {
        const ths = [...tbl.querySelectorAll('thead th')];
        const rows = [...tbl.querySelectorAll('tbody tr')];
        ths.forEach((th, ci) => {
          const label = th.textContent.replace(/\s+/g, '');
          const prefilled = rows.some(r => r.children[ci] && !r.children[ci].classList.contains('fill') && r.children[ci].textContent.trim().length > 3);
          if (label.length <= 6 && !prefilled) { th.style.width = '0.55in'; th.style.whiteSpace = 'nowrap'; }
          else if (ci === 0 && prefilled && ths.length <= 3) th.style.width = '38%';
        });
      });
      // Highlight author flags (proof only; final build fails on them)
      const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
      const hits = [];
      while (walker.nextNode()) if (/\[\[(FLAG|CHECK):/.test(walker.currentNode.nodeValue)) hits.push(walker.currentNode);
      hits.forEach(t => {
        const span = document.createElement('span');
        span.innerHTML = t.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\[\[((?:FLAG|CHECK):[^\]]*)\]\]/g, '<span class="flag">$1</span>');
        t.replaceWith(span);
      });
    });

    // Contents page
    const toc = document.querySelector('section.toc .body');
    const openers = pages.filter(s => s.dataset.type === 'opener');
    const chapterEnd = idx => (idx + 1 < openers.length ? Number(openers[idx + 1].dataset.page) - 1 : 41);
    const minor = (label, title, pg) => `<li class="minor"><a href="#p${pg}"><span class="t-num">${label}</span><span class="t-title">${title}</span><span class="t-page">${pg}</span></a></li>`;
    const h2Of = pg => document.querySelector(`#p${pg} h2`)?.textContent.trim() || '';
    toc.innerHTML = `<div class="toc-title">Contents</div><div class="toc-sub">The Science of a Cold Call · A Systematic Playbook for Opening, Engaging, and Booking More Meetings</div>
      <ol class="toc-list">
        ${minor('', h2Of(4), 4)}
        ${openers.map((s, idx) => `<li><a href="#${s.id}"><span class="t-num">${romanCh(s.dataset.chapter)}</span><span class="t-title">${s.dataset.chapterTitle.replace(/&/g, '&amp;')}<span class="t-builds">You will build: ${s.dataset.builds}</span></span><span class="t-page">${s.dataset.page}–${chapterEnd(idx)}</span></a></li>`).join('')}
        ${minor('', h2Of(42), 42)}
        ${minor('', h2Of(43), 43)}
        ${minor('', h2Of(44), 44)}
      </ol>`;
    toc.insertAdjacentHTML('afterbegin', '<h2 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Contents</h2>');
    outline.splice(outline.findIndex(o => o.page === 4), 0, { title: 'Contents', page: 3, level: 0 });

    // Layout measurement
    const metrics = pages.map(sec => {
      const body = sec.querySelector('.body');
      if (!body) return { page: Number(sec.dataset.page), fill: null, overflow: 0 };
      const avail = body.clientHeight;
      const bodyRect = body.getBoundingClientRect();
      let bottom = bodyRect.top;
      let maxRight = bodyRect.right;
      body.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.height) { bottom = Math.max(bottom, r.bottom); maxRight = Math.max(maxRight, r.right); }
      });
      const used = bottom - bodyRect.top;
      return { page: Number(sec.dataset.page), type: sec.dataset.type, fill: +(used / avail).toFixed(2), overflow: Math.max(0, Math.round(used - avail)), hOverflow: Math.max(0, Math.round(maxRight - bodyRect.right)) };
    });
    const flags = document.querySelectorAll('.flag').length;
    return { pageCount: pages.length, outline, errors, metrics, flags };
  });

  await writeFile(path.join(buildDir, 'book.composed.html'), await page.content());
  await page.pdf({ path: path.join(buildDir, 'book.raw.pdf'), preferCSSPageSize: true, printBackground: true, tagged: true, outline: false });
} finally {
  await browser.close();
}

await writeFile(path.join(buildDir, 'layout-report.json'), JSON.stringify(report, null, 2));
const over = report.metrics.filter(m => m.overflow > 0 || m.hOverflow > 0 || (m.fill && m.fill > 1.001));
const under = report.metrics.filter(m => m.fill !== null && m.fill < 0.72 && !['cover', 'toc'].includes(m.type) && m.page !== 2);
console.log(`Pages: ${report.pageCount}  Flags: ${report.flags}`);
console.log(report.metrics.map(m => `p${m.page}:${m.fill ?? '-'}`).join(' '));
if (report.errors.length) console.log('Structure errors:\n ' + report.errors.join('\n '));
if (over.length) console.log('OVERFLOW:', JSON.stringify(over));
if (under.length) console.log('Underfilled (<72%):', under.map(m => `p${m.page}(${m.fill})`).join(' '));

const finalPdf = path.join(buildDir, proof ? 'The-Science-of-a-Cold-Call-PROOF.pdf' : 'The-Science-of-a-Cold-Call.pdf');
execFileSync('python3', ['-I', path.join(here, 'finalize_pdf.py'), path.join(buildDir, 'book.raw.pdf'), finalPdf, path.join(buildDir, 'layout-report.json'), proof ? 'proof' : 'final', ...(coverArg && coverArg.endsWith('.pdf') ? [path.resolve(coverArg)] : [])], { stdio: 'inherit' });
await rm(path.join(buildDir, 'book.raw.pdf'));

await rm(renderDir, { recursive: true, force: true });
await mkdir(renderDir, { recursive: true });
execFileSync('pdftoppm', ['-r', '96', '-png', finalPdf, path.join(renderDir, 'page')]);
console.log(`PDF: ${path.relative(root, finalPdf)}\nRenders: ${path.relative(root, renderDir)}`);

if (!proof && (report.flags || report.errors.length || over.length || report.pageCount !== 44)) {
  throw new Error('Final build failed acceptance gates (flags, structure, overflow, or page count).');
}
