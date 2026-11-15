# The Science of a Cold Call — book production pipeline

Northmark Press collection no. 04. Same pipeline and manuscript format as Master Interviews (see `MASTER_INTERVIEWS_PRODUCTION.md`), copied into its own folder so each book builds independently. This document contains no paid content.

## Where things live

| What | Path | In Git? |
|---|---|---|
| Spec, manuscript, research ledger, reviews, cover sources and renders, builds, previews, reports | `private-work/northmark-press/science-of-a-cold-call/` | **No** (`/private-work/` is gitignored) |
| Static font cache (adds Inter Latin Extended) | `private-work/northmark-press/fonts-static-v2/` | No (regenerated automatically) |
| Interior design system (navy / electric cyan re-skin) | `scripts/northmark-press/science-of-a-cold-call/book.css` | Yes |
| Build, cover render, PDF finalize, QA, font instancer | `scripts/northmark-press/science-of-a-cold-call/*.mjs, *.py` | Yes |

Never commit the manuscript, cover renders, or PDF, and never place them in `public/`.

## Build

Prerequisites as for Master Interviews (`npm ci`, Chromium via Playwright or `CHROMIUM_PATH`, Python 3 with `pypdf`, `fonttools`, `brotli`, poppler).

```bash
# Cover: SVG source with vector Montserrat type and the author's HD headshot -> 3000x4000 PNG + one-page vector PDF
node scripts/northmark-press/science-of-a-cold-call/build_cover.mjs

# Proof (allows [[FLAG]] markers)
node scripts/northmark-press/science-of-a-cold-call/build.mjs --proof --cover private-work/northmark-press/science-of-a-cold-call/cover/science-of-a-cold-call-cover.pdf

# Final (fails on flags, overflow, or page count != 44)
node scripts/northmark-press/science-of-a-cold-call/build.mjs --cover private-work/northmark-press/science-of-a-cold-call/cover/science-of-a-cold-call-cover.pdf
python3 -I scripts/northmark-press/science-of-a-cold-call/qa_pdf.py private-work/northmark-press/science-of-a-cold-call/build/The-Science-of-a-Cold-Call.pdf
```

## Launch rules

Do not change `purchaseEnabled`, `finalPdfApproved`, `price.approved`, or `status` in `src/lib/playbooks.ts` until Cristian approves the final edition and the sandbox purchase flow in `docs/PLAYBOOK_COMMERCE.md` passes end to end.
