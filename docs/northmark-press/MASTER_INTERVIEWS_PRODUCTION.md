# Master Interviews — book production pipeline

Northmark Press collection no. 01. This document covers the reproducible interior build. It contains no paid content.

## Where things live

| What | Path | In Git? |
|---|---|---|
| Editorial + design spec, manuscript, research ledger, reviews, builds, renders, previews | `private-work/northmark-press/master-interviews/` | **No** (`/private-work/` is gitignored) |
| Static font cache generated from `public/fonts` (OFL) | `private-work/northmark-press/fonts-static/` | No (regenerated automatically) |
| Interior design system (CSS) | `scripts/northmark-press/master-interviews/book.css` | Yes |
| Build script (compose, measure, PDF, bookmarks, renders) | `scripts/northmark-press/master-interviews/build.mjs` | Yes |
| PDF metadata + bookmarks | `scripts/northmark-press/master-interviews/finalize_pdf.py` | Yes |
| Automated PDF QA | `scripts/northmark-press/master-interviews/qa_pdf.py` | Yes |
| Static font instancer | `scripts/northmark-press/master-interviews/make_static_fonts.py` | Yes |

The paid manuscript and PDF must never be committed, placed in `public/`, or uploaded anywhere public. The final PDF goes to the private bucket described in `docs/PLAYBOOK_COMMERCE.md`. The build refuses to run if `private-work/` is not gitignored.

## Build

Prerequisites: `npm ci`, Playwright Chromium (`npx playwright install chromium`, or set `CHROMIUM_PATH` to an existing Chromium), Python 3 with `pypdf`, `fonttools`, `brotli`, and poppler (`pdftoppm`, `pdffonts`).

```bash
# Internal proof: allows [[FLAG: …]] markers (highlighted) and a reserved cover slot on page 1
node scripts/northmark-press/master-interviews/build.mjs --proof

# Final edition: requires the approved FLAT front cover (3:4) and fails on flags, overflow, or page count ≠ 44
node scripts/northmark-press/master-interviews/build.mjs --cover /path/to/approved-flat-cover.png

python3 -I scripts/northmark-press/master-interviews/qa_pdf.py private-work/northmark-press/master-interviews/build/Master-Interviews.pdf
```

Outputs (all private): `build/Master-Interviews[-PROOF].pdf`, `build/book.html` (assembled source), `build/book.composed.html`, `build/layout-report.json` (fill ratio and overflow per page), and `renders/page-NN.png` (every page at 96 dpi).

## How the layout works

- Trim 7.5 × 10 in (3:4), matching the cover proportion measured from the approved hardcover mockup, so the flat cover fills page 1 without cropping.
- Each manuscript page is one `<section class="page" data-page="N" data-type="…">` written in a small HTML vocabulary (see the spec in the private workspace). The build adds running heads, folios, chapter-opener bands, contents page with internal links, worksheet ruling, and figure tiles, then measures every page and reports overflow.
- Text is real, selectable, searchable text. Diagrams are CSS/SVG vectors. Nothing is rasterized except the cover artwork.
- Fonts: Fraunces (display), Inter (body), Newsreader italic (annotations), all from the site's bundled OFL files, instanced to static TrueType so they embed as standard fonts.
- Bookmarks: chapters with nested page headings; front and back matter at top level. Metadata: title, author, subject, keywords, language `en-US`.

## Cover

The approved flat front cover is not in this repository; only `public/playbooks/master-interviews/mockup.webp` (a photographed hardcover presentation mockup) exists.

### Provisional cover (superseded)
Cristian confirmed (2026-11-15) that no flat original exists and approved a provisional cover derived from the mockup (front board cropped, hinge trimmed, background extended to 3:4, upscaled to 2250 × 3000). Its true detail was only about 116 ppi and the author photo was soft.

### 4K rebuild (current)
At Cristian's request (2026-11-15) the cover was rebuilt at 4K from the approved design, keeping its layout, wording, colours and branding:

- Source: `private-work/northmark-press/master-interviews/cover/src/cover.html` (one SVG, 7.5 × 10 in). Not in Git; the persistent copy is in the project folder.
- Background (sky gradient, planet arc glow, grain) is rendered once to a 3000 × 4000 JPEG; all type stays vector (Montserrat, OFL, closest match to the original geometric sans) and the author photo is Cristian's HD headshot.
- Render: `node scripts/northmark-press/master-interviews/build_cover.mjs` writes `cover/master-interviews-cover-3000x4000.png` and `cover/master-interviews-cover.pdf`.
- Build with it: pass the cover PDF to `--cover`; `finalize_pdf.py` swaps it in as page 1 so the cover type stays vector in the book.

```bash
node scripts/northmark-press/master-interviews/build_cover.mjs
node scripts/northmark-press/master-interviews/build.mjs --proof --cover private-work/northmark-press/master-interviews/cover/master-interviews-cover.pdf
```

## Launch gates (unchanged)

This pipeline does not touch `src/lib/playbooks.ts` commerce flags. `purchaseEnabled`, `finalPdfApproved`, `price.approved`, and `status` stay as they are until Cristian approves the final edition and the sandbox flow in `docs/PLAYBOOK_COMMERCE.md` has passed end to end.
