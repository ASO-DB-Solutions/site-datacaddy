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

## Addendum (2026-09-14): only English is offered to search engines

The decision holds — each language keeps its own URL, built from one bundle — but one consequence
above is now wrong. This ADR assumed both locales would be indexed and left open only *which* one
owned `/`. The owner's call is that **`/pt-br/` is not for search results at all**: DataCaddy sells
into the United States, and the Portuguese page exists so the designer, the owner and Brazilian
stakeholders can read the site in its original language. It stays built, deployed and reachable to
anyone with the link.

What changed, one day after indexing was enabled:

- `pt-br/index.html` carries `<meta name="robots" content="noindex, follow">`.
- `public/sitemap.xml` submits only `https://datacaddy.co/`.
- **The `hreflang` set is gone from both shells.** It exists to relate indexable translations of
  one page. With one locale indexed, a single-entry set says nothing, and a set naming a `noindex`
  page contradicts itself.

**`robots.txt` stays `Allow: /`, and that is load-bearing.** The obvious move — `Disallow: /pt-br/`
— would have been wrong three times over, and the third is the trap: `Disallow` stops a crawler
*fetching* the page, so it would never read the `noindex` that does the actual work. Blocking and
de-indexing are different jobs, and combining them leaves the page crawlable-but-unreadable in the
worst sense. Two further reasons it was rejected: `Disallow` does not remove a URL from the index
(a blocked page can still be listed, bare, from external links), and `robots.txt` is itself public,
so naming a path there advertises it to anyone curious.

**Which locale owns `/` is no longer open.** English owns it, because it is the only one indexed.
Reversing that is no longer "one constant" — it would mean moving the `noindex` and rebuilding the
sitemap, which is the cost of having answered the question.

**The documentation still describes two locales, correctly.** `CONTEXT.md`, `AGENTS.md` and the
setup runbooks were left alone: the site really is built bilingually from two shells, and that has
not changed. What changed is only what the site tells search engines.
