# SDR/BDR Job Mastery — book production pipeline

Northmark Press collection no. 02. This document covers the reproducible interior and cover build. It contains no paid content.

## Where things live

| What | Path | In Git? |
|---|---|---|
| Spec, manuscript, research ledger, reviews, builds, renders, previews, cover source | `private-work/northmark-press/sdr-bdr-job-mastery/` | **No** (`/private-work/` is gitignored) |
| Interior design system (ember orange palette) | `scripts/northmark-press/sdr-bdr-job-mastery/book.css` | Yes |
| Build script (48-page map) | `scripts/northmark-press/sdr-bdr-job-mastery/build.mjs` | Yes |
| Cover render | `scripts/northmark-press/sdr-bdr-job-mastery/build_cover.mjs` | Yes |
| PDF metadata + bookmarks, PDF QA | `finalize_pdf.py`, `qa_pdf.py` in the same folder | Yes |

The static font instancer is shared with Master Interviews (`scripts/northmark-press/master-interviews/make_static_fonts.py`). The paid manuscript and PDF must never be committed, placed in `public/`, or uploaded anywhere public.

## Build

```bash
node scripts/northmark-press/sdr-bdr-job-mastery/build_cover.mjs
node scripts/northmark-press/sdr-bdr-job-mastery/build.mjs --proof --cover private-work/northmark-press/sdr-bdr-job-mastery/cover/sdr-bdr-job-mastery-cover.pdf
python3 -I scripts/northmark-press/sdr-bdr-job-mastery/qa_pdf.py private-work/northmark-press/sdr-bdr-job-mastery/build/SDR-BDR-Job-Mastery-PROOF.pdf
```

Drop `--proof` for the final edition; it fails on remaining `[[FLAG]]` markers, overflow, or a page count other than 48.

## Cover

No flat original exists. The cover is a 4K rebuild of the approved design (`public/playbooks/sdr-bdr-job-mastery/mockup.webp`): one SVG at 7.5 × 10 in with positions measured from the mockup's front board, Montserrat vector type, and a fresh 3000 × 4000 background (gradient, ember arc glow, grain). At Cristian's request (2026-11-15) it adds his headshot and the "Cristian Sanchez / Founder, Outflow" byline in the same position and style as Master Interviews.

## Launch gates

This pipeline does not touch `src/lib/playbooks.ts`. `purchaseEnabled`, `finalPdfApproved`, `price.approved`, and `status` stay as they are until Cristian approves the final edition and the sandbox flow in `docs/PLAYBOOK_COMMERCE.md` passes end to end.
