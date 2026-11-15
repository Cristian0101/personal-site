"""Add bookmarks and document metadata to the SDR/BDR Job Mastery PDF.

Usage: python3 -I finalize_pdf.py <raw.pdf> <out.pdf> <layout-report.json> <proof|final> [cover.pdf]
With cover.pdf, its first page replaces page 1 (keeps the cover's vector type).
"""
import json
import sys

from pypdf import PdfReader, PdfWriter

raw, out, report_path, mode = sys.argv[1:5]
cover_pdf = sys.argv[5] if len(sys.argv) > 5 else None
report = json.load(open(report_path, encoding="utf-8"))

reader = PdfReader(raw)
writer = PdfWriter(clone_from=reader)
if cover_pdf:
    cover_page = PdfReader(cover_pdf).pages[0]
    box = writer.pages[0].mediabox
    if (round(float(cover_page.mediabox.width)), round(float(cover_page.mediabox.height))) != (round(float(box.width)), round(float(box.height))):
        raise SystemExit("Cover PDF page size does not match the book page size")
    writer.insert_page(cover_page, 0)
    writer.remove_page(1)
writer.page_mode = "/UseOutlines"

parents = {}
for item in report["outline"]:
    page_index = item["page"] - 1
    if page_index >= len(writer.pages):
        continue
    parent = parents.get("chapter") if item["level"] == 1 else None
    ref = writer.add_outline_item(item["title"], page_index, parent=parent)
    if item["level"] == 0:
        parents["chapter"] = ref if item["title"][:1].isdigit() else None

title = "SDR/BDR Job Mastery: A Practical Playbook to Break Into Tech Sales, Perform, and Get Promoted"
writer.add_metadata({
    "/Title": title + (" (Production proof)" if mode == "proof" else ""),
    "/Author": "Cristian Sanchez",
    "/Subject": "Performing in an SDR/BDR role: role expectations, daily operating system, territory planning and research, multi-channel prospecting, meetings and metrics, and career advancement.",
    "/Keywords": "SDR, BDR, tech sales, prospecting, cadence, territory planning, sales development, promotion, Northmark Press",
    "/Creator": "Northmark Press production pipeline",
    "/Producer": "Chromium (Playwright) + pypdf",
})
writer._root_object.update({})
from pypdf.generic import NameObject, TextStringObject, DictionaryObject, BooleanObject
writer._root_object[NameObject("/Lang")] = TextStringObject("en-US")
viewer = DictionaryObject({NameObject("/DisplayDocTitle"): BooleanObject(True)})
writer._root_object[NameObject("/ViewerPreferences")] = viewer

with open(out, "wb") as fh:
    writer.write(fh)
print(f"Finalized {out}: {len(writer.pages)} pages, {len(report['outline'])} bookmarks")
