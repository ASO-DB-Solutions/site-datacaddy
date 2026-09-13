# Work that cannot ship is shown behind a build-time flag, never a runtime one

The 2026-09-11 design import held back a "Sign in" link because it points at a bare IP over plain
HTTP. That was right, and it had a cost nobody priced: the navigation could no longer be reviewed
as designed, and two other blocked things — a contact form that cannot accept a submission, and
unverified cloud pricing — were equally invisible and therefore equally easy to forget.

**Decided: blocked work is rendered in a review build, outlined and annotated, behind
`import.meta.env.VITE_REVIEW`. Every call site is gated on that literal, so a production build
contains none of it — not hidden, absent.**

## Considered options

- **Leave it out until it is shippable.** What was being done. Rejected: it makes the reviewable
  artefact differ from the designed one without saying so, and a held-back item leaves no trace in
  the thing anyone actually looks at. Three items had accumulated before anyone noticed.
- **Ship it and hide it with CSS, or behind a query parameter.** Rejected outright. The URL would
  be in the public bundle, discoverable by anyone who reads it, and a `?review=1` switch is an
  invitation. Hiding is not the same as not shipping.
- **A separate long-lived branch carrying the unshippable work.** Rejected: it diverges from `main`
  the moment either moves, and the merge cost grows exactly as long as the block persists — which
  for a third-party dependency like a certificate can be weeks.
- **A build-time flag with every call site gated on it** (chosen). One codebase, one `main`, and a
  production artefact that provably does not contain the material.

## The mistake this records

The first implementation looked correct and was not. Helpers returned `{}` when the flag was off:

```ts
export function reviewProps(reason: string) {
  if (!REVIEW) return {};              // looks sufficient
  return { title: `NOT SHIPPABLE — ${reason}` };
}
// call site, unconditional:
{...reviewProps(REVIEW_ITEMS[0].why)}
```

Calling a function unconditionally **still evaluates its arguments**. `REVIEW_ITEMS` therefore
stayed referenced, and every string in it survived into the production bundle — including the
insecure URL the whole exercise exists to keep off the public site. `<ReviewLegend>` had the same
shape: mounted always, returning `null` from inside.

Gating the call sites is what makes it dead code:

```ts
{...(REVIEW ? reviewProps(REVIEW_ITEMS[0].why) : {})}
{REVIEW && <ReviewLegend items={REVIEW_ITEMS} />}
```

**It was found by grepping the production bundle, not by reasoning about it.** An assertion about
what a bundler removes is worth nothing until the artefact is searched. That check is now part of
the procedure rather than a thing someone might think to do.

## Consequences

- **A production build must be grepped, not trusted.** `grep -c '144.22.135.180' dist/assets/*.js`
  returning zero is the evidence; the flag's presence is not. Anything added to `REVIEW_ITEMS` that
  is sensitive needs the same check.
- **The flag is invisible in ordinary work.** `pnpm run build`, CI, and Netlify never set it, so
  every deploy is a production build by default. There is no way to ship review mode by forgetting
  something; it requires actively setting the variable.
- **Three items currently carry it.** Each names who is blocking and why. An item leaving the list
  means its outline and its entry go together, because both read from one array.
- **It will be tempting to use this for feature flags.** It is not one: there is no runtime toggle,
  no per-user targeting, and no way to change behaviour after a build. It shows work that is
  finished but blocked on something external, and nothing else.
- **The panel is a review tool, not a caption.** Clicking an entry scrolls to the element and
  pulses it. On a long single page, a note that cannot find its subject goes unread.
- **Marks use `outline`, not `border`**, so they never shift the layout. A review that changes the
  thing being reviewed is worse than no review.
