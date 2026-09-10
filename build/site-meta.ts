import type { Plugin } from "vite";

/**
 * Replaces Figma Make's `figmaSiteConfiguration`.
 *
 * Two differences that are the point of replacing it rather than keeping it:
 *  - it is keyed on `ctx.path`, so each locale shell gets its own <head>
 *    (the original's handler received only `html` and structurally could not);
 *  - `og:image` is emitted ABSOLUTE. The original emitted it verbatim from
 *    site.json, i.e. relative, which most scrapers will not resolve.
 *
 * Deliberately dropped from the original: Google Analytics injection, the
 * `robots: noindex` path, and the bypass-link stylesheet.
 */

export const SITE = "https://datacaddy.co";

// Until the launch-time root-locale decision, EN owns `/` and x-default.
// Flipping that is this constant plus the two shells' <link> tags.
type LocaleMeta = {
  lang: string;
  ogLocale: string;
  title: string;
  description: string;
  path: string;
};

const META: Record<"en" | "pt-BR", LocaleMeta> = {
  en: {
    lang: "en",
    ogLocale: "en_US",
    title: "DataCaddy",
    description:
      "DataCaddy continuously reads your database environment, connecting workload, configuration, security, and capacity signals into a clearer view of what matters.",
    path: "/",
  },
  "pt-BR": {
    lang: "pt-BR",
    ogLocale: "pt_BR",
    title: "DataCaddy",
    description:
      "O DataCaddy percorre seu parque de Oracle, SQL Server, PostgreSQL e MySQL, mede o que cada instância realmente consome e devolve o tamanho que deveria estar ali.",
    path: "/pt-br/",
  },
};

export function siteMeta(): Plugin {
  return {
    name: "site-meta",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const m = ctx.path.startsWith("/pt-br/") ? META["pt-BR"] : META.en;
        const ogImage = `${SITE}/og.png`;
        return {
          html,
          tags: [
            { tag: "title", children: m.title, injectTo: "head" as const },
            {
              tag: "meta",
              attrs: { name: "description", content: m.description },
              injectTo: "head" as const,
            },
            {
              tag: "meta",
              attrs: { property: "og:type", content: "website" },
              injectTo: "head" as const,
            },
            {
              tag: "meta",
              attrs: { property: "og:site_name", content: "DataCaddy" },
              injectTo: "head" as const,
            },
            {
              tag: "meta",
              attrs: { property: "og:locale", content: m.ogLocale },
              injectTo: "head" as const,
            },
            {
              tag: "meta",
              attrs: { property: "og:title", content: m.title },
              injectTo: "head" as const,
            },
            {
              tag: "meta",
              attrs: { property: "og:description", content: m.description },
              injectTo: "head" as const,
            },
            {
              tag: "meta",
              attrs: { property: "og:url", content: SITE + m.path },
              injectTo: "head" as const,
            },
            {
              tag: "meta",
              attrs: { property: "og:image", content: ogImage },
              injectTo: "head" as const,
            },
            {
              tag: "meta",
              attrs: { name: "twitter:card", content: "summary_large_image" },
              injectTo: "head" as const,
            },
            {
              tag: "meta",
              attrs: { name: "twitter:image", content: ogImage },
              injectTo: "head" as const,
            },
          ],
        };
      },
    },
  };
}
