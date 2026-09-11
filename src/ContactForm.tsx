import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCopy } from "@/CopyProvider";
import { ACCENT, CREAM, MUTED_GREEN, REGULAR, SEMIBOLD, TEXT_LIGHT } from "@/tokens";

/**
 * The assessment request form.
 *
 * Posts to a single endpoint so the provider stays a one-env-var swap rather
 * than a rewrite (ADR-0003). The default target is "/", which is how Netlify
 * Forms receives a submission.
 *
 * NOTE: `VITE_`-prefixed values are inlined into the public bundle at build
 * time. This one is safe because a form endpoint is meant to be public — see
 * docs/PUBLIC-SURFACE.md. Never put a server-privileged key behind that prefix.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? "/";

/** Must match the hidden static form in index.html, which is what Netlify's
 *  build-time parser actually sees. If these drift, submissions 404. */
const FORM_NAME = "contact";
const HONEYPOT = "bot-field";

/** A human takes longer than this to read the section and fill four fields. */
const MIN_FILL_MS = 3000;

type Status = "idle" | "sending" | "sent" | "error";
type Field = "name" | "email" | "company" | "message";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm({ onOpenPrivacy }: { onOpenPrivacy: () => void }) {
  const c = useCopy().contact;
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const mountedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const liveRegion = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [f]: e.target.value }));
    setErrors((x) => (x[f] ? { ...x, [f]: undefined } : x));
  };

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const next: Partial<Record<Field, string>> = {};
      if (!values.name.trim()) next.name = c.required;
      if (!values.email.trim()) next.email = c.required;
      else if (!EMAIL.test(values.email.trim())) next.email = c.invalidEmail;
      setErrors(next);
      if (Object.keys(next).length) return;

      // Silently accept and discard obvious bots: a filled honeypot, or a
      // submission faster than a person could have typed one.
      const looksAutomated =
        Boolean(honeypot.current?.value) || Date.now() - mountedAt.current < MIN_FILL_MS;
      if (looksAutomated) {
        setStatus("sent");
        return;
      }

      setStatus("sending");
      try {
        const body = new URLSearchParams({
          "form-name": FORM_NAME,
          ...values,
        });
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        setStatus(res.ok ? "sent" : "error");
      } catch {
        setStatus("error");
      }
    },
    [values, c],
  );

  if (status === "sent") {
    return (
      <div role="status" style={panel}>
        <p style={{ ...SEMIBOLD, fontSize: 17, color: CREAM, margin: "0 0 6px" }}>
          {c.successTitle}
        </p>
        <p style={{ ...REGULAR, fontSize: 15, color: TEXT_LIGHT, margin: 0 }}>{c.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{ display: "grid", gap: 14, maxWidth: 480 }}>
      <style>{`
        .dc-f-input {
          width: 100%; box-sizing: border-box;
          background: rgba(246,248,244,0.06);
          border: 1px solid rgba(199,208,197,0.28);
          border-radius: 2px; padding: 11px 13px;
          color: ${CREAM}; font-size: 15px;
          font-family: 'Archivo Variable', Archivo, system-ui, sans-serif;
          transition: border-color .15s, background .15s;
        }
        .dc-f-input::placeholder { color: rgba(199,208,197,0.42); }
        .dc-f-input:focus {
          outline: none;
          border-color: rgba(199,208,197,0.75);
          background: rgba(246,248,244,0.1);
        }
        .dc-f-input[aria-invalid="true"] { border-color: #d98f6a; }
        .dc-f-label {
          display: block; font-size: 12px; letter-spacing: .04em;
          text-transform: uppercase; color: rgba(199,208,197,0.6);
          margin-bottom: 6px;
          font-family: 'Archivo Variable', Archivo, system-ui, sans-serif;
        }
        .dc-f-err { font-size: 13px; color: #e8a684; margin: 5px 0 0; }
        .dc-f-link {
          color: ${CREAM}; text-decoration: underline;
          text-underline-offset: 2px; background: none; border: 0;
          padding: 0; font: inherit; cursor: pointer;
        }
        .dc-f-link:focus-visible { outline: 2px solid ${CREAM}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .dc-f-input { transition: none; } }
      `}</style>

      {/* Netlify needs the form name in the payload; the visible fields are
          mirrored by a hidden static form in index.html for its parser. */}
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p hidden>
        <label>
          {HONEYPOT}
          <input ref={honeypot} name={HONEYPOT} tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {(
        [
          ["name", c.name, "text", "name"],
          ["email", c.email, "email", "email"],
          ["company", c.company, "text", "organization"],
        ] as const
      ).map(([field, label, type, ac]) => (
        <div key={field}>
          <label className="dc-f-label" htmlFor={`dc-${field}`}>
            {label}
            {field === "company" && (
              <span style={{ textTransform: "none", opacity: 0.65 }}> · {c.optional}</span>
            )}
          </label>
          <input
            id={`dc-${field}`}
            className="dc-f-input"
            name={field}
            type={type}
            autoComplete={ac}
            value={values[field]}
            onChange={set(field)}
            aria-invalid={Boolean(errors[field])}
            aria-describedby={errors[field] ? `dc-${field}-err` : undefined}
          />
          {errors[field] && (
            <p className="dc-f-err" id={`dc-${field}-err`}>
              {errors[field]}
            </p>
          )}
        </div>
      ))}

      <div>
        <label className="dc-f-label" htmlFor="dc-message">
          {c.message}
          <span style={{ textTransform: "none", opacity: 0.65 }}> · {c.optional}</span>
        </label>
        <textarea
          id="dc-message"
          className="dc-f-input"
          name="message"
          rows={3}
          placeholder={c.messagePlaceholder}
          value={values.message}
          onChange={set("message")}
        />
      </div>

      <p
        style={{
          ...REGULAR,
          fontSize: 13,
          lineHeight: 1.5,
          color: "rgba(199,208,197,0.62)",
          margin: 0,
        }}
      >
        {c.consent}{" "}
        <button type="button" className="dc-f-link" onClick={onOpenPrivacy}>
          {c.consentLink}
        </button>
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          ...SEMIBOLD,
          fontSize: 15,
          color: "#fff",
          background: ACCENT,
          border: `1px solid ${MUTED_GREEN}`,
          borderRadius: 2,
          padding: "14px 28px",
          cursor: status === "sending" ? "default" : "pointer",
          opacity: status === "sending" ? 0.7 : 1,
          justifySelf: "start",
        }}
      >
        {status === "sending" ? c.sending : c.submit}
      </button>

      <div ref={liveRegion} role="alert">
        {status === "error" && (
          <>
            <p style={{ ...SEMIBOLD, fontSize: 15, color: "#e8a684", margin: "0 0 4px" }}>
              {c.errorTitle}
            </p>
            <p style={{ ...REGULAR, fontSize: 14, color: TEXT_LIGHT, margin: 0 }}>{c.errorBody}</p>
          </>
        )}
      </div>
    </form>
  );
}

const panel: React.CSSProperties = {
  maxWidth: 480,
  background: "rgba(246,248,244,0.07)",
  border: "1px solid rgba(199,208,197,0.28)",
  borderRadius: 3,
  padding: "20px 22px",
};
