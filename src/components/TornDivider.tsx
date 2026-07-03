import { useMemo } from "react";
import { motion } from "motion/react";

/*
 * TornDivider v2 — ultra-realistic torn paper section separator.
 *
 * Approach:
 *   1. Dense polyline path (every 3 px ≈ 480 points) built from a sum-of-sines
 *      noise function — produces the multi-scale, irregular character of real
 *      paper fibre without requiring an external noise library.
 *   2. SVG feTurbulence → feDisplacementMap → feMorphology filter adds sub-pixel
 *      micro-roughness and grows thin wispy fibre strands at the tear edge.
 *   3. Direction-aware drop-shadow for layered depth.
 *   4. whileInView spring settle (paper drifts into place on scroll).
 */

/* ─── Noise / path generation ──────────────────────────────────────────────── */

function computeTear(
  seed: number,
  flip: boolean
): { fill: string; edge: string } {
  const W = 1440;
  const H = 80;
  const STEP = 3; // 1 point every 3 px → ~481 points

  /* Tear baseline: further from the edge so there is paper above/below */
  const base = H * (flip ? 0.34 : 0.60);

  const xs: number[] = [];
  const ys: number[] = [];

  for (let i = 0; i * STEP <= W; i++) {
    const x = Math.min(i * STEP, W);
    const t = x / W; // 0 → 1

    /*
     * Sum-of-sines "fBm" — 6 octaves:
     *   low freq  → macro tear trajectory (which way the paper wants to tear)
     *   mid freq  → medium undulation (fibre groups)
     *   high freq → individual fibre tips (rough edge texture)
     */
    const y =
      base +
      Math.sin(t * 8.3   + seed * 2.73)  * 9.0  + // macro shape
      Math.sin(t * 22.9  + seed * 9.17)  * 5.0  + // medium undulation
      Math.sin(t * 59.1  + seed * 4.31)  * 3.2  + // coarse fibre groups
      Math.sin(t * 151.7 + seed * 14.73) * 2.1  + // fine fibres
      Math.sin(t * 389.3 + seed * 7.29)  * 1.4  + // very fine
      Math.sin(t * 1001.7+ seed * 19.11) * 0.7;   // surface micro-texture

    xs.push(x);
    ys.push(Math.max(6, Math.min(H - 6, y)));
  }

  const pts = xs.map((x, i) => `${x},${ys[i].toFixed(1)}`);
  const line = pts.join(" L ");

  return {
    /* Closed fill shape */
    fill: flip
      ? `M0,${H} L${line} L${W},${H} Z`
      : `M0,0 L${line} L${W},0 Z`,
    /* Open polyline for the edge hairline */
    edge: `M${pts[0]} L${pts.slice(1).join(" L ")}`,
  };
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

type Variant = 1 | 2 | 3;

/* Distinct seeds give visually different tear characters per variant */
const SEEDS: Record<Variant, number> = {
  1: 1.414, // √2 — clean, receipt-like
  2: 3.718, // e  — organic, handmade
  3: 7.182, // 2π/something — archival, asymmetric
};

interface TornDividerProps {
  /** CSS colour matching the section whose paper is tearing (normally the section above) */
  fill: string;
  /** CSS colour for the divider container background (normally the section below) */
  bg?: string;
  /** Flip 180° so the torn edge points upward */
  flip?: boolean;
  /** Tear character variant */
  variant?: Variant;
  className?: string;
}

export function TornDivider({
  fill,
  bg = "transparent",
  flip = false,
  variant = 1,
  className = "",
}: TornDividerProps) {
  const seed = SEEDS[variant];

  /* Deterministic paths — stable across SSR + hydration */
  const { fill: fillPath, edge: edgePath } = useMemo(
    () => computeTear(seed, flip),
    [seed, flip]
  );

  /*
   * Unique-enough filter ID: variant + orientation.
   * Same variant + flip combo shares the same filter (identical params → fine).
   */
  const fid = `torn-${variant}-${flip ? "f" : "n"}`;

  /* Shadow direction tracks the tear orientation */
  const shadow = flip
    ? "drop-shadow(0 -6px 24px rgba(26,16,8,0.18)) drop-shadow(0 -2px 7px rgba(26,16,8,0.10))"
    : "drop-shadow(0 6px 24px rgba(26,16,8,0.18)) drop-shadow(0 2px 7px rgba(26,16,8,0.10))";

  return (
    <motion.div
      aria-hidden
      /* Paper drifts gently into its resting position as the section scrolls into view */
      initial={{ y: flip ? -14 : 14 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, amount: 0.85 }}
      transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      className={`relative pointer-events-none select-none ${className}`}
      style={{ background: bg, height: 80, zIndex: 2, overflow: "visible" }}
    >
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          filter: shadow,
          display: "block",
        }}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id={fid}
            /* Generous filter region so displaced fibre strands are not clipped */
            x="-4%" y="-60%"
            width="108%" height="220%"
          >
            {/*
             * Fine turbulence: high Y frequency (1.4) generates thin vertical
             * fibre strands; low X frequency (0.04) varies their density
             * naturally across the width.
             */}
            <feTurbulence
              type="turbulence"
              baseFrequency="0.035 1.4"
              numOctaves="4"
              seed={Math.round(seed * 23)}
              result="fbr"
            />
            {/*
             * feDisplacementMap moves pixels along the fibre direction.
             * scale=4 → up to 4 user-units of displacement (≈4 px at 1440 width).
             */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="fbr"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dis"
            />
            {/*
             * Dilate ONLY vertically (rx=0, ry=2) to grow the fibre fringe
             * perpendicular to the tear without widening the body horizontally.
             */}
            <feMorphology
              operator="dilate"
              radius="0 2"
              in="dis"
              result="mor"
            />
            {/* Soften fibre tips so they taper naturally */}
            <feGaussianBlur stdDeviation="0.45" in="mor" />
          </filter>
        </defs>

        {/* ── Main paper fill — dense noise shape + fibre filter ── */}
        <path
          d={fillPath}
          style={{ fill }}
          filter={`url(#${fid})`}
        />

        {/*
         * Hairline edge shadow — a thin stroke tracing the exact tear line.
         * Visible even when fill == bg (same-colour transitions) — creates
         * the "layered paper" depth through shadow alone.
         */}
        <path
          d={edgePath}
          fill="none"
          stroke="rgba(26,16,8,0.06)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
