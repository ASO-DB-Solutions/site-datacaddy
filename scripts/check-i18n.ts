/**
 * The gate `tsc` cannot be.
 *
 * `satisfies Copy` proves every locale has the same KEYS. It says nothing about
 * the VALUES: a Portuguese entry left as the English string typechecks
 * perfectly and renders the wrong language. ADR-0002 names this gap; this
 * closes it.
 *
 *   node --experimental-strip-types scripts/check-i18n.ts
 *
 * Two assertions, both cheap and both real:
 *   1. No value is empty or whitespace.
 *   2. No non-English value is identical to its English counterpart, unless the
 *      string is on the allowlist below.
 *
 * The allowlist exists because some strings SHOULD be identical across
 * languages — proper nouns, product names, and golf terms that CONTEXT.md
 * records as deliberately untranslated.
 */
import { locales, type Locale } from "../src/i18n/index.ts";

/** Strings that are legitimately the same in every language. */
const ALLOWED_IDENTICAL = new Set<string>([
  "DataCaddy",
  "Oracle",
  "SQL Server",
  "PostgreSQL",
  "MySQL",
  "AWS RDS",
  "Azure Database",
  "Oracle Cloud",
  "Google Cloud",
  "info@datacaddy.co",
  "par",
  "score",
]);

type Finding = { locale: string; path: string; problem: string; value: string };

function walk(node: unknown, base: unknown, locale: string, path: string[], out: Finding[]): void {
  if (typeof node === "string") {
    if (!node.trim()) {
      out.push({ locale, path: path.join("."), problem: "empty", value: node });
      return;
    }
    if (locale !== "en" && typeof base === "string" && node === base) {
      if (!ALLOWED_IDENTICAL.has(node.trim())) {
        out.push({
          locale,
          path: path.join("."),
          problem: "identical to English",
          value: node,
        });
      }
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) =>
      walk(v, Array.isArray(base) ? base[i] : undefined, locale, [...path, String(i)], out),
    );
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      const b =
        base && typeof base === "object" && !Array.isArray(base)
          ? (base as Record<string, unknown>)[k]
          : undefined;
      walk(v, b, locale, [...path, k], out);
    }
  }
}

const findings: Finding[] = [];
const english = locales.en;

for (const locale of Object.keys(locales) as Locale[]) {
  walk(locales[locale], english, locale, [], findings);
}

if (findings.length === 0) {
  const n = Object.keys(locales).length;
  console.log(`check:i18n — ${n} locales, no empty values, no untranslated strings.`);
  process.exit(0);
}

console.error(`check:i18n — ${findings.length} problem(s):\n`);
for (const f of findings) {
  const shown = f.value.length > 60 ? `${f.value.slice(0, 60)}…` : f.value;
  console.error(`  [${f.locale}] ${f.path}\n      ${f.problem}: "${shown}"`);
}
console.error(
  "\nIf a string is meant to be identical across languages, add it to " +
    "ALLOWED_IDENTICAL in scripts/check-i18n.ts and say why.",
);
process.exit(1);
