# Assets: where they came from, and what licence they carry

> **Reference, accurate as of 2026-09-11.** Every third-party asset the site ships, with its
> origin and licence, plus the recipe that produced the optimised derivatives. Update it in the
> same commit that adds or replaces an asset — provenance recorded later is provenance guessed.

The repository commits **optimised derivatives only**. The multi-megabyte originals live in the
designer's handover folder and are deliberately not in git: this repository is public and its
history is permanent, so a large file committed once stays downloadable forever.

## Images

| Shipped file | Origin | Licence |
|---|---|---|
| `src/assets/hero-texture.webp` (28.5 KB) | Figma Make export, `Frame2/8f7a…png` | Commissioned work — ASO DB Solutions |
| `src/assets/golf-dome.webp` (18.6 KB) | Figma Make export, `MaskGroup/e13a…png` | Commissioned work — ASO DB Solutions |
| `src/assets/cta-golf-course.webp` (203 KB) | Photograph by **Brandon Williams** on Unsplash, photo ID [`Nt3vkTSlVHk`](https://unsplash.com/photos/Nt3vkTSlVHk) | [Unsplash License](https://unsplash.com/license) — commercial use permitted, attribution appreciated but not required |
| `public/icon-32.png`, `public/apple-touch-icon.png`, `public/icon-512.png` | Delivered by the designer, 2026-09-10 | Commissioned work — ASO DB Solutions |
| `public/og.png` (1200×630) | Delivered by the designer, 2026-09-10 | Commissioned work — ASO DB Solutions |

The four icon and social-card files arrived spec-correct and fully opaque — the 180×180 in
particular, which matters because iOS composites transparency onto black. They are wired up
as delivered, with no re-encoding.

## Typeface

**Archivo**, self-hosted via `@fontsource-variable/archivo` 5.3.0.

- **Licence: SIL Open Font License 1.1.** Copyright 2020 The Archivo Project Authors
  ([Omnibus-Type/Archivo](https://github.com/Omnibus-Type/Archivo)). The full licence text ships
  inside the package at `node_modules/@fontsource-variable/archivo/LICENSE`; OFL-1.1 permits
  embedding and redistribution with the notice, which self-hosting via the package satisfies.
- The **`wdth.css`** entry point is used, not the default. It declares `font-weight: 100 900` and
  `font-stretch: 62% 125%` — both axes the design actually uses, since `App.tsx` sets
  `font-variation-settings: "wdth" 125` on display text.
- Three subsets are bundled (`latin`, `latin-ext`, `vietnamese`) because Fontsource ships them as
  separate `@font-face` rules with `unicode-range`. **Only `latin` is ever fetched** for this
  site: every pt-BR diacritic lives in Latin-1 Supplement. The other two sit in `dist/` unused,
  costing deploy size but no visitor bytes.

Fraunces was in the original export and is **not** shipped — it was referenced only by the dead
generated code that never entered this repository.

## The optimisation recipe

`scripts/optimize-assets.py`, run by hand against the designer's export directory:

```bash
python3 scripts/optimize-assets.py \
  /path/to/AI-DataCaddy/site \
  src/assets
```

Measured result, 2026-09-10:

| | Before | After |
|---|---|---|
| texture | 2,231.3 KB | **28.5 KB** (−98.7%) |
| dome | 463.8 KB | **18.6 KB** (−96.0%) |
| CTA photo | 578.9 KB | **203.0 KB** (−64.9%) |
| **total** | **3,274.0 KB** | **250.0 KB** (−92.4%) |

**The texture transform looks lossy and is not.** It renders with `mix-blend-mode: screen`, and
screen against black is the identity, so premultiplying the alpha onto black and reducing to
8-bit grayscale produces equivalent output — four channels collapse to one with no CSS change.
Worst case measured at **2.83/255** across five backdrops, dominated by the luma conversion
rather than by WebP.

Grayscale also beat premultiplied RGB on *both* axes when this was measured — 28.5 KB at 2.83
error, against 30.3 KB at 6.30 — because WebP's chroma subsampling costs more on near-monochrome
RGB than luma conversion costs on grayscale. The counter-intuitive result is why the script
carries the reasoning rather than just the numbers.

## Design source

The `.fig` file is the source for visual changes and is **not** in this repository. Figma
Starter's version history is 30 days, so a local archive has been requested from the designer;
until it exists, the design has no rollback beyond a month. The `site.fig` in the handover folder
is 32 KB — a reference, not a self-contained file, so it does not satisfy this.

## Adding an asset

1. Put the original in the designer handover folder, not in git.
2. Produce the derivative with `scripts/optimize-assets.py`, or by hand if it is a new shape.
3. Commit **only** the derivative.
4. Add a row above, with origin and licence, in the same commit.

If an asset's licence cannot be established, it does not ship. A public repository makes an
unlicensed image a public problem rather than a private one.
