"""Instance the site's bundled variable fonts (OFL) into static TrueType files for PDF output.

Chromium embeds variable fonts in PDFs as Type 3 glyph procedures, which some readers
render without hinting. Static instances embed as standard TrueType (CID) fonts.

Usage: python3 -I make_static_fonts.py <public/fonts dir> <out dir>
Requires: pip install fonttools brotli
Writes static TTFs and fonts.css (@font-face rules with relative URLs) to <out dir>.
"""
import os
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

# Latin subsets (the ".p" preload files) of each family.
plan = [
    ("Inter", "normal", "inter-e4af272ccee01ff0-s.p.woff2", [400, 500, 600]),
    ("Fraunces", "normal", "fraunces-af4bf8399d1aacdf-s.p.woff2", [400, 500]),
    ("Newsreader", "normal", "newsreader-5611c55482296524-s.p.woff2", [400]),
    ("Newsreader", "italic", "newsreader-4b9bb515ce6d026f-s.p.woff2", [400]),
]
rules = []
for family, style, filename, weights in plan:
    for weight in weights:
        font = TTFont(os.path.join(src, filename))
        static = instantiateVariableFont(font, {"wght": weight}, updateFontNames=False)
        static.flavor = None
        name = f"{family.lower()}-{style}-{weight}.ttf"
        static.save(os.path.join(out, name))
        rules.append(
            f'@font-face{{font-family:"{family}";font-style:{style};font-weight:{weight};'
            f'src:url({name}) format("truetype");}}'
        )
with open(os.path.join(out, "fonts.css"), "w", encoding="utf-8") as fh:
    fh.write("\n".join(rules) + "\n")
print(f"Wrote {len(rules)} static fonts to {out}")
