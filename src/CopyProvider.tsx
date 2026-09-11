import React, { createContext, useContext } from "react";
import { locales, resolveLocale, type Copy, type Locale } from "@/i18n";

/**
 * The React half of the i18n setup, kept out of `src/i18n/` because that
 * directory must stay free of React — `vite.config.ts` imports it at config
 * time to build each shell's <head>. See ADR-0002.
 *
 * Context rather than prop-drilling, so the page's section components keep
 * their existing signatures as strings move out of JSX.
 */

const CopyContext = createContext<Copy>(locales.en);

export function CopyProvider({ children }: { children: React.ReactNode }) {
  // The shell is the single source of truth: /index.html declares lang="en",
  // /pt-br/index.html declares lang="pt-BR". The URL therefore can never
  // disagree with the rendered language.
  const locale: Locale = resolveLocale(
    typeof document === "undefined" ? "en" : document.documentElement.lang,
  );
  return <CopyContext.Provider value={locales[locale]}>{children}</CopyContext.Provider>;
}

export const useCopy = () => useContext(CopyContext);

/** The locale the document declares, for building hreflang-aware links. */
export function useLocale(): Locale {
  return resolveLocale(typeof document === "undefined" ? "en" : document.documentElement.lang);
}
