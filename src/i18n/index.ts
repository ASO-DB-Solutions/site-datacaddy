import { en } from "./en";
import { ptBR } from "./pt-BR";

/**
 * Pure data only — no React, no DOM. `vite.config.ts` imports this at config
 * time to build each locale shell's <head>, so anything that touches a browser
 * API here breaks the build rather than the page. See ADR-0002.
 */

export type Locale = "en" | "pt-BR";

/**
 * The English dictionary IS the schema. Every other locale is checked against
 * it with `satisfies Copy`, which makes `tsc --noEmit` the gate for a missing
 * or misspelled key.
 *
 * `en` is deliberately NOT declared `as const`: that would make every English
 * string a literal type, and `Copy` would then demand each translation be
 * identical to the original. Widened types are what we want here — same keys,
 * same shape, any string.
 */
export type Copy = typeof en;

export const locales = {
  en,
  "pt-BR": ptBR,
} satisfies Record<Locale, Copy>;

/** Falls back to English for any value that is not a locale we ship. */
export function resolveLocale(tag: string | null | undefined): Locale {
  return tag === "pt-BR" ? "pt-BR" : "en";
}
