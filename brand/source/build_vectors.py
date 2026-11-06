"""Redraw FicPhone as vector geometry; outline the separate wordmark.

The supplied bitmap is visual reference only. No pixels are traced, embedded,
cropped or enlarged. Production SVGs have no font or linked-image dependencies.
"""
from pathlib import Path
import json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parents[1]
BLUE = "#002FA7"
FONT = Path("/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf")

CORE = f'''<g id="phone-symbol" fill="{BLUE}">
  <rect x="132" y="66" width="248" height="380" rx="64"/>
  <rect x="152" y="119" width="208" height="270" rx="30" fill="#FFFFFF"/>
  <rect x="222" y="89" width="68" height="14" rx="7" fill="#FFFFFF"/>
  <circle cx="256" cy="416" r="17" fill="#FFFFFF"/>
  <path d="M218 171H294C322 171 343 193 343 221V259C343 287 322 308 294 308H281C264 308 246 333 211 345C220 332 224 319 223 308H218C190 308 169 287 169 259V220C169 193 190 171 218 171Z"/>
  <g id="quotation-marks" fill="#FFFFFF">
    <path d="M245 205C223 207 205 225 205 247C205 261 214 269 226 269C238 269 246 261 246 250C246 240 239 233 228 232C231 223 238 216 245 211C248 209 248 205 245 205Z"/>
    <path d="M296 205C274 207 256 225 256 247C256 261 265 269 277 269C289 269 297 261 297 250C297 240 290 233 279 232C282 223 289 216 296 211C299 209 299 205 296 205Z"/>
  </g>
</g>'''


def svg(width, height, body, title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width:g}" height="{height:g}" viewBox="0 0 {width:g} {height:g}" role="img" aria-labelledby="title">
<title id="title">{title}</title>
{body}
</svg>
'''


def wordmark():
    font = TTFont(FONT)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    kerning = {}
    if "kern" in font:
        for table in font["kern"].kernTables:
            kerning.update(table.kernTable)
    cursor = 0
    previous = None
    letters = []
    bounds = []
    for char in "FicPhone":
        name = cmap[ord(char)]
        if previous:
            cursor += kerning.get((previous, name), 0)
        pen = BoundsPen(glyphs)
        glyphs[name].draw(pen)
        if pen.bounds:
            x0, y0, x1, y1 = pen.bounds
            bounds.append((x0 + cursor, y0, x1 + cursor, y1))
        letters.append((name, cursor))
        cursor += font["hmtx"][name][0]
        previous = name
    x0 = min(b[0] for b in bounds)
    y0 = min(b[1] for b in bounds)
    x1 = max(b[2] for b in bounds)
    y1 = max(b[3] for b in bounds)
    scale = 190 / (y1 - y0)
    paths = []
    for name, offset in letters:
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale,
                                           12 + (offset - x0) * scale,
                                           12 + y1 * scale)))
        paths.append(pen.getCommands())
    width = (x1 - x0) * scale + 24
    height = 214
    body = f'<g id="wordmark" fill="{BLUE}" stroke="{BLUE}" stroke-width="6" stroke-linejoin="round">\n'
    body += "\n".join(f'<path d="{path}"/>' for path in paths) + "\n</g>"
    return body, width, height


def main():
    out = ROOT / "svg"
    out.mkdir(exist_ok=True)
    word, word_w, word_h = wordmark()

    icon = '<g transform="translate(-51.2 -51.2) scale(1.2)">' + CORE + "</g>"
    (out / "ficphone-icon.svg").write_text(svg(512, 512, icon, "FicPhone phone and quotation icon"))
    (out / "ficphone-wordmark.svg").write_text(svg(word_w, word_h, word, "FicPhone wordmark"))

    horizontal_w = 334 + word_w * 1.05 + 24
    horizontal_h = 428
    horizontal = '<g transform="translate(-108 -42)">' + CORE + "</g>"
    horizontal += '<g transform="translate(334 101.65) scale(1.05)">' + word + "</g>"
    (out / "ficphone-horizontal.svg").write_text(svg(horizontal_w, horizontal_h, horizontal, "FicPhone horizontal logo"))

    stacked_w = word_w + 96
    phone_h = stacked_w * .60
    gap = stacked_w * .055
    top = (stacked_w - phone_h - gap - word_h) / 2
    scale = phone_h / 380
    tx = (stacked_w - 248 * scale) / 2 - 132 * scale
    ty = top - 66 * scale
    stacked = f'<g transform="translate({tx:g} {ty:g}) scale({scale:g})">' + CORE + '</g>'
    stacked += f'<g transform="translate(48 {top + phone_h + gap:g})">' + word + '</g>'
    (out / "ficphone-stacked.svg").write_text(svg(stacked_w, stacked_w, stacked, "FicPhone stacked logo"))

    (ROOT / "brand.json").write_text(json.dumps({
        "name": "FicPhone", "color": BLUE, "backgrounds": ["#FFFFFF", "#F5F7FB"],
        "icon_viewbox": [0, 0, 512, 512], "wordmark_outlined": True,
        "horizontal_viewbox": [0, 0, round(horizontal_w, 3), horizontal_h],
        "reference_used_as": "Visual reference only; all geometry redrawn. No embedded raster assets.",
        "wordmark": "Outlined Arial Rounded MT Bold with optical weight adjustment; no font files bundled."
    }, indent=2) + "\n")

    # The board demonstrates separable parts and a website-size horizontal arrangement.
    board = f'''<rect width="1800" height="1200" fill="#F5F7FB"/>
<rect x="64" y="64" width="1672" height="1072" rx="32" fill="#FFFFFF"/>
<text x="112" y="128" fill="#667085" font-family="Arial" font-size="22" letter-spacing="3">FICPHONE / BRAND ASSETS</text>
<g transform="translate(92 180) scale(.9)">{icon}</g>
<g transform="translate(648 272) scale(.81)">{word}</g>
<path d="M112 676H1688" stroke="#E6EAF1" stroke-width="2"/>
<text x="112" y="738" fill="#667085" font-family="Arial" font-size="20">HORIZONTAL LOCKUP</text>
<g transform="translate(345 778) scale(.70)">{horizontal}</g>
<text x="112" y="1110" fill="#667085" font-family="Arial" font-size="18">#002FA7     ·     VECTOR OUTLINES     ·     TRANSPARENT PNG</text>'''
    # Avoid repeated symbol IDs in the preview board.
    board = board.replace(' id="phone-symbol"', '').replace(' id="quotation-marks"', '').replace(' id="wordmark"', '')
    (ROOT / "source" / "brand-preview.svg").write_text(svg(1800, 1200, board, "FicPhone logo redraw preview"))
    print(f"Created 4 production SVG files; wordmark {word_w:.1f} x {word_h}.")


if __name__ == "__main__":
    main()
