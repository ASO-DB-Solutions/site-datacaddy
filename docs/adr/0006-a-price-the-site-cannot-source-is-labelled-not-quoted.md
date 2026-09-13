# A price the site cannot source is labelled, not quoted

The migration calculator shows a prospect what their database would cost on four clouds. Three of
those columns came from published list prices. The Oracle Cloud column did not — it came from a
figure nobody on this side could trace, sitting in the same table, in the same typeface, carrying
the same implied authority as the three that could be checked.

Worse, one cell of it priced a product that does not exist: OCI has no managed Microsoft SQL
Server. On Oracle Cloud, SQL Server runs BYOL on Compute instances the customer administers, and
there is no PaaS equivalent to Amazon RDS for SQL Server or Azure SQL. The calculator was quoting a
managed rate for it anyway.

**Decided: every column names the service and region its figures come from, and a column whose rate
did not come from a published list price says so on the page. An engine a destination does not
offer as a managed service is refused outright rather than priced.**

## Considered Options

- **Substitute a better-researched Oracle number.** Rejected, and this is the one that felt
  responsible. Oracle publishes managed-database rates per OCPU and per GB rather than as named
  instance types, so there is no `db.r6i.2xlarge` equivalent to quote. Oracle's own price pages
  refuse automated requests. The secondary sources that carry figures disagree on whether they are
  per OCPU or per ECPU and disclaim themselves — one says plainly to treat its numbers as
  orientation rather than quotation. Replacing one untraceable figure with another would have
  repeated the original mistake with more confidence behind it.
- **Drop the Oracle column until it can be sourced.** Rejected: Oracle Cloud is a destination this
  business is asked about, and an absent column reads as "not supported" rather than "not yet
  priced". It also hides the question instead of answering it.
- **Keep quoting it and add a blanket disclaimer at the foot of the section.** Rejected. A footnote
  covering all four columns tells a reader nothing about *which* number to distrust, which is the
  only thing they need. A caveat that applies to everything applies to nothing.
- **Name the provenance per column, and mark the unsourced one** (chosen). `DEST_META` carries the
  service name, the region, and whether the rate came from a published list price; the methodology
  note reads from it rather than restating it by hand. `DEST_ENGINES` records which engines each
  destination actually offers, so the non-existent-product class of claim cannot recur by accident.

## Consequences

- **The site now makes a checkable claim instead of an impressive one.** A reader can confirm or
  refute any of the four columns, which was not previously possible. That is the point: these are
  commercial numbers shown to prospects, and a number a prospect's own architect can dismantle in a
  meeting costs more than a missing one.
- **`sourced: false` is visible to visitors, and it should stay uncomfortable.** The caveat is
  rendered in a warning colour next to the figure. The intended way to remove it is to source the
  price, not to soften the wording.
- **Clearing it needs an OCI account and nothing else.** Output from the OCI Cost Estimator for the
  managed service and the capacity points the table uses; then the flag and the numbers are the
  only edit. A few minutes for someone signed in — and impossible from outside, which is why it is
  still open.
- **Google Cloud is sourced but dated.** Its `db-n1-standard-*` shapes are the 2015 generation.
  They are real published prices, so the flag stays `true`, but the column is quoting a legacy
  machine family and will drift from what a new Cloud SQL customer is actually offered. Worth
  revisiting with the OCI work rather than separately.
- **This applies to any future number, not just cloud prices.** Savings percentages, benchmark
  results and customer counts all have the same property: the site's credibility rests on the
  weakest sourced claim on the page, not the average one.
- **The refusal is more useful than a price would have been.** Selecting Oracle Cloud with SQL
  Server now explains that the alternative is compute you administer under your own licence — a
  different operating model rather than a cheaper one. That answers the question the prospect was
  really asking, which a number never would have.
