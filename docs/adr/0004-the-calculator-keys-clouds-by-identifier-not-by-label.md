# The migration calculator keys clouds by identifier, not by the visible label

Extends [ADR-0002](0002-each-language-gets-its-own-url.md), which named this hazard but only in
passing, when the calculator offered two clouds. The designer's 2026-09-11 export raised it to
four — Oracle Cloud and Google Cloud alongside AWS and Azure — which made it worth its own record.

**Decided: `Destination` is `"aws" | "azure" | "oci" | "gcp"`. Instance tables, storage labels and
every branch key off those identifiers. `DEST_LABEL` is the single place an identifier becomes
words a visitor reads.**

## The hazard, concretely

The export declared:

```ts
type Destination = "AWS RDS" | "Azure Database" | "Oracle Cloud" | "Google Cloud";
const DEST_INSTANCES: Record<Destination, ...> = { "AWS RDS": AWS_INSTANCES, ... };
```

The string in the type is simultaneously the button's text and the lookup key for that cloud's
pricing table. Rename the button to "Amazon RDS" and the calculator stops finding AWS instances —
or, worse, a near-match keeps working while a different branch elsewhere silently takes the wrong
path. Nothing about the edit looks dangerous: it is a copy change to a label.

This is not hypothetical. The same shape shipped in the original 2026-09-08 export and was fixed
then; the 2026-09-11 export reintroduced it, because the designer works from Figma and has no
reason to know the string is load-bearing. **It will come back with every export**, which is why
it is written down here rather than just corrected again.

## Considered options

- **Keep the labels as keys, and add a lint rule or a test.** Rejected: it detects the problem
  after someone has made it, and the failure it guards against is a silent wrong answer rather
  than a crash, so the test has to assert on pricing output to be worth anything.
- **Keep the labels as keys, and forbid editing them by comment.** Rejected: a comment is not a
  mechanism, and the person most likely to edit the label is working in Figma, not in this file.
- **Opaque identifiers with a label lookup** (chosen). The type system then refuses the mistake
  outright, and the labels become ordinary copy that anyone may edit freely — which is the actual
  goal, not merely avoiding the bug.

Nina's `Record<Destination, ...>` lookup shape is **kept**, not reverted. It is better than the
two-way ternary it replaced (`dest === "AWS RDS" ? AWS : AZURE`), which does not scale past two and
silently treats every non-AWS value as Azure. Only the keys changed.

## Consequences

- **The compiler catches the regression immediately, and did.** A leftover
  `dest === "AWS RDS"` comparison became `error TS2367: This comparison appears to be unintentional
  because the types 'Destination' and '"AWS RDS"' have no overlap` — a hard failure at the exact
  line, rather than a branch that is always false and a UI that quietly shows the wrong row label.
- **`vite build` passed while that typecheck failed.** esbuild strips types without checking them,
  so the broken comparison compiled cleanly into a working-looking bundle. This is the third time
  that has mattered in this repository, and it is the reason `typecheck` gates CI.
- **Re-importing a design export now has a known reconciliation step.** The export will keep
  arriving with label-keyed lookups. The port is mechanical — swap the keys, add labels to
  `DEST_LABEL` — but it must be done deliberately every time rather than merged wholesale.
- **Labels are now safe to translate.** They are ordinary strings, so moving them into
  `src/i18n/` later requires no further refactor. Under the old shape, translating the button text
  would have switched clouds.
- **Four clouds need a two-by-two button grid**, not the flex row that held two. Adopted from the
  export, along with a methodology note naming all four reference regions — a visitor selecting
  Oracle Cloud previously saw prices with no stated basis, since the note named only AWS and Azure
  regions.
- **The pricing figures are the designer's and have not been independently verified.** They are
  commercial claims shown to prospects. The regions are now stated, which makes them checkable;
  checking them is outstanding work, not something this ADR settles.
