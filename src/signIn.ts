import type { Locale } from "@/i18n";

/**
 * Where "Sign in" goes, and in which language.
 *
 * `app.datacaddy.co` defaults to **Portuguese**. A visitor reading the English
 * site and clicking Sign in would otherwise land in a language they did not
 * choose, which reads as a broken link rather than a default.
 *
 * The parameter is therefore sent **always**, including for pt-BR where it is
 * currently redundant. Relying on the app's default would mean this link
 * silently changes meaning the day that default changes — and nothing here
 * would fail, which is the kind of breakage nobody finds.
 *
 * No React and no DOM: this is a pure mapping, callable from anywhere.
 */

export const APP_ORIGIN = "https://app.datacaddy.co";

/**
 * The languages the app accepts. This list is the source of truth for the type
 * below, so adding one is a single edit here.
 */
export const APP_LANGS = ["pt-BR", "en", "es", "ja"] as const;

export type AppLang = (typeof APP_LANGS)[number];

/**
 * Site locale → app language.
 *
 * Deliberately not an identity function, and it will not become one: the site
 * ships two locales, the app offers four. `Record<Locale, AppLang>` makes
 * `tsc --noEmit` the gate — adding a site locale without deciding which app
 * language it opens is a build failure, not a silent fall back to Portuguese.
 */
const FOR_LOCALE: Record<Locale, AppLang> = {
  en: "en",
  "pt-BR": "pt-BR",
};

/** The sign-in URL for an explicit app language. */
export function signInUrl(lang: AppLang): string {
  return `${APP_ORIGIN}/?${new URLSearchParams({ lang })}`;
}

/** The sign-in URL for the locale this page is rendered in. */
export function signInUrlForLocale(locale: Locale): string {
  return signInUrl(FOR_LOCALE[locale]);
}
