# Documentation

| Document | What it covers |
|---|---|
| [`NETLIFY-SETUP.md`](NETLIFY-SETUP.md) · [pt-BR](NETLIFY-SETUP.pt-BR.md) | Standing the site up on Netlify and pointing `datacaddy.co` at it. The DNS half is a parameter table, not instructions — the zone is administered by someone who needs values, not a procedure. |
| [`adr/`](adr/README.md) | Decision records. Append-only, numbered, never renumbered. |

## Conventions

**Bilingual pairs stay in step.** Where a document has an `.md` and a `.pt-BR.md`, both carry the
same sections and identical literal values — IDs, endpoints, records, commands. Change one, change
the other. The pt-BR editions agree on their recurring headings: `Onde isso se encaixa`,
`Valores já conhecidos`, `Defina isto primeiro`, `Verificação`, `Solução de problemas`,
`Relação com os outros guias`.

Each edition carries its own diagram, in its own language. Node identifiers and proper nouns
(`main`, `Netlify`, `Cloudflare`, `CNAME`) stay as they are in both.

**Only link a document that exists.** A markdown link to a missing file reads as data loss in
VS Code's preview. In-page anchors need the same care: a numbered heading's slug carries its
number, so `## 4. DNS parameters — hand these over` is `#4-dns-parameters--hand-these-over`, with
two hyphens where the em dash was.

Both link kinds are checkable from a clone:

```bash
# relative links that point at nothing
grep -rohE '\]\(([^)#][^)]*\.md)[^)]*\)' . --include='*.md' \
  | sed -E 's/.*\]\(([^)#]*).*/\1/' | sort -u \
  | while read -r f; do [ -e "$f" ] || echo "MISSING: $f"; done

# in-page anchors that match no heading
python3 - <<'PY'
import re, pathlib
def slug(h):
    s = re.sub(r"[^\w\s-]", "", h.strip().lower(), flags=re.UNICODE)
    return re.sub(r"\s", "-", s)
for p in pathlib.Path(".").rglob("*.md"):
    src = p.read_text(encoding="utf-8")
    heads = {slug(m) for m in re.findall(r"^##+ (.+)$", src, re.M)}
    for a in set(re.findall(r"\]\(#([^)]+)\)", src)):
        if a not in heads:
            print(f"BROKEN ANCHOR: {p}#{a}")
PY
```

**Stakeholder-facing material ships as an Artifact**, alongside the two `.md` editions. This
repository has no `docs/devlog/` — the sibling's daily report exists for a months-long build with
a non-technical audience, and would be ceremony here.
