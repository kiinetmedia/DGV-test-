import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import * as topojson from "topojson-client";

// @ts-ignore — Vite handles JSON imports natively
import worldData from "world-atlas/countries-110m.json";

/* ═══════════════════════════════════════════════ CONSTANTS ══ */
const W = 2000;
const H = 1000;
const CHAMPAGNE = "#D7BE8A";
const MAP_BG    = "oklch(0.082 0.012 42)";
const LAND_BASE = "oklch(0.148 0.010 44)";
const LAND_HI   = "oklch(0.200 0.012 46)";
const SERVED_F  = "#D7BE8A";
const SERVED_FH = "#E5CFA4";

/* ════════════════════════════════ GEOGRAPHIC PROJECTION ══ */
/* equirectangular: x = (lon+180)/360*W, y = (90-lat)/180*H */
function ringToPath(ring: [number, number][]): string {
  return (
    ring
      .map(([lon, lat], i) => {
        const x = ((lon + 180) / 360) * W;
        const y = ((90 - lat) / 180) * H;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

function featureToSVGPath(feature: { geometry: { type: string; coordinates: unknown } }): string {
  const geo = feature.geometry;
  if (!geo) return "";
  if (geo.type === "Polygon") {
    return (geo.coordinates as [number, number][][]).map(ringToPath).join(" ");
  }
  if (geo.type === "MultiPolygon") {
    return (geo.coordinates as [number, number][][][])
      .map((poly) => poly.map(ringToPath).join(" "))
      .join(" ");
  }
  return "";
}

/* ═══════════════════════════════════ MAP DATA (module-level) ══ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo        = worldData as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const landFC      = topojson.feature(topo, topo.objects.land) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countriesFC = topojson.feature(topo, topo.objects.countries) as any;

/* eslint-disable @typescript-eslint/no-explicit-any */
// world-atlas land is a GeometryCollection → feature() returns a FeatureCollection
const LAND_PATH = featureToSVGPath(
  (landFC as any).features?.[0] ?? landFC
);

const ISO_CODES: Record<string, number> = {
  india: 356, "sri-lanka": 144, malaysia: 458,
  kuwait: 414, uae: 784, switzerland: 756,
  uk: 826, usa: 840, kenya: 404,
  "south-africa": 710, australia: 36,
  bangladesh: 50, nepal: 524, netherlands: 528,
  italy: 380, france: 250, canada: 124,
};

const COUNTRY_PATHS: Record<string, string> = {};
(countriesFC as any).features.forEach((f: any) => {
  const id = parseInt(f.id, 10);
  for (const [key, code] of Object.entries(ISO_CODES)) {
    if (id === code) {
      COUNTRY_PATHS[key] = featureToSVGPath(f);
    }
  }
});
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ═══════════════════════════════════════════ DATA TYPES ══ */
type ServedCountry = {
  id: string;
  name: string;
  isHQ: boolean;
  centroid: [number, number]; // [lat, lon]
  routeDelay: number;
};

const SERVED: ServedCountry[] = [
  { id: "india",        name: "India",                isHQ: true,  centroid: [20.5,  78.9],  routeDelay: 0    },
  { id: "sri-lanka",    name: "Sri Lanka",             isHQ: false, centroid: [7.9,   80.7],  routeDelay: 0.3  },
  { id: "malaysia",     name: "Malaysia",              isHQ: false, centroid: [4.2,  109.7],  routeDelay: 0.5  },
  { id: "kuwait",       name: "Kuwait",                isHQ: false, centroid: [29.3,  47.5],  routeDelay: 0.2  },
  { id: "uae",          name: "United Arab Emirates",  isHQ: false, centroid: [24.0,  54.0],  routeDelay: 0.25 },
  { id: "switzerland",  name: "Switzerland",           isHQ: false, centroid: [46.8,   8.2],  routeDelay: 0.7  },
  { id: "uk",           name: "United Kingdom",        isHQ: false, centroid: [54.0,  -2.0],  routeDelay: 0.75 },
  { id: "usa",          name: "United States",         isHQ: false, centroid: [38.0, -97.0],  routeDelay: 1.1  },
  { id: "kenya",        name: "Kenya",                 isHQ: false, centroid: [0.0,   37.9],  routeDelay: 0.6  },
  { id: "south-africa", name: "South Africa",          isHQ: false, centroid: [-28.5, 24.7],  routeDelay: 0.8  },
  { id: "australia",    name: "Australia",             isHQ: false, centroid: [-25.0, 133.0], routeDelay: 0.9  },
  { id: "bangladesh",   name: "Bangladesh",            isHQ: false, centroid: [23.7,   90.4], routeDelay: 0.35 },
  { id: "nepal",        name: "Nepal",                 isHQ: false, centroid: [28.4,   84.1], routeDelay: 0.32 },
  { id: "netherlands",  name: "Netherlands",           isHQ: false, centroid: [52.1,    5.3], routeDelay: 0.78 },
  { id: "italy",        name: "Italy",                 isHQ: false, centroid: [41.9,   12.6], routeDelay: 0.72 },
  { id: "france",       name: "France",                isHQ: false, centroid: [46.2,    2.2], routeDelay: 0.74 },
  { id: "canada",       name: "Canada",                isHQ: false, centroid: [60.0,  -96.8], routeDelay: 1.15 },
];

/* ═══════════════════════════════════════════ CENTROID XY ══ */
function toXY(lat: number, lon: number) {
  return {
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  };
}

/* ═══════════════════════════════════════════ ARC PATHS ══ */
const { x: INDIA_X, y: INDIA_Y } = toXY(20.5, 78.9);

function arcPath(lat: number, lon: number): string {
  const { x: tx, y: ty } = toXY(lat, lon);
  const dist = Math.hypot(tx - INDIA_X, ty - INDIA_Y);
  const mx   = (INDIA_X + tx) / 2;
  const my   = Math.max(15, (INDIA_Y + ty) / 2 - dist * 0.24);
  return `M${INDIA_X.toFixed(1)},${INDIA_Y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`;
}

const ROUTE_PATHS: Record<string, string> = {};
SERVED.forEach((c) => {
  if (!c.isHQ) {
    ROUTE_PATHS[c.id] = arcPath(c.centroid[0], c.centroid[1]);
  }
});

/* ═══════════════════════════════════════ MARKER COMPONENT ══ */
type MarkerProps = {
  cx: number; cy: number;
  isHQ: boolean; hovered: boolean;
  inView: boolean; reduced: boolean; delay: number;
};

function Marker({ cx, cy, isHQ, hovered, inView, reduced, delay }: MarkerProps) {
  const R = isHQ ? 11 : 7;
  const D = isHQ ? 4.5 : 2.8;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* Outer ring */}
      <motion.circle
        cx={cx} cy={cy} r={R}
        fill="none"
        stroke={CHAMPAGNE}
        animate={{
          strokeWidth:   hovered ? 1.6 : (isHQ ? 1.0 : 0.75),
          strokeOpacity: hovered ? 1.0 : (isHQ ? 0.80 : 0.52),
          r:             hovered ? R * 1.2 : R,
        }}
        transition={{ duration: 0.22 }}
      />
      {/* Center dot */}
      <motion.circle
        cx={cx} cy={cy} r={D}
        fill={CHAMPAGNE}
        animate={{ fillOpacity: hovered ? 1 : (isHQ ? 0.95 : 0.78) }}
        transition={{ duration: 0.22 }}
      />
      {/* HQ pulse ring — suppressed under reduced motion */}
      {isHQ && !reduced && (
        <motion.circle
          cx={cx} cy={cy} r={R}
          fill="none" stroke={CHAMPAGNE} strokeWidth={0.6}
          initial={{ scale: 0.9, opacity: 0.4 }}
          animate={inView ? { scale: [0.9, 2.8, 2.8], opacity: [0.4, 0, 0] } : {}}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeOut",
            times: [0, 0.72, 1],
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      )}
      {/* Hit area */}
      <circle cx={cx} cy={cy} r={R + 22} fill="transparent" />
    </motion.g>
  );
}

/* ═══════════════════════════════════════════ LABEL SYSTEM ══ */
// SVG font size → ~12.3px at 0.558 container scale
const PILL_FS   = 22;
const PILL_PH   = 10;  // horizontal padding SVG units (≈5.6px screen)
const PILL_PV   = 6;   // vertical padding SVG units   (≈3.3px screen)
const PILL_H    = PILL_FS + PILL_PV * 2;
const LABEL_COL = "rgba(232,220,196,.95)";
const PILL_BG   = "rgba(10,10,10,.55)";

// Estimate pill width from label string (Inter all-caps at PILL_FS)
function pillW(label: string): number {
  const charW = label.split("").reduce((s, c) => s + (c === " " ? 7 : 13.4), 0);
  const gaps  = Math.max(0, label.length - 1) * (PILL_FS * 0.12);
  return charW + gaps + PILL_PH * 2;
}

type LabelCfg = {
  id: string; label: string; tier: 1 | 2 | 3;
  ax: number; ay: number;   // pill center in SVG coords
  lx?: number; ly?: number; // leader line endpoint at marker
};

// Label centers: large countries get labels ON the territory; small countries
// get labels just outside with a short white dashed leader to the marker.
// All use textAnchor="middle" so ax is the visual center of the pill.
// Positions in 2000×1000 equirectangular SVG.
const LABEL_CFGS: LabelCfg[] = [
  // Large territories — label on the country body
  { id: "india",        label: "INDIA",        tier: 1, ax: 1440, ay: 350,  lx: 1438, ly: 382 },
  { id: "usa",          label: "USA",          tier: 2, ax: 475,  ay: 255,  lx: 461,  ly: 284 },
  { id: "australia",    label: "AUSTRALIA",    tier: 2, ax: 1710, ay: 604,  lx: 1739, ly: 636 },
  { id: "canada",       label: "CANADA",       tier: 2, ax: 462,  ay: 140,  lx: 462,  ly: 164 },
  { id: "south-africa", label: "SOUTH AFRICA", tier: 3, ax: 1140, ay: 628,  lx: 1140, ly: 656 },
  // European cluster — fanned out with dashed leaders (UK above, Netherlands above-right,
  // France left, Switzerland right, Italy below)
  { id: "uk",           label: "UK",           tier: 2, ax: 940,  ay: 108,  lx: 986,  ly: 196 },
  { id: "netherlands",  label: "NETHERLANDS",  tier: 3, ax: 1100, ay: 156,  lx: 1030, ly: 207 },
  { id: "france",       label: "FRANCE",       tier: 3, ax: 872,  ay: 244,  lx: 1010, ly: 243 },
  { id: "switzerland",  label: "SWITZERLAND",  tier: 3, ax: 1160, ay: 232,  lx: 1048, ly: 238 },
  { id: "italy",        label: "ITALY",        tier: 3, ax: 1100, ay: 312,  lx: 1072, ly: 268 },
  // Middle East
  { id: "kuwait",       label: "KUWAIT",       tier: 3, ax: 1230, ay: 306,  lx: 1262, ly: 334 },
  { id: "uae",          label: "UAE",          tier: 3, ax: 1360, ay: 400,  lx: 1310, ly: 366 },
  // South Asia — Nepal above India cluster, Bangladesh to the right
  { id: "nepal",        label: "NEPAL",        tier: 3, ax: 1500, ay: 298,  lx: 1470, ly: 336 },
  { id: "bangladesh",   label: "BANGLADESH",   tier: 3, ax: 1630, ay: 368,  lx: 1510, ly: 368 },
  // Africa
  { id: "kenya",        label: "KENYA",        tier: 3, ax: 1205, ay: 466,  lx: 1212, ly: 496 },
  // Southeast Asia / Indian Ocean
  { id: "sri-lanka",    label: "SRI LANKA",    tier: 3, ax: 1512, ay: 454,  lx: 1454, ly: 456 },
  { id: "malaysia",     label: "MALAYSIA",     tier: 3, ax: 1645, ay: 524,  lx: 1610, ly: 482 },
];

type LabelProps = { cfg: LabelCfg; hovered: boolean; inView: boolean; reduced: boolean };

function CountryLabel({ cfg, hovered, inView, reduced }: LabelProps) {
  const { label, tier, ax, ay, lx, ly } = cfg;
  const pw   = pillW(label);
  const base = tier === 1 ? 0.92 : tier === 2 ? 0.84 : 0.76;
  const dl   = reduced ? 0 : tier === 1 ? 0.9 : tier === 2 ? 1.1 : 1.4;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: hovered ? 1 : base } : { opacity: 0 }}
      transition={{
        duration: reduced ? 0 : hovered ? 0.18 : 0.45,
        delay:    reduced ? 0 : hovered ? 0    : dl,
      }}
      style={{ pointerEvents: "none" }}
    >
      {/* Leader line — white dashed so it reads against both land and country fill */}
      {lx !== undefined && ly !== undefined && (
        <line
          x1={ax} y1={ay} x2={lx} y2={ly}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={1.2}
          strokeDasharray="5 3"
          strokeOpacity={hovered ? 0.90 : 0.60}
        />
      )}
      {/* Dark pill background */}
      <rect
        x={ax - pw / 2}
        y={ay - PILL_H / 2}
        width={pw}
        height={PILL_H}
        rx={PILL_H / 2}
        fill={PILL_BG}
      />
      {/* Label text */}
      <text
        x={ax} y={ay}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={LABEL_COL}
        fontSize={PILL_FS}
        fontFamily="var(--font-sans)"
        fontWeight={500}
        letterSpacing="0.12em"
      >
        {label}
      </text>
    </motion.g>
  );
}

/* ═══════════════════════════════════════════ MAIN EXPORT ══ */
export function GlobalPresence() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef     = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-6%" });
  const reduced    = useReducedMotion() ?? false;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [ww, setWw] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  useEffect(() => {
    const onResize = () => setWw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const showLabels = ww >= 1024;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const pX     = useSpring(mouseX, { stiffness: 35, damping: 18 });
  const pY     = useSpring(mouseY, { stiffness: 35, damping: 18 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const r = mapRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set(((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * 6);
    mouseY.set(((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * 6);
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Global Client Presence"
      className="relative py-12 md:py-20 overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-[30%_70%] lg:gap-6 items-start lg:items-stretch lg:min-h-[380px] xl:min-h-[560px]">

          {/* ── LEFT: Editorial content ───────────────── */}
          <div className="lg:pr-10 xl:pr-14 mb-10 lg:mb-0 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: reduced ? 0 : 0.82, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Heading */}
              <h2
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "clamp(3rem, 4.8vw, 5.2rem)",
                  fontWeight:    400,
                  lineHeight:    0.9,
                  marginBottom:  "1.4rem",
                  letterSpacing: "-0.03em",
                  color:         "oklch(0.22 0.018 60)",
                } as React.CSSProperties}
              >
                One standard.
                <br />
                <em style={{
                  fontStyle:   "italic",
                  fontWeight:  400,
                  fontSize:    "0.86em",
                  color:       "oklch(0.50 0.042 64)",
                }}>
                  17 markets.
                </em>
              </h2>

              {/* Body */}
              <p
                style={{
                  maxWidth:     "26ch",
                  color:        "oklch(0.44 0.028 62)",
                  lineHeight:   1.7,
                  fontSize:     "0.9rem",
                  marginBottom: "1.8rem",
                }}
              >
                From our press rooms in India, DGV ships precision print and
                packaging to five continents — each delivery held to the same
                tolerance of colour, registration, and finish.
              </p>

              {/* KPI line — secondary, understated */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.72 }}
                style={{
                  fontFamily:    "var(--font-sans)",
                  fontSize:      "0.6rem",
                  fontWeight:    400,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color:         "oklch(0.46 0.022 62)",
                } as React.CSSProperties}
              >
                17 markets&ensp;·&ensp;5 continents&ensp;·&ensp;15+ years
              </motion.p>
            </motion.div>
          </div>

          {/* ── RIGHT: Map + mobile market list ─────────── */}
          <div className="flex flex-col gap-4 lg:[display:contents]">
          <motion.div
            ref={mapRef}
            className="h-[58vw] min-h-[280px] max-h-[520px] lg:h-full lg:max-h-none lg:min-h-0"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            style={{
              position:     "relative",
              borderRadius: "2rem",
              overflow:     "hidden",
              background:   MAP_BG,
              boxShadow: [
                "0 60px 120px oklch(0.04 0.010 42 / 0.7)",
                "0 20px 40px oklch(0.04 0.010 42 / 0.5)",
                "inset 0 1px 0 oklch(0.28 0.010 60 / 0.3)",
                "inset 0 0 100px oklch(0.05 0.008 42 / 0.5)",
              ].join(", "),
              border:      "1px solid oklch(0.22 0.008 60 / 0.5)",
              touchAction: "pan-y",
            }}
          >
            {/* Radial vignette (depth at edges) */}
            <div
              aria-hidden
              style={{
                position:       "absolute",
                inset:          0,
                pointerEvents:  "none",
                background:     "radial-gradient(ellipse 140% 80% at 50% 50%, transparent 38%, oklch(0.05 0.010 42 / 0.88) 100%)",
                zIndex:         2,
              }}
            />

            {/* Parallax SVG map */}
            <motion.div
              style={{
                x:          reduced ? 0 : pX,
                y:          reduced ? 0 : pY,
                willChange: reduced ? "auto" : "transform",
                height:     "100%",
              }}
            >
              <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid slice"
                style={{ width: "100%", height: "100%", display: "block", overflow: "hidden" }}
                aria-hidden="true"
                >
                  <defs>
                    {/* Soft relief shadow for land masses */}
                    <filter id="gpRelief" x="-3%" y="-3%" width="106%" height="106%">
                      <feDropShadow
                        dx="0" dy="-4" stdDeviation="5"
                        floodColor="oklch(0.30 0.012 55)"
                        floodOpacity="0.55"
                      />
                    </filter>
                    {/* Glow for served countries */}
                    <filter id="gpGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    {/* Stronger glow for HQ */}
                    <filter id="gpHQGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* ── L1: All landmasses — base dark layer ── */}
                  <motion.path
                    d={LAND_PATH}
                    fill={LAND_BASE}
                    stroke="oklch(0.24 0.010 46)"
                    strokeWidth={0.5}
                    strokeOpacity={0.5}
                    fillRule="evenodd"
                    filter="url(#gpRelief)"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: reduced ? 0 : 0.9, ease: "easeOut" }}
                  />

                  {/* ── L1b: Highlight pass — simulates top-lit terrain ── */}
                  <motion.path
                    d={LAND_PATH}
                    fill={LAND_HI}
                    fillOpacity={0.38}
                    fillRule="evenodd"
                    style={{ transform: "translateY(-2px)" }}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: reduced ? 0 : 1.0, delay: 0.06, ease: "easeOut" }}
                  />

                  {/* ── L2: Served country highlighted fills ── */}
                  {SERVED.map((c) => {
                    const path = COUNTRY_PATHS[c.id];
                    if (!path) return null;
                    const isH = hoveredId === c.id;
                    return (
                      <motion.path
                        key={`fill-${c.id}`}
                        d={path}
                        fill={isH ? SERVED_FH : SERVED_F}
                        fillRule="evenodd"
                        stroke={CHAMPAGNE}
                        strokeWidth={c.isHQ ? 1.4 : 0.8}
                        filter={isH ? "url(#gpHQGlow)" : (c.isHQ ? "url(#gpHQGlow)" : "url(#gpGlow)")}
                        onMouseEnter={() => setHoveredId(c.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{ cursor: "pointer" }}
                        initial={{ opacity: 0, fillOpacity: 0, strokeOpacity: 0 }}
                        animate={inView ? {
                          opacity:       1,
                          fillOpacity:   isH ? 0.88 : (c.isHQ ? 0.82 : 0.58),
                          strokeOpacity: isH ? 1.0  : (c.isHQ ? 0.85 : 0.55),
                        } : { opacity: 0, fillOpacity: 0, strokeOpacity: 0 }}
                        transition={{
                          opacity:       { duration: reduced ? 0 : 0.85, delay: reduced ? 0 : 0.28, ease: "easeOut" },
                          fillOpacity:   { duration: 0.28 },
                          strokeOpacity: { duration: 0.28 },
                        }}
                      />
                    );
                  })}

                  {/* ── L3: Route arcs from India ── */}
                  {SERVED.filter((c) => !c.isHQ).map((c) => {
                    const d       = ROUTE_PATHS[c.id];
                    if (!d) return null;
                    const isActive = hoveredId === c.id;
                    return (
                      <motion.path
                        key={`route-${c.id}`}
                        d={d}
                        fill="none"
                        stroke={CHAMPAGNE}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={
                          inView
                            ? {
                                pathLength:    1,
                                opacity:       1,
                                strokeWidth:   isActive ? 2.0 : 1.2,
                                strokeOpacity: isActive ? 0.72 : 0.20,
                              }
                            : { pathLength: 0, opacity: 0 }
                        }
                        transition={{
                          pathLength:    { duration: reduced ? 0 : 1.85, delay: reduced ? 0 : c.routeDelay, ease: [0.16, 1, 0.3, 1] },
                          opacity:       { duration: 0.4, delay: reduced ? 0 : c.routeDelay },
                          strokeWidth:   { duration: 0.28 },
                          strokeOpacity: { duration: 0.28 },
                        }}
                      />
                    );
                  })}

                  {/* ── L4: Precision markers ── */}
                  {SERVED.map((c) => {
                    const { x, y }   = toXY(c.centroid[0], c.centroid[1]);
                    const markerDelay = c.isHQ ? 0.55 : c.routeDelay + 1.65;
                    return (
                      <g
                        key={`marker-${c.id}`}
                        onMouseEnter={() => setHoveredId(c.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{ cursor: "pointer" }}
                      >
                        <Marker
                          cx={x} cy={y}
                          isHQ={c.isHQ}
                          hovered={hoveredId === c.id}
                          inView={inView}
                          reduced={reduced}
                          delay={markerDelay}
                        />
                      </g>
                    );
                  })}

                  {/* ── L5: Persistent country labels (desktop only — hidden < 1024 px) ── */}
                  {showLabels && LABEL_CFGS.map((cfg) => (
                    <CountryLabel
                      key={`lbl-${cfg.id}`}
                      cfg={cfg}
                      hovered={hoveredId === cfg.id}
                      inView={inView}
                      reduced={reduced}
                    />
                  ))}
                </svg>
            </motion.div>
          </motion.div>

          {/* Country chips — mobile / tablet only (hidden at lg+) */}
          <div className="lg:hidden flex flex-wrap gap-2 px-1">
            {SERVED.map((c) => (
              <span
                key={c.id}
                style={{
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           4,
                  padding:       "3px 12px",
                  borderRadius:  100,
                  background:    c.isHQ ? "oklch(0.20 0.016 58)" : "oklch(0.11 0.008 42)",
                  border:        `1px solid ${c.isHQ ? "#D7BE8A55" : "oklch(0.26 0.008 46)"}`,
                  color:         c.isHQ ? "#D7BE8A" : "oklch(0.60 0.018 62)",
                  fontSize:      "0.63rem",
                  fontWeight:    500,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase" as const,
                  fontFamily:    "var(--font-sans)",
                  whiteSpace:    "nowrap" as const,
                }}
              >
                {c.name}
                {c.isHQ && <span style={{ fontSize: "0.8em", opacity: 0.7 }}>★</span>}
              </span>
            ))}
          </div>

          </div>{/* end right wrapper */}

        </div>
      </div>
    </section>
  );
}
