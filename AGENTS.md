## Agent conventions

Adopted from the sibling repository `ASO-DB-Solutions/integration-bot` on 2026-09-11, so the
organization's second repository does not invent a second way of working. Where a convention is
narrower here, the reason is given.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at the repo root. ADRs are append-only and
numbered sequentially, never renumbered; corrections go in a dated `## Addendum`, not by editing
the reasoning. See `docs/adr/README.md`.

**Devlog (adopted 2026-09-11, reversing an earlier call).** One dated report per calendar day
under `docs/devlog/`, generated from git and GitHub rather than from memory, aimed at a
non-technical stakeholder. See `docs/devlog/README.md`.

This section previously argued the opposite — that a one-page site did not justify the ceremony.
Two days in, the project had already accumulated decisions a stakeholder would want to follow, and
none of them were legible without reading commit messages. Reversed on the project owner's call;
recorded rather than silently edited, because the earlier reasoning was wrong in a way worth
remembering.

### Branching (adopted 2026-09-11)

One branch per unit of work, merged via PR — not directly on `main`. Plain kebab-case slugs
(`contact-form`, `fix-og-image`); `ticket-N-slug` when an issue exists. **Delete the branch once
its PR is merged**, local and remote.

The first commit went directly to `main` because an empty repository has no base to branch from.
Everything after that is branch + PR.

`gh pr merge` fails here with `Resource not accessible by personal access token` — the
organization's fine-grained PAT is deliberately narrow. Merge over SSH instead:
`git merge --no-ff <branch> -m "Merge pull request #<n> from <branch>"` then `git push origin main`.
Do **not** widen the PAT's scope to work around this.

Push uses a repo-scoped deploy key, not a personal key: `~/.ssh/github-site-datacaddy`, reached
through the `github-site-datacaddy` host alias. `IdentitiesOnly yes` is required — without it SSH
offers `id_ed25519` first and GitHub authenticates you as `integration-bot`.

### Commit subjects

Declarative present-tense sentences describing the *effect*, not imperative
conventional-commits. `The Portuguese edition stops reading like a translation`, not
`fix(i18n): improve pt-BR copy`.

### Coding conventions

**A green build does not prove the code is valid.** `vite build` strips TypeScript types without
checking them, so a syntax error inside a type annotation compiles happily. Only `tsc --noEmit`
catches it. `typecheck` is therefore a load-bearing CI gate, not a nicety — this was found the
hard way when `oxfmt` 0.2.0 deleted a semicolon in an inline type literal and the build stayed
green.

**Prettier, not `oxfmt`.** The Figma Make export shipped `oxfmt`; it corrupts TypeScript (above).
Configured with `printWidth` only, so the designer's existing semicolon and double-quote style
survives and diffs stay small.

**`pnpm` is not on this host's PATH — use `corepack pnpm`.** Corepack reads
`package.json#packageManager` and pins `pnpm@10.34.3`, which is the same path CI and Netlify take.

**Every visible string lives in `src/i18n/`, never in JSX.** `type Copy = typeof en` makes
`tsc --noEmit` the missing-translation gate: a key present in English and absent in Portuguese is
a build failure rather than a blank on the page.

**Never make a UI label double as a logic discriminator.** `type Destination = "AWS RDS" | "Azure Database"`
was both the button text and the branch condition selecting a cloud provider's instance table —
translating the label would have silently switched providers.

### A control that cannot act is dimmed, not disabled (adopted 2026-09-13)

`aria-disabled` with reduced opacity, not the `disabled` attribute, whenever a control is inert
because of something the visitor can change.

```tsx
<button aria-disabled={!complete} onClick={…}>   // dimmed, reachable, explains itself
<button disabled={!complete}>                     // WRONG — leaves the tab order silently
```

A `disabled` button is removed from the tab order, so a keyboard or screen-reader user meets a
control they cannot reach and is told nothing about why. The dimmed form stays reachable, and
activating it is what surfaces the reason — the submit handler marks every outstanding field and
focuses the first; a dimmed destination button opens the card explaining what that cloud offers
instead. "Why is that one grey?" is the question worth answering, and the dead end is the worse
interface.

`disabled` is still correct for a control that is inert because of something in flight — a form
mid-submit, where blocking a second click is the whole point.

**One source per attribute when a spread is involved.** `title` was being set twice on the same
element, once directly and once by a review mark, and the later spread won silently. `tsc --noEmit`
catches this (TS2783); `vite build` does not.

### Showing work that cannot ship (adopted 2026-09-12)

Work that is finished but blocked on somebody else is rendered in a **review build**, outlined and
annotated, rather than held out of the tree. Holding it out makes the reviewable artefact differ
from the designed one with nothing saying so. `corepack pnpm run review`; see ADR-0005.

**Gate every call site on the build-time literal, not just the helper's body.**

```tsx
{...(REVIEW ? reviewProps(reason) : {})}      // correct — dead code in production
{...reviewProps(reason)}                       // WRONG — the argument still evaluates
```

A helper that returns `{}` when the flag is off looks sufficient and is not: calling it
unconditionally still evaluates its arguments, which keeps the data referenced and every string in
it alive in the shipped bundle. That is how an insecure URL reached a production build here.

**Then grep the artefact.** An assertion about what a bundler removes is worth nothing until
`dist/assets/*.js` has been searched for the string that must not be there.

### Assets

Optimised derivatives are committed; multi-megabyte originals are not. The repository is public,
and its history is permanent — a large file committed once stays downloadable forever, which is
why the first commit was landed clean rather than as an import followed by deletions.

### Deliverables (adopted 2026-09-11)

A setup or handover topic ships as a **trio**: an English `.md`, a pt-BR `.md`, and a published
Artifact for the stakeholder. The two `.md` editions stay in step on sections and literal values;
each carries its own diagram, in its own language.

**A document's diagrams speak the document's language.** Node identifiers and proper nouns
(`main`, `Netlify`, `Cloudflare`, `CNAME`) stay as they are in both.

**Never link a document that does not exist.** A markdown link to a missing file reads as data
loss in VS Code's preview. Audit relative links and in-page anchors before committing — a
numbered heading's slug carries its number (`#4-dns-parameters--hand-these-over`), which is easy
to get wrong.

### Site copy

**The site's public is bilingual: English at `/`, Portuguese at `/pt-br/`.** Which locale owns the
root is a launch-time decision; the build is symmetric so it is one constant either way.

The pt-BR copy is the **original** and the English is derived from it — the design was authored in
Portuguese. Treat both as authored: the golf metaphor is transcreated, not translated. The
vocabulary is fixed in `CONTEXT.md`.

**Don't assert on user-facing wording in tests.** Pin the property instead, so a rewording cannot
break an assertion.

### Shared filesystem

`/opt/site-datacaddy` is `adb:adb`, mode `2775`, with an access **and default** ACL granting the
`adb` group `rwx`. Run `umask 002`, and `git config --global --add safe.directory` once per
account.

A recursive `chmod` silently clamps the ACL mask while `getfacl` still prints `rwx` — verify with
`getfacl -d`, and re-apply `setfacl` after any `chmod`. New group membership does not reach an
already-open Remote-SSH window; reconnect fully, or use `newgrp adb`.
