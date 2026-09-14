# What changed between the design and the published site

> **For Nina.** Everything done on top of her export since 2026-09-10, with the reason for each
> change, so she can reflect them in the `.fig` and everyone works from the same version.
> Portuguese edition: [DESIGN-CHANGES.pt-BR.md](DESIGN-CHANGES.pt-BR.md).

The site has been live at [datacaddy.co](https://datacaddy.co) since 2026-09-11. The design is the
visual reference — what follows is technical adjustment, states the design did not yet cover, and
one correction of ours that was undone because she was right.

## Starting with the mistake that was ours

**The closing section — the pitch with the form — had been rebuilt by us, and has been returned to
her original.** On 2026-09-12 we moved the form beside the text, into a two-column grid that does
not exist in her file. The grid ended up with a single child, its second column was born empty, and
the content took whatever the first resolved to.

The effect was not obvious on screen, but it is measurable: the text measure began swinging between
**587 and 942 px** with the viewport, against the **constant 640 px** she had set. A headline she
tuned to break at 640 was breaking at widths she never saw. The asymmetry the owner noticed came
from there.

On 2026-09-13 her export was compared against ours rule by rule. **It was the only place where this
repository had invented layout rather than ported hers.** The section was restored — same
container, same gaps, same ordering — and the two classes that existed only on our side were
deleted. Every class in the file is now one of hers.

One difference remains in that section, deliberately: **the gradient over the photograph ends at
0.74 rather than 0.55.** At 0.55 the right-hand side was bright enough that the form's labels lost
legibility exactly where the fields sit. If she would rather solve that another way in the design,
we will follow it.

## States the design does not yet have

These are new behaviours, not redesigns. How they should look is hers to decide.

**The send button starts dimmed.** It lights up only once **name, email and company** are filled
and the address looks valid — the message stays optional. A line under the button says what is
still missing.

It is dimmed but deliberately still clickable: a genuinely disabled button drops out of keyboard
navigation, so a screen-reader user meets a control that does not respond and explains nothing.
Pressing this one marks the outstanding fields and moves the cursor to the first.

**Fields show errors on leaving, not while typing.** Nothing turns red on the first character.

**The four destination buttons dim according to the chosen database.** Not every cloud offers every
engine as a managed service:

| Engine chosen | aws | azure | oci | gcp |
|---|---|---|---|---|
| Oracle | ✓ | dimmed | ✓ | dimmed |
| SQL Server | ✓ | ✓ | dimmed | ✓ |
| PostgreSQL | ✓ | ✓ | ✓ | ✓ |
| MySQL | ✓ | ✓ | ✓ | ✓ |

Dimmed, and again still clickable: clicking one opens a card explaining what that cloud offers
instead. Oracle Cloud, for instance, has no managed SQL Server — there it runs on machines the
customer administers under their own licence. A different operating model, not a cheaper option.

**A yellow caveat sits under the calculator when Oracle Cloud is selected.** The other three clouds'
prices come from published tables; Oracle's could not be confirmed, so the column says it is an
estimate. It is a new element in the section — today just a sentence, but if she wants to give it a
form, it is hers.

**An LGPD consent line beside the button**, with a link opening the policy in a window over the
page. It does not change the section's structure.

## Technical adjustments that do not change the appearance

**The fonts.** The export declared `'Archivo:Regular'` and `'Archivo:SemiBold'` — names Figma
generates that match no installed face, so browsers fell back to something arbitrary. It is now the
**real variable Archivo**, self-hosted with the site, carrying both axes the design uses (weight and
width — the `wdth 125` on display text works). **Fraunces** was dropped: it was referenced only by
code that was never used.

**The images were re-encoded: 3.27 MB → 250 KB, visually identical.** The hero texture alone went
from 2.23 MB to 28.5 KB — it composites in `screen` over black, where the three colour channels are
redundant, so it became grayscale with no perceptible difference (worst case measured at 2.83 of
255). No CSS changed.

**The icons and social card delivered on 2026-09-10 went in exactly as supplied.** All were
correctly sized and fully opaque — the 180×180 especially, which matters because iOS composites
transparency onto black. Nothing was re-encoded.

**The contact address.** The original export carried three different addresses in different places:
`hello@datacaddy.com` (twice) and `contato@datacaddy.com.br`. It is now one,
**`info@datacaddy.co`**, which works in both languages.

**Sign in.** In the 2026-09-11 export it pointed at a bare IP address without `https`. It was held
out of the public site until 2026-09-13, when the certificate was ready; it now points at
**`https://app.datacaddy.co/`** and is visible in the nav and the mobile drawer.

**The form actually sends now.** The export's version showed "we got your message" with nowhere to
send it — there was nothing behind the button. Her design and her labels, which are better than
ours, were kept on top of delivery that works.

**The footer names ASO Tech Global LLC** and leaves clearance at the bottom for the Netlify badge,
which the free plan displays.

## Two languages, and her Portuguese is the original

The site publishes **English at `/` and Portuguese at `/pt-br/`** from the same design. Worth
recording where the Portuguese came from: it was inside the export, in a file that looked like
disposable generated code. It was the original copy. Had the project been tidied before that file
was read, the authored version would have been deleted and re-translated from the English.

That is why Portuguese is treated as the original and English as derived — including the golf
vocabulary, which is transcreated rather than translated.

One correction on that line: **"Park Card" is wrong in English.** It is a literal rendering of
*cartão do parque*, and *parque* here means the machine estate, not a public park. In English it
reads *scorecard*. If it appears on any English artboard, it is worth fixing there too.

## Things to decide with her

**The "E" in the score column.** It is *even par*, carried from her Portuguese original. The doubt
is honest: a non-golfer reads nothing from it, in either language. Keep it, replace it with a
number, or pair it with a legend?

**A Portuguese social card.** Both languages currently use the English card. If Portuguese ends up
as the language at the site root, it deserves its own. Which language owns the root is a launch
decision, so this can wait — but it is hers to make.

**A local copy of the `.fig`.** The Starter plan keeps **30 days** of history. After that there is
no way back, and no copy exists outside her account. `File → Save local copy` covers it, and it is
worth repeating each delivery. The `site.fig` in the handover folder is 32 KB — a shortcut, not the
file.

**The 3-pages-per-file limit** is the ceiling this project would hit first if the design grows. Not
a problem today; noted so she knows we know.

## What was not touched

Worth stating what stayed as it was, because it is most of it:

- **Every style class on the page is hers.** The 2026-09-13 comparison found three rules differing
  between the two files, and all three differed only in font-family, for the reason in the section
  above.
- **The width scale is hers**, exactly: 520, 640, 640, 700, 700, 720, 760, 1180.
- **The calculator's structure is hers**, including how the four clouds are organised, which is
  better than what we had before. Only the label was swapped for an internal code underneath, so
  that rewriting a button's name cannot change which cloud it prices.
- **`.dc-cta-btns` is still in the file although nothing uses it.** It is dead in her file too — she
  left the rule behind when she replaced the buttons with a form. Following the design means
  matching the file, not tidying it.

## Where to look

The published site is [datacaddy.co](https://datacaddy.co). Portuguese is at
[datacaddy.co/pt-br/](https://datacaddy.co/pt-br/).

One note: the site still asks search engines **not** to index it. That is deliberate and flips at
launch. Until then the address works normally for anyone with the link.
