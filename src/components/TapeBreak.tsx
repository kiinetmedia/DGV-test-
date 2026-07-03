/**
 * TapeBreak — full-width branded packaging tape divider.
 *
 * Visual layers (bottom to top):
 *   1. Tape body          — warm beige/kraft background
 *   2. Fiber texture      — horizontal turbulence → woven tape backing
 *   3. Grain texture      — fractal noise via SVG + mix-blend-mode:multiply
 *   4. Convexity gradient — tape reads as slightly curved/raised
 *   5. Gloss streak       — central catchlight strip (tape plastic sheen)
 *   6. Wrinkle streaks    — diagonal light reflections across tape length
 *   7. Edge adhesive      — left/right darkening
 *   8. Crease lines       — hairline shadow at top and bottom edge
 *   9. Logo strip         — DGV / COMPANY repeating with wide spacing + parallax
 *
 * Box-shadow: drop shadow below + catch-light above.
 * skewY(-0.15deg): "applied by hand" imperfection.
 */

import { useScroll, useTransform, useSpring, motion } from "motion/react";

/* ── Fiber texture (horizontal turbulence → woven tape backing) ───────────── */

const FIBER_URI = `data:image/svg+xml,${encodeURIComponent(
  [
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="80">`,
    `<filter id="f">`,
    `<feTurbulence type="turbulence" baseFrequency="0.0 0.72" numOctaves="2" seed="5"/>`,
    `<feColorMatrix values="0 0 0 0 0.26  0 0 0 0 0.17  0 0 0 0 0.07  0 0 0 0.13 0"/>`,
    `</filter>`,
    `<rect width="100%" height="100%" filter="url(#f)"/>`,
    `</svg>`,
  ].join("")
)}`;

/* ── Grain texture (fractal noise, multiply blend) ────────────────────────── */

const GRAIN_URI = `data:image/svg+xml,${encodeURIComponent(
  [
    `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="80">`,
    `<filter id="g">`,
    `<feTurbulence type="fractalNoise" baseFrequency="0.68 0.24" numOctaves="4" seed="17"/>`,
    `<feColorMatrix values="0 0 0 0 0.33  0 0 0 0 0.22  0 0 0 0 0.10  0 0 0 0.23 0"/>`,
    `</filter>`,
    `<rect width="100%" height="100%" filter="url(#g)"/>`,
    `</svg>`,
  ].join("")
)}`;

/* ── Logo instances ───────────────────────────────────────────────────────── */

const LOGO_COUNT = 20;

/* ── Component ──────────────────────────────────────────────────────────────── */

export function TapeBreak() {
  const { scrollY } = useScroll();

  const rawX = useTransform(scrollY, [0, 4000], [0, -80]);
  const x    = useSpring(rawX, { stiffness: 26, damping: 20, restDelta: 0.01 });

  return (
    <div
      aria-hidden
      className="relative w-full select-none pointer-events-none"
      style={{ isolation: "isolate" }}
    >

      {/* ── Tape body ────────────────────────────────────────────────── */}
      <div
        style={{
          height: "64px",
          position: "relative",
          overflow: "hidden",
          background: "oklch(0.872 0.043 76.5)",
          transform: "skewY(-0.15deg)",
          boxShadow: [
            "0 6px 28px oklch(0.22 0.018 60 / 0.15)",
            "0 2px 8px  oklch(0.22 0.018 60 / 0.11)",
            "0 -3px 12px oklch(0.22 0.018 60 / 0.06)",
            "inset 0  2px 0 oklch(1 0 0 / 0.32)",
            "inset 0 -2px 0 oklch(0.40 0.038 66 / 0.26)",
          ].join(", "),
        }}
      >

        {/* Layer 2 — Fiber (horizontal woven texture) */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            backgroundImage: `url("${FIBER_URI}")`,
            backgroundSize: "400px 80px",
            mixBlendMode: "multiply",
            opacity: 0.60,
          }}
        />

        {/* Layer 3 — Grain (fractal noise) */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            backgroundImage: `url("${GRAIN_URI}")`,
            backgroundSize: "280px 80px",
            mixBlendMode: "multiply",
            opacity: 0.50,
          }}
        />

        {/* Layer 4 — Convexity: tape bowed outward */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
            background:
              "linear-gradient(to bottom, oklch(1 0 0 / 0.15) 0%, oklch(1 0 0 / 0.03) 35%, oklch(1 0 0 / 0.03) 65%, oklch(0.30 0.028 60 / 0.10) 100%)",
          }}
        />

        {/* Layer 5 — Central gloss streak (plastic sheen of tape surface) */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
            background:
              "linear-gradient(to bottom, transparent 20%, oklch(1 0 0 / 0.08) 38%, oklch(1 0 0 / 0.13) 50%, oklch(1 0 0 / 0.08) 62%, transparent 80%)",
          }}
        />

        {/* Layer 6 — Wrinkle light streaks (diagonal, sparse) */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
            background: [
              "linear-gradient(104deg, transparent 8%,  oklch(1 0 0 / 0.12) 11%,  oklch(1 0 0 / 0.04) 13%, transparent 16%)",
              "linear-gradient(100deg, transparent 27%, oklch(1 0 0 / 0.08) 30%,  transparent 33%)",
              "linear-gradient(103deg, transparent 49%, oklch(1 0 0 / 0.11) 52%,  oklch(1 0 0 / 0.03) 54%, transparent 57%)",
              "linear-gradient(101deg, transparent 70%, oklch(1 0 0 / 0.08) 73%,  transparent 76%)",
              "linear-gradient(102deg, transparent 86%, oklch(1 0 0 / 0.06) 88.5%,transparent 91%)",
            ].join(", "),
          }}
        />

        {/* Layer 7 — Adhesive edge darkening */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
            background:
              "linear-gradient(to right, " +
              "oklch(0.52 0.044 66 / 0.32) 0%, " +
              "oklch(0.68 0.040 68 / 0.10) 1.6%, " +
              "transparent 4%, " +
              "transparent 96%, " +
              "oklch(0.68 0.040 68 / 0.10) 98.4%, " +
              "oklch(0.52 0.044 66 / 0.32) 100%)",
          }}
        />

        {/* Layer 8a — Top crease */}
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: 0,
            height: "4px", zIndex: 7, pointerEvents: "none",
            background: "linear-gradient(to bottom, oklch(0.40 0.044 65 / 0.38), transparent)",
          }}
        />

        {/* Layer 8b — Bottom crease */}
        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0,
            height: "4px", zIndex: 7, pointerEvents: "none",
            background: "linear-gradient(to top, oklch(0.40 0.044 65 / 0.38), transparent)",
          }}
        />

        {/* Layer 9 — Logo strip with horizontal scroll parallax */}
        <motion.div
          style={{
            x,
            willChange: "transform",
            position: "absolute",
            top: 0, bottom: 0,
            left: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "160px",
            paddingLeft: "100px",
          }}
        >
          {Array.from({ length: LOGO_COUNT }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                flexShrink: 0,
              }}
            >
              {/* DGV — matches nav logo weight/tracking */}
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "17px",
                  fontWeight: 400,
                  letterSpacing: "0.26em",
                  color: "oklch(0.20 0.058 54)",
                  textShadow:
                    "0  1px 0 oklch(1 0 0 / 0.38), " +
                    "0 -1px 0 oklch(0.10 0.022 54 / 0.32)",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                DGV
              </span>
              {/* COMPANY — matches nav sub-label */}
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "6.5px",
                  fontWeight: 400,
                  letterSpacing: "0.44em",
                  textTransform: "uppercase",
                  color: "oklch(0.34 0.048 60)",
                  textShadow: "0 0.6px 0 oklch(1 0 0 / 0.28)",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                COMPANY
              </span>
            </div>
          ))}
        </motion.div>

      </div>

    </div>
  );
}
