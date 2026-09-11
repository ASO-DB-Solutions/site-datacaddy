# The site leaves the Figma Make harness and becomes an ordinary Vite project

The designer delivered the site as a **Figma Make** export: React 19, Vite 8, TypeScript 5.7 and
Tailwind v4, wired to Figma's own hosting. It built and it worked. This ADR decides that
**the harness is removed rather than kept, and the repository — not the Figma file — becomes the
source of truth for the site**.

Written 2026-09-11, after the fact: the removal landed in the repository's first commit
(`43037da`) because a public repository's history is permanent, and importing the export intact
before cleaning it would have left 2,318 lines of generated code and a 2.28 MB texture
downloadable forever.

## Considered options

- **Keep the export as delivered.** Unzip it, commit it, deploy it. Rejected — not because it
  fails, but because of what it commits: dead generated code, unoptimised images, fonts fetched
  at runtime from `static.figma.com`, `robots.index: false` shipping silently, and a formatter
  that corrupts TypeScript. All of it permanent on a public repository.
- **Keep the Figma plugins, fix only the fonts.** The middle path: stop depending on Figma's CDN
  but leave `vite.config.ts` alone. Rejected — it leaves ~330 lines of vendor configuration that
  nobody here owns, and `figmaSiteConfiguration` structurally cannot produce per-locale `<head>`
  tags, which [ADR-0002](0002-each-language-gets-its-own-url.md) requires.
- **Remove the harness, keep the repository as the source of truth** (chosen). Delete the three
  dev-only plugins, replace the one load-bearing plugin, self-host the fonts, prune the dead code.

The plugin audit that decided it:

| Plugin | `apply` | Runs in `vite build`? | Action |
|---|---|---|---|
| `figmaSiteConfiguration` | none | **yes** | Replaced by `build/site-meta.ts` |
| `figmaErrorOverlayReplay` | `serve` | no | Deleted |
| `figmaReactRefreshBoundaryFallback` | `serve` | no | Deleted |
| `figmaMakeKitPlugin` | `serve` | no | Deleted — its stories glob matched zero files |

Only the first is load-bearing, because `index.html` carries six `<!-- figma:* -->` slots it
fills. Deleting it alone would have shipped `<title><!-- figma:title --></title>` as the literal
SERP title.

## Consequences

- **Design changes are now manual.** Nina edits the `.fig` and exports assets; we apply them by
  hand. For a one-page site that is cheap, and it is what already worked for the four icons. There
  is no path back to regenerating the page from Figma Make without redoing this decision.
- **The replacement fixed two defects the original carried**, which is the argument for replacing
  rather than porting: `og:image` was emitted verbatim and therefore relative, which most scrapers
  will not resolve; and the `<head>` could not vary by locale, because the plugin's
  `transformIndexHtml` handler received only `html` and no path.
- **`oxfmt` had to go too.** It shipped with the export and it **corrupts TypeScript** — it
  deleted the semicolon in an inline type literal, producing invalid code that `vite build`
  accepted anyway, because esbuild strips types without validating them. Only `tsc --noEmit`
  caught it. That is why `typecheck` is a CI gate here and not a nicety, and the lesson
  generalises: a green build never proves the code is valid.
- **The images were re-encoded once, by hand, and the originals were not committed.** 3,274 KB →
  250 KB. The hero texture alone went 2,231 KB → 28.5 KB by exploiting the fact that it renders
  with `mix-blend-mode: screen`, and screen against black is the identity — so premultiplying the
  alpha and reducing to 8-bit grayscale is equivalent output, measured at a worst case of 2.83/255
  across five backdrops. No CSS change was needed. The recipe is not yet committed as a script,
  which is a gap.
- **`src/imports/1920WDefault/index.tsx` was read before being dropped**, and turned out to be the
  **original pt-BR copy deck** rather than dead generated code. Had the export been committed and
  tidied later, the Portuguese source would have been deleted by someone who believed it was
  machine output. See [ADR-0002](0002-each-language-gets-its-own-url.md).
- **The `.fig` file remains the source for visual changes**, and Figma Starter's version history
  is only 30 days. A local `.fig` archive has been requested from the designer; until it exists,
  the design has no rollback beyond a month.
