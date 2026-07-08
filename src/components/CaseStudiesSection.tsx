import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ─── Spring configs ─── */
const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const SPRING_GENTLE = { type: "spring" as const, stiffness: 200, damping: 32 };

/* ─── Modal grain (retained for overlay) ─── */
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='csg'><feTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.38 0 0 0 0 0.28 0 0 0 0 0.18 0 0 0 0.13 0'/></filter><rect width='100%25' height='100%25' filter='url(%23csg)'/></svg>")`;

/* ─── Premium folder texture system ────────────────────────────────────────
   Five independent SVG noise layers, each targeting a different material
   property. Combined via mix-blend-mode, they simulate:
     PAPER_GRAIN  — fine cross-fiber structure (handmade/cotton paper feel)
     VERT_GRAIN   — directional press grain (mould-made sheet texture)
   Each has a light and dark variant tuned to the paper stock's fiber color.
   ─────────────────────────────────────────────────────────────────────── */

// Fine fiber grain — warm archival ivory stock (cotton-rag paper feel)
const PAPER_GRAIN_LIGHT = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='pgl'><feTurbulence type='fractalNoise' baseFrequency='0.65 0.52' numOctaves='4' seed='2'/><feColorMatrix values='0 0 0 0 0.44 0 0 0 0 0.32 0 0 0 0 0.18 0 0 0 0.090 0'/></filter><rect width='100%25' height='100%25' filter='url(%23pgl)'/></svg>")`;

// Fine fiber grain — espresso / black-dyed stock (warm fibers catch ambient light)
const PAPER_GRAIN_DARK = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='pgd'><feTurbulence type='fractalNoise' baseFrequency='0.60 0.46' numOctaves='4' seed='11'/><feColorMatrix values='0 0 0 0 0.68 0 0 0 0 0.52 0 0 0 0 0.30 0 0 0 0.115 0'/></filter><rect width='100%25' height='100%25' filter='url(%23pgd)'/></svg>")`;

// Vertical press grain — directional mould-made surface (light stock)
const VERT_GRAIN_LIGHT = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='380' height='380'><filter id='vgl'><feTurbulence type='fractalNoise' baseFrequency='0.016 0.72' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.38 0 0 0 0 0.28 0 0 0 0 0.16 0 0 0 0.052 0'/></filter><rect width='100%25' height='100%25' filter='url(%23vgl)'/></svg>")`;

// Vertical press grain — dark dyed stock (amber fiber direction visible)
const VERT_GRAIN_DARK = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='380' height='380'><filter id='vgd'><feTurbulence type='fractalNoise' baseFrequency='0.014 0.68' numOctaves='2' seed='9'/><feColorMatrix values='0 0 0 0 0.65 0 0 0 0 0.50 0 0 0 0 0.28 0 0 0 0.068 0'/></filter><rect width='100%25' height='100%25' filter='url(%23vgd)'/></svg>")`;

/* ─── Types ─── */
type Stat = { label: string; value: string };

type CaseStudy = {
  id: string;
  client: string;
  industry: string;
  year: string;
  tagline: string;
  service: string;
  problem: string;
  process: string;
  solution: string;
  deliverables: string[];
  outcome: string;
  stats: Stat[];
  dark: boolean;
};

/* ─── Data ─── */
const STUDIES: CaseStudy[] = [
  {
    id: "PHR-2024-001",
    client: "Leading Pharmaceutical Company",
    industry: "Pharmaceutical",
    year: "2026",
    tagline: "10,000+ individually personalised executive diaries — name-accurate, nationwide, on time.",
    service: "Corporate Gifting · Print",
    dark: false,
    problem:
      "A leading pharmaceutical company needed to move beyond generic corporate gifting for its annual doctor engagement programme — personalising over 10,000 executive diaries with individual doctor names and distributing desk and wall calendars nationwide, all within a hard pre-year-end deadline across multiple cities and regions.",
    process:
      "DGV built a variable data printing pipeline with multi-level name verification at every stage. Data files were validated, reformatted, and cross-checked before press. A dedicated project management team ran region-wise packing and dispatch planning in parallel with production to protect the year-end timeline.",
    solution:
      "Premium executive diaries individually variable-printed with each doctor's name, backed by rigorous multi-stage accuracy verification. Complemented by high-quality desk and wall calendars, all securely packed for region-specific nationwide distribution — managed end-to-end from planning through delivery.",
    deliverables: [
      "10,000+ premium executive diaries with personalised names",
      "Variable data printing — individual doctor-name customisation",
      "Multi-level verification process for name accuracy",
      "High-quality desk calendars",
      "Wall calendars for nationwide distribution",
      "Region-wise secure packing and dispatch planning",
      "Centralised project management across the full production cycle",
    ],
    outcome:
      "Over 10,000 personalised diaries delivered with high name accuracy before the new year. Healthcare professionals across India responded positively to the premium presentation and personalised approach. The diaries served as a year-long brand touchpoint, strengthening the client's relationships with its medical network and enhancing brand recall throughout the year.",
    stats: [
      { label: "Diaries personalised", value: "10K+" },
      { label: "Distribution", value: "Pan India" },
      { label: "Delivery", value: "On Time" },
    ],
  },
  {
    id: "RTL-2024-001",
    client: "Leading Corporate Organisation",
    industry: "Retail & Corporate",
    year: "2024",
    tagline: "Branded marketing collateral coordinated nationwide — consistent quality, centralised execution, on schedule.",
    service: "Commercial Print · Logistics",
    dark: true,
    problem:
      "A leading corporate organisation planned a nationwide retailer engagement campaign requiring large volumes of branded marketing collateral within a tight turnaround period. The project demanded consistent print quality, centralised coordination, and timely delivery across multiple territories — with no room for brand inconsistency between locations.",
    process:
      "DGV took ownership of the full execution process — managing the print production schedule and coordinating logistics planning in parallel. A centralised dispatch framework ensured brand-consistent collateral reached each territory on time without requiring the client to manage multiple vendor relationships.",
    solution:
      "A complete branded collateral suite — estimate pads, product information sheets, dealer communication materials, and promotional print — produced with consistent colour fidelity across all print runs. Logistics and dispatch managed centrally to eliminate territory-level coordination gaps.",
    deliverables: [
      "Estimate pads for field sales teams",
      "Product information sheets",
      "Dealer communication materials",
      "Promotional print collateral",
      "Centralised logistics and dispatch coordination",
      "Consistent branding across all materials and territories",
    ],
    outcome:
      "Successful rollout across multiple territories with consistent branding throughout. Dealers and field teams reported positive feedback on material quality and timely availability. The client saw a significant reduction in coordination effort — a single production partner managing print and dispatch removed the complexity of multi-vendor management.",
    stats: [
      { label: "Collateral types", value: "4+" },
      { label: "Rollout", value: "Nationwide" },
      { label: "Vendor management", value: "Centralised" },
    ],
  },
  {
    id: "FCG-2024-001",
    client: "Expanding FMCG Brand",
    industry: "FMCG & Retail",
    year: "2025",
    tagline: "Retail-ready mono cartons engineered for shelf presence — compliant, vibrant, scalable across markets.",
    service: "Packaging · Commercial Print",
    dark: false,
    problem:
      "A rapidly expanding FMCG company required retail-ready mono cartons for the launch of a new product portfolio across modern trade and general trade channels. The packaging had to stand out on crowded retail shelves while maintaining structural integrity and regulatory compliance — all within aggressive launch timelines.",
    process:
      "DGV selected a high-quality paperboard grade appropriate for both modern trade shelf environments and general trade handling conditions. Artwork was prepared for maximum shelf contrast and print fidelity, with batch-specific production controls in place to maintain consistency across large volume runs and multiple SKUs.",
    solution:
      "Mono cartons produced on high-quality paperboard with vibrant multi-colour offset printing, protective coating, and precision die-cutting and folding. Batch-specific production controls maintained colour and structural consistency across all SKUs, enabling simultaneous launch across both trade channels.",
    deliverables: [
      "Retail-ready mono cartons across multiple SKUs",
      "High-quality paperboard selection for durability",
      "Vibrant multi-colour offset printing",
      "Protective coatings for shelf and transit durability",
      "Precision die-cutting and folding",
      "Batch-specific production controls for consistency",
    ],
    outcome:
      "Enhanced shelf visibility across modern and general trade channels. Improved packaging consistency across SKUs supported coherent brand presence at launch. Large production volumes delivered within aggressive timelines, enabling simultaneous market entries.",
    stats: [
      { label: "Trade channels", value: "MT + GT" },
      { label: "Shelf visibility", value: "Enhanced" },
      { label: "Launch timeline", value: "On Time" },
    ],
  },
  {
    id: "MFG-2024-001",
    client: "Listed Manufacturing Company",
    industry: "Manufacturing",
    year: "2023",
    tagline: "End-to-end barcode label and thermal ribbon supply across multiple facilities — accurate, consistent, uninterrupted.",
    service: "Labels · Industrial Supply",
    dark: true,
    problem:
      "A publicly listed manufacturing organisation faced recurring issues across multiple production facilities — barcode readability failures, inventory tracking inefficiencies, and supply inconsistency from multiple vendors were creating operational downtime and coordination overhead.",
    process:
      "DGV audited the client's production environments and recommended product-specific label materials and thermal ribbon grades for each facility's conditions. A scheduled supply management programme was implemented with inventory planning support to eliminate the stock-out risk that had previously caused production disruptions.",
    solution:
      "High-performance barcode labels and thermal transfer ribbons specified per production environment, supplied on a scheduled basis with inventory planning support. A single-vendor model replaced multi-vendor complexity, providing consistent quality, predictable supply, and a single point of accountability.",
    deliverables: [
      "High-performance barcode labels for production environments",
      "Thermal transfer ribbons optimised per facility",
      "Product-specific material recommendations",
      "Inventory planning and supply scheduling support",
      "Scheduled supply management across multiple locations",
      "Single-vendor consolidation for supply accountability",
    ],
    outcome:
      "Improved barcode scanning accuracy across all facilities, reducing rework caused by unreadable codes. Downtime from labelling issues was eliminated. Uninterrupted supply across locations streamlined inventory and warehouse processes, and consolidating supply to a single vendor reduced the coordination burden on the client's procurement team.",
    stats: [
      { label: "Supply", value: "Uninterrupted" },
      { label: "Scan accuracy", value: "Improved" },
      { label: "Facilities", value: "Multi-site" },
    ],
  },
  {
    id: "LUX-2024-001",
    client: "Premium Consumer Brand",
    industry: "Luxury & Lifestyle",
    year: "2024",
    tagline: "Fully customised rigid boxes reinforcing premium positioning — foil-stamped, magnetic-closed, unboxing-ready.",
    service: "Packaging · Luxury Print",
    dark: false,
    problem:
      "A luxury lifestyle brand sought packaging that would match the exclusivity of its products while creating a memorable customer unboxing experience. The packaging needed to reinforce the brand's premium positioning and ensure product protection throughout storage, transportation, and retail display — while meeting aesthetic requirements across multiple product categories.",
    process:
      "Multiple prototypes were developed through an iterative refinement process, testing material combinations and structural formats. DGV's team worked closely with the brand to resolve tension between aesthetic goals and functional requirements — ensuring foil stamping, embossing, and magnetic closure systems performed consistently at production volumes.",
    solution:
      "Fully customised rigid boxes with premium grey board construction, luxury textured wrapping paper, gold foil stamping, embossed branding elements, and a magnetic closure system. Precision-engineered inserts tailored to each product category ensure consistent presentation whether the pack is on shelf, in transit, or being unboxed.",
    deliverables: [
      "Rigid boxes with premium grey board construction",
      "Luxury textured wrapping paper exterior",
      "Gold foil stamping on branding elements",
      "Embossed brand identity treatment",
      "Magnetic closure system",
      "Precision-engineered product inserts",
      "Multiple prototypes for aesthetic and functional refinement",
    ],
    outcome:
      "Improved overall product presentation and strengthened premium brand perception at point of sale and unboxing. The magnetic closure and textured exterior delivered a consistent tactile premium experience. Achieved execution consistency across multiple product categories, enabling the brand to scale the format across its full range.",
    stats: [
      { label: "Construction", value: "Grey Board" },
      { label: "Finish", value: "Foil + Emboss" },
      { label: "Closure", value: "Magnetic" },
    ],
  },
  {
    id: "PUB-2024-001",
    client: "Renowned Indian Business Group",
    industry: "Corporate Publishing",
    year: "2023",
    tagline: "A commemorative coffee table book archiving decades of corporate achievement — hardbound, HD offset, prestige-ready.",
    service: "Publishing · Premium Print",
    dark: true,
    problem:
      "A renowned Indian business group needed a commemorative coffee table book to mark a major corporate milestone — a publication that would serve as a historical archive and a prestigious gift for stakeholders, investors, and dignitaries. Colour consistency, exceptional image reproduction, premium finishing, and strict delivery timelines were all non-negotiable.",
    process:
      "DGV partnered closely with the client's branding and creative teams from pre-press through to delivery. Premium art paper was selected for image fidelity, a colour-managed offset workflow maintained consistency across the full colour range, and multi-level quality inspections were run throughout the production cycle. Finishing and binding were executed to hardbound luxury standards.",
    solution:
      "A hardbound coffee table book produced on premium art paper with high-definition offset printing, matte lamination, spot UV enhancements on key pages, and luxury hardbound binding. Multi-level quality inspections throughout production ensured colour accuracy and image reproduction met the elevated standard required for distribution to senior stakeholders and dignitaries.",
    deliverables: [
      "Premium art paper selection for image fidelity",
      "High-definition offset printing with colour management",
      "Hardbound luxury binding",
      "Matte lamination with spot UV enhancements",
      "Multi-level quality inspections at each production stage",
      "Secure packaging for stakeholder distribution",
    ],
    outcome:
      "Delivered within the committed timeline with exceptional image reproduction and colour accuracy. Senior management and stakeholders responded positively to the quality and prestige of the final publication. The book effectively archived the group's corporate history while serving as a high-value gift — enhancing corporate storytelling and brand perception among its most important audiences.",
    stats: [
      { label: "Print", value: "HD Offset" },
      { label: "Binding", value: "Hardbound" },
      { label: "Delivery", value: "On Time" },
    ],
  },
];

/* ══════════════════════════════════════════════
   SECTION
══════════════════════════════════════════════ */

export function CaseStudiesSection() {
  const [active, setActive] = useState<CaseStudy | null>(null);

  return (
    <section id="work" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-14">
          <div>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
              <span className="h-px w-8 bg-[var(--sand-400)]" />
              Work
            </div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[0.95]">
              Selected Projects.<br />
              <span className="italic font-light">Case by case.</span>
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-[var(--sand-700)] leading-relaxed">
            A few engagements that represent DGV's range — pharmaceutical
            gifting, retail activation, FMCG packaging, industrial supply,
            luxury rigid boxes, and corporate publishing.
          </p>
        </div>

        {/* Folder grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {STUDIES.map((study, i) => (
            <FolderCard
              key={study.id}
              study={study}
              index={i}
              onOpen={() => setActive(study)}
            />
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-16 flex items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-[var(--sand-700)]">
          <span className="h-px w-6 bg-[var(--sand-300)]" />
          Hover to preview · Click to open file
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <CaseStudyModal study={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FOLDER CARD
══════════════════════════════════════════════ */

function FolderCard({
  study,
  index,
  onOpen,
}: {
  study: CaseStudy;
  index: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  /* ── Material colors — slightly richer bases for texture depth ── */
  const folderBg     = study.dark ? "oklch(0.172 0.020 54)"  : "oklch(0.970 0.016 78)";
  const tabBg        = study.dark ? "oklch(0.232 0.022 56)"  : "oklch(0.876 0.026 74)";
  const sheetBg      = study.dark ? "oklch(0.212 0.020 58)"  : "var(--sand-50)";
  const borderColor  = study.dark ? "oklch(0.30 0.020 55)"   : "var(--sand-300)";
  const textMuted    = study.dark ? "var(--sand-400)"         : "var(--sand-700)";
  const textPrimary  = study.dark ? "var(--sand-50)"          : "var(--foreground)";
  const dividerColor = study.dark ? "oklch(0.28 0.018 55)"   : "var(--sand-300)";

  /* ── Layered box-shadows: outer depth + inset emboss/deboss ── */
  const shadowRest = study.dark
    ? [
        "0 4px 20px -2px rgba(8,4,2,0.38)",
        "0 1px 5px rgba(8,4,2,0.22)",
        "inset 0 1px 0 rgba(130,95,52,0.30)",
        "inset 0 -2px 7px rgba(4,2,1,0.46)",
        "inset 1px 0 0 rgba(110,78,38,0.14)",
        "inset -1px 0 0 rgba(4,2,1,0.28)",
      ].join(", ")
    : [
        "0 4px 20px -2px rgba(30,18,8,0.09)",
        "0 1px 5px rgba(30,18,8,0.05)",
        "inset 0 1px 0 rgba(255,250,238,0.78)",
        "inset 0 -1px 3px rgba(30,18,8,0.06)",
        "inset 1px 0 0 rgba(255,250,238,0.44)",
        "inset -1px 0 0 rgba(30,18,8,0.04)",
      ].join(", ");

  const shadowHover = study.dark
    ? [
        "0 26px 58px -8px rgba(8,4,2,0.52)",
        "0 10px 26px -4px rgba(8,4,2,0.32)",
        "0 2px 8px rgba(8,4,2,0.18)",
        "inset 0 1px 0 rgba(150,112,60,0.44)",
        "inset 0 -2px 10px rgba(4,2,1,0.52)",
      ].join(", ")
    : [
        "0 26px 58px -8px rgba(30,18,8,0.20)",
        "0 10px 26px -4px rgba(30,18,8,0.13)",
        "0 2px 6px rgba(30,18,8,0.07)",
        "inset 0 1px 0 rgba(255,250,238,0.90)",
        "inset 0 -1px 5px rgba(30,18,8,0.08)",
      ].join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: index * 0.13 }}
      className="relative cursor-pointer select-none"
      style={{ perspective: "1400px", height: 500 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      aria-label={`Open case study: ${study.client}`}
    >
      {/* ── Inner sheet (peeks above on hover) ── */}
      <motion.div
        animate={{ y: hovered ? -48 : 0 }}
        transition={SPRING_GENTLE}
        className="absolute z-0 rounded-sm"
        style={{
          inset: "0 6px",
          background: sheetBg,
          border: `1px solid ${borderColor}`,
          boxShadow: study.dark
            ? "inset 0 1px 0 rgba(110,80,40,0.18), inset 0 0 12px rgba(4,2,1,0.18)"
            : "inset 0 1px 0 rgba(255,252,244,0.80), inset 0 0 10px rgba(30,18,8,0.03)",
        }}
      >
        {/* Sheet grain */}
        <div
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            backgroundImage: study.dark ? PAPER_GRAIN_DARK : PAPER_GRAIN_LIGHT,
            backgroundSize: "240px 240px",
            opacity: 0.6,
            mixBlendMode: study.dark ? "screen" : "multiply",
          }}
          aria-hidden
        />
        <div className="px-6 pt-5">
          <div style={{ height: 2, width: 40, background: "var(--gold)", marginBottom: 12 }} />
          <div
            className="flex items-center justify-between text-[8.5px] uppercase tracking-[0.3em]"
            style={{ color: textMuted }}
          >
            <span>{study.service}</span>
            <span>{study.year}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Folder body ── */}
      <motion.div
        animate={{
          y: hovered ? -10 : 0,
          rotateX: hovered ? 3 : 0,
          boxShadow: hovered ? shadowHover : shadowRest,
        }}
        transition={SPRING}
        className="absolute inset-0 z-10 rounded-sm"
        style={{ background: folderBg, transformOrigin: "50% 100%" }}
      >
        {/* ═══════════════════════════════════════════
            TEXTURE SYSTEM — 5 independent layers
            ═══════════════════════════════════════════ */}

        {/* Layer 1 — Fine paper fiber grain (cross-fiber handmade paper structure) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            backgroundImage: study.dark ? PAPER_GRAIN_DARK : PAPER_GRAIN_LIGHT,
            backgroundSize: "260px 260px",
            mixBlendMode: study.dark ? "screen" : "multiply",
            zIndex: 1,
          }}
          aria-hidden
        />

        {/* Layer 2 — Vertical press grain (directional mould-made surface fiber) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            backgroundImage: study.dark ? VERT_GRAIN_DARK : VERT_GRAIN_LIGHT,
            backgroundSize: "380px 380px",
            opacity: study.dark ? 0.88 : 0.78,
            mixBlendMode: study.dark ? "screen" : "multiply",
            zIndex: 1,
          }}
          aria-hidden
        />

        {/* Layer 3 — Studio surface light (editorial top-left light rake) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            background: study.dark
              ? "linear-gradient(142deg, rgba(138,98,52,0.18) 0%, transparent 40%, rgba(6,3,1,0.22) 100%)"
              : "linear-gradient(142deg, rgba(255,252,240,0.54) 0%, transparent 44%, rgba(28,16,6,0.05) 100%)",
            zIndex: 1,
          }}
          aria-hidden
        />

        {/* Layer 4 — Edge vignette (peripheral shadow, paper aging at corners) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            background: study.dark
              ? "radial-gradient(ellipse at 50% 50%, transparent 64%, rgba(4,2,1,0.30) 100%)"
              : "radial-gradient(ellipse at 50% 50%, transparent 70%, rgba(28,16,6,0.08) 100%)",
            zIndex: 1,
          }}
          aria-hidden
        />

        {/* Layer 5 — Ink absorption hot-spot (uneven pigmentation, print pressure variation) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            background: study.dark
              ? "radial-gradient(ellipse 72% 52% at 20% 26%, rgba(92,66,32,0.14) 0%, transparent 62%)"
              : "radial-gradient(ellipse 65% 48% at 26% 20%, rgba(255,253,245,0.26) 0%, transparent 66%)",
            zIndex: 1,
          }}
          aria-hidden
        />

        {/* Dashed fold mark */}
        <svg
          className="absolute left-0 right-0 pointer-events-none"
          style={{ top: "63%", opacity: study.dark ? 0.07 : 0.11, zIndex: 2 }}
          width="100%" height="4" preserveAspectRatio="none" viewBox="0 0 400 4"
        >
          <line x1="0" y1="2" x2="400" y2="2"
            stroke={study.dark ? "var(--sand-400)" : "var(--sand-700)"}
            strokeWidth="0.7" strokeDasharray="5 4" />
        </svg>

        {/* Registration mark */}
        <svg
          className="absolute pointer-events-none"
          style={{ bottom: 18, right: 18, opacity: study.dark ? 0.08 : 0.10, zIndex: 2 }}
          width="22" height="22" viewBox="0 0 22 22"
        >
          <circle cx="11" cy="11" r="5" fill="none"
            stroke={study.dark ? "var(--sand-400)" : "var(--sand-700)"} strokeWidth="0.6" />
          <line x1="0" y1="11" x2="22" y2="11"
            stroke={study.dark ? "var(--sand-400)" : "var(--sand-700)"} strokeWidth="0.6" />
          <line x1="11" y1="0" x2="11" y2="22"
            stroke={study.dark ? "var(--sand-400)" : "var(--sand-700)"} strokeWidth="0.6" />
        </svg>

        {/* ── Folder tab — die-cut with physical drop-shadow ── */}
        <div
          style={{
            position: "absolute", top: 0, left: 24, zIndex: 3,
            /* drop-shadow respects clip-path, casts realistic die-cut shadow */
            filter: study.dark
              ? "drop-shadow(0 4px 7px rgba(4,2,1,0.52)) drop-shadow(0 1px 2px rgba(4,2,1,0.35))"
              : "drop-shadow(0 3px 6px rgba(22,12,4,0.20)) drop-shadow(0 1px 2px rgba(22,12,4,0.13))",
          }}
        >
          <div
            className="flex items-end pb-1.5 px-3 relative"
            style={{
              width: 112, height: 34, background: tabBg,
              clipPath: "polygon(0 100%, 5px 0%, calc(100% - 5px) 0%, 100% 100%)",
            }}
          >
            {/* Tab fiber grain */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: study.dark ? PAPER_GRAIN_DARK : PAPER_GRAIN_LIGHT,
              backgroundSize: "200px 200px",
              opacity: 0.88,
              mixBlendMode: study.dark ? "screen" : "multiply",
            }} aria-hidden />
            {/* Tab top-edge highlight (die-cut edge catching light) */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: study.dark
                ? "linear-gradient(180deg, rgba(128,92,48,0.24) 0%, transparent 58%)"
                : "linear-gradient(180deg, rgba(255,252,242,0.52) 0%, transparent 56%)",
            }} aria-hidden />
            <span className="relative text-[8px] uppercase tracking-[0.32em]" style={{ color: textMuted }}>
              {study.industry.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col h-full px-7 pb-7" style={{ paddingTop: 54, zIndex: 3 }}>
          <ArchiveLabelBox study={study} borderColor={borderColor} textMuted={textMuted} textPrimary={textPrimary} />

          <div className="mt-5">
            <p className="text-[9px] uppercase tracking-[0.28em] mb-3" style={{ color: textMuted }}>
              {study.industry}
            </p>
            <h3
              className="font-display leading-[1.04] text-balance"
              style={{ fontSize: "clamp(1.55rem, 2.2vw, 2rem)", color: textPrimary }}
            >
              {study.client}
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: textMuted }}>
              {study.tagline}
            </p>
          </div>

          <div className="flex-1" />

          <div className="grid grid-cols-3 gap-2 mb-5">
            {study.stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-xl" style={{ color: textPrimary }}>{s.value}</div>
                <div className="text-[7.5px] uppercase tracking-[0.2em] mt-0.5" style={{ color: textMuted }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${dividerColor}` }}>
            <span className="text-[8px] uppercase tracking-[0.28em]" style={{ color: textMuted }}>
              {study.service}
            </span>
            <motion.span
              animate={{ x: hovered ? 5 : 0, opacity: hovered ? 1 : 0.45 }}
              transition={SPRING}
              className="flex items-center gap-2 text-[8px] uppercase tracking-[0.28em]"
              style={{ color: textMuted }}
            >
              Open file
              <svg width="14" height="7" viewBox="0 0 14 7" fill="none" stroke="currentColor" strokeWidth="0.9">
                <line x1="0" y1="3.5" x2="12" y2="3.5" />
                <polyline points="8,1 12,3.5 8,6" />
              </svg>
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Archive label box — pressed/debossed into folder surface ── */
function ArchiveLabelBox({
  study,
  borderColor,
  textMuted,
  textPrimary,
}: {
  study: CaseStudy;
  borderColor: string;
  textMuted: string;
  textPrimary: string;
}) {
  const bg = study.dark ? "transparent" : "var(--sand-50)";
  return (
    <div
      className="relative p-3"
      style={{
        border: `1px solid ${borderColor}`,
        background: bg,
        /* inset shadow simulates deboss — label pressed into paper surface */
        boxShadow: study.dark
          ? "inset 0 1px 4px rgba(4,2,1,0.28), inset 0 0 10px rgba(4,2,1,0.12)"
          : "inset 0 1px 3px rgba(28,16,6,0.06), inset 0 0 8px rgba(28,16,6,0.03)",
      }}
    >
      <CornerCropMark pos="tl" color={borderColor} />
      <CornerCropMark pos="tr" color={borderColor} />
      <CornerCropMark pos="bl" color={borderColor} />
      <CornerCropMark pos="br" color={borderColor} />
      <p
        className="text-[7.5px] uppercase tracking-[0.32em] mb-1"
        style={{ color: textMuted }}
      >
        Archive Reference
      </p>
      <p
        className="font-mono text-[9px] uppercase tracking-[0.16em]"
        style={{ color: textPrimary }}
      >
        DGV&nbsp;/&nbsp;{study.year}&nbsp;/&nbsp;{study.id}
      </p>
    </div>
  );
}

function CornerCropMark({
  pos,
  color,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  color: string;
}) {
  const S = 8;
  const style: React.CSSProperties = { position: "absolute" };
  if (pos === "tl") { style.top = -S / 2 - 1; style.left = -S / 2 - 1; }
  if (pos === "tr") { style.top = -S / 2 - 1; style.right = -S / 2 - 1; }
  if (pos === "bl") { style.bottom = -S / 2 - 1; style.left = -S / 2 - 1; }
  if (pos === "br") { style.bottom = -S / 2 - 1; style.right = -S / 2 - 1; }

  const mid = S;
  const C = S * 2 + 2;

  return (
    <svg style={style} width={C} height={C} viewBox={`0 0 ${C} ${C}`} overflow="visible">
      {pos === "tl" && (<><line x1={mid} y1={0} x2={mid} y2={mid - 2} stroke={color} strokeWidth="0.6" /><line x1={0} y1={mid} x2={mid - 2} y2={mid} stroke={color} strokeWidth="0.6" /></>)}
      {pos === "tr" && (<><line x1={mid} y1={0} x2={mid} y2={mid - 2} stroke={color} strokeWidth="0.6" /><line x1={mid + 2} y1={mid} x2={C} y2={mid} stroke={color} strokeWidth="0.6" /></>)}
      {pos === "bl" && (<><line x1={mid} y1={mid + 2} x2={mid} y2={C} stroke={color} strokeWidth="0.6" /><line x1={0} y1={mid} x2={mid - 2} y2={mid} stroke={color} strokeWidth="0.6" /></>)}
      {pos === "br" && (<><line x1={mid} y1={mid + 2} x2={mid} y2={C} stroke={color} strokeWidth="0.6" /><line x1={mid + 2} y1={mid} x2={C} y2={mid} stroke={color} strokeWidth="0.6" /></>)}
    </svg>
  );
}

/* ══════════════════════════════════════════════
   CASE STUDY MODAL
══════════════════════════════════════════════ */

function CaseStudyModal({
  study,
  onClose,
}: {
  study: CaseStudy;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.dispatchEvent(new Event("lenis:stop"));
    return () => {
      document.body.style.overflow = "";
      document.dispatchEvent(new Event("lenis:start"));
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const panelBg = study.dark ? "oklch(0.18 0.018 55)" : "var(--sand-50)";
  const headerBg = study.dark ? "oklch(0.22 0.018 60)" : "oklch(0.955 0.014 80)";
  const borderColor = study.dark ? "oklch(0.28 0.018 55)" : "var(--sand-300)";
  const textMuted = study.dark ? "var(--sand-400)" : "var(--sand-700)";
  const textPrimary = study.dark ? "var(--sand-50)" : "var(--foreground)";
  const textBody = study.dark ? "var(--sand-300)" : "var(--sand-700)";
  const blockBg = study.dark ? "oklch(0.22 0.018 60)" : "oklch(0.955 0.014 80)";
  const dividerColor = study.dark ? "oklch(0.26 0.018 55)" : "var(--sand-300)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center p-4 md:p-8"
      style={{ background: "oklch(0.12 0.018 55 / 0.72)", backdropFilter: "blur(14px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 64, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 48, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-sm"
        style={{ background: panelBg }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        data-lenis-prevent
        role="dialog"
        aria-modal
        aria-label={`Case study: ${study.client}`}
      >
        {/* Grain */}
        <div
          className="pointer-events-none absolute inset-0 rounded-sm"
          style={{ backgroundImage: GRAIN, opacity: 0.32, mixBlendMode: "multiply", zIndex: 0 }}
          aria-hidden
        />

        {/* ── Sticky header ── */}
        <div
          className="sticky top-0 z-10 px-4 py-4 md:px-8 md:py-5 flex items-start justify-between"
          style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}
        >
          <div>
            <p
              className="text-[8.5px] uppercase tracking-[0.32em] mb-2"
              style={{ color: textMuted }}
            >
              DGV&nbsp;/&nbsp;{study.year}&nbsp;/&nbsp;{study.id}&nbsp;—&nbsp;Case Study
            </p>
            <h2
              className="font-display text-3xl md:text-4xl leading-[1.02]"
              style={{ color: textPrimary }}
            >
              {study.client}
            </h2>
            <p className="mt-1 text-sm" style={{ color: textMuted }}>
              {study.industry}&nbsp;·&nbsp;{study.service}
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative mt-0.5 ml-6 flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-sm transition-opacity hover:opacity-70 before:absolute before:-inset-[4px] before:content-['']"
            style={{ border: `1px solid ${borderColor}`, color: textMuted }}
            aria-label="Close"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.1">
              <line x1="1" y1="1" x2="12" y2="12" />
              <line x1="12" y1="1" x2="1" y2="12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="relative z-1 px-4 py-6 md:px-8 md:py-10">

          {/* Stats row */}
          <div
            className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10 pb-8 md:pb-10"
            style={{ borderBottom: `1px solid ${dividerColor}` }}
          >
            {study.stats.map((s) => (
              <div key={s.label}>
                <div
                  className="font-display text-3xl md:text-5xl leading-none mb-2"
                  style={{ color: textPrimary }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[8.5px] uppercase tracking-[0.26em]"
                  style={{ color: textMuted }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Problem + Process */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <ContentBlock title="The Challenge" body={study.problem} textMuted={textMuted} textBody={textBody} />
            <ContentBlock title="Our Process" body={study.process} textMuted={textMuted} textBody={textBody} />
          </div>

          {/* Solution */}
          <ContentBlock
            title="Packaging & Print Solution"
            body={study.solution}
            textMuted={textMuted}
            textBody={textBody}
            className="mb-10"
          />

          {/* Deliverables */}
          <div
            className="mb-10 pb-10"
            style={{ borderBottom: `1px solid ${dividerColor}` }}
          >
            <ModalLabel textMuted={textMuted}>Deliverables</ModalLabel>
            <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8">
              {study.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                  style={{ color: textBody }}
                >
                  <div
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: "var(--gold)" }}
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Outcome */}
          <div
            className="p-4 md:p-7 rounded-sm"
            style={{ background: blockBg, border: `1px solid ${borderColor}` }}
          >
            <ModalLabel textMuted={textMuted}>Outcome</ModalLabel>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: textPrimary }}
            >
              {study.outcome}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Content block ── */
function ContentBlock({
  title,
  body,
  textMuted,
  textBody,
  className = "",
}: {
  title: string;
  body: string;
  textMuted: string;
  textBody: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ModalLabel textMuted={textMuted}>{title}</ModalLabel>
      <p className="mt-4 text-sm leading-relaxed" style={{ color: textBody }}>
        {body}
      </p>
    </div>
  );
}

/* ── Section label ── */
function ModalLabel({
  children,
  textMuted,
}: {
  children: React.ReactNode;
  textMuted: string;
}) {
  return (
    <div
      className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em]"
      style={{ color: textMuted }}
    >
      <div
        className="h-px w-5 flex-shrink-0"
        style={{ background: "var(--gold)" }}
      />
      {children}
    </div>
  );
}
