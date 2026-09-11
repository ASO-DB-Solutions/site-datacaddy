#!/usr/bin/env python3
"""Produce the optimised image derivatives the site ships.

A one-time hand-run, not a CI step: the inputs are design exports that change
rarely, and re-encoding on every build would burn minutes to produce bytes
that are already committed. Provenance and licences are in docs/assets.md.

    python3 scripts/optimize-assets.py <figma-export-dir> src/assets

Requires Pillow with WebP support (Pillow >= 9 has it built in).

The texture case is the one worth explaining, because it looks lossy and is
not. It renders with `mix-blend-mode: screen` at `opacity: 0.45`. For the
screen blend, an image with alpha `a` and colour `s` composites identically
to an OPAQUE image of colour `a*s`:

    with alpha:     Co = (1-0.45a)*Cb + 0.45a*(Cb + Cs - Cb*Cs)
                       = Cb + 0.45*a*Cs*(1-Cb)
    premultiplied:  Co = (1-0.45)*Cb  + 0.45*(Cb + a*s - Cb*a*s)
                       = Cb + 0.45*a*s*(1-Cb)        <- identical

Screen against black is the identity, so flattening the alpha onto black and
reducing to 8-bit grayscale is equivalent output. Four channels collapse to
one and no CSS changes. Measured worst case 2.83/255 across five backdrops,
dominated by the luma conversion rather than by WebP.

Grayscale also beat premultiplied RGB on BOTH axes when this was measured
(28.5 KB / 2.83 error vs 30.3 KB / 6.30): WebP's chroma subsampling costs
more on near-monochrome RGB than luma conversion costs on grayscale.
"""

import sys
from pathlib import Path

from PIL import Image, ImageChops

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)


def premultiply_to_gray(im: Image.Image) -> Image.Image:
    """Flatten alpha onto black, then collapse to 8-bit grayscale."""
    r, g, b, a = im.split()
    r, g, b = (ImageChops.multiply(c, a) for c in (r, g, b))
    return Image.merge("RGB", (r, g, b)).convert("L")


def flatten(im: Image.Image) -> Image.Image:
    """Composite onto black and drop the alpha channel."""
    bg = Image.new("RGB", im.size, (0, 0, 0))
    bg.paste(im, mask=im.getchannel("A"))
    return bg


def report(label: str, src: Path, dst: Path) -> tuple[int, int]:
    before, after = src.stat().st_size, dst.stat().st_size
    print(
        f"{label:<30} {before/1024:>9,.1f} KB -> {after/1024:>8,.1f} KB"
        f"   -{100 * (1 - after / before):4.1f}%"
    )
    return before, after


jobs: list[tuple[str, Path, Path]] = []

# 1. Hero texture. See the module docstring: grayscale is not a compromise here.
p = SRC / "src/imports/Frame2/8f7a6a7b81efa8a327e91a22e497bd8e8f0b4509.png"
out = OUT / "hero-texture.webp"
premultiply_to_gray(Image.open(p)).save(out, "WEBP", quality=80, method=6)
jobs.append(("texture (gray, screen-safe)", p, out))

# 2. Golf-ball dome. 99.54% opaque and clipped by an SVG clipPath anyway,
#    so the alpha channel is redundant weight.
p = SRC / "src/imports/MaskGroup/e13a8dc9e188d1d742529d5ee58a4a46f730b0b9.png"
im = Image.open(p)
out = OUT / "golf-dome.webp"
flatten(im).resize((1920, round(1920 * im.height / im.width)), Image.LANCZOS).save(
    out, "WEBP", quality=82, method=6
)
jobs.append(("dome (flattened)", p, out))

# 3. CTA background photo. Sits under a rgba(21,42,11,0.97 -> 0.55) gradient,
#    which hides compression artefacts, so q70 is safe.
p = SRC / "src/imports/brandon-williams-Nt3vkTSlVHk-unsplash.jpg"
im = Image.open(p).convert("RGB")
out = OUT / "cta-golf-course.webp"
im.resize((1920, round(1920 * im.height / im.width)), Image.LANCZOS).save(
    out, "WEBP", quality=70, method=6
)
jobs.append(("CTA photo", p, out))

total_before = total_after = 0
for label, s, d in jobs:
    b, a = report(label, s, d)
    total_before += b
    total_after += a

print("-" * 68)
print(
    f"{'TOTAL':<30} {total_before/1024:>9,.1f} KB -> {total_after/1024:>8,.1f} KB"
    f"   -{100 * (1 - total_after / total_before):4.1f}%"
)
