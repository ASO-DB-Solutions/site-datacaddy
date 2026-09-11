# Each language gets its own URL, from one shared bundle

The site ships in English and Brazilian Portuguese. This ADR decides **two prerendered HTML
shells — `/` and `/pt-br/` — loading one shared JavaScript bundle, with the copy held in typed
dictionaries under `src/i18n/` and the language chosen by an `<a href>`, not by runtime
detection**.

Written 2026-09-11. The shells and `build/site-meta.ts` landed in the first commit; the
dictionaries are the work this ADR authorises.

## The finding that shaped it

`src/imports/1920WDefault/index.tsx` looked like dead generated code. It is the **original pt-BR
copy deck** — the design was authored in Portuguese and `App.tsx`'s English is derived from it.

```
"O que ele carrega no saco"           →  "What it reads"
"Média engana. Percentil 95 decide."  →  "Average lies. P95 decides."
"Cartão do parque"                    →  "Park Card"    ← a mistranslation
```

So the Portuguese edition is roughly 90% *recovery*, not translation. It also means neither
language can be regenerated from the other: both are authored text, and the golf metaphor is
transcreated. `CONTEXT.md` fixes the vocabulary.

## Considered options

- **`react-i18next`.** Rejected: ~20 KB gzipped, a provider, a detector and a resource loader, to
  serve ~110 flat strings with no pluralisation. Its real cost is moving "is this string
  translated?" from compile time to runtime.
- **Two full builds, one per language.** Best SEO, rejected on cost: it doubles the build matrix,
  duplicates the HTML shell, and makes the language toggle a full navigation with no shared bundle.
- **One bundle, runtime language detection from `Accept-Language`.** Rejected: Google advises
  against redirecting `/` by language, and it hides one of the two pages from the crawler
  entirely. It also makes the URL and the rendered language disagree, so a shared link can show
  the wrong text.
- **Two prerendered shells, one bundle, typed dictionaries** (chosen). Takes the SEO win of
  separate URLs at roughly 1% of the cost of separate builds.

## Consequences

- **`type Copy = typeof en` makes `tsc --noEmit` the missing-translation gate.** A key present in
  English and absent or misspelled in Portuguese is a build failure, not a blank on the page. That
  is stricter than any runtime library's fallback behaviour and costs zero bytes.
- **`src/i18n/*.ts` must stay pure data** — no React, no DOM imports — because `vite.config.ts`
  loads them at config time to build each shell's `<head>`. This is a real constraint that will
  look arbitrary to someone adding a helper function there.
- **The toggle is a link, not state.** `/pt-br/#rightsizing` ↔ `/#rightsizing`, preserving the
  hash. Crawlable and shareable, and the URL can never disagree with the rendered language.
- **A UI label must never double as a logic discriminator.** `type Destination = "AWS RDS" | "Azure Database"`
  was both the button text and the condition selecting a cloud provider's instance table.
  Translating the label would have silently switched providers in the cost calculator. It becomes
  `'aws' | 'azure'` with labels from the dictionary, and this has to happen *before* any
  translation exists.
- **Which locale owns `/` is deliberately left open.** Both shells carry all three `hreflang`
  links; which path `x-default` points at is one constant. English holds it today because the
  `.co` domain and the current copy read international, but the design's original language is
  Portuguese, so the argument is live. Reversing it is cheap by construction.
- **The social card is shared until that decision.** Its tagline is English, so pt-BR currently
  gets an English card. Per-locale cards are one line in `src/i18n/*.ts`, because the OG URL
  already lives in each dictionary's `meta` block.
- **`tsc` cannot catch a Portuguese value that is still the English string.** A separate
  `check:i18n` gate is needed for that, asserting no empty values and no pt-BR value identical to
  its English counterpart outside an allowlist of proper nouns.
