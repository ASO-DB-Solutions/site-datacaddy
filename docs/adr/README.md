# Architecture decision records

One file per hard-to-reverse decision. Numbered sequentially, `NNNN-kebab-case-title.md`, never
renumbered.

**They are append-only.** A decision that no longer holds is not edited away: the superseding ADR
says `Supersedes [NNNN]`, and the superseded one gains a `**Status: Superseded by [NNNN].**`
header at the top. Corrections and things learned later go in a dated `## Addendum` section at
the bottom, so the reasoning as it stood stays readable next to what reality did to it.

## Shape

A title that states the decision as a sentence, a context paragraph in bold-decision form, then:

```
## Considered Options
- **Option A.** Rejected: <why>.
- **Option B** (chosen): <why>.

## Consequences
- What this costs, what it forecloses, what will be forgotten later.
```

Consequences are the part worth writing carefully. A consequence nobody wrote down is the one
that surprises someone in four months.

## What earns an ADR

A decision is worth recording when reversing it would mean rewriting code, re-doing an external
setup, or renegotiating with someone outside the team. Hosting, URL layout, the i18n mechanism
and the contact-form endpoint all qualify. Which shade of green a button is does not.

## Index

| # | Decision | Status |
|---|---|---|
| [0001](0001-the-site-leaves-the-figma-make-harness.md) | The site leaves the Figma Make harness and becomes an ordinary Vite project | Accepted |
| [0002](0002-each-language-gets-its-own-url.md) | Each language gets its own URL, from one shared bundle | Accepted |
| [0003](0003-netlify-hosts-the-site-with-netlify-forms-for-contact.md) | Netlify hosts the site, and Netlify Forms takes the contact form | Accepted |

This table and the files must agree. A new ADR is added here in the same commit that adds it to
the directory.
