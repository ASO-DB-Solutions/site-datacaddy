import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { siteMeta } from "./build/site-meta";

/**
 * The site's HTML entry points, one per locale. Single source: the build inputs
 * and the redirect below are both derived from it, so adding a locale cannot
 * leave the two disagreeing.
 */
const ENTRIES = {
  en: "index.html",
  pt: "pt-br/index.html",
} as const;

/**
 * `/pt-br` → 301 → `/pt-br/`, the way a real static host answers it.
 *
 * `/pt-br` and `/pt-br/` are different URLs by spec — relative links resolve
 * against different bases — so a server must pick one as canonical and send the
 * other there. Netlify already does exactly this in production. Vite's dev and
 * preview servers do not, which left the two environments resolving the same
 * address differently: the one thing a preview exists to rule out.
 *
 * Redirecting to the English page instead would be wrong. `/pt-br/` exists; a
 * missing slash is a typo to correct, not a reason to hand someone a different
 * language. Answering a request for a page that exists with some other page is
 * the "soft 404" pattern, and it is what caused the confusion this fixes.
 */
function directorySlashRedirect(): Plugin {
  const dirs = new Set(
    Object.values(ENTRIES)
      .filter((f) => f.includes("/"))
      .map((f) => "/" + path.posix.dirname(f)),
  );

  const middleware = (
    req: { url?: string },
    res: { statusCode: number; setHeader: (k: string, v: string) => void; end: () => void },
    next: () => void,
  ) => {
    const [pathname = "/", query] = (req.url ?? "/").split("?");
    if (!dirs.has(pathname)) return next();
    res.statusCode = 301;
    res.setHeader("Location", `${pathname}/${query ? `?${query}` : ""}`);
    res.end();
  };

  return {
    name: "directory-slash-redirect",
    configureServer: (s) => {
      s.middlewares.use(middleware);
    },
    configurePreviewServer: (s) => {
      s.middlewares.use(middleware);
    },
  };
}

// Figma Make's four plugins were removed here. Three (`figmaErrorOverlayReplay`,
// `figmaReactRefreshBoundaryFallback`, `figmaMakeKitPlugin`) were `apply: 'serve'`
// only and served Figma's hosted preview. The fourth, `figmaSiteConfiguration`,
// ran in `vite build` and filled the `<!-- figma:* -->` slots in index.html;
// `build/site-meta.ts` replaces it, keyed on locale. See ADR-0001.
export default defineConfig({
  // Two HTML entry points, no client-side router — this is a multi-page site.
  // Vite's default `appType: 'spa'` answers any unmatched path with the ROOT
  // index.html and a 200, so every wrong URL — `/pt-br`, `/nonsense` — served
  // the English page and claimed success.
  appType: "mpa",
  plugins: [react(), tailwindcss(), siteMeta(), directorySlashRedirect()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(ENTRIES).map(([name, file]) => [name, path.resolve(__dirname, file)]),
      ),
    },
  },
});
