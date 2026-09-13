import React, { useCallback, useEffect, useState } from "react";

/**
 * Review mode: shows everything the designer shipped, including the parts that
 * cannot go live yet, each outlined in thin red with the reason attached.
 *
 * Gated on a BUILD-TIME flag, not a runtime one. `import.meta.env.VITE_REVIEW`
 * is substituted as a literal during the build, so a production build (which
 * never sets it) evaluates `REVIEW` to `false`.
 *
 * That alone is not enough, and getting it wrong is easy: if a helper is
 * *called* unconditionally — even one that returns `{}` when the flag is off —
 * its arguments still evaluate, `REVIEW_ITEMS` stays referenced, and every
 * string in it survives into the shipped bundle, including the insecure URL.
 * So every call site is gated on the literal (`REVIEW ? … : undefined`), which
 * makes the whole expression dead code and lets it be removed. Verified by
 * grepping the production bundle, not assumed.
 *
 *   corepack pnpm run build     # production — none of this ships
 *   corepack pnpm run review    # review build
 */
export const REVIEW = import.meta.env.VITE_REVIEW === "1";

const RED = "#d14b3c";
const STORE = "dc-review-panel";

/** Outline an element that is on show but not shippable.
 *  `outline` rather than `border`, so nothing shifts in the layout. */
export function reviewMark(_reason: string): React.CSSProperties {
  return { outline: `1px solid ${RED}`, outlineOffset: 2, borderRadius: 2 };
}

/** The reason, reachable on hover and by the panel's jump-to. */
export function reviewProps(reason: string) {
  return { title: `NOT SHIPPABLE — ${reason}`, "data-review": reason };
}

export type ReviewItem = { what: string; why: string };

/** Everything currently blocked, in one place, so the panel and the outlines
 *  cannot drift apart. */
export const REVIEW_ITEMS: ReviewItem[] = [
  {
    what: "Sign in",
    why: "Points at http://144.22.135.180:94/ — bare IP, no TLS. Waiting on Marcelo's domain and certificate.",
  },
  {
    what: "Contact form",
    why: "Netlify form detection is off, so every submission returns 404 and is discarded. Waiting on Marcelo.",
  },
  {
    what: "Oracle Cloud / Google Cloud pricing",
    why: "Unverified. OCI uses a compute shape, not a managed database, priced at roughly 4x the compute list rate.",
  },
];

type Side = "left" | "right";

function readStored(): { side: Side; open: boolean } {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return JSON.parse(raw) as { side: Side; open: boolean };
  } catch {
    /* private window, blocked storage — fall through to defaults */
  }
  return { side: "right", open: false };
}

/**
 * The review panel.
 *
 * Collapsed to a small pill by default so it occludes as little as possible;
 * expands on demand. It can be flipped to the other side, and clicking an entry
 * scrolls to the element it describes and pulses it — which is the part that
 * makes it a review tool rather than a caption.
 */
export function ReviewLegend({ items }: { items: ReviewItem[] }) {
  const [{ side, open }, setState] = useState<{ side: Side; open: boolean }>({
    side: "right",
    open: false,
  });

  // Read stored preferences after mount: the first paint must not depend on
  // storage, which can be unavailable or throw.
  useEffect(() => setState(readStored()), []);

  const persist = useCallback((next: { side: Side; open: boolean }) => {
    setState(next);
    try {
      localStorage.setItem(STORE, JSON.stringify(next));
    } catch {
      /* not worth failing the panel over */
    }
  }, []);

  const jump = useCallback((why: string) => {
    const el = document.querySelector<HTMLElement>(`[data-review="${CSS.escape(why)}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.animate(
      [
        { boxShadow: `0 0 0 0 ${RED}66` },
        { boxShadow: `0 0 0 10px ${RED}00` },
        { boxShadow: `0 0 0 0 ${RED}00` },
      ],
      { duration: 1400, iterations: 2 },
    );
  }, []);

  const edge = side === "right" ? { right: 16 } : { left: 16 };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => persist({ side, open: true })}
        aria-label={`Show ${items.length} review notes`}
        style={{
          position: "fixed",
          bottom: 16,
          ...edge,
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: "rgba(255,255,255,0.97)",
          border: `1px solid ${RED}`,
          borderRadius: 999,
          padding: "7px 13px",
          cursor: "pointer",
          font: "600 12px/1 'Archivo Variable', Archivo, system-ui, sans-serif",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: RED,
          boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
        }}
      >
        <span
          style={{ width: 7, height: 7, borderRadius: "50%", background: RED, flex: "0 0 auto" }}
        />
        {items.length} review notes
      </button>
    );
  }

  return (
    <aside
      aria-label="Review notes"
      style={{
        position: "fixed",
        bottom: 16,
        ...edge,
        zIndex: 2000,
        width: "min(320px, calc(100vw - 32px))",
        background: "rgba(255,255,255,0.97)",
        border: `1px solid ${RED}`,
        borderRadius: 5,
        padding: "12px 14px 14px",
        font: "13px/1.45 'Archivo Variable', Archivo, system-ui, sans-serif",
        color: "#16281f",
        boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
      }}
    >
      <style>{`
        .dc-rv-btn { background:none; border:0; padding:2px 5px; cursor:pointer;
          color:#71816f; font:600 12px/1 inherit; border-radius:3px; }
        .dc-rv-btn:hover { color:${RED}; background:rgba(209,75,60,0.08); }
        .dc-rv-btn:focus-visible { outline:2px solid ${RED}; outline-offset:1px; }
        .dc-rv-item { display:block; width:100%; text-align:left; background:none;
          border:0; padding:6px 7px; margin:0 -7px; border-radius:3px; cursor:pointer;
          font:inherit; color:inherit; }
        .dc-rv-item:hover { background:rgba(209,75,60,0.07); }
        .dc-rv-item:focus-visible { outline:2px solid ${RED}; outline-offset:-1px; }
        @media (prefers-reduced-motion: reduce) { .dc-rv-item { transition:none; } }
      `}</style>

      <div
        style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: RED,
            fontSize: 11.5,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Review build — not production
        </p>
        <span style={{ display: "flex", gap: 2, flex: "0 0 auto" }}>
          <button
            type="button"
            className="dc-rv-btn"
            onClick={() => persist({ side: side === "right" ? "left" : "right", open })}
            title={`Move to the ${side === "right" ? "left" : "right"}`}
            aria-label={`Move panel to the ${side === "right" ? "left" : "right"}`}
          >
            {side === "right" ? "←" : "→"}
          </button>
          <button
            type="button"
            className="dc-rv-btn"
            onClick={() => persist({ side, open: false })}
            title="Collapse"
            aria-label="Collapse review notes"
          >
            ▾
          </button>
        </span>
      </div>

      <p style={{ margin: "6px 0 8px", color: "#4c5e51", fontSize: 12.5 }}>
        Outlined in red: on show, but blocked. Click one to jump to it.
      </p>

      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 2 }}>
        {items.map((i) => (
          <li key={i.what}>
            <button type="button" className="dc-rv-item" onClick={() => jump(i.why)}>
              <strong>{i.what}</strong>
              <br />
              <span style={{ color: "#4c5e51", fontSize: 12.5 }}>{i.why}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
