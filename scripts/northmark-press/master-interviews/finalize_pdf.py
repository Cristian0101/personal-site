"""Add bookmarks and document metadata to the Master Interviews PDF.

Usage: python3 -I finalize_pdf.py <raw.pdf> <out.pdf> <layout-report.json> <proof|final>
"""
import json
import sys

from pypdf import PdfReader, PdfWriter

raw, out, report_path, mode = sys.argv[1:5]
report = json.load(open(report_path, encoding="utf-8"))

reader = PdfReader(raw)
writer = PdfWriter(clone_from=reader)
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

title = "Master Interviews: The SDR/BDR Interview Preparation Playbook"
writer.add_metadata({
    "/Title": title + (" (Production proof)" if mode == "proof" else ""),
    "/Author": "Cristian Sanchez",
    "/Subject": "SDR/BDR interview preparation: role research, company research, interview stories, answers, mock calls, and a seven-day preparation plan.",
    "/Keywords": "SDR, BDR, tech sales, interview preparation, mock call, STAR, Northmark Press",
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
