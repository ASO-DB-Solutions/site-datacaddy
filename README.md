# site-datacaddy

The one-page institutional website for **DataCaddy**, at [datacaddy.co](https://datacaddy.co) —
a static React/Vite build served by Netlify, in English and Brazilian Portuguese.

DataCaddy reads a database estate (Oracle, SQL Server, PostgreSQL, MySQL), measures what each
instance actually consumes, and reports the size it should be along with the cost of the
difference. *This repository is the marketing site, not the product.* No code here touches a
database.

## Run it

`pnpm` is not on the development host's PATH; Corepack is, and it pins the version from
`package.json#packageManager` — the same path CI and Netlify take.

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm run dev              # http://localhost:5173  (hot reload)
corepack pnpm run build            # -> dist/
corepack pnpm exec vite preview    # http://localhost:4173  (serves the real build)
corepack pnpm run review           # build + serve WITH blocked work on show
```

`review` is not a debug mode. It renders work that is finished but blocked on something external —
today a sign-in link waiting on a certificate, a contact form waiting on a Netlify setting, and
unverified cloud pricing — each outlined in red with its reason and who is blocking. A production
build contains none of it; see [ADR-0005](docs/adr/0005-unshippable-work-is-shown-behind-a-build-time-flag.md).

The gate chain, which CI runs on every pull request:

```bash
corepack pnpm run typecheck     # load-bearing: a green build does NOT prove valid TypeScript
corepack pnpm run format:check
corepack pnpm run check:i18n    # catches a translation left as its English original
corepack pnpm run build
```

## Layout

| Path | What it is |
|---|---|
| `src/App.tsx` | The entire site — one component, with its design tokens at the top |
| `src/assets/` | Optimised images. Originals are not committed; history is public and permanent |
| `index.html`, `pt-br/index.html` | The two locale shells. Same bundle, different `<html lang>` and `<head>` |
| `build/site-meta.ts` | Fills each shell's `<head>` per locale, keyed on path |
| `public/` | Favicons, the Open Graph card, `robots.txt` |
| `netlify.toml` | Build command, publish directory, security headers |
| `docs/` | Runbooks and decision records — see [`docs/README.md`](docs/README.md) |

## Start here

1. [`CONTEXT.md`](CONTEXT.md) — the vocabulary, including the golf metaphor the copy is built on
2. [`AGENTS.md`](AGENTS.md) — how work is done here, and why each convention exists
3. [`docs/NETLIFY-SETUP.md`](docs/NETLIFY-SETUP.md) — standing the site up and pointing the domain at it

## Two things that will save you an hour

**A green build does not mean the code is valid.** `vite build` strips TypeScript types without
checking them, so a syntax error inside a type annotation compiles happily. Only `tsc --noEmit`
catches it. That is why `typecheck` is a CI gate.

**The Portuguese copy is the original.** The design was authored in pt-BR and the English is
derived from it, so both editions are authored text. The golf vocabulary is transcreated, not
translated — the agreed renderings are in `CONTEXT.md`.
