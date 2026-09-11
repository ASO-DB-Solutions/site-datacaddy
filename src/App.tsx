import React, { useState, useCallback } from "react";
import imgHeroTexture from "@/assets/hero-texture.webp";
import imgGolfBallDome from "@/assets/golf-dome.webp";
import imgGolfCourse from "@/assets/cta-golf-course.webp";
import { ContactForm } from "@/ContactForm";
import { PrivacyModal } from "@/PrivacyModal";
import {
  EXPANDED,
  REGULAR,
  SEMIBOLD,
  SAGE,
  SAGE_MID,
  FOREST,
  ACCENT,
  ACCENT_MID,
  MUTED_GREEN,
  TEXT_LIGHT,
  CREAM,
  INK,
  subgrid,
} from "@/tokens";

// ── Design tokens ──────────────────────────────────────────
const DB_ICON_PATH =
  "M136.654 1.47564C144.405 -0.491915 152.525 -0.491848 160.275 1.47564L178.825 6.18463L197.686 9.42779C205.567 10.7828 212.985 14.0853 219.266 19.0352L234.297 30.8819L250.208 41.5157C256.856 45.9591 262.29 51.9938 266.014 59.0704L274.927 76.0059L285.138 92.1924C289.404 98.9559 291.913 106.679 292.436 114.658L293.69 133.755L296.435 152.695C297.581 160.609 296.733 168.684 293.966 176.187L287.343 194.143L282.146 212.562C279.975 220.258 275.915 227.29 270.336 233.019L256.983 246.729L244.744 261.441C239.63 267.589 233.061 272.361 225.634 275.325L207.859 282.419L190.693 290.882C183.521 294.418 175.579 296.106 167.589 295.793L148.465 295.043L129.342 295.793C121.351 296.106 113.409 294.418 106.237 290.882L89.0712 282.419L71.2968 275.325C63.8698 272.361 57.3005 267.589 52.1865 261.441L39.9472 246.729L26.5947 233.019C21.0153 227.29 16.9555 220.258 14.7841 212.562L9.58687 194.143L2.9648 176.187C0.197941 168.684 -0.65053 160.609 0.496049 152.695L3.24019 133.755L4.4941 114.658C5.01793 106.679 7.52649 98.9559 11.7929 92.1924L22.0039 76.0059L30.9169 59.0704C34.641 51.9938 40.0741 45.9591 46.7226 41.5157L62.6337 30.8819L77.665 19.0352C83.9453 14.0853 91.3632 10.7828 99.2441 9.42779L118.104 6.18463L136.654 1.47564ZM148.466 75.7559C114.041 75.7559 84.9659 90.412 84.9658 107.756V187.756C84.9658 205.1 114.041 219.756 148.466 219.756C182.891 219.756 211.966 205.1 211.966 187.756V107.756C211.966 90.412 182.891 75.756 148.466 75.7559ZM196.091 187.708C195.543 191.7 177.763 203.756 148.466 203.756C119.168 203.756 101.388 191.7 100.841 187.756V168.612C112.58 175.388 129.71 179.756 148.466 179.756C167.222 179.756 184.351 175.388 196.091 168.612V187.708ZM196.091 147.708C195.543 151.7 177.763 163.756 148.466 163.756C119.168 163.756 101.388 151.7 100.841 147.756V128.612C112.58 135.388 129.71 139.756 148.466 139.756C167.222 139.756 184.351 135.388 196.091 128.612V147.708ZM148.466 91.7559C177.763 91.756 195.543 103.812 196.091 107.708C195.543 111.7 177.763 123.756 148.466 123.756C119.168 123.756 101.388 111.7 100.841 107.804C101.389 103.811 119.169 91.7559 148.466 91.7559Z";

// ── Shared small components ────────────────────────────────
function LogoMark({ color = "#152a0b", size = 32 }: { color?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 296.931 295.83"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path d={DB_ICON_PATH} fill={color} />
    </svg>
  );
}

function IconKey() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5L19 11l2-2" />
    </svg>
  );
}
function IconList() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
  );
}
function IconActivity() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconFileText() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// ── Responsive CSS ─────────────────────────────────────────
function ResponsiveStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-behavior: smooth; scroll-padding-top: 80px; }

      .dc-sp  { padding: 96px max(4vw, 24px); }
      .dc-in  { max-width: 1180px; margin: 0 auto; }

      /* Nav */
      .dc-nav-links { display: flex; align-items: center; gap: 26px; }
      .dc-hamburger { display: none; background: none; border: none; cursor: pointer; color: ${ACCENT}; padding: 4px; }

      /* Drawer overlay */
      .dc-drawer-overlay {
        display: none; position: fixed; inset: 0; z-index: 100;
        background: rgba(10,22,8,0.55); backdrop-filter: blur(2px);
      }
      .dc-drawer-overlay.open { display: block; }
      .dc-drawer {
        position: fixed; top: 0; right: 0; bottom: 0; width: min(300px, 85vw);
        background: ${CREAM}; z-index: 101; transform: translateX(100%);
        transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        display: flex; flex-direction: column; padding: 28px 24px 40px;
        overflow-y: auto;
      }
      .dc-drawer.open { transform: translateX(0); }
      .dc-drawer-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; }
      .dc-drawer-link { display: block; font-family: 'Archivo Variable', Archivo, system-ui, sans-serif; font-variation-settings: "wdth" 100; font-size: 17px; color: ${INK}; text-decoration: none; padding: 13px 0; border-bottom: 1px solid ${SAGE}; letter-spacing: -0.1px; }
      .dc-drawer-link:last-of-type { border-bottom: none; }

      /* Hero ball wrapper — desktop: 75% wide centered; mobile: full width */
      .dc-ball-wrap {
        position: absolute; bottom: 0; z-index: 2; pointer-events: none;
        width: 75%; left: 50%; transform: translateX(-50%);
      }

      /* Hero copy — ball-wrap is fixed 600px wide → dome height ≈ 163px */
      .dc-hero-copy {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center; z-index: 5;
        padding: 140px max(5vw, 20px) 180px;
      }
      .dc-hero-gap { display: flex; flex-direction: column; align-items: center; gap: 20px; }
      .dc-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }

      /* Grids */
      .dc-g4  { display: grid; grid-template-columns: repeat(4,1fr); }
      .dc-g3  { display: grid; grid-template-columns: repeat(3,1fr); }
      .dc-g2t { display: grid; grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr); gap: 72px; align-items: start; }
      .dc-g2e { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

      .dc-col-div { border-right: 1px solid rgba(199,208,197,0.3); }
      .dc-step-div { border-right: 1px solid ${SAGE}; }

      /* Rightsizing table — scrollable container */
      .dc-park-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid ${SAGE}; border-radius: 4px; box-shadow: 0 20px 60px -28px rgba(11,29,22,0.18); }
      .dc-park-min { min-width: 400px; }

      /* Calculator form */
      .dc-calc-input {
        width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(199,208,197,0.25);
        border-radius: 2px; padding: 11px 14px; color: ${CREAM};
        font-family: 'Archivo Variable', Archivo, system-ui, sans-serif; font-size: 16px;
        appearance: none; -webkit-appearance: none; outline: none;
        transition: border-color 0.15s;
      }
      .dc-calc-input:focus { border-color: rgba(199,208,197,0.6); }
      .dc-calc-input option { background: ${FOREST}; color: ${CREAM}; }
      .dc-calc-label { font-family: 'Archivo Variable', Archivo, system-ui, sans-serif; font-size: 12px; color: rgba(199,208,197,0.55); letter-spacing: 0.04em; text-transform: uppercase; display: block; margin-bottom: 6px; }
      .dc-dest-btn { flex: 1; padding: 11px 16px; border-radius: 2px; cursor: pointer; font-family: 'Archivo Variable', Archivo, system-ui, sans-serif; font-weight: 600; font-size: 14px; transition: all 0.15s; border: 1px solid rgba(199,208,197,0.3); background: transparent; color: ${TEXT_LIGHT}; }
      .dc-dest-btn.active { background: ${CREAM}; color: ${INK}; border-color: ${CREAM}; }

      /* CTA buttons */
      .dc-cta-btns { display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap; }
      .dc-cta-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,440px); gap: clamp(32px,5vw,64px); align-items: start; }
      /* The form is the page's one conversion goal, so it is the one element
         lifted off the background — and the panel is what keeps its labels
         legible where the gradient thins over the photograph. */
      .dc-cta-form { background: rgba(13,32,16,0.82); border: 1px solid rgba(199,208,197,0.16); border-radius: 3px; padding: clamp(22px,3vw,30px); backdrop-filter: blur(2px); }

      /* Footer inner */
      .dc-foot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }

      /* ── Tablet ≤ 1024px ─── */
      @media (max-width: 1024px) {
        .dc-g4  { grid-template-columns: repeat(2,1fr); }
        .dc-g3  { grid-template-columns: repeat(2,1fr); }
        .dc-g2t { grid-template-columns: 1fr; gap: 48px; }
        .dc-g2e { grid-template-columns: 1fr; gap: 48px; }
        .dc-col-div { border-right: none; border-bottom: 1px solid rgba(199,208,197,0.3); }
      }

      /* ── Mobile ≤ 640px ─── */
      @media (max-width: 640px) {
        .dc-sp { padding: 60px 20px; }

        /* Nav */
        .dc-nav-links { display: none; }
        .dc-hamburger { display: flex; }

        /* Mobile: ball is full width, restore wrapper and adjust copy padding */
        .dc-ball-wrap { width: 100%; left: 0; transform: none; }
        .dc-hero-copy { padding: 76px 20px 27vw; }

        /* Grids */
        .dc-g4  { grid-template-columns: 1fr; }
        .dc-g3  { grid-template-columns: 1fr; }
        .dc-g2t { gap: 36px; }
        .dc-g2e { gap: 36px; }
        .dc-step-div { border-right: none; border-bottom: 1px solid ${SAGE}; }

        /* Buttons */
        .dc-hero-btns { flex-direction: column; align-items: stretch; width: 100%; max-width: 280px; }
        .dc-cta-btns  { flex-direction: column; }
        .dc-cta-grid  { grid-template-columns: 1fr; gap: 34px; }
        .dc-cta-form  { padding: 20px 18px; }

        /* Footer */
        .dc-foot { flex-direction: column; align-items: flex-start; gap: 10px; }
      }

      /* ── Tiny ≤ 390px ─── */
      @media (max-width: 390px) {
        .dc-sp { padding: 48px 16px; }
        .dc-hero-copy { padding: 72px 16px 44%; }
      }
    `}</style>
  );
}

// ── Nav + Drawer ───────────────────────────────────────────
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "What it reads", href: "#what-it-reads" },
  { label: "Rightsizing", href: "#rightsizing" },
  { label: "Cloud migration", href: "#cloud-migration" },
  { label: "Assessment", href: "#assessment" },
];

function Nav({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <nav
      style={{
        position: "absolute",
        top: 20,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: "0 max(4vw, 20px)",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark color={ACCENT} size={32} />
          <span
            style={{
              ...REGULAR,
              fontVariationSettings: '"wdth" 125',
              fontWeight: 300,
              fontSize: 21,
              letterSpacing: "-0.4px",
              color: ACCENT,
            }}
          >
            Data<span style={{ fontWeight: 700 }}>Caddy</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="dc-nav-links">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                ...REGULAR,
                fontSize: 14,
                color: ACCENT,
                opacity: 0.75,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.75")}
            >
              {label}
            </a>
          ))}
          <a
            href="#get-assessment"
            style={{
              ...SEMIBOLD,
              fontSize: 14,
              color: "#fff",
              background: ACCENT,
              border: `1px solid ${MUTED_GREEN}`,
              borderRadius: 2,
              padding: "10px 20px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Get an assessment
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="dc-hamburger" onClick={onOpenMenu} aria-label="Open menu">
          <IconMenu />
        </button>
      </div>
    </nav>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div className={`dc-drawer-overlay${open ? " open" : ""}`} onClick={onClose} />
      <div className={`dc-drawer${open ? " open" : ""}`}>
        <div className="dc-drawer-head">
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <LogoMark color={ACCENT} size={28} />
            <span
              style={{
                ...REGULAR,
                fontVariationSettings: '"wdth" 125',
                fontWeight: 700,
                fontSize: 19,
                color: ACCENT,
              }}
            >
              DataCaddy
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: MUTED_GREEN,
              padding: 4,
            }}
          >
            <IconClose />
          </button>
        </div>

        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href} className="dc-drawer-link" onClick={onClose}>
            {label}
          </a>
        ))}

        <a
          href="#get-assessment"
          onClick={onClose}
          style={{
            ...SEMIBOLD,
            display: "block",
            marginTop: 28,
            textAlign: "center",
            fontSize: 15,
            color: "#fff",
            background: ACCENT,
            borderRadius: 2,
            padding: "14px 20px",
            textDecoration: "none",
          }}
        >
          Get an assessment
        </a>
        <p style={{ ...REGULAR, fontSize: 12, color: MUTED_GREEN, marginTop: 20, lineHeight: 1.6 }}>
          Oracle · SQL Server · PostgreSQL · MySQL
        </p>
      </div>
    </>
  );
}

// ── Hero ───────────────────────────────────────────────────
function Hero({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <section
      style={{
        position: "relative",
        height: "100svh",
        minHeight: 560,
        overflow: "hidden",
        background: `linear-gradient(180deg,${SAGE} 0%,${SAGE} 35%,${SAGE_MID} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imgHeroTexture})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          mixBlendMode: "screen",
          opacity: 0.45,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)`,
          backgroundSize: "96px 96px",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />

      <Nav onOpenMenu={onOpenMenu} />

      <div className="dc-hero-copy">
        <div className="dc-hero-gap" style={{ justifyContent: "flex-start" }}>
          <h1
            style={{
              ...EXPANDED,
              fontSize: "clamp(30px,4.5vw,58px)",
              lineHeight: 1.06,
              letterSpacing: "-1.2px",
              color: ACCENT,
              margin: 0,
              maxWidth: 760,
            }}
          >
            Read the field.
            <br />
            Make the right move.
          </h1>
          <p
            style={{
              ...REGULAR,
              fontSize: "clamp(14px,1.4vw,18px)",
              lineHeight: 1.55,
              color: ACCENT,
              opacity: 0.75,
              margin: 0,
              maxWidth: 520,
            }}
          >
            DataCaddy continuously reads your database environment — connecting workload,
            configuration, security and capacity signals into a clearer view of what matters.
          </p>
          <div className="dc-hero-btns">
            <a
              href="#get-assessment"
              style={{
                ...SEMIBOLD,
                fontSize: 15,
                color: "#fff",
                background: ACCENT,
                border: `1px solid ${MUTED_GREEN}`,
                borderRadius: 2,
                padding: "13px 26px",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Get an assessment
            </a>
            <a
              href="#what-it-reads"
              style={{
                ...SEMIBOLD,
                fontSize: 15,
                color: CREAM,
                background: ACCENT_MID,
                border: `1px solid rgba(246,248,244,0.34)`,
                borderRadius: 2,
                padding: "13px 26px",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              See how it works
            </a>
          </div>
        </div>
      </div>

      <div className="dc-ball-wrap" style={{ width: 600 }}>
        <svg
          width="100%"
          viewBox="0 0 1832 499"
          preserveAspectRatio="xMidYMax slice"
          style={{ display: "block" }}
        >
          <defs>
            <clipPath id="ballDomeClip">
              <path d="M906.5 0C446.1 0 110.333 332.667 0 499H1832C1715.33 332.667 1366.9 0 906.5 0Z" />
            </clipPath>
          </defs>
          <image
            href={imgGolfBallDome}
            x="-31.5"
            y="-585.5"
            width="1920"
            height="1085"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#ballDomeClip)"
          />
        </svg>
      </div>
    </section>
  );
}

// ── Collect section ────────────────────────────────────────
function CollectSection() {
  const cols = [
    {
      title: "Workload",
      desc: "Where time is spent, not just how much CPU was consumed.",
      items: [
        "Wait events per session",
        "Top SQL and plan history",
        "Locks, deadlocks, I/O queue",
        "Load seasonality by hour and day",
      ],
    },
    {
      title: "Configuration",
      desc: "What is out of spec and what changed since the last round.",
      items: [
        "Memory and parallelism parameters",
        "Version, patch level and end of support",
        "Backup, retention and recovery",
        "Drift between identical environments",
      ],
    },
    {
      title: "Security",
      desc: "Excess privilege is the most common finding in any audit.",
      items: [
        "Accounts with elevated privilege",
        "Default passwords and orphan accounts",
        "Encryption at rest and in transit",
        "Permission combinations that accumulate",
      ],
    },
    {
      title: "Capacity",
      desc: "The foundation for rightsizing and the migration bill.",
      items: [
        "CPU, memory and I/O at percentile, not average",
        "Data growth and projection",
        "Real peak vs. provisioned capacity",
        "Idle windows and batch windows",
      ],
    },
  ];
  return (
    <section
      id="what-it-reads"
      className="dc-sp"
      style={{ background: FOREST, position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: subgrid,
          backgroundSize: "96px 96px",
          pointerEvents: "none",
        }}
      />
      <div
        className="dc-in"
        style={{ position: "relative", display: "flex", flexDirection: "column", gap: 56 }}
      >
        <div style={{ maxWidth: 720 }}>
          <p
            style={{
              ...REGULAR,
              fontSize: 13,
              color: "rgba(199,208,197,0.5)",
              margin: "0 0 14px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            What it reads
          </p>
          <h2
            style={{
              ...EXPANDED,
              fontSize: "clamp(28px,3.2vw,44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.66px",
              color: CREAM,
              margin: "0 0 18px",
            }}
          >
            Four signals that today live in different tools
          </h2>
          <p
            style={{
              ...REGULAR,
              fontSize: 17,
              lineHeight: 1.65,
              color: TEXT_LIGHT,
              margin: 0,
              maxWidth: 640,
            }}
          >
            Performance lives in one license, security in another, and nobody crosses them.
            DataCaddy brings all four into a single inventory, so a slow query and a misconfigured
            parameter appear side by side.
          </p>
        </div>
        <div className="dc-g4" style={{ borderTop: `1px solid rgba(199,208,197,0.3)` }}>
          {cols.map((col, i) => (
            <div
              key={col.title}
              className={i < 3 ? "dc-col-div" : ""}
              style={{
                padding: "26px 20px 40px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <h3
                style={{
                  ...EXPANDED,
                  fontSize: 20,
                  letterSpacing: "-0.3px",
                  color: CREAM,
                  margin: 0,
                }}
              >
                {col.title}
              </h3>
              <p
                style={{
                  ...REGULAR,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: TEXT_LIGHT,
                  margin: "0 0 8px",
                }}
              >
                {col.desc}
              </p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {col.items.map((item) => (
                  <div
                    key={item}
                    style={{
                      borderTop: `1px solid rgba(199,208,197,0.22)`,
                      padding: "5px 0",
                      ...REGULAR,
                      fontSize: 13,
                      color: TEXT_LIGHT,
                      lineHeight: 1.6,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Rightsizing section ────────────────────────────────────
function RightsizingSection() {
  const AMBER = "#b08029";
  const RED_S = "#b23a2c";
  const GREEN_S = "#2e7d5b";
  const rows = [
    {
      name: "ora-erp-01",
      db: "Oracle 19c",
      par: "8 / 64",
      played: "32 / 256",
      score: "+4",
      scoreColor: AMBER,
    },
    {
      name: "sql-crm-02",
      db: "SQL Server 2019",
      par: "8 / 32",
      played: "4 / 16",
      score: "−2",
      scoreColor: RED_S,
    },
    {
      name: "pg-billing-03",
      db: "PostgreSQL 15",
      par: "4 / 16",
      played: "4 / 16",
      score: "E",
      scoreColor: GREEN_S,
    },
    {
      name: "mysql-app-04",
      db: "MySQL 8.0",
      par: "2 / 8",
      played: "8 / 32",
      score: "+3",
      scoreColor: AMBER,
    },
    {
      name: "ora-dw-05",
      db: "Oracle 19c",
      par: "16 / 128",
      played: "16 / 128",
      score: "E",
      scoreColor: GREEN_S,
    },
  ];
  return (
    <section id="rightsizing" className="dc-sp" style={{ background: "#fff" }}>
      <div className="dc-g2t dc-in">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p
            style={{
              ...REGULAR,
              fontSize: 13,
              color: MUTED_GREEN,
              margin: 0,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Rightsizing
          </p>
          <h2
            style={{
              ...EXPANDED,
              fontSize: "clamp(28px,3.2vw,44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.66px",
              color: INK,
              margin: 0,
            }}
          >
            Average lies. P95 decides.
          </h2>
          <p style={{ ...REGULAR, fontSize: 17, lineHeight: 1.65, color: MUTED_GREEN, margin: 0 }}>
            Almost every estate was sized once, on paper, before real load existed — and never
            revisited. DataCaddy compares each instance's true peak against what is provisioned and
            surfaces both directions of error: idle capacity and saturation risk.
          </p>
          <p
            style={{
              ...REGULAR,
              fontSize: 13.5,
              lineHeight: 1.65,
              color: MUTED_GREEN,
              margin: "8px 0 0",
            }}
          >
            Idle capacity doesn't trigger any alert. It shows up on the invoice — and when the
            environment moves to the cloud, it gets multiplied by twelve months.
          </p>
        </div>

        {/* Scrollable table wrapper — no overflow:hidden on the border box */}
        <div className="dc-park-scroll">
          <div className="dc-park-min">
            <div
              style={{
                padding: "18px 20px 14px",
                borderBottom: `2px solid ${INK}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <span style={{ ...EXPANDED, fontSize: 16, color: INK }}>Park Card</span>
              <span
                style={{
                  ...REGULAR,
                  fontSize: 11,
                  color: MUTED_GREEN,
                  textAlign: "right",
                  lineHeight: 1.5,
                }}
              >
                14-day read · 5 instances
                <br />
                us-east-1 · list price
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 86px 86px 58px",
                borderBottom: `1px solid ${SAGE}`,
              }}
            >
              {["Instance", "Par", "Played", "Score"].map((h, i) => (
                <div
                  key={h}
                  style={{
                    padding: "12px 14px 8px",
                    ...REGULAR,
                    fontWeight: 500,
                    fontSize: 11.5,
                    color: MUTED_GREEN,
                    textAlign: i > 0 ? "right" : "left",
                  }}
                >
                  {h}
                  {(h === "Par" || h === "Played") && (
                    <div style={{ color: SAGE, fontSize: 10, marginTop: 1 }}>vCPU / GB</div>
                  )}
                </div>
              ))}
            </div>
            {rows.map((r) => (
              <div
                key={r.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 86px 86px 58px",
                  borderBottom: `1px solid ${SAGE}`,
                }}
              >
                <div style={{ padding: "10px 14px" }}>
                  <div style={{ ...REGULAR, fontWeight: 500, fontSize: 13, color: INK }}>
                    {r.name}
                  </div>
                  <div style={{ ...REGULAR, fontSize: 11, color: MUTED_GREEN, marginTop: 2 }}>
                    {r.db}
                  </div>
                </div>
                {[
                  { k: "par", v: r.par },
                  { k: "played", v: r.played },
                ].map(({ k, v }) => (
                  <div
                    key={k}
                    style={{
                      padding: "10px 14px",
                      ...REGULAR,
                      fontSize: 13,
                      color: INK,
                      textAlign: "right",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {v}
                  </div>
                ))}
                <div
                  style={{
                    padding: "10px 14px",
                    ...SEMIBOLD,
                    fontSize: 13.5,
                    color: r.scoreColor,
                    textAlign: "right",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {r.score}
                </div>
              </div>
            ))}
            <div
              style={{
                padding: "14px 20px 16px",
                background: "#f5f7f4",
                borderTop: `2px solid ${INK}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ ...EXPANDED, fontSize: 14, color: INK }}>
                  Round total: <span style={{ fontWeight: 700 }}>+9</span>
                </div>
                <div style={{ ...REGULAR, fontSize: 11, color: MUTED_GREEN, marginTop: 2 }}>
                  Net strokes above and below par
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    ...EXPANDED,
                    fontSize: 22,
                    color: AMBER,
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                  }}
                >
                  US$ 4,180
                </div>
                <div style={{ ...REGULAR, fontSize: 11, color: MUTED_GREEN, marginTop: 3 }}>
                  per month in idle capacity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Migration calculator ───────────────────────────────────
type Destination = "AWS RDS" | "Azure Database";

const AWS_INSTANCES = [
  { name: "db.r6i.large", vcpu: 2, memGb: 16, ph: 0.24 },
  { name: "db.r6i.xlarge", vcpu: 4, memGb: 32, ph: 0.48 },
  { name: "db.r6i.2xlarge", vcpu: 8, memGb: 64, ph: 0.96 },
  { name: "db.r6i.4xlarge", vcpu: 16, memGb: 128, ph: 1.92 },
  { name: "db.r6i.8xlarge", vcpu: 32, memGb: 256, ph: 3.84 },
  { name: "db.r6i.16xlarge", vcpu: 64, memGb: 512, ph: 7.68 },
];
const AZURE_INSTANCES = [
  { name: "Standard_D2ds_v4", vcpu: 2, memGb: 8, ph: 0.19 },
  { name: "Standard_D4ds_v4", vcpu: 4, memGb: 16, ph: 0.38 },
  { name: "Standard_D8ds_v4", vcpu: 8, memGb: 32, ph: 0.77 },
  { name: "Standard_D16ds_v4", vcpu: 16, memGb: 64, ph: 1.54 },
  { name: "Standard_D32ds_v4", vcpu: 32, memGb: 128, ph: 3.07 },
  { name: "Standard_D64ds_v4", vcpu: 64, memGb: 256, ph: 6.14 },
];
const STORAGE_PER_GB = 0.115; // gp3 / Azure managed, $/GB/mo
const HRS = 730;

function calcMigration(
  vcpu: number,
  memGb: number,
  cpuPeak: number,
  memPeak: number,
  storageGb: number,
  dest: Destination,
) {
  const instances = dest === "AWS RDS" ? AWS_INSTANCES : AZURE_INSTANCES;
  const last = instances[instances.length - 1];

  const findFit = (minVcpu: number, minMem: number) =>
    instances.find((i) => i.vcpu >= minVcpu && i.memGb >= minMem) ?? last;

  // Right-sized target
  const tVcpu = Math.max(2, Math.ceil(vcpu * (cpuPeak / 100) * 1.3));
  const tMem = Math.max(2, Math.ceil(memGb * (memPeak / 100) * 1.15));
  const rightSized = findFit(tVcpu, tMem);

  // Mirror (provision as-is)
  const mirrored = findFit(vcpu, memGb);

  const storageCost = storageGb * STORAGE_PER_GB;
  const mirrorCost = Math.round(mirrored.ph * HRS + storageCost);
  const rightCost = Math.round(rightSized.ph * HRS + storageCost);
  const savings = (mirrorCost - rightCost) * 12;

  return {
    rightSized,
    mirrored,
    mirrorCost,
    rightCost,
    savings,
    storageCost: Math.round(storageCost),
  };
}

function NumberInput({
  label,
  value,
  onChange,
  min = 1,
  max = 10000,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label className="dc-calc-label">{label}</label>
      <input
        className="dc-calc-input"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value);
          if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
        }}
      />
    </div>
  );
}

function MigrationSection() {
  const [db, setDb] = useState("PostgreSQL");
  const [vcpu, setVcpu] = useState(16);
  const [memGb, setMemGb] = useState(128);
  const [cpuPeak, setCpuPeak] = useState(27);
  const [memPeak, setMemPeak] = useState(41);
  const [storageGb, setStorageGb] = useState(900);
  const [dest, setDest] = useState<Destination>("AWS RDS");

  const result = calcMigration(vcpu, memGb, cpuPeak, memPeak, storageGb, dest);
  const fmt = useCallback((n: number) => `US$ ${n.toLocaleString("en-US")}`, []);

  const freeEngine = db === "PostgreSQL" || db === "MySQL";

  return (
    <section
      id="cloud-migration"
      className="dc-sp"
      style={{ background: FOREST, position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: subgrid,
          backgroundSize: "96px 96px",
          pointerEvents: "none",
        }}
      />
      <div className="dc-g2e dc-in" style={{ position: "relative" }}>
        {/* Left: description + form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p
              style={{
                ...REGULAR,
                fontSize: 13,
                color: "rgba(199,208,197,0.5)",
                margin: 0,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Cloud migration
            </p>
            <h2
              style={{
                ...EXPANDED,
                fontSize: "clamp(28px,3.2vw,44px)",
                lineHeight: 1.1,
                letterSpacing: "-0.66px",
                color: CREAM,
                margin: 0,
              }}
            >
              Bringing the oversize home costs money every month
            </h2>
            <p style={{ ...REGULAR, fontSize: 16, lineHeight: 1.65, color: TEXT_LIGHT, margin: 0 }}>
              Enter an instance's specs and observed load. DataCaddy recommends the managed instance
              type and shows what changes when the size is corrected before the move.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Database */}
            <div>
              <label className="dc-calc-label">Database</label>
              <div style={{ position: "relative" }}>
                <select
                  className="dc-calc-input"
                  value={db}
                  onChange={(e) => setDb(e.target.value)}
                  style={{ paddingRight: 36 }}
                >
                  {["Oracle", "SQL Server", "PostgreSQL", "MySQL"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <svg
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={TEXT_LIGHT}
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* vCPU + Memory */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <NumberInput
                label="vCPU provisioned today"
                value={vcpu}
                onChange={setVcpu}
                min={1}
                max={512}
              />
              <NumberInput
                label="Memory provisioned (GB)"
                value={memGb}
                onChange={setMemGb}
                min={1}
                max={4096}
              />
            </div>

            {/* CPU Peak + Mem Peak */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <NumberInput
                label="Peak CPU observed (%)"
                value={cpuPeak}
                onChange={setCpuPeak}
                min={1}
                max={100}
              />
              <NumberInput
                label="Peak memory observed (%)"
                value={memPeak}
                onChange={setMemPeak}
                min={1}
                max={100}
              />
            </div>

            {/* Storage */}
            <NumberInput
              label="Storage in use (GB)"
              value={storageGb}
              onChange={setStorageGb}
              min={20}
              max={64000}
            />

            {/* Destination toggle */}
            <div>
              <label className="dc-calc-label">Destination</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["AWS RDS", "Azure Database"] as Destination[]).map((d) => (
                  <button
                    key={d}
                    className={`dc-dest-btn${dest === d ? " active" : ""}`}
                    onClick={() => setDest(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <p
              style={{
                ...REGULAR,
                fontSize: 11.5,
                color: "rgba(199,208,197,0.45)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Target capacity = observed peak + 30% CPU headroom, 15% memory headroom. Reference
              prices: on-demand, single-AZ, us-east-1 / East US, list price.
            </p>
          </div>
        </div>

        {/* Right: result card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 4,
            boxShadow: "0 32px 80px -32px rgba(0,0,0,0.55)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "22px 24px 18px", borderBottom: `2px solid ${INK}` }}>
            <span style={{ ...REGULAR, fontSize: 12, color: MUTED_GREEN }}>
              Recommended instance after rightsizing
            </span>
            <div
              style={{
                ...EXPANDED,
                fontSize: "clamp(20px,2.4vw,30px)",
                letterSpacing: "-0.7px",
                color: INK,
                lineHeight: 1.1,
                marginTop: 6,
              }}
            >
              {result.rightSized.name}
            </div>
            <span
              style={{
                ...REGULAR,
                fontSize: 12.5,
                color: MUTED_GREEN,
                marginTop: 4,
                display: "block",
              }}
            >
              {result.rightSized.vcpu} vCPU · {result.rightSized.memGb} GB · {storageGb} GB{" "}
              {dest === "AWS RDS" ? "gp3" : "managed"}
            </span>
          </div>

          <div style={{ padding: "4px 24px 0" }}>
            {[
              {
                label:
                  dest === "AWS RDS"
                    ? "Mirrored migration, as it stands today"
                    : "Mirrored migration to " + dest,
                value: `${fmt(result.mirrorCost)}/mo`,
                strike: true,
              },
              {
                label: "With size corrected before migrating",
                value: `${fmt(result.rightCost)}/mo`,
                strike: false,
              },
              {
                label: `Instance a mirrored migration would require`,
                value: result.mirrored.name,
                strike: false,
              },
            ].map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "13px 0",
                  borderBottom: i < 2 ? `1px solid ${SAGE}` : "none",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ ...REGULAR, fontSize: 13, color: MUTED_GREEN, flex: "1 1 140px" }}>
                  {row.label}
                </span>
                <span
                  style={{
                    ...SEMIBOLD,
                    fontSize: 14,
                    color: row.strike ? MUTED_GREEN : INK,
                    textDecoration: row.strike ? "line-through" : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#edf0ea",
              borderTop: `2px solid ${INK}`,
              padding: "18px 24px 20px",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                ...EXPANDED,
                fontSize: "clamp(22px,2.6vw,32px)",
                letterSpacing: "-0.9px",
                color: "#2e7d5b",
                lineHeight: 1,
              }}
            >
              {result.savings > 0 ? `${fmt(result.savings)} per year` : "Sizing is already optimal"}
            </div>
            <p
              style={{
                ...REGULAR,
                fontSize: 12.5,
                color: MUTED_GREEN,
                margin: "8px 0 0",
                lineHeight: 1.6,
              }}
            >
              {result.savings > 0
                ? `Saved on this single instance by migrating at the right size. Storage: ${fmt(result.storageCost)}/mo included.`
                : "The observed load fits the current provisioning. No savings from rightsizing before migration."}
            </p>
            {freeEngine && (
              <p
                style={{
                  ...REGULAR,
                  fontSize: 11.5,
                  color: ACCENT_MID,
                  margin: "10px 0 0",
                  lineHeight: 1.5,
                }}
              >
                {db}: no license cost — prices shown are the total instance cost.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Assessment section ─────────────────────────────────────
function AssessmentSection() {
  const steps = [
    {
      time: "00:00",
      title: "Access granted",
      desc: "One read-only user per instance. Nothing is installed on the database server or the operating system.",
      Icon: IconKey,
    },
    {
      time: "00:20",
      title: "Inventory closed",
      desc: "Instances, versions, patch level, size and topology already visible, including what nobody knew existed.",
      Icon: IconList,
    },
    {
      time: "04:00",
      title: "Load window read",
      desc: "Native wait, session and capacity history retrieved, with peak separated from average.",
      Icon: IconActivity,
    },
    {
      time: "06:00",
      title: "Report in hand",
      desc: "Findings ordered by risk and cost, each with evidence, affected instance and suggested remediation.",
      Icon: IconFileText,
    },
  ];
  return (
    <section id="assessment" className="dc-sp" style={{ background: "#fff" }}>
      <div className="dc-in" style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        <div style={{ maxWidth: 700 }}>
          <p
            style={{
              ...REGULAR,
              fontSize: 13,
              color: MUTED_GREEN,
              margin: "0 0 14px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Assessment
          </p>
          <h2
            style={{
              ...EXPANDED,
              fontSize: "clamp(28px,3.2vw,44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.66px",
              color: INK,
              margin: "0 0 18px",
            }}
          >
            From first access to report on the same day
          </h2>
          <p style={{ ...REGULAR, fontSize: 17, lineHeight: 1.65, color: MUTED_GREEN, margin: 0 }}>
            Monitoring tools require an implementation project before they say anything. DataCaddy
            was built for the other case: arriving in an environment you don't know and delivering
            its portrait before end of day.
          </p>
        </div>
        <div className="dc-g4" style={{ borderTop: `2px solid ${INK}` }}>
          {steps.map((step, i) => {
            const { Icon } = step;
            return (
              <div
                key={step.title}
                className={i < 3 ? "dc-step-div" : ""}
                style={{
                  padding: "24px 22px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    left: 0,
                    width: 34,
                    height: 2,
                    background: "#b23a2c",
                  }}
                />
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <div style={{ color: ACCENT, opacity: 0.85 }}>
                    <Icon />
                  </div>
                  <span style={{ ...EXPANDED, fontSize: 13, color: MUTED_GREEN, opacity: 0.7 }}>
                    {step.time}
                  </span>
                </div>
                <h3
                  style={{
                    ...EXPANDED,
                    fontSize: 16,
                    letterSpacing: "-0.2px",
                    color: INK,
                    margin: 0,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    ...REGULAR,
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: MUTED_GREEN,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Coverage section ───────────────────────────────────────
function CoverageSection() {
  const dbs = [
    {
      name: "Oracle",
      desc: "11g to 23ai, single instance and RAC. Collection that requires no Diagnostics or Tuning Pack — no exposure in licensing audits.",
    },
    {
      name: "SQL Server",
      desc: "2012 onwards, including Always On and Managed Instance. Reads DMVs, Query Store and server configuration.",
    },
    {
      name: "PostgreSQL",
      desc: "12 onwards, self-managed or as a managed service. Native statistics, installed extensions and effective parameters.",
    },
    {
      name: "MySQL",
      desc: "5.7 and 8.x, with MariaDB on the same collector. Performance schema, replication and session variables.",
    },
  ];
  const principles = [
    {
      title: "No agent",
      desc: "The collector talks to the database over the network, like any application. Nothing is installed on the server, and nothing runs as root.",
    },
    {
      title: "Read-only",
      desc: "No write commands, no business data read. Only metadata, statistics and configuration — with a record of everything accessed.",
    },
    {
      title: "Where you prefer",
      desc: "Managed service or installed inside your network, for environments that cannot send telemetry outside.",
    },
  ];
  return (
    <section className="dc-sp" style={{ background: SAGE }}>
      <div className="dc-in" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        <div style={{ maxWidth: 700 }}>
          <p
            style={{
              ...REGULAR,
              fontSize: 13,
              color: MUTED_GREEN,
              margin: "0 0 14px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Coverage
          </p>
          <h2
            style={{
              ...EXPANDED,
              fontSize: "clamp(28px,3.2vw,44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.66px",
              color: INK,
              margin: "0 0 18px",
            }}
          >
            One card for the entire estate
          </h2>
          <p style={{ ...REGULAR, fontSize: 17, lineHeight: 1.65, color: MUTED_GREEN, margin: 0 }}>
            The four databases that underpin most enterprise environments, read through each
            engine's own views and catalogs.
          </p>
        </div>
        <div className="dc-g4" style={{ gap: 1, background: "#c7d0c5" }}>
          {dbs.map((db) => (
            <div
              key={db.name}
              style={{
                background: "#edf0ea",
                padding: "25px 24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <h3 style={{ ...EXPANDED, fontSize: 21, color: INK, margin: 0 }}>{db.name}</h3>
              <p
                style={{
                  ...REGULAR,
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: MUTED_GREEN,
                  margin: 0,
                }}
              >
                {db.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="dc-g3" style={{ gap: 36 }}>
          {principles.map((p) => (
            <div
              key={p.title}
              style={{
                borderTop: `1px solid ${SAGE}`,
                paddingTop: 18,
                display: "flex",
                flexDirection: "column",
                gap: 9,
              }}
            >
              <h3
                style={{
                  ...EXPANDED,
                  fontSize: 16,
                  letterSpacing: "-0.25px",
                  color: INK,
                  margin: 0,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{ ...REGULAR, fontSize: 14, lineHeight: 1.6, color: MUTED_GREEN, margin: 0 }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA section ────────────────────────────────────────────
function CTASection() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  return (
    <section id="get-assessment" style={{ position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imgGolfCourse})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg,rgba(21,42,11,0.97) 0%,rgba(21,42,11,0.93) 45%,rgba(21,42,11,0.74) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: subgrid,
          backgroundSize: "96px 96px",
          pointerEvents: "none",
        }}
      />
      <div
        className="dc-sp dc-in"
        style={{
          position: "relative",
          paddingTop: "clamp(72px,10vw,112px)",
          paddingBottom: "clamp(72px,10vw,112px)",
        }}
      >
        <div className="dc-cta-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <h2
              style={{
                ...EXPANDED,
                fontSize: "clamp(30px,3.8vw,50px)",
                lineHeight: 1.06,
                letterSpacing: "-0.8px",
                color: CREAM,
                margin: 0,
              }}
            >
              Bring an environment. We'll return the card.
            </h2>
            <p style={{ ...REGULAR, fontSize: 17, lineHeight: 1.65, color: TEXT_LIGHT, margin: 0 }}>
              A complimentary assessment on up to five instances: workload, configuration, security
              and the right size for each one. No installation required.
            </p>
            <ContactForm onOpenPrivacy={() => setPrivacyOpen(true)} />
          </div>
        </div>
      </div>
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        background: "#0d2010",
        padding: "40px max(4vw,20px)",
        borderTop: "1px solid rgba(199,208,197,0.08)",
      }}
    >
      <div className="dc-in dc-foot">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LogoMark color="rgba(199,208,197,0.5)" size={26} />
          <span
            style={{
              ...REGULAR,
              fontVariationSettings: '"wdth" 125',
              fontWeight: 300,
              fontSize: 18,
              color: "rgba(199,208,197,0.6)",
              letterSpacing: "-0.35px",
            }}
          >
            Data<span style={{ fontWeight: 700 }}>Caddy</span>
          </span>
          {/* The brand is DataCaddy; the LLC operates it. A hairline rule and
              quieter type encode that relationship instead of setting the two
              names up as peers. */}
          <span
            aria-hidden="true"
            style={{ width: 1, height: 18, background: "rgba(199,208,197,0.22)", margin: "0 4px" }}
          />
          <span
            style={{
              ...REGULAR,
              fontSize: 11.5,
              letterSpacing: "0.06em",
              color: "rgba(199,208,197,0.42)",
              whiteSpace: "nowrap",
            }}
          >
            ASO TECH GLOBAL. LLC
          </span>
        </div>
        <span style={{ ...REGULAR, fontSize: 12.5, color: "rgba(199,208,197,0.38)" }}>
          Oracle · SQL Server · PostgreSQL · MySQL
        </span>
        <a
          href="mailto:info@datacaddy.co"
          style={{
            ...REGULAR,
            fontSize: 12.5,
            color: "rgba(199,208,197,0.38)",
            textDecoration: "none",
          }}
        >
          info@datacaddy.co
        </a>
      </div>
    </footer>
  );
}

// ── Root ───────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <ResponsiveStyles />
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div style={{ minHeight: "100%", overflowX: "hidden" }}>
        <Hero onOpenMenu={() => setMenuOpen(true)} />
        <CollectSection />
        <RightsizingSection />
        <MigrationSection />
        <AssessmentSection />
        <CoverageSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
