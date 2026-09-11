# DataCaddy site

The one-page institutional website for **DataCaddy**, at `datacaddy.co`. A static React/Vite
build, published on Netlify, in English and Brazilian Portuguese.

## Language

### The product this site sells

**DataCaddy**:
The product the site describes — it reads a database estate (Oracle, SQL Server, PostgreSQL,
MySQL), measures what each instance actually consumes, and reports the size it should be, with
the cost of the difference. Read-only, agentless. **This repository is the marketing site, not
the product**; no code here touches a database.
_Avoid_: the tool, the platform, the app

**Estate**:
The customer's whole population of database instances, which is what an assessment covers.
Rendered in pt-BR as **parque**.
_Avoid_: fleet, park (see the golf vocabulary below — "park" is a mistranslation, not a synonym)

**Assessment**:
The offer the site's call to action leads to — a courtesy read of up to five instances. It is
the page's single conversion goal, so nothing else on the page competes with it.
_Avoid_: audit, analysis, scan

### The golf vocabulary

The site is built on a golf metaphor, and it is **transcreated, not translated** — the pt-BR copy
is the original, and the English is derived from it. Both are authored, neither is mechanical.
These terms are the ones that recur; keep them consistent within each language.

**par**:
The size an instance *should* be. Identical word in English and Brazilian Portuguese golf, which
is why `info@datacaddy.co` was considered and why the term anchors both editions.
_Avoid_: baseline, target (in copy — fine in prose about the copy)

**score / tacadas**:
The distance between provisioned and needed capacity, in both directions. EN "net strokes above
and below par"; pt-BR "soma das tacadas acima e abaixo do par".
_Avoid_: delta, variance

**scorecard / cartão do parque**:
The deliverable an assessment returns. **The English must not read "Park Card"** — that was a
literal rendering of *cartão do parque* in an early draft, and *parque* means the estate, not a
park.
_Avoid_: Park Card (an error, kept here so it is not reintroduced), report card

**round / volta**:
One pass over the estate. "Agendar uma volta" — schedule a round — is the CTA's pt-BR form.
_Avoid_: session, run

**E**:
Even par, in the score column. Carried untranslated from the pt-BR source. Flagged as a live
legibility question in both languages — a non-golfer reads nothing from it.

### Build and hosting

**Locale shell**:
One of the two HTML entry points, `index.html` (`/`, English) and `pt-br/index.html`
(`/pt-br/`, Portuguese). Both load the same bundle; only `<html lang>` and the `<head>` differ.
`build/site-meta.ts` fills the `<head>` per locale, keyed on the request path.
_Avoid_: template, page (the site has one page in two languages, not two pages)

**Deploy Preview**:
The throwaway Netlify address published for every pull request. Distinct from production, which
is built only from `main`. Reviewing here is what the branch workflow exists for.
_Avoid_: staging (there is no staging environment), preview build

**Figma Make**:
The Figma product that generated the original export. Its harness was removed in the first
commit — see ADR-0001. The `.fig` design file remains the source for *visual* changes, but the
repository is the source of truth for the site.
_Avoid_: Figma (the design tool generally), the export

### Ownership

**ASO Tech Global LLC**:
The entity that owns this web project, and the one named in the site's footer. DataCaddy targets
the United States market, which is why the US entity owns it rather than ASO DB Solutions. Written
without a comma or a period before `LLC` — see the note below.
_Avoid_: ASO TECH GLOBAL. LLC (the period is not a recognised form), Aso Tech (the full name is
the legal one)

**ASO DB Solutions**:
The Brazilian company that owns the `ASO-DB-Solutions` GitHub organization, which hosts this
repository, and the sibling repository `integration-bot` that supplies the conventions this one
follows. Distinct from the owner of the web project above — the organization hosts the code, the
LLC owns the site.
_Avoid_: ASODB (that prefix belongs to the Teams bot, not to this product); treating it as the
site's owner

**`datacaddy.co`**:
The production domain. Registered at **Cloudflare**, whose registrar requires its domains to
stay on Cloudflare nameservers. Note `datacaddy.com` resolves to an unrelated host and is not
ours — the designer's export carried `hello@datacaddy.com`, which was corrected.
_Avoid_: datacaddy.com, the .com
