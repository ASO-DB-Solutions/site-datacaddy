import React, { useEffect, useRef } from "react";
import { useCopy } from "@/CopyProvider";
import { CREAM, INK, REGULAR, SEMIBOLD } from "@/tokens";

/**
 * The LGPD notice, in a modal rather than a separate page.
 *
 * Keeping it here is what lets the site stay a genuine one-pager while still
 * naming the controller, the purpose, the operators and the retention period
 * at the point where data is actually collected.
 */
export function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const p = useCopy().privacy;
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialog.current) return;
      // Trap focus: a modal a keyboard user can tab out of is not a modal.
      const items = dialog.current.querySelectorAll<HTMLElement>("button, a[href]");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,18,12,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 1000,
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dc-privacy-title"
        style={{
          background: CREAM,
          color: INK,
          borderRadius: 4,
          maxWidth: 560,
          width: "100%",
          maxHeight: "82vh",
          overflowY: "auto",
          padding: "28px clamp(20px,5vw,34px) 26px",
        }}
      >
        <h2 id="dc-privacy-title" style={{ ...SEMIBOLD, fontSize: 21, margin: "0 0 4px" }}>
          {p.title}
        </h2>
        <p style={{ ...REGULAR, fontSize: 13, color: "#5e6d63", margin: "0 0 20px" }}>
          {p.updated}
        </p>

        {p.body.map((s) => (
          <section key={s.h} style={{ marginBottom: 16 }}>
            <h3 style={{ ...SEMIBOLD, fontSize: 15, margin: "0 0 4px" }}>{s.h}</h3>
            <p style={{ ...REGULAR, fontSize: 14.5, lineHeight: 1.6, margin: 0, color: "#3d4c42" }}>
              {s.p}
            </p>
          </section>
        ))}

        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          style={{
            ...SEMIBOLD,
            fontSize: 14,
            marginTop: 8,
            padding: "10px 22px",
            borderRadius: 2,
            border: "1px solid #c2d4bd",
            background: "transparent",
            color: INK,
            cursor: "pointer",
          }}
        >
          {p.close}
        </button>
      </div>
    </div>
  );
}
