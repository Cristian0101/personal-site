"""Automated PDF checks for The Science of a Cold Email.

Usage: python3 -I qa_pdf.py <book.pdf> [expected_pages]
Checks page count/size, metadata, bookmarks, contents-page link targets,
per-page extractable text, and font embedding. Prints a report and exits 1 on failure.
"""
import subprocess
import sys

from pypdf import PdfReader

path = sys.argv[1]
expected = int(sys.argv[2]) if len(sys.argv) > 2 else 44
r = PdfReader(path)
fails, notes = [], []

n = len(r.pages)
(notes if n == expected else fails).append(f"page count {n} (expected {expected})")

sizes = {(round(float(p.mediabox.width)), round(float(p.mediabox.height))) for p in r.pages}
(notes if sizes == {(540, 720)} else fails).append(f"page sizes {sorted(sizes)} pt (7.5x10in = 540x720)")

meta = r.metadata or {}
for key in ("/Title", "/Author", "/Subject"):
    (notes if meta.get(key) else fails).append(f"metadata {key}: {meta.get(key)!r}")


def count_outline(items):
    total = 0
    for it in items:
        total += count_outline(it) if isinstance(it, list) else 1
    return total


outline_count = count_outline(r.outline)
(notes if outline_count >= 40 else fails).append(f"bookmarks: {outline_count}")

# Contents page (p3) internal links
page_ids = {p.indirect_reference.idnum: i + 1 for i, p in enumerate(r.pages)}
targets = []
for annot in r.pages[2].get("/Annots") or []:
    a = annot.get_object()
    if a.get("/Subtype") != "/Link":
        continue
    dest = a.get("/Dest")
    if dest is None and a.get("/A") is not None:
        dest = a["/A"].get("/D")
    if isinstance(dest, str) or hasattr(dest, "startswith"):
        named = r.named_destinations.get(str(dest))
        page_ref = named.page if named is not None else None
        targets.append(page_ids.get(page_ref.idnum) if page_ref is not None else None)
    elif dest is not None:
        targets.append(page_ids.get(dest[0].idnum))
(notes if targets and None not in targets else fails).append(f"contents links -> pages {targets}")

# Text extraction per page (page 1 is the cover image)
empty = [i + 1 for i, p in enumerate(r.pages) if i > 0 and len((p.extract_text() or "").strip()) < 40]
(notes if not empty else fails).append(f"pages without extractable text: {empty or 'none'}")
leftovers = [i + 1 for i, p in enumerate(r.pages) if "FLAG:" in (p.extract_text() or "") or "CHECK:" in (p.extract_text() or "")]
(notes if not leftovers else notes).append(f"pages with author flags: {leftovers or 'none'}")

fonts = subprocess.run(["pdffonts", path], capture_output=True, text=True).stdout.splitlines()[2:]
not_embedded = [line for line in fonts if line.split()[-5:-4] != ["yes"] and "yes" not in line.split()[-5:-2]]
families = sorted({line.split()[0].split("+")[-1] for line in fonts})
(notes if fonts and not not_embedded else fails).append(f"fonts embedded: {len(fonts) - len(not_embedded)}/{len(fonts)} ({', '.join(families)})")

print("PDF QA:", path)
for line in notes:
    print("  ok   ", line)
for line in fails:
    print("  FAIL ", line)
sys.exit(1 if fails else 0)
