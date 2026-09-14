import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { siteMeta } from "./build/site-meta";

// Figma Make's four plugins were removed here. Three (`figmaErrorOverlayReplay`,
// `figmaReactRefreshBoundaryFallback`, `figmaMakeKitPlugin`) were `apply: 'serve'`
// only and served Figma's hosted preview. The fourth, `figmaSiteConfiguration`,
// ran in `vite build` and filled the `<!-- figma:* -->` slots in index.html;
// `build/site-meta.ts` replaces it, keyed on locale. See ADR-0001.
export default defineConfig({
  // Two HTML entry points, no client-side router — this is a multi-page site.
  // Vite's default `appType: 'spa'` answers any unmatched path with the ROOT
  // index.html and a 200, so `/pt-br` (no trailing slash) silently served the
  // English page at a Portuguese URL. 'mpa' turns that into the 404 it is.
  appType: "mpa",
  plugins: [react(), tailwindcss(), siteMeta()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    rollupOptions: {
      input: {
        en: path.resolve(__dirname, "index.html"),
        pt: path.resolve(__dirname, "pt-br/index.html"),
      },
    },
  },
});
