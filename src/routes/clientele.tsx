import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import {
  Pill,
  Car,
  UtensilsCrossed,
  Laptop,
  Shirt,
  ShoppingBasket,
  GraduationCap,
  Ticket,
  Newspaper,
  ConciergeBell,
  Wheat,
  Headset,
  Sparkles,
  Building2,
  Zap,
  Candy,
  FlaskConical,
  Refrigerator,
  ShoppingCart,
  Landmark,
  HeartHandshake,
  Factory,
  Truck,
  Sofa,
  Baby,
  Ship,
  PackageSearch,
  Stethoscope,
  Wine,
  House,
  Hammer,
  HardHat,
  Droplet,
  Sun,
  Dumbbell,
  Gift,
  Package,
  Recycle,
  type LucideIcon,
} from "lucide-react";
import { PremiumNav } from "@/components/PremiumNav";
import { PremiumFooter } from "@/components/PremiumFooter";
import { useMailtoHref } from "@/lib/contact";

const logoImports = import.meta.glob(
  "/src/assets/clientele/strip/*.webp",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const LOGOS: string[] = Object.keys(logoImports).sort().map((k) => logoImports[k]);

export const Route = createFileRoute("/clientele")({
  head: () => ({
    meta: [
      { title: "DGV Company Clientele — Printing & Packaging Partners" },
      { name: "description", content: "DGV Company's clientele spans pharmaceuticals, FMCG, luxury, manufacturing, corporate and more — trusted by leading brands across India." },
    ],
    links: [{ rel: "canonical", href: "https://www.dgvcompany.com/clientele" }],
  }),
  component: ClientelePage,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const MAILTO_SUBJECT = "Request to View DGV Clientele Brochure";
const MAILTO_BODY = [
  "Hello DGV Company,\n\n",
  "I would like to request access to your clientele brochure.",
  "\n\nPlease share the brochure at your earliest convenience.",
  "\n\nThank you.",
].join("");

const INDUSTRIES = [
  "Pharmaceuticals",
  "FMCG",
  "Food & Beverage",
  "Personal Care",
  "Industrial",
  "Luxury",
];

const SECTORS: { name: string; icon: LucideIcon; products: string[] }[] = [
  {
    name: "Pharmaceutical & Healthcare",
    icon: Pill,
    products: [
      "Product Labels",
      "Barcode Labels",
      "QR Code Labels",
      "Variable Data Labels",
      "Tamper Evident Labels",
      "Security Labels",
      "Hologram Labels",
      "Patient Information Leaflets (PIL)",
      "Leave Behind Literature (LBL)",
      "Cartons",
      "Mono Cartons",
      "Blister Cards",
      "Carton Inserts",
      "Shipping Labels",
      "Prescription Pads",
      "Medicine Boxes",
      "Product Catalogue",
      "Diary",
      "Calendars",
      "Posters",
      "Eflute Corrugated Box",
    ],
  },
  {
    name: "Automotive",
    icon: Car,
    products: [
      "Warning Labels",
      "Asset Labels",
      "VIN Labels",
      "Industrial Labels",
      "Spare Parts Boxes",
      "Instruction Manuals",
      "Warranty Cards",
      "Hanging Tags",
      "Packaging Boxes",
      "Shipping Cartons",
      "Mono Cartons",
      "Eflute Corrugated Box",
      "Product Catalogue",
      "Posters",
    ],
  },
  {
    name: "Food & Beverage",
    icon: UtensilsCrossed,
    products: [
      "Food Labels",
      "Beverage Labels",
      "Shrink Sleeves",
      "Wrap Around Labels",
      "Nutritional Labels",
      "Barcode Labels",
      "Mono Cartons",
      "Corrugated Boxes",
      "Pizza Boxes",
      "Takeaway Boxes",
      "Paper Bags",
      "Cup Sleeves",
      "Menu Cards",
      "Table Tents",
      "Promotional Stickers",
      "Stand Up Pouches",
      "Product Brochure",
      "Leaflets",
      "Posters",
      "Calendars",
      "Diary",
    ],
  },
  {
    name: "Information Technology",
    icon: Laptop,
    products: [
      "Asset Labels",
      "Barcode Labels",
      "Employee ID Cards",
      "Welcome Kits",
      "Corporate Stationery",
      "Presentation Folders",
      "Event Badges",
      "Lanyards",
      "Notebooks",
      "Brochures",
      "Information/Seminar Kits",
      "Internal Publications",
      "Diaries",
    ],
  },
  {
    name: "Fashion & Apparel",
    icon: Shirt,
    products: [
      "Hang Tags",
      "Swing Tags",
      "Price Tags",
      "RFID Labels",
      "Care Labels",
      "Garment Boxes",
      "Tissue Paper",
      "Shopping Bags",
      "Brand Stickers",
      "Gift Boxes",
      "Mono Cartons",
      "4 Corner & 6 Corner Box",
      "Eflute Corrugated Box",
      "Calendars",
    ],
  },
  {
    name: "FMCG",
    icon: ShoppingBasket,
    products: [
      "Product Labels",
      "Promotional Labels",
      "Barcode Labels",
      "Mono Cartons",
      "Shelf Ready Packaging",
      "Display Boxes",
      "Corrugated Boxes",
      "Promotional Packaging",
      "Paper Bags",
      "Retail Displays",
      "Product Catalogue",
      "Diary",
      "Calendars",
      "Blister Pack",
      "Posters",
    ],
  },
  {
    name: "Education",
    icon: GraduationCap,
    products: [
      "Prospectus",
      "Certificates",
      "Student Diaries",
      "Text Books",
      "Report Cards",
      "Answer Sheets",
      "Books",
      "Notebooks",
      "Admission Forms",
      "Presentation Folders",
      "Brochure",
      "Leaflets",
      "Posters",
      "Files",
      "Letterheads",
      "Envelope",
    ],
  },
  {
    name: "Entertainment & Events",
    icon: Ticket,
    products: [
      "Event Tickets",
      "Invitation Cards",
      "VIP Passes",
      "Lanyards",
      "Posters",
      "Standees",
      "Backdrops",
      "Merchandise Packaging",
      "DVD/CD Packaging",
      "Point-of-Sale",
      "POP",
    ],
  },
  {
    name: "Media & Publishing",
    icon: Newspaper,
    products: [
      "Books",
      "Magazines",
      "Catalogues",
      "Coffee Table Books",
      "Annual Reports",
      "Corporate Profiles",
      "Newsletters",
      "Journals",
      "Brochure",
      "Calendars",
      "Diary",
      "Poster",
      "Leaflets",
      "Envelope",
      "Letterheads",
      "Files",
      "Labels",
    ],
  },
  {
    name: "Hospitality",
    icon: ConciergeBell,
    products: [
      "Menus",
      "Tent Cards",
      "Door Hangers",
      "Key Card Holders",
      "Coasters",
      "Room Directories",
      "Hotel Stationery",
      "Packaging Boxes",
      "Paper Bags",
      "Files",
      "Leaflets",
      "Posters",
      "Books",
      "Letterhead",
      "Envelope",
      "Diary",
      "Calendars",
    ],
  },
  {
    name: "Agriculture",
    icon: Wheat,
    products: [
      "Seed Pouches",
      "Fertilizer Labels",
      "Pesticide Labels",
      "Product Inserts",
      "Cartons",
      "Corrugated Boxes",
      "Promotional Posters",
      "Product Catalogues",
      "Mono Cartons",
      "Calendars",
      "Diary",
    ],
  },
  {
    name: "Service Industry",
    icon: Headset,
    products: ["Brochures", "Calendars", "Diary", "Leaflets", "Posters", "Letterheads", "Envelope"],
  },
  {
    name: "Cosmetics & Personal Care",
    icon: Sparkles,
    products: [
      "Premium Labels",
      "Transparent Labels",
      "Foil Labels",
      "Luxury Cartons",
      "Rigid Boxes",
      "Window Boxes",
      "Sleeve Packaging",
      "Paper Bags",
      "Gift Boxes",
      "Promotional Kits",
      "Mono Cartons",
      "Eflute Corrugated Box",
      "Product Brochure",
      "Leaflets",
      "Posters",
      "Diary",
      "Calendars",
    ],
  },
  {
    name: "Real Estate",
    icon: Building2,
    products: [
      "Brochures",
      "Project Catalogues",
      "Presentation Folders",
      "Site Maps",
      "Welcome Kits",
      "Hoardings",
      "Vinyl Graphics",
      "Sales Kits",
      "Calendars",
      "Diary",
      "Leaflets",
      "Posters",
      "Letterhead",
      "Envelope",
    ],
  },
  {
    name: "Electrical & Electronics",
    icon: Zap,
    products: [
      "Rating Labels",
      "Barcode Labels",
      "Security Labels",
      "Void Labels",
      "Product Labels",
      "Instruction Manuals",
      "Warranty Cards",
      "Packaging Boxes",
      "Corrugated Boxes",
      "Product Catalogues",
      "Mono Cartons",
      "Brochure",
      "Letterhead",
      "Envelope",
      "Leaflets",
      "Posters",
      "Calendars",
      "Diary",
    ],
  },
  {
    name: "Chocolate & Confectionery",
    icon: Candy,
    products: ["Packaging", "Labels", "Posters", "Specialty Gift", "Festive Packs"],
  },
  {
    name: "Chemicals, Paints & Lubricants",
    icon: FlaskConical,
    products: [
      "Product Labels",
      "Chemical Resistant Labels",
      "Drum Labels",
      "Hazard Labels",
      "Barcode Labels",
      "Product Cartons",
      "Shipping Labels",
      "Corrugated Boxes",
      "Instruction Sheets",
      "Safety Posters",
    ],
  },
  {
    name: "Consumer Durables",
    icon: Refrigerator,
    products: [
      "Product Labels",
      "Rating Labels",
      "User Manuals",
      "Warranty Cards",
      "Packaging Boxes",
      "Corrugated Boxes",
      "Product Catalogues",
      "Promotional Brochures",
    ],
  },
  {
    name: "E-Commerce & Retail",
    icon: ShoppingCart,
    products: [
      "Shipping Labels",
      "Barcode Labels",
      "Courier Labels",
      "Mailer Boxes",
      "Corrugated Boxes",
      "Packaging Tape",
      "Thank You Cards",
      "Invoice Envelopes",
      "Product Stickers",
    ],
  },
  {
    name: "Banking & Financial Services",
    icon: Landmark,
    products: [
      "Annual Reports",
      "Brochures",
      "Presentation Folders",
      "Welcome Kits",
      "ID Cards",
      "Cheque Book Covers",
      "Passbook Covers",
      "Promotional Material",
    ],
  },
  {
    name: "NGOs & Government",
    icon: HeartHandshake,
    products: [
      "Annual Reports",
      "Brochures",
      "Awareness Posters",
      "Forms",
      "Certificates",
      "Booklets",
      "Presentation Folders",
      "ID Cards",
    ],
  },
  {
    name: "Industrial Manufacturing",
    icon: Factory,
    products: [
      "Industrial Labels",
      "Barcode Labels",
      "Asset Labels",
      "Shipping Labels",
      "Corrugated Boxes",
      "Instruction Manuals",
      "Safety Signages",
      "Product Catalogues",
      "Estimate Pads for Sales Promotion",
      "Retail - Store Branding",
    ],
  },
  {
    name: "Logistics & Warehousing",
    icon: Truck,
    products: [
      "Shipping Labels",
      "Barcode Labels",
      "Pallet Labels",
      "Carton Labels",
      "Inventory Stickers",
      "Dispatch Documents",
      "Packing Lists",
      "Corrugated Boxes",
    ],
  },
  {
    name: "Home Décor & Furniture",
    icon: Sofa,
    products: [
      "Product Labels",
      "Hang Tags",
      "Product Catalogues",
      "Instruction Manuals",
      "Packaging Boxes",
      "Corrugated Boxes",
      "Paper Bags",
      "Warranty Cards",
    ],
  },
  {
    name: "Toys, Baby Care & Pet Care",
    icon: Baby,
    products: [
      "Product Labels",
      "Barcode Labels",
      "Packaging Boxes",
      "Instruction Leaflets",
      "Hanging Tags",
      "Gift Boxes",
      "Promotional Stickers",
      "Retail Display Boxes",
    ],
  },
  {
    name: "Exporters & Merchant Exporters",
    icon: Ship,
    products: [
      "Export Packaging",
      "Corrugated Shipping Boxes",
      "Export Labels",
      "Barcode Labels",
      "Pallet Labels",
      "Shipping Marks",
      "Container Labels",
      "Packing Lists",
      "Product Inserts",
      "Export Cartons",
    ],
  },
  {
    name: "Importers & Distributors",
    icon: PackageSearch,
    products: [
      "Product Relabelling",
      "Compliance Labels",
      "Barcode Labels",
      "Retail Packaging",
      "Product Stickers",
      "Instruction Manuals",
      "Cartons",
      "Promotional Material",
    ],
  },
  {
    name: "Medical Devices",
    icon: Stethoscope,
    products: [
      "Device Labels",
      "Sterilization Labels",
      "UDI Labels",
      "Barcode Labels",
      "Cartons",
      "IFU (Instructions for Use)",
      "Security Labels",
      "Blister Cards",
    ],
  },
  {
    name: "Wine, Spirits & Beverages",
    icon: Wine,
    products: [
      "Premium Bottle Labels",
      "Neck Labels",
      "Foil Labels",
      "Shrink Sleeves",
      "Luxury Gift Boxes",
      "Corrugated Boxes",
      "Promotional Packaging",
    ],
  },
  {
    name: "Household Products",
    icon: House,
    products: [
      "Product Labels",
      "Barcode Labels",
      "Corrugated Boxes",
      "Mono Cartons",
      "Display Boxes",
      "Retail Packaging",
      "Promotional Stickers",
    ],
  },
  {
    name: "Hardware & Fasteners",
    icon: Hammer,
    products: [
      "Barcode Labels",
      "Bin Labels",
      "Product Labels",
      "Hanging Cards",
      "Blister Cards",
      "Packaging Boxes",
      "Instruction Manuals",
    ],
  },
  {
    name: "Pipes, Plumbing & Building Materials",
    icon: HardHat,
    products: [
      "Product Labels",
      "Barcode Labels",
      "Bundle Labels",
      "Packaging Boxes",
      "Catalogues",
      "Technical Manuals",
      "Promotional Brochures",
    ],
  },
  {
    name: "Adhesives & Sealants",
    icon: Droplet,
    products: [
      "Drum Labels",
      "Tube Labels",
      "Product Labels",
      "Shrink Sleeves",
      "Packaging Cartons",
      "Promotional Packaging",
    ],
  },
  {
    name: "Renewable Energy & Solar",
    icon: Sun,
    products: [
      "Rating Labels",
      "Asset Labels",
      "Warning Labels",
      "Equipment Labels",
      "Instruction Manuals",
      "Packaging Boxes",
    ],
  },
  {
    name: "Sports & Fitness",
    icon: Dumbbell,
    products: [
      "Hang Tags",
      "Packaging Boxes",
      "Product Labels",
      "Promotional Material",
      "Retail Displays",
      "Gift Boxes",
    ],
  },
  {
    name: "Gifts & Corporate Gifting",
    icon: Gift,
    products: [
      "Luxury Rigid Boxes",
      "Magnetic Boxes",
      "Gift Bags",
      "Gift Tags",
      "Invitation Cards",
      "Corporate Kits",
      "Premium Packaging",
    ],
  },
  {
    name: "Export Print & Packaging Solutions",
    icon: Package,
    products: [
      "Export Cartons",
      "Heavy Duty Corrugated Boxes",
      "Export Quality Product Labels",
      "Barcode & GS1 Labels",
      "Shipping Marks",
      "Pallet Labels",
      "Container Labels",
      "Multilingual Labels",
      "Variable Data Printing",
      "Instruction Manuals",
      "Product Inserts",
      "Retail Ready Packaging",
      "Luxury Export Packaging",
      "Protective Inner Packaging",
      "Paper Bags",
      "Hang Tags",
      "Product Catalogues",
      "Compliance Labels",
      "Custom Packaging Design",
    ],
  },
  {
    name: "Plastic Products & Polymer Industry",
    icon: Recycle,
    products: [
      "Product Labels",
      "Barcode Labels",
      "Batch Labels",
      "QR Code Labels",
      "Industrial Stickers",
      "Packaging Sleeves",
      "Product Inserts",
      "Mono Cartons",
      "Corrugated Boxes",
      "Shipping Labels",
      "Product Catalogues",
      "Technical Manuals",
      "Hanging Tags",
    ],
  },
];

function IconLock() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 shrink-0"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

const sectorGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};

const sectorCellVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Registration-mark corner brackets — a nod to print crop marks, purely decorative. */
function CropMarks({ visible }: { visible: boolean }) {
  const corners = [
    "top-2.5 left-2.5 border-t border-l",
    "top-2.5 right-2.5 border-t border-r",
    "bottom-2.5 left-2.5 border-b border-l",
    "bottom-2.5 right-2.5 border-b border-r",
  ];
  return (
    <>
      {corners.map((cls, i) => (
        <motion.span
          key={cls}
          aria-hidden
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
          transition={{ duration: 0.35, ease: EASE, delay: visible ? i * 0.03 : 0 }}
          className={`pointer-events-none absolute w-2.5 h-2.5 ${cls}`}
          style={{ borderColor: "var(--gold)" }}
        />
      ))}
    </>
  );
}

function SectorCell({
  index,
  name,
  icon: Icon,
  products,
}: {
  index: number;
  name: string;
  icon: LucideIcon;
  products: string[];
}) {
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  return (
    <motion.div
      variants={sectorCellVariants}
      role="listitem"
      aria-label={name}
      className="group relative flex flex-col justify-start min-h-[10rem] border-r border-b border-[var(--sand-300)] px-6 py-8 md:px-7 md:py-9 overflow-hidden select-none"
      onMouseMove={(e) => {
        if (prefersReduced) return;
        const rect = e.currentTarget.getBoundingClientRect();
        rawX.set(e.clientX - rect.left);
        rawY.set(e.clientY - rect.top);
      }}
      onMouseEnter={(e) => {
        if (!prefersReduced) {
          const rect = e.currentTarget.getBoundingClientRect();
          rawX.set(e.clientX - rect.left);
          rawY.set(e.clientY - rect.top);
        }
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
    >
      {!prefersReduced && (
        <motion.div
          aria-hidden
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.15, ease: "linear" }}
          style={{
            position: "absolute",
            left: rawX,
            top: rawY,
            width: 220,
            height: 220,
            x: "-50%",
            y: "-50%",
            borderRadius: "50%",
            background: "radial-gradient(circle, oklch(0.72 0.11 75 / 0.12) 0%, transparent 72%)",
            pointerEvents: "none",
          }}
        />
      )}

      <CropMarks visible={hovered && !prefersReduced} />

      <span
        aria-hidden
        className="pointer-events-none absolute right-5 top-5 font-display text-[2.6rem] leading-none transition-colors duration-500"
        style={{ color: hovered ? "oklch(0.72 0.11 75 / 0.32)" : "var(--sand-200)" }}
      >
        {String(index).padStart(2, "0")}
      </span>

      <span
        className="relative flex items-center gap-2.5 transition-transform duration-300 ease-out"
        style={{ transform: hovered ? "translateX(4px)" : "translateX(0)" }}
      >
        <Icon
          aria-hidden
          className="shrink-0 w-4 h-4 md:w-[1.1rem] md:h-[1.1rem] transition-colors duration-500"
          style={{ color: hovered ? "var(--gold)" : "var(--sand-500)" }}
          strokeWidth={1.75}
        />
        <span className="font-display font-bold uppercase text-[1.05rem] md:text-[1.15rem] leading-tight tracking-wide pr-6">
          {name}
        </span>
      </span>

      <span
        className="relative mt-3 mb-4 h-px w-6 transition-all duration-300 ease-out"
        style={{
          backgroundColor: hovered ? "var(--gold)" : "var(--sand-300)",
          width: hovered ? "2.5rem" : "1.5rem",
        }}
      />

      <ul className="relative space-y-1 text-[0.82rem] text-[var(--sand-700)] leading-relaxed">
        {products.map((product) => (
          <li key={product}>{product}</li>
        ))}
      </ul>
    </motion.div>
  );
}

function ClientelePage() {
  const mailtoHref = useMailtoHref({ subject: MAILTO_SUBJECT, body: MAILTO_BODY });
  return (
    <main className="relative bg-background text-foreground overflow-x-clip min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-grid-fine grid-fade opacity-60" aria-hidden />
      <PremiumNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
              <span className="h-px w-8 bg-[var(--sand-400)]" />
              Clientele
            </div>
            <h1 className="mt-8 font-display text-[clamp(3rem,7vw,7rem)] leading-[0.93] tracking-tight text-balance max-w-4xl">
              Trusted by leaders.<br />
              <span className="italic font-light">Across every category.</span>
            </h1>
            <p className="mt-8 max-w-lg text-[var(--sand-700)] leading-relaxed">
              From pharmaceuticals and FMCG to luxury, manufacturing, and
              corporate — DGV Company's clientele represents some of India's
              most demanding brands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Logo marquee ─────────────────────────────────────────────────── */}
      <section
        className="border-t border-b border-[var(--sand-300)] py-12 overflow-hidden"
        style={{ backgroundColor: "oklch(0.919 0.026 73)" }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-[10px] uppercase tracking-[0.32em] text-[var(--sand-400)] mb-10"
        >
          Trusted by India's most demanding brands
        </motion.p>

        <div className="marquee-track">
          <div
            className="animate-marquee"
            style={{
              animationDuration: "30s",
              backgroundColor: "oklch(0.919 0.026 73)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")
            }
          >
            {[...LOGOS, ...LOGOS].map((src, i) => (
              <div
                key={i}
                className="shrink-0 mx-6 w-[140px] h-[80px] flex items-center justify-center"
              >
                <img
                  src={src}
                  alt={`Client logo ${(i % LOGOS.length) + 1}`}
                  className="max-w-full max-h-full object-contain"
                  style={{ mixBlendMode: "multiply", display: "block" }}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sectors served ───────────────────────────────────────────────── */}
      <section className="border-t border-[var(--sand-300)]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
              <span className="h-px w-8 bg-[var(--sand-400)]" />
              Sectors served
            </div>
            <h2 className="mt-8 font-display text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.02] tracking-tight max-w-3xl">
              38+ industries.<br />
              <span className="italic font-light">One standard of craft.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[var(--sand-700)] leading-relaxed">
              From pharmaceutical cartons to movie packaging, DGV Company's
              presses have printed for nearly every sector of Indian industry.
            </p>
          </motion.div>

          <motion.div
            variants={sectorGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            role="list"
            aria-label="Sectors DGV Company has served"
            className="mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-l border-[var(--sand-300)]"
          >
            {SECTORS.map((sector, i) => (
              <SectorCell key={sector.name} index={i + 1} name={sector.name} icon={sector.icon} products={sector.products} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Request Access ───────────────────────────────────────────────── */}
      <section className="border-t border-[var(--sand-300)]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-24 md:py-36">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">

            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.15 }}
              className="flex-1 max-w-xl"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-[var(--sand-700)] mb-8"
                style={{
                  background: "oklch(0.97 0.008 80 / 0.7)",
                  border: "1px solid oklch(0.86 0.028 75 / 0.55)",
                  boxShadow: "0 2px 12px oklch(0.22 0.018 60 / 0.06)",
                }}
              >
                <IconLock />
              </div>

              <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.05] tracking-tight">
                Our clientele is<br />
                <span className="italic font-light">available on request.</span>
              </h2>

              <p className="mt-6 text-[var(--sand-700)] leading-relaxed max-w-md">
                To protect the privacy of our clients, we share our full
                clientele brochure exclusively by request. Click the button
                below to send us a quick email and we will get back to you
                promptly with the brochure.
              </p>

              {/* Industries served pills */}
              <div className="mt-10 flex flex-wrap gap-2">
                {INDUSTRIES.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] uppercase tracking-[0.18em] text-[var(--sand-700)] border border-[var(--sand-300)] px-3 py-1.5 rounded-full"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right — CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.28 }}
              className="flex-shrink-0 w-full md:w-[420px]"
            >
              <div
                className="rounded-3xl border border-[var(--sand-300)] bg-[var(--sand-50)]/60 backdrop-blur-md p-8 md:p-10"
                style={{ boxShadow: "0 4px 32px oklch(0.22 0.018 60 / 0.07), inset 0 1px 0 oklch(1 0 0 / 0.55)" }}
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                  How it works
                </p>

                <ol className="mt-6 space-y-5">
                  {[
                    { step: "01", text: "Click the button below to open a pre-drafted email." },
                    { step: "02", text: "Send it from your inbox — no editing required." },
                    { step: "03", text: "We'll reply with our full clientele brochure." },
                  ].map(({ step, text }) => (
                    <li key={step} className="flex items-start gap-4">
                      <span
                        className="text-[10px] font-display tracking-widest text-[var(--sand-500)] pt-0.5 shrink-0"
                      >
                        {step}
                      </span>
                      <span className="text-[0.9rem] text-[var(--sand-800)] leading-snug">{text}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 border-t border-[var(--sand-300)] pt-8 space-y-3">
                  {/* Primary CTA */}
                  <a
                    href={mailtoHref}
                    className="flex items-center justify-between gap-3 w-full bg-foreground text-[var(--sand-50)] px-6 py-4 text-[11px] uppercase tracking-[0.28em] hover:opacity-90 transition-opacity duration-300 rounded-xl"
                  >
                    <span className="flex items-center gap-3">
                      <IconMail />
                      Request Clientele Brochure
                    </span>
                    <IconArrow />
                  </a>

                  <p className="text-center text-[10px] text-[var(--sand-500)] tracking-wide">
                    Opens your email app with a ready-to-send message
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
