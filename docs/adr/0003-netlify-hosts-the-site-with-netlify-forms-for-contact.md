# Netlify hosts the site, and Netlify Forms takes the contact form

This ADR decides **Netlify's Free plan as the host**, with **Netlify Forms** as the contact
endpoint, and records why the three plausible alternatives were rejected. Live at `datacaddy.co`
since 2026-09-11.

## Considered options

- **Vercel Hobby.** Rejected on licence, not capability: Hobby is contractually
  personal/non-commercial, and a product's marketing page is commercial use. The Pro plan would
  be ~US$20/seat/month for a site that will never approach any usage limit.
- **GitHub Pages.** Genuinely attractive — zero new vendors, and Actions minutes are free and
  unlimited on a public repository, with no organisation policy change needed since the Pages
  actions are all GitHub-authored. Rejected for three reasons that compound: **no security
  headers are possible at all**, so the HSTS / `X-Content-Type-Options` / `Referrer-Policy` set
  this site now serves could not exist; no per-PR deploy previews, which matter with a designer in
  the loop; and the Pages terms discourage using it to run a business, which is a grey area a
  company site should not sit in.
- **Azure Static Web Apps.** The highest-reuse option, and the one the organisation is already
  configured for: the sibling repository runs a landing page on it, `Azure/static-web-apps-deploy@v1`
  is the single third-party action on the org allow-list, and the tenant is already owned. It
  offers custom domains, managed TLS, PR preview environments and managed Functions — which would
  have let the contact form keep its data in our own tenant. Rejected on balance: it adds an Azure
  resource and a deployment token to own, for a site with no backend and no secrets, where the
  form can be solved with no credential at all.
- **Netlify Free** (chosen). Commercial use explicitly permitted, per-PR deploy previews,
  header control, one-click rollback, and native forms.

## Consequences

- **Netlify builds and deploys; GitHub Actions only gates.** CI runs typecheck, format and build
  on every pull request and deploys nothing. The organisation's allowed-actions policy therefore
  never sits in the deploy path — which also means a CI failure does not block a Netlify deploy,
  and the two can disagree.
- **Netlify Forms cannot see a React-rendered form.** Its parser runs at build time against static
  HTML, so the repository carries a hidden static form in `index.html` whose field names must
  match the React component's. If that hidden form is ever removed as apparent dead markup,
  submissions start returning 404 with nothing else changing.
- **100 submissions/month on the free plan**, and submissions are stored on Netlify and visible to
  anyone with account access. That makes Netlify a data processor for LGPD purposes, named in the
  privacy notice — see `docs/PUBLIC-SURFACE.md`.
- **The endpoint stays swappable.** The form posts to a single `VITE_CONTACT_ENDPOINT`, so moving
  to Web3Forms, Formspree or a function is an environment-variable change rather than a rewrite.
  Note that a `VITE_`-prefixed value is inlined into the public bundle — safe here only because
  the value is designed to be public.
- **Deploy previews are public and unauthenticated**, at a sequential and therefore guessable URL.
  Netlify sends `X-Robots-Tag: noindex`, but a preview is published, not private.
- **Adding a form adds an attack surface a static site did not have.** A honeypot field plus a
  submit-time floor is the minimum; free-tier endpoints get scraped quickly, and on a public
  repository the markup is readable in advance.
- **The apex is served by an A record to `75.2.60.5`, not the flattened CNAME** the runbook
  prefers. It works, and Netlify publishes that address for exactly this purpose, but it pins us
  to an IP that Netlify could change. Worth revisiting at the next DNS edit.
- **Reversing this is cheap.** The build output is plain static files with no Netlify-specific
  code except the hidden form; the reason to stay is the licence and the previews, not lock-in.
