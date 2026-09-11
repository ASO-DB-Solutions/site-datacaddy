import type React from "react";

/**
 * The site's design tokens, lifted out of App.tsx so a second component can
 * use them without importing the page. Values are unchanged from the
 * designer's export; only their location moved.
 */
export const EXPANDED: React.CSSProperties = {
  fontFamily: "'Archivo Variable', Archivo, system-ui, sans-serif",
  fontStyle: "normal",
  fontVariationSettings: '"wdth" 125',
};
export const REGULAR: React.CSSProperties = {
  fontFamily: "'Archivo Variable', Archivo, system-ui, sans-serif",
  fontVariationSettings: '"wdth" 100',
};
export const SEMIBOLD: React.CSSProperties = {
  fontFamily: "'Archivo Variable', Archivo, system-ui, sans-serif",
  fontWeight: 600,
  fontVariationSettings: '"wdth" 100',
};
export const SAGE = "#c7d0c5";
export const SAGE_MID = "#aeb49b";
export const FOREST = "#152a0b";
export const ACCENT = "#26533e";
export const ACCENT_MID = "#537c69";
export const MUTED_GREEN = "#5e6d63";
export const TEXT_LIGHT = "#c7d0c5";
export const CREAM = "#f6f8f4";
export const INK = "#16281f";
export const subgrid = `linear-gradient(rgba(199,208,197,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(199,208,197,0.05) 1px,transparent 1px)`;
