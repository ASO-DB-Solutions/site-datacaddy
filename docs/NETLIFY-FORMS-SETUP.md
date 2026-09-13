# Turning on the contact form's notifications

> **Done — the form has been accepting submissions since 2026-09-13.** Form detection was enabled and the site redeployed; `form-name=contact` now answers 200 where an unregistered form answers 404. Kept as the reference for re-enabling detection after a project is recreated, and for diagnosing a form that silently stops accepting. Read the present tense below as "how it was done". The notification address is the one step to confirm — see step 2.

Someone can fill in the form today and Netlify will keep what they wrote — but no one will know
until they log in and look. If you are here because a submission did not arrive by email, the
cause is almost certainly that no notification has been configured yet; step 1 is the whole fix.

This is the shorter half of the contact path. The other half — making `info@datacaddy.co` exist
and its mail trusted — is [`MICROSOFT-EMAIL-SETUP.md`](MICROSOFT-EMAIL-SETUP.md). **They are
independent**: notifications can be switched on and tested before the mailbox exists, by sending
them somewhere else in the meantime.

## Where this fits

```mermaid
flowchart TB
    VIS(["Visitor fills in the form<br/>/ or /pt-br/"]) -->|"POST, form-name=contact"| NF

    subgraph NETLIFY["Netlify"]
        direction LR
        NF["Form capture<br/>100 submissions/month"]
        SPAM{"Spam checks<br/>honeypot · time floor · Akismet"}
        STORE[("Stored submissions<br/>visible in the dashboard")]
        NOTIF["Email notification<br/>THE MISSING PIECE"]
        NF --> SPAM
        SPAM -->|"looks human"| STORE
        SPAM -->|"looks automated"| BIN["Discarded"]
        STORE --> NOTIF
    end

    NOTIF -->|"sent by Netlify, not as datacaddy.co"| BOX["info@datacaddy.co"]

    classDef ours fill:#e8f0e6,stroke:#26533e,stroke-width:1.5px,color:#152a0b
    classDef todo fill:#f6efd9,stroke:#7a5c16,stroke-width:2px,color:#3d2f0a
    classDef ext  fill:#f4f1e8,stroke:#8a7f5c,stroke-width:1.5px,color:#332d1a
    class NF,SPAM,STORE,BIN ours
    class NOTIF todo
    class VIS,BOX ext
```

Note where the notification comes from: **Netlify's own servers**, not from `datacaddy.co`. That
is why nothing in the Microsoft guide can break it, and why it works before the mailbox exists.

## Already-known values

| Value | What it is |
|---|---|
| `contact` | The form's name. Netlify matches submissions to it, so it must not be renamed casually |
| `name`, `email`, `company`, `message` | The fields, in that order |
| `bot-field` | The honeypot. Never remove it — it looks like dead markup and is not |
| `info@datacaddy.co` | Where notifications should go |
| **100 / month** | The free plan's submission limit |
| `/` | Where the form posts. Both locales post to the same place |

## Set these first

Nothing to export — every step is in the Netlify dashboard.

## Read this before you start: what this can't do

- **It cannot create the mailbox.** Netlify only sends *to* an address. Until
  `info@datacaddy.co` exists, point notifications at a mailbox that does — a personal company
  address is fine temporarily, and changing it later is one field.
- **It cannot recover submissions made before notifications existed.** They are not lost: they are
  in the dashboard under **Forms**. Check there once, now, in case someone has already written in.
- **It cannot raise the 100/month limit.** That is the free plan. At this site's traffic it is not
  a near-term concern, but it is a hard stop rather than a soft one, so it is worth knowing.
- **It cannot stop all spam.** The form has a honeypot and a submit-time floor, and Netlify adds
  its own filtering. A public form on a public repository will still attract some.

## 1. Enable form detection, then redeploy — OWNER

**This is the step that was missing, and nothing works without it.** Netlify turns form detection
off by default on every site created since 2023-04-12, to keep builds fast. With it off, the
build-time parser never scans for forms, so `contact` is never registered and every POST to it is
answered `404` — indistinguishable from a form that does not exist.

**Forms → Usage and configuration → Form detection → Enable form detection.**

Then **redeploy**: Deploys → Trigger deploy → Deploy site. Enabling detection applies only to
*new* deploys, never retroactively, so the existing build stays unscanned until one runs.

Verify before moving on — this must return `200`, not `404`:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'form-name=contact&name=Test&email=test@example.com&message=detection+check' \
  https://datacaddy.co/
```

## 2. Set the notification address — OWNER

**[app.netlify.com](https://app.netlify.com)** → your site → **Forms**.

You should see a form named **contact** with a submission count. If it is not there at all, see
Troubleshooting — it means the deploy that introduced the form has not been picked up.

Then: **Form notifications** → **Add notification** → **Email notification**.

- **Event to listen for**: New form submission
- **Form**: `contact`
- **Email to notify**: `info@datacaddy.co` — or a working address in the meantime

Save. That is the whole change.

## 3. Send a test submission — OWNER

Go to [datacaddy.co](https://datacaddy.co), fill the form in properly, and submit.

**The send button stays dimmed until name, email and company are filled and the address looks
valid.** That is the form working, not a fault — a line under the button says what is still
missing. Message is optional.

**Take more than three seconds over it.** The form silently discards submissions completed faster
than a person plausibly could — a deliberate anti-bot measure — and it shows the same success
message either way, so a rushed test looks like it worked while going nowhere.

Then check both places: the submission should appear under **Forms**, and the notification should
arrive by email within a minute or two.

## 4. Decide who gets told — OWNER

A single address is the simplest arrangement and the one to start with. Two refinements are worth
knowing about, neither urgent:

- **More than one recipient**: add a second email notification rather than trying to comma-separate
  addresses in one.
- **A shared mailbox as the target** means everyone with access sees new submissions without any
  forwarding rules — which is the argument for making `info@` shared rather than an alias, in the
  Microsoft guide.

## Verify

```bash
# 1. The form is present in what Netlify actually deployed.
#    This is what its parser reads; if it is absent, nothing else matters.
curl -sS https://datacaddy.co/ | grep -o 'name="contact"' | head -1

# 2. The field names in the deployed HTML match what the page submits.
curl -sS https://datacaddy.co/ \
  | tr '>' '>\n' | grep -oE 'name="(name|email|company|message|bot-field|form-name)"' | sort -u
```

Expected: `name="contact"` present, and all six field names listed. Then the real check, which no
command can do: a test submission appearing in **Forms** *and* arriving by email.

## Troubleshooting

**No `contact` form appears in the dashboard, and submissions return 404.** Two different causes,
and the first is far more likely:

1. **Form detection is off** — the default since 2023-04-12. Step 1 fixes it, and it needs a
   redeploy afterwards. This was the actual cause here, and it is hard to diagnose because the
   symptom is identical to a form that was never written.
2. **The hidden static mirror is missing.** Netlify's parser runs at build time against static HTML
   and cannot see a React-rendered form, so `index.html` carries a mirror. If a deploy removed it,
   the verify command in step 1 returns 404 even with detection on. Check the live site.

**Submissions return a 404.** The field names in the hidden form and the React component have
drifted apart. They must match exactly. CI checks this, so a 404 means something changed outside
the normal path.

**Notifications do not arrive, but submissions appear in the dashboard.** The notification is not
configured, is pointing at a different form, or the target mailbox does not exist yet. Check the
address first — an address that does not exist fails silently from Netlify's side.

**Submissions arrive marked as spam.** Netlify's filtering is aggressive by default. Spam
submissions are still visible under **Forms → Spam** — check there before concluding a message was
lost.

**A test submission showed success but never appeared.** Almost certainly the submit-time floor:
the form was completed in under three seconds. Fill it in at a normal pace and retry.

**Volume is approaching 100 in a month.** Consider whether the traffic is genuine before upgrading.
If it is, the free plan's limit is the reason to move the endpoint — the form posts to a single
configurable endpoint precisely so that is a setting change rather than a rewrite.

## Relationship to the other guides

- [`MICROSOFT-EMAIL-SETUP.md`](MICROSOFT-EMAIL-SETUP.md) is the other half: making
  `info@datacaddy.co` exist and be trusted. Independent of this guide, and doable in either order.
- ADR-0003 records *why* Netlify Forms, and the consequences accepted with it — including that
  submissions are stored on Netlify, which makes them a data processor.
- [`PUBLIC-SURFACE.md`](PUBLIC-SURFACE.md) covers what the form exposes, and why the endpoint being
  visible in the page's code is safe while an API key would not be.

---

**pt-BR edition:** [`NETLIFY-FORMS-SETUP.pt-BR.md`](NETLIFY-FORMS-SETUP.pt-BR.md). Both stay in
step on sections and literal values.
