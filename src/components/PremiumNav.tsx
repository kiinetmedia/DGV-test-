import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionTemplate,
} from "motion/react";

import dgvLogo from "../assets/dgv-logo-full.png";

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_SOFT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/* ══ Types ══════════════════════════════════════════════════════════════════ */

type ActiveDropdown = "products" | "solutions" | "vas" | null;

type ProductSubItem = { name: string; href: string };

type ProductCategory = {
  title: string;
  href: string;
  sub: ProductSubItem[];
};

type Solution = {
  title: string;
  description: string;
  href: string;
};

/* ══ Products catalogue data ════════════════════════════════════════════════ */

const PRODUCTS: ProductCategory[] = [
  {
    title: "Rigid Boxes",
    href: "/products#rigid-boxes",
    sub: [
      { name: "Magnetic Closure Boxes",  href: "/products#magnetic-closure" },
      { name: "Drawer Type Boxes",       href: "/products#drawer-boxes" },
      { name: "Lid & Base Boxes",        href: "/products#lid-base" },
      { name: "Foldable Rigid Boxes",    href: "/products#foldable-rigid" },
      { name: "Jewellery Boxes",         href: "/products#jewellery-boxes" },
      { name: "Cosmetic Packaging Boxes",href: "/products#cosmetic-packaging" },
      { name: "Corporate Gift Boxes",    href: "/products#corporate-gift-boxes" },
    ],
  },
  {
    title: "Paper Bags",
    href: "/products#paper-bags",
    sub: [
      { name: "Kraft Paper Bags",      href: "/products#kraft-bags" },
      { name: "Laminated Paper Bags",  href: "/products#laminated-bags" },
      { name: "Luxury Paper Bags",     href: "/products#luxury-bags" },
      { name: "Retail Carry Bags",     href: "/products#retail-carry-bags" },
      { name: "Custom Printed Bags",   href: "/products#custom-printed-bags" },
    ],
  },
  {
    title: "Commercial Printing",
    href: "/products#commercial-printing",
    sub: [
      { name: "Brochures",           href: "/products#brochures" },
      { name: "Catalogues",          href: "/products#catalogues" },
      { name: "Flyers / Leaflets",   href: "/products#flyers-leaflets" },
      { name: "Letterheads",         href: "/products#letterheads-envelopes" },
      { name: "Envelopes",           href: "/products#letterheads-envelopes" },
      { name: "Notebooks",           href: "/products#book-printing" },
      { name: "Book Printing",       href: "/products#book-printing" },
      { name: "Corporate Stationery",href: "/products#corporate-stationery" },
    ],
  },
  {
    title: "Barcode Labels",
    href: "/products#barcode-labels",
    sub: [
      { name: "Product Labels",         href: "/products#barcode-labels" },
      { name: "Pharmaceutical Labels",  href: "/products#barcode-labels" },
      { name: "Cosmetic Labels",        href: "/products#barcode-labels" },
      { name: "FMCG Labels",            href: "/products#barcode-labels" },
      { name: "Food Labels",            href: "/products#barcode-labels" },
      { name: "Chemical Labels",        href: "/products#barcode-labels" },
      { name: "Vinyl / Transparent Labels", href: "/products#barcode-labels" },
      { name: "Tamper-Evident Labels",  href: "/products#barcode-labels" },
    ],
  },
  {
    title: "Calendars & Diaries",
    href: "/products#calendars-diaries",
    sub: [
      { name: "Wall Calendars",                    href: "/products#wall-calendars" },
      { name: "Desk Calendars",                    href: "/products#desk-calendars" },
      { name: "Corporate Diaries",                 href: "/products#corporate-diaries" },
      { name: "Executive Diaries",                 href: "/products#executive-diaries" },
      { name: "Custom Designed Calendars",         href: "/products#calendars-diaries" },
      { name: "Custom Designed Diaries (Dated)",   href: "/products#custom-diaries" },
      { name: "Custom Designed Diaries (Non-Dated)",href: "/products#custom-diaries" },
    ],
  },
  {
    title: "Marketing & Branding",
    href: "/products#marketing-branding",
    sub: [
      { name: "Product Catalogues",    href: "/products#product-catalogues" },
      { name: "Corporate Profiles",    href: "/products#corporate-profiles" },
      { name: "Annual Reports",        href: "/products#corporate-profiles" },
      { name: "Presentation Folders",  href: "/products#presentation-folders" },
      { name: "Estimate Pads",         href: "/products#marketing-branding" },
      { name: "Danglers / Wobblers",   href: "/products#danglers-wobblers" },
      { name: "Posters",               href: "/products#marketing-branding" },
      { name: "Exhibition Materials",  href: "/products#exhibition-materials" },
    ],
  },
  {
    title: "Corrugated Boxes",
    href: "/products#corrugated-boxes",
    sub: [
      { name: "E-commerce Shipping Boxes",       href: "/products#ecommerce-boxes" },
      { name: "Standard Corrugated Boxes",       href: "/products#standard-corrugated" },
      { name: "Heavy-Duty Corrugated Boxes",     href: "/products#heavy-duty-corrugated" },
      { name: "Custom Printed Corrugated Boxes", href: "/products#custom-printed-corrugated" },
      { name: "Die-Cut Corrugated Boxes",        href: "/products#die-cut-corrugated" },
      { name: "Multi-Layer Corrugated Boards",   href: "/products#heavy-duty-corrugated" },
    ],
  },
];

/* ══ Solutions data ═════════════════════════════════════════════════════════ */

const SOLUTIONS: Solution[] = [
  {
    title: "Offset Printing",
    href: "/solutions#offset-printing",
    description:
      "High-quality sheet-fed printing for commercial and packaging applications — ideal for high-volume, colour-critical work.",
  },
  {
    title: "Web Offset Printing",
    href: "/solutions#web-offset-printing",
    description:
      "High-volume continuous print production for scale and consistency — newspapers, magazines, direct mail and more.",
  },
  {
    title: "Screen Printing",
    href: "/solutions#screen-printing",
    description:
      "Surface printing solutions for industrial and specialty applications, delivering durable, vibrant results on diverse substrates.",
  },
  {
    title: "Flexographic Printing",
    href: "/solutions#flexographic-printing",
    description:
      "High-speed relief printing for labels, flexible packaging and continuous substrates — efficient and scalable.",
  },
  {
    title: "Digital Printing",
    href: "/solutions#digital-printing",
    description:
      "On-demand short-run printing with precise colour accuracy and fast turnaround — perfect for variable and personalised content.",
  },
  {
    title: "Conversion",
    href: "/solutions#conversion",
    description:
      "Converting raw materials into finished print products through precision cutting, creasing, laminating, slitting and more.",
  },
  {
    title: "Fabrication",
    href: "/solutions#fabrication",
    description:
      "Structural fabrication of packaging forms, display units and bespoke printed products — from concept to finished form.",
  },
  {
    title: "Binding",
    href: "/solutions#binding",
    description:
      "Professional binding solutions — perfect binding, saddle-stitching, spiral, case binding and thread-sewn finishing.",
  },
];

/* ══ Value-Added Services data ══════════════════════════════════════════════ */

const VAS: Solution[] = [
  {
    title: "Label Design & Artwork Support",
    href: "/value-added-services#label-design",
    description:
      "End-to-end artwork refinement and production-ready label systems.",
  },
  {
    title: "Packaging Development",
    href: "/value-added-services#packaging-development",
    description:
      "Structural and visual packaging engineered for production and scale.",
  },
  {
    title: "Prototype Sampling",
    href: "/value-added-services#prototype-sampling",
    description:
      "Rapid sample creation for approvals and production validation.",
  },
  {
    title: "Bulk Manufacturing",
    href: "/value-added-services#bulk-manufacturing",
    description:
      "Scalable manufacturing with consistency and operational control.",
  },
  {
    title: "Inventory Management",
    href: "/value-added-services#inventory-management",
    description:
      "Inventory planning and stock continuity for uninterrupted supply.",
  },
  {
    title: "Pan India Logistics Support",
    href: "/value-added-services#logistics-support",
    description:
      "Reliable nationwide dispatch and fulfillment coordination.",
  },
  {
    title: "Visualisation",
    href: "/value-added-services#visualisation",
    description:
      "3D renders and photorealistic visual mockups of your packaging design for pre-production approval and client presentations.",
  },
  {
    title: "Designing",
    href: "/value-added-services#designing",
    description:
      "Full-service graphic design and branding support — from initial concept and identity to print-ready artwork and production files.",
  },
  {
    title: "Artwork Archiving",
    href: "/value-added-services#artwork-archiving",
    description:
      "Secure long-term storage and version management of your digital artwork files for seamless future reprints and reorders.",
  },
];

/* ══ Shared dropdown card style ═════════════════════════════════════════════ */

const CARD_STYLE: React.CSSProperties = {
  background: "oklch(0.978 0.010 80 / 0.97)",
  backdropFilter: "blur(28px) saturate(1.5)",
  WebkitBackdropFilter: "blur(28px) saturate(1.5)",
  border: "1px solid oklch(0.86 0.028 75 / 0.38)",
  boxShadow:
    "0 12px 40px oklch(0.22 0.018 60 / 0.09), inset 0 1px 0 oklch(1 0 0 / 0.5)",
};

/* ══ Shared left-panel button ════════════════════════════════════════════════ */

function CategoryButton({
  title,
  active,
  layoutId,
  onActivate,
}: {
  title: string;
  active: boolean;
  layoutId: string;
  onActivate: () => void;
}) {
  return (
    <button
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`relative w-full flex items-center justify-between px-3.5 py-[10px] rounded-lg transition-colors duration-200 text-left ${
        active
          ? "bg-[var(--sand-100)] text-foreground"
          : "text-[var(--sand-700)] hover:bg-[var(--sand-100)]/60 hover:text-foreground"
      }`}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          className="absolute left-0 top-[7px] bottom-[7px] w-[2px] rounded-full bg-[var(--gold)]"
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      <span className="text-[9.5px] uppercase tracking-[0.20em] leading-[1.35] min-w-0">
        {title}
      </span>
      <motion.span
        animate={{ x: active ? 2 : 0, opacity: active ? 1 : 0.22 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="text-[var(--gold)] flex-shrink-0 ml-1"
      >
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
          <path
            d="M1 3.5H9M6 1L9 3.5L6 6"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    </button>
  );
}

/* ══ Shared right-panel header ═══════════════════════════════════════════════ */

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="px-3.5 pb-2.5 flex items-center gap-2.5">
      <span className="h-px flex-1 bg-[var(--sand-300)]/45" />
      <span className="text-[8px] uppercase tracking-[0.24em] text-[var(--sand-400)] flex-shrink-0 max-w-[160px] text-right leading-[1.35]">
        {title}
      </span>
    </div>
  );
}

/* ══ Products mega menu ═════════════════════════════════════════════════════ */

function ProductsDropdown({ onClose }: { onClose: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const active = PRODUCTS[activeIdx];
  const useTwoCol = active.sub.length > 10;
  const staggerDelay = active.sub.length > 10 ? 0.02 : 0.04;

  return (
    <div className="flex p-2">

      {/* ── Left: category navigation ─────────────────────────────────── */}
      <div className="w-[204px] py-1 flex-shrink-0">
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.035, duration: 0.38, ease: EASE }}
          >
            <CategoryButton
              title={p.title}
              active={activeIdx === i}
              layoutId="products-indicator"
              onActivate={() => setActiveIdx(i)}
            />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36, duration: 0.32, ease: EASE }}
          className="px-3.5 pt-3 pb-1.5 mt-0.5 border-t border-[var(--sand-300)]/30"
        >
          <a
            href="/#contact"
            onClick={onClose}
            className="group flex items-center gap-2 text-[8.5px] tracking-[0.18em] text-[var(--sand-700)] hover:text-foreground transition-colors duration-200 normal-case leading-relaxed"
          >
            For more details of your project types, kindly contact us
            <span className="h-px w-3 bg-current group-hover:w-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex-shrink-0" />
          </a>
        </motion.div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div className="w-px bg-[var(--sand-300)]/35 my-2 mx-2 flex-shrink-0" />

      {/* ── Right: sub-items — crossfade with 4px y-slide on category switch */}
      <div className="w-[308px] py-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <PanelHeader title={active.title} />

            <div className={useTwoCol ? "grid grid-cols-2" : "flex flex-col"}>
              {active.sub.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * staggerDelay, duration: 0.28, ease: EASE }}
                  className="group flex items-start gap-2 px-3.5 py-[9px] text-[var(--sand-700)] hover:text-foreground transition-colors duration-[220ms]"
                >
                  <span className="mt-[5px] h-px w-2.5 bg-[var(--sand-400)] group-hover:w-3.5 group-hover:bg-[var(--gold)] transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex-shrink-0" />
                  <span className="text-[9px] uppercase tracking-[0.18em] leading-[1.5]">
                    {item.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

/* ══ Solutions dropdown ══════════════════════════════════════════════════════ */

function SolutionsDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-2">
      <div className="w-[260px] py-1">
        {SOLUTIONS.map((s, i) => (
          <motion.a
            key={s.title}
            href={s.href}
            onClick={onClose}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.035, duration: 0.38, ease: EASE }}
            className="group relative flex items-center justify-between px-4 py-[11px] rounded-lg cursor-pointer text-[var(--sand-700)] hover:text-foreground hover:bg-[var(--sand-100)]/60 transition-colors duration-[220ms]"
          >
            <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[var(--gold)] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="text-[9.5px] uppercase tracking-[0.20em] leading-[1.35] min-w-0 transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[2px]">
              {s.title}
            </span>
            <span className="flex-shrink-0 ml-2 text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
              <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                <path d="M1 3.5H9M6 1L9 3.5L6 6" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </motion.a>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36, duration: 0.32, ease: EASE }}
          className="px-4 pt-3 pb-1.5 mt-0.5 border-t border-[var(--sand-300)]/30"
        >
          <a
            href="/#contact"
            onClick={onClose}
            className="group flex items-center gap-2 text-[8.5px] tracking-[0.18em] text-[var(--sand-700)] hover:text-foreground transition-colors duration-200 normal-case leading-relaxed"
          >
            For more details of your project types, kindly contact us
            <span className="h-px w-3 bg-current group-hover:w-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex-shrink-0" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

/* ══ Value-Added Services dropdown ══════════════════════════════════════════ */

function VasDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-2">
      <div className="w-[284px] py-1">
        {VAS.map((v, i) => (
          <motion.a
            key={v.title}
            href={v.href}
            onClick={onClose}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.035, duration: 0.38, ease: EASE }}
            className="group relative flex items-center justify-between px-4 py-[11px] rounded-lg cursor-pointer text-[var(--sand-700)] hover:text-foreground hover:bg-[var(--sand-100)]/60 transition-colors duration-[220ms]"
          >
            <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[var(--gold)] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="text-[9.5px] uppercase tracking-[0.20em] leading-[1.35] min-w-0 transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[2px]">
              {v.title}
            </span>
            <span className="flex-shrink-0 ml-2 text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
              <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                <path d="M1 3.5H9M6 1L9 3.5L6 6" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </motion.a>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.40, duration: 0.32, ease: EASE }}
          className="px-4 pt-3 pb-1.5 mt-0.5 border-t border-[var(--sand-300)]/30"
        >
          <a
            href="/#contact"
            onClick={onClose}
            className="group flex items-center gap-2 text-[8.5px] tracking-[0.18em] text-[var(--sand-700)] hover:text-foreground transition-colors duration-200 normal-case leading-relaxed"
          >
            For more details of your project types, kindly contact us
            <span className="h-px w-3 bg-current group-hover:w-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex-shrink-0" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

/* ══ Nav trigger — forwardRef exposes button rect for dropdown positioning ═══ */

type NavTriggerProps = {
  label: React.ReactNode;
  active: boolean;
  onEnter: () => void;
  onLeave?: () => void;
  href?: string;
};

const NavTrigger = forwardRef<HTMLButtonElement, NavTriggerProps>(
  function NavTrigger({ label, active, onEnter, onLeave, href }, ref) {
    return (
      <button
        ref={ref}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={() => href && (window.location.href = href)}
        className={`text-[11px] uppercase tracking-[0.22em] group relative flex flex-col items-center gap-0 cursor-pointer outline-none transition-colors duration-200 ${
          active ? "text-foreground" : "text-[var(--sand-700)] hover:text-foreground"
        }`}
      >
        <span className="flex items-center gap-1.5">
          {label}
          <motion.span
            animate={{ rotate: active ? 180 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex items-center"
            style={{ color: active ? "var(--foreground)" : "var(--sand-400)" }}
          >
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
              <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </span>
        <span
          className="mt-[3px] h-px bg-foreground transition-all duration-300"
          style={{ width: active ? "100%" : "0%", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
        />
      </button>
    );
  }
);

function NavLink({
  href,
  children,
  onMouseEnter,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      onMouseEnter={onMouseEnter}
      className={`group relative flex flex-col items-center gap-0 text-[var(--sand-700)] hover:text-foreground transition-colors duration-200 ${className}`}
    >
      {children}
      <span
        className="mt-[3px] h-px w-0 bg-foreground group-hover:w-full transition-all duration-300"
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      />
    </a>
  );
}

/* ══ Main exported component ════════════════════════════════════════════════ */

export function PremiumNav() {
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileVasOpen, setMobileVasOpen] = useState(false);
  // Left offset (px) for the anchored dropdown — relative to the dropzone div
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const wrapperRef  = useRef<HTMLDivElement>(null);
  const pillRef     = useRef<HTMLDivElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  // Trigger button refs — used to measure position for dropdown anchoring
  const productsRef = useRef<HTMLButtonElement>(null);
  const solutionsRef = useRef<HTMLButtonElement>(null);
  const vasRef      = useRef<HTMLButtonElement>(null);

  const closeTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openIntentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeDropdownRef = useRef<ActiveDropdown>(null);
  const [pendingDropdown, setPendingDropdown] = useState<ActiveDropdown>(null);
  const prefersReducedMotion = useReducedMotion();

  /* ── Measure pill height → set --nav-h CSS variable ──────────────────── */
  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      // bottom of pill = height of nav from top of viewport
      document.documentElement.style.setProperty("--nav-h", `${Math.ceil(rect.bottom) + 2}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Scroll-driven pill animation ────────────────────────────────────── */
  const { scrollY } = useScroll();

  const rawWidth    = useTransform(scrollY, [0, 200], [100,  82]);
  const rawRadius   = useTransform(scrollY, [0, 200], [16,   24]);
  const rawBlur     = useTransform(scrollY, [0, 200], [28,   72]);
  const rawBgOp     = useTransform(scrollY, [0, 200], [0.72, 0.42]);
  const rawBorderOp = useTransform(scrollY, [0, 200], [0.55, 0.35]);
  const rawShadowA  = useTransform(scrollY, [0, 200], [0.05, 0.06]);
  const rawShadowB  = useTransform(scrollY, [0, 200], [0.10, 0.14]);
  const rawPadding  = useTransform(scrollY, [0, 200], [17,   9]);

  const sp = prefersReducedMotion
    ? { stiffness: 9999, damping: 200, restDelta: 0.001 }
    : { stiffness: 160,  damping: 32,  restDelta: 0.001 };

  const sWidth    = useSpring(rawWidth,    sp);
  const sRadius   = useSpring(rawRadius,   sp);
  const sBlur     = useSpring(rawBlur,     sp);
  const sBgOp     = useSpring(rawBgOp,     sp);
  const sBorderOp = useSpring(rawBorderOp, sp);
  const sShadowA  = useSpring(rawShadowA,  sp);
  const sShadowB  = useSpring(rawShadowB,  sp);
  const sPadding  = useSpring(rawPadding,  sp);

  const pillWidth      = useMotionTemplate`${sWidth}%`;
  const borderRadius   = useMotionTemplate`${sRadius}px`;
  const backdropFilter = useMotionTemplate`blur(${sBlur}px) saturate(2.4)`;
  const background     = useMotionTemplate`oklch(0.968 0.009 80 / ${sBgOp})`;
  const borderColor    = useMotionTemplate`oklch(1 0 0 / ${sBorderOp})`;
  const boxShadow      = useMotionTemplate`inset 0 1px 0 oklch(1 0 0 / 0.55), inset 0 -1px 0 oklch(0.22 0.018 60 / 0.08), 0 2px 10px oklch(0.22 0.018 60 / ${sShadowA}), 0 16px 48px oklch(0.22 0.018 60 / ${sShadowB})`;

  /* ── Compute dropdown left position anchored to the trigger button ────── */
  const computeDropdownLeft = useCallback((key: NonNullable<ActiveDropdown>) => {
    const refMap = { products: productsRef, solutions: solutionsRef, vas: vasRef };
    const trigEl  = refMap[key].current;
    const zoneEl  = dropzoneRef.current;
    if (!trigEl || !zoneEl) return;

    const trigRect  = trigEl.getBoundingClientRect();
    const zoneRect  = zoneEl.getBoundingClientRect();

    // Estimated dropdown content widths
    const estimatedW = key === "products" ? 540 : key === "solutions" ? 296 : 320;
    const left       = trigRect.left - zoneRect.left;
    // Clamp so dropdown doesn't overflow right viewport edge
    const maxLeft    = window.innerWidth - estimatedW - 16 - zoneRect.left;

    setDropdownLeft(Math.max(0, Math.min(left, maxLeft)));
  }, []);

  /* ── Dropdown open / close handlers ──────────────────────────────────── */

  // scheduleOpen: immediate nav-item highlight, dropdown opens after 200ms intent delay.
  // If another dropdown is already visible, switch instantly (no lag between panels).
  const scheduleOpen = useCallback((key: NonNullable<ActiveDropdown>) => {
    if (closeTimer.current)      clearTimeout(closeTimer.current);
    if (openIntentTimer.current) clearTimeout(openIntentTimer.current);

    setPendingDropdown(key);

    const doOpen = () => {
      computeDropdownLeft(key);
      setActiveDropdown(key);
      activeDropdownRef.current = key;
      setPendingDropdown(null);
      setMobileOpen(false);
    };

    if (activeDropdownRef.current !== null && activeDropdownRef.current !== key) {
      doOpen(); // already showing a different panel — switch immediately
    } else if (activeDropdownRef.current === key) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setPendingDropdown(null);
    } else {
      openIntentTimer.current = setTimeout(doOpen, 200);
    }
  }, [computeDropdownLeft]);

  const closeNow = useCallback(() => {
    if (openIntentTimer.current) clearTimeout(openIntentTimer.current);
    if (closeTimer.current)      clearTimeout(closeTimer.current);
    setActiveDropdown(null);
    setPendingDropdown(null);
    activeDropdownRef.current = null;
  }, []);

  const scheduleClose = useCallback(() => {
    // Cancel a pending open that hasn't fired yet
    if (openIntentTimer.current) {
      clearTimeout(openIntentTimer.current);
      openIntentTimer.current = null;
      setPendingDropdown(null);
    }
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setActiveDropdown(null);
      activeDropdownRef.current = null;
    }, 280);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!activeDropdown) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeDropdown]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current)      clearTimeout(closeTimer.current);
      if (openIntentTimer.current) clearTimeout(openIntentTimer.current);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">

      {/* Page dim when any dropdown is open */}
      <AnimatePresence>
        {activeDropdown !== null && (
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-[var(--sand-900)]/10 pointer-events-none"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Floating wrapper ────────────────────────────────────────── */}
      <div
        ref={wrapperRef}
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
        className="pointer-events-auto relative z-10 pt-3 px-3 md:pt-4 md:px-5 flex flex-col gap-[6px]"
      >

        {/* ── Pill ──────────────────────────────────────────────────── */}
        <motion.div
          ref={pillRef}
          style={{
            width: pillWidth,
            borderRadius,
            backdropFilter,
            WebkitBackdropFilter: backdropFilter,
            background,
            borderColor,
            boxShadow,
            paddingTop: sPadding,
            paddingBottom: sPadding,
          }}
          className="border mx-auto flex items-center justify-between px-5 lg:px-7 xl:px-8 max-w-[1400px]"
        >
          {/* Logo */}
          <a
            href="/"
            onMouseEnter={closeNow}
            className="flex items-center select-none shrink-0"
          >
            <img
              src={dgvLogo}
              alt="DGV Company"
              draggable={false}
              className="h-9 w-auto object-contain"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-9 text-[11px] uppercase tracking-[0.22em]">
            <NavTrigger
              ref={productsRef}
              label="Products"
              active={activeDropdown === "products" || pendingDropdown === "products"}
              onEnter={() => scheduleOpen("products")}
              onLeave={scheduleClose}
              href="/products"
            />
            <NavTrigger
              ref={solutionsRef}
              label="Solutions"
              active={activeDropdown === "solutions" || pendingDropdown === "solutions"}
              onEnter={() => scheduleOpen("solutions")}
              onLeave={scheduleClose}
              href="/solutions"
            />
            <NavTrigger
              ref={vasRef}
              label={<><span className="hidden xl:inline">Value-Added </span>Services</>}
              active={activeDropdown === "vas" || pendingDropdown === "vas"}
              onEnter={() => scheduleOpen("vas")}
              onLeave={scheduleClose}
              href="/value-added-services"
            />
            <NavLink href="/affiliations" onMouseEnter={closeNow} className="hidden lg:block">Clientele</NavLink>
            <NavLink href="/#contact" onMouseEnter={closeNow}>Contact</NavLink>
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-5 shrink-0">
            <a
              href="mailto:abhinav@dgvcompany.com"
              onMouseEnter={closeNow}
              className="hidden lg:inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-foreground border border-foreground/65 px-5 py-[9px] hover:bg-foreground hover:text-[var(--sand-50)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              Get a Quote
            </a>
            <button
              className="lg:hidden relative flex items-center justify-center -m-3 p-3 cursor-pointer outline-none"
              onClick={() => { setMobileOpen((v) => !v); setActiveDropdown(null); }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span className="relative w-7 h-5 flex flex-col justify-between pointer-events-none">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="block h-px w-full bg-foreground origin-center"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  className="block h-px w-full bg-foreground origin-right"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="block h-px w-full bg-foreground origin-center"
                />
              </span>
            </button>
          </div>
        </motion.div>

        {/* ── Dropdown zone — height:0 so pill position is unaffected ───
            The absolute card is anchored to the hovered trigger button.
            Position is computed via getBoundingClientRect() on hover.
            ─────────────────────────────────────────────────────────── */}
        <div ref={dropzoneRef} className="relative" style={{ height: 0 }}>
          <AnimatePresence>
            {activeDropdown !== null && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.992 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0, y: -5, scale: 0.996,
                  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                }}
                transition={{
                  opacity: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
                  y:       { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                  scale:   { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
                }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                className="absolute top-[6px] rounded-xl overflow-hidden"
                style={{ left: dropdownLeft, ...CARD_STYLE }}
              >
                {/* Invisible bridge — extends hit-zone 14px above the card, covering the gap
                    between the pill and dropdown so diagonal cursor movement never triggers close. */}
                <div aria-hidden style={{ position: "absolute", top: -14, left: 0, right: 0, height: 14 }} />

                {/* Inner content — key-driven crossfade (y-slide) when switching tabs */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeDropdown}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {activeDropdown === "products"  && <ProductsDropdown onClose={() => setActiveDropdown(null)} />}
                    {activeDropdown === "solutions" && <SolutionsDropdown onClose={() => setActiveDropdown(null)} />}
                    {activeDropdown === "vas"       && <VasDropdown onClose={() => setActiveDropdown(null)} />}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mobile drawer ──────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.38, ease: EASE }}
              className="md:hidden rounded-xl overflow-hidden"
              style={{
                background: "oklch(0.975 0.011 80 / 0.97)",
                backdropFilter: "blur(28px) saturate(1.5)",
                WebkitBackdropFilter: "blur(28px) saturate(1.5)",
                border: "1px solid oklch(0.86 0.028 75 / 0.35)",
                boxShadow: "0 12px 40px oklch(0.22 0.018 60 / 0.08)",
              }}
            >
              <nav className="flex flex-col px-6 pt-4 pb-8">

                <MobileAccordion
                  label="Products"
                  open={mobileProductsOpen}
                  onToggle={() => setMobileProductsOpen((v) => !v)}
                >
                  {PRODUCTS.map((p, i) => (
                    <motion.a
                      key={p.title}
                      href={p.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.26, ease: EASE }}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center gap-3 py-3.5 pl-2 text-[10px] uppercase tracking-[0.2em] text-[var(--sand-700)] hover:text-foreground transition-colors duration-200"
                    >
                      <span className="h-px w-3 bg-[var(--sand-400)] group-hover:bg-[var(--gold)] group-hover:w-5 transition-all duration-300 flex-shrink-0" />
                      {p.title}
                    </motion.a>
                  ))}
                </MobileAccordion>

                <MobileAccordion
                  label="Solutions"
                  open={mobileSolutionsOpen}
                  onToggle={() => setMobileSolutionsOpen((v) => !v)}
                >
                  {SOLUTIONS.map((s, i) => (
                    <motion.a
                      key={s.title}
                      href={s.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.26, ease: EASE }}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center gap-3 py-3.5 pl-2 text-[10px] uppercase tracking-[0.2em] text-[var(--sand-700)] hover:text-foreground transition-colors duration-200"
                    >
                      <span className="h-px w-3 bg-[var(--sand-400)] group-hover:bg-[var(--gold)] group-hover:w-5 transition-all duration-300 flex-shrink-0" />
                      {s.title}
                    </motion.a>
                  ))}
                </MobileAccordion>

                <MobileAccordion
                  label="Value-Added Services"
                  open={mobileVasOpen}
                  onToggle={() => setMobileVasOpen((v) => !v)}
                >
                  {VAS.map((v, i) => (
                    <motion.a
                      key={v.title}
                      href={v.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.26, ease: EASE }}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center gap-3 py-3.5 pl-2 text-[10px] uppercase tracking-[0.2em] text-[var(--sand-700)] hover:text-foreground transition-colors duration-200"
                    >
                      <span className="h-px w-3 bg-[var(--sand-400)] group-hover:bg-[var(--gold)] group-hover:w-5 transition-all duration-300 flex-shrink-0" />
                      {v.title}
                    </motion.a>
                  ))}
                </MobileAccordion>

                {[
                  { label: "Clientele", href: "/affiliations" },
                  { label: "Contact",      href: "/#contact" },
                ].map(({ label, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.055, duration: 0.38, ease: EASE }}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center justify-between py-[15px] text-[11px] uppercase tracking-[0.22em] text-[var(--sand-700)] hover:text-foreground border-b border-[var(--sand-300)]/30 last:border-0 transition-colors duration-200"
                  >
                    {label}
                    <svg
                      width="13" height="9" viewBox="0 0 13 9" fill="none"
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                    >
                      <path d="M1 4.5H12M8.5 1L12 4.5L8.5 8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.a>
                ))}

                <motion.a
                  href="mailto:abhinav@dgvcompany.com"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.38, ease: EASE }}
                  onClick={() => setMobileOpen(false)}
                  className="mt-6 inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.22em] text-foreground border border-foreground/65 px-5 py-3 hover:bg-foreground hover:text-[var(--sand-50)] transition-all duration-300"
                >
                  Get a Quote
                </motion.a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}

/* ══ Mobile accordion ════════════════════════════════════════════════════════ */

function MobileAccordion({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[var(--sand-300)]/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-[15px] text-[11px] uppercase tracking-[0.22em] text-[var(--sand-700)] hover:text-foreground transition-colors duration-200"
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex items-center text-[var(--sand-400)]"
        >
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
            <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
