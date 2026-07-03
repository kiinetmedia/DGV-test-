import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PremiumNav } from "@/components/PremiumNav";
import { PremiumFooter } from "@/components/PremiumFooter";
import { FlatAtlas, type FlatAtlasItem, type FlatAtlasConfig } from "@/components/FlatAtlas";
import vasLabelDesign from "@/assets/vas/label-design.png";
import vasPackagingDev from "@/assets/vas/packaging-development.png";
import vasPrototypeSampling from "@/assets/vas/prototype-sampling.png";
import vasBulkManufacturing from "@/assets/vas/bulk-manufacturing.png";
import vasInventoryManagement from "@/assets/vas/inventory-management.png";
import vasLogistics from "@/assets/vas/logistics.png";
import vasVisualisation from "@/assets/vas/visualisation.png";
import vasDesigning from "@/assets/vas/designing.png";
import vasArtworkArchiving from "@/assets/vas/artwork-archiving.png";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   SERVICES ATLAS DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const VAS_ITEMS: FlatAtlasItem[] = [
  {
    id: "label-design",
    code: "01",
    title: "Label Design & Artwork Support",
    tagline: "Print-ready artwork engineered for production",
    description:
      "Print-ready label artwork engineered for production — colour separations, dieline systems, barcode integration, and pre-press verification.",
    insight:
      "Label artwork failures cause more production delays than any other single factor. Off-spec colours, incorrect dielines, improperly set barcodes, and missing bleeds account for the majority of press hold-ups. Our artwork team treats pre-press as a quality control stage, not an administration step.",
    image: vasLabelDesign,
    imageAlt:
      "Label design artwork preparation with dieline layout, colour separations and barcode verification documentation",
    sections: [
      {
        type: "list",
        heading: "What's included",
        items: [
          "Dieline engineering for any label shape and application method",
          "Pantone-to-process colour conversion and print-profile verification",
          "Barcode generation and ITF/EAN compliance verification",
          "Pre-press file check, bleed and trap correction",
        ],
      },
      {
        type: "specs",
        heading: "Typical timelines",
        specs: [
          { k: "New artwork", v: "3–5 working days" },
          { k: "Artwork revision", v: "24–48 hours" },
          { k: "Barcode verification", v: "Same day" },
        ],
      },
    ],
    pairings: [
      { label: "Designing", href: "#designing" },
      { label: "Prototype Sampling", href: "#prototype-sampling" },
      { label: "Artwork Archiving", href: "#artwork-archiving" },
    ],
    faqs: [
      {
        q: "Will you check our existing artwork before printing?",
        a: "Yes. Every file is checked for colour set-up, bleed, dieline alignment, barcode integrity, and resolution before it reaches the press. We flag and correct issues at pre-press rather than discovering them on the production floor.",
      },
      {
        q: "Can you generate compliant barcodes for our labels?",
        a: "We generate and verify ITF, EAN, and retail barcodes to the relevant standard, supplying verification documentation so you can be confident every code scans correctly at point of sale.",
      },
    ],
  },
  {
    id: "packaging-development",
    code: "02",
    title: "Packaging Development",
    tagline: "From brief to production-ready in one seamless process",
    description:
      "Structural and visual packaging engineered from brief to production-ready — material specification, dieline engineering, 3D rendering, and prototype.",
    insight:
      "Packaging development is the stage at which cost is either locked in or left on the table. Material choice, structural format, and print process selection made here determine the per-unit cost of every production run thereafter. Involving DGV at brief stage — not artwork stage — consistently reduces production costs.",
    image: vasPackagingDev,
    imageAlt:
      "Packaging structural development showing dieline engineering, 3D CAD model and material specification",
    sections: [
      {
        type: "list",
        heading: "What's included",
        items: [
          "Structural design for rigid, folding carton, flexible and corrugated formats",
          "Material and board specification across standard and specialty stocks",
          "Dieline engineering and technical drawings",
          "Production-ready file delivery",
        ],
      },
      {
        type: "specs",
        heading: "Typical timelines",
        specs: [
          { k: "Concept to dieline", v: "5–10 working days" },
          { k: "Material specification", v: "2–3 working days" },
          { k: "3D render", v: "24–48 hours" },
        ],
      },
    ],
    pairings: [
      { label: "Prototype Sampling", href: "#prototype-sampling" },
      { label: "Visualisation", href: "#visualisation" },
      { label: "Designing", href: "#designing" },
    ],
    faqs: [
      {
        q: "When should we involve you in packaging development?",
        a: "As early as possible. Material, structure, and print-process decisions made at brief stage determine the per-unit cost of every subsequent run. Involving us before artwork is finalised consistently reduces production cost.",
      },
      {
        q: "Do you provide technical drawings and dielines?",
        a: "Yes. Every development project is delivered with production-ready dielines, technical drawings, and material specifications that can go straight to the press floor or be shared with stakeholders.",
      },
    ],
  },
  {
    id: "prototype-sampling",
    code: "03",
    title: "Prototype Sampling",
    tagline: "Production-accurate samples before the first run",
    description:
      "Physical prototypes and first-article samples that accurately represent the finished product — before a single unit enters full production.",
    insight:
      "The cost of a sampling stage is always less than the cost of reprinting a defective production run. We produce prototypes that represent real production conditions — not idealized hand-samples — so that the approval you give on a prototype is the approval you see at delivery.",
    image: vasPrototypeSampling,
    imageAlt:
      "Pre-production packaging prototype samples being quality checked against specification documentation",
    sections: [
      {
        type: "list",
        heading: "What's included",
        items: [
          "Hand-finished structural prototypes for pre-production evaluation",
          "Colour-accurate press proofs matching the intended production process",
          "First-article inspection with structural and print verification",
          "Compliance and fit-for-purpose checks",
        ],
      },
      {
        type: "specs",
        heading: "Typical timelines",
        specs: [
          { k: "Structural prototype", v: "3–7 working days" },
          { k: "Press proof", v: "2–4 working days" },
          { k: "First-article report", v: "1–2 working days" },
        ],
      },
    ],
    pairings: [
      { label: "Packaging Development", href: "#packaging-development" },
      { label: "Bulk Manufacturing", href: "#bulk-manufacturing" },
      { label: "Visualisation", href: "#visualisation" },
    ],
    faqs: [
      {
        q: "Do your prototypes represent the final production product?",
        a: "Yes. We produce prototypes under real production conditions — correct substrate, print process, and finishing — so that the approval you give on a sample is the standard you receive at delivery, not an idealized hand-made approximation.",
      },
      {
        q: "Is sampling included in the project cost?",
        a: "Pre-production sampling is a standard part of our packaging and labelling process. Sampling scope and any additional iterations are confirmed at quotation stage.",
      },
    ],
  },
  {
    id: "bulk-manufacturing",
    code: "04",
    title: "Bulk Manufacturing",
    tagline: "Thousands to millions, quality consistent throughout",
    description:
      "Scale from thousands to millions without quality drift — multi-shift production with rigorous inline QC, batch tracking and ISO-compliant documentation.",
    insight:
      "The challenge in bulk manufacturing is not producing the first pallet — it is ensuring the last pallet is identical to the first. Our production management system tracks colour density, registration, and cut accuracy against specification at shift intervals, with documented sign-off before dispatch.",
    image: vasBulkManufacturing,
    imageAlt:
      "High-volume packaging production line with inline quality control inspection system in operation",
    sections: [
      {
        type: "list",
        heading: "What's included",
        items: [
          "Multi-shift production across all press and converting technologies",
          "ISO 9001:2015 production management with full batch traceability",
          "Inline inspection of colour, registration and cut accuracy",
          "Documented QC sign-off before dispatch",
        ],
      },
      {
        type: "specs",
        heading: "Typical timelines",
        specs: [
          { k: "Standard packaging", v: "10–14 working days" },
          { k: "Rigid boxes", v: "14–21 working days" },
          { k: "High-volume runs", v: "Scheduled by capacity" },
        ],
      },
    ],
    pairings: [
      { label: "Inventory Management", href: "#inventory-management" },
      { label: "Pan India Logistics", href: "#logistics-support" },
      { label: "Prototype Sampling", href: "#prototype-sampling" },
    ],
    faqs: [
      {
        q: "How do you keep quality consistent across a large run?",
        a: "Our production management system tracks colour density, registration, and cut accuracy against specification at shift intervals, with documented sign-off before dispatch. The objective is that the last pallet is identical to the first.",
      },
      {
        q: "What volumes can you handle?",
        a: "We produce from thousands to millions of units across our press and converting technologies, with multi-shift scheduling for high-volume programmes. Capacity and timeline are confirmed at order.",
      },
    ],
  },
  {
    id: "inventory-management",
    code: "05",
    title: "Inventory Management",
    tagline: "Buffer stock and just-in-time dispatch on your behalf",
    description:
      "Buffer stock holding, reorder management, and just-in-time dispatch — so your supply chain never stalls due to packaging availability.",
    insight:
      "Packaging stock-outs have a disproportionate operational cost — halting a production line because a label or carton is out of stock is far more expensive than the cost of carrying a small buffer inventory. Our inventory management programme is designed to remove this risk entirely.",
    image: vasInventoryManagement,
    imageAlt:
      "Organized packaging inventory warehouse with systematic stock management and FIFO rotation system",
    sections: [
      {
        type: "list",
        heading: "What's included",
        items: [
          "Buffer stock holding with FIFO rotation and expiry management",
          "Automatic reorder triggers at agreed minimum stock levels",
          "Monthly inventory reporting with digital stock visibility",
          "Just-in-time dispatch against your demand schedule",
        ],
      },
      {
        type: "specs",
        heading: "Typical timelines",
        specs: [
          { k: "Stock release", v: "24–48 hours" },
          { k: "Reorder lead time", v: "Per production schedule" },
          { k: "Reporting", v: "Monthly" },
        ],
      },
    ],
    pairings: [
      { label: "Bulk Manufacturing", href: "#bulk-manufacturing" },
      { label: "Pan India Logistics", href: "#logistics-support" },
      { label: "Artwork Archiving", href: "#artwork-archiving" },
    ],
    faqs: [
      {
        q: "Can you hold buffer stock on our behalf?",
        a: "Yes. We hold agreed buffer inventory with FIFO rotation and release stock just-in-time against your schedule, removing the risk and cost of a packaging stock-out halting your production line.",
      },
      {
        q: "How do we track held inventory?",
        a: "You receive monthly inventory reporting with digital stock visibility, and reorder triggers are set at agreed minimum levels so replenishment is initiated before stock runs low.",
      },
    ],
  },
  {
    id: "logistics-support",
    code: "06",
    title: "Pan India Logistics",
    tagline: "Coordinated delivery across India and beyond",
    description:
      "Coordinated dispatch and fulfilment across all Indian states — and international shipping to Asia, Europe, the Americas, Africa, and Oceania.",
    insight:
      "Logistics is the stage at which production quality can be undone. Inadequate packaging of finished goods, incorrect documentation, and carrier selection mismatches with load type are the common causes of in-transit damage. We manage dispatch as an extension of production quality control.",
    image: vasLogistics,
    imageAlt:
      "Packaging dispatch and logistics operation with organised consignments ready for pan India and export delivery",
    sections: [
      {
        type: "list",
        heading: "What's included",
        items: [
          "Pan India delivery coordination with established freight partners",
          "International shipping with export documentation and customs support",
          "Consolidated dispatch for multi-SKU and multi-location orders",
          "Transit-appropriate finished-goods packing",
        ],
      },
      {
        type: "specs",
        heading: "Typical timelines",
        specs: [
          { k: "Metro delivery", v: "2–4 working days" },
          { k: "Pan India delivery", v: "4–7 working days" },
          { k: "Export dispatch", v: "Per destination & mode" },
        ],
      },
    ],
    pairings: [
      { label: "Inventory Management", href: "#inventory-management" },
      { label: "Bulk Manufacturing", href: "#bulk-manufacturing" },
      { label: "Prototype Sampling", href: "#prototype-sampling" },
    ],
    faqs: [
      {
        q: "Do you ship internationally?",
        a: "Yes. We ship to clients across Asia, Europe, the Americas, Africa, and Oceania, handling export documentation, commercial invoicing, and customs coordination on your behalf.",
      },
      {
        q: "Can you consolidate multi-location deliveries?",
        a: "We coordinate consolidated dispatch for multi-SKU and multi-location orders, managing the routing and documentation so your sites receive the right stock on schedule.",
      },
    ],
  },
  {
    id: "visualisation",
    code: "07",
    title: "Visualisation",
    tagline: "Photorealistic renders without a physical sample",
    description:
      "Photorealistic 3D renders and digital mockups for pre-production approval, stakeholder presentation, and marketing use — without a physical sample.",
    insight:
      "3D visualisation has changed the approval process fundamentally. Stakeholders who struggle to read a flat dieline can immediately evaluate a photorealistic render on a white background. This reduces revision cycles, accelerates approvals, and allows consumer research to be conducted before production investment.",
    image: vasVisualisation,
    imageAlt:
      "Photorealistic 3D rendering of luxury packaging box showing all surface details and material finishes",
    sections: [
      {
        type: "list",
        heading: "What's included",
        items: [
          "Photorealistic 3D renders from dieline files and artwork",
          "Lifestyle scene renders for marketing, social and e-commerce",
          "Rapid iteration as design changes are made",
          "White-background and contextual presentation views",
        ],
      },
      {
        type: "specs",
        heading: "Typical timelines",
        specs: [
          { k: "Standard render", v: "24–48 hours" },
          { k: "Lifestyle scene", v: "2–4 working days" },
          { k: "Revision", v: "Within hours" },
        ],
      },
    ],
    pairings: [
      { label: "Designing", href: "#designing" },
      { label: "Packaging Development", href: "#packaging-development" },
      { label: "Prototype Sampling", href: "#prototype-sampling" },
    ],
    faqs: [
      {
        q: "Why use 3D visualisation instead of a physical sample?",
        a: "A photorealistic render lets stakeholders evaluate a design immediately — without the time and cost of a physical sample — accelerating approvals and enabling consumer research before any production investment.",
      },
      {
        q: "How quickly can renders be updated?",
        a: "Design changes are typically reflected in new renders within hours, allowing rapid iteration through the approval cycle.",
      },
    ],
  },
  {
    id: "designing",
    code: "08",
    title: "Designing",
    tagline: "Design built for the press, not the screen",
    description:
      "Full-service graphic design and brand identity — from logo and identity systems through to packaging artwork and production-ready files.",
    insight:
      "Design for print is a distinct discipline from design for screen. Colour gamut, substrate behaviour, finishing interactions, and print process constraints all affect the design decisions that produce consistent results on press. Our studio designs for production from the first sketch.",
    image: vasDesigning,
    imageAlt:
      "Graphic design studio with packaging design artwork being reviewed for brand consistency and print accuracy",
    sections: [
      {
        type: "list",
        heading: "What's included",
        items: [
          "Brand identity, logo design and visual language systems",
          "Packaging concept and surface artwork",
          "Print-ready file production for any process",
          "Multi-format adaptation across ranges and collateral",
        ],
      },
      {
        type: "specs",
        heading: "Typical timelines",
        specs: [
          { k: "Identity concept", v: "10–15 working days" },
          { k: "Packaging artwork", v: "5–10 working days" },
          { k: "Adaptation", v: "2–5 working days" },
        ],
      },
    ],
    pairings: [
      { label: "Visualisation", href: "#visualisation" },
      { label: "Packaging Development", href: "#packaging-development" },
      { label: "Label Design & Artwork", href: "#label-design" },
    ],
    faqs: [
      {
        q: "Do you design for print production specifically?",
        a: "Yes. Our studio designs for production from the first sketch — accounting for colour gamut, substrate behaviour, finishing interactions, and print-process constraints so the result is consistent on press, not just on screen.",
      },
      {
        q: "Can you work from our existing brand guidelines?",
        a: "Absolutely. We can develop a new identity from scratch or work within your established brand guidelines, adapting existing assets for print production across formats.",
      },
    ],
  },
  {
    id: "artwork-archiving",
    code: "09",
    title: "Artwork Archiving",
    tagline: "Every file secured for seamless reprints",
    description:
      "Secure digital archive of all artwork, dieline files, and production specifications — enabling seamless reprints and SKU expansions without re-origination cost.",
    insight:
      "Artwork re-origination is a hidden cost that accumulates over time. When a packaging file is lost, superseded without documentation, or held only by a supplier who is no longer available, the cost of recreating it from scratch often exceeds the original design fee. Our archiving programme eliminates this risk.",
    image: vasArtworkArchiving,
    imageAlt:
      "Digital artwork archive system showing organized packaging files with version management and access control",
    sections: [
      {
        type: "list",
        heading: "What's included",
        items: [
          "Secure long-term storage of artwork, dieline and production files",
          "Version management with full change history",
          "Reprint continuity for consistent repeat runs",
          "On-request retrieval of any archived asset",
        ],
      },
      {
        type: "specs",
        heading: "Typical timelines",
        specs: [
          { k: "File retrieval", v: "Within 24 hours" },
          { k: "Reprint set-up", v: "Same day from archive" },
          { k: "Version history", v: "Retained long-term" },
        ],
      },
    ],
    pairings: [
      { label: "Bulk Manufacturing", href: "#bulk-manufacturing" },
      { label: "Inventory Management", href: "#inventory-management" },
      { label: "Designing", href: "#designing" },
    ],
    faqs: [
      {
        q: "What happens to our artwork after a job is complete?",
        a: "All artwork, dieline files, and production specifications are securely archived with version management, so reprints and SKU expansions can be produced without re-origination cost or risk of losing the working files.",
      },
      {
        q: "How quickly can you retrieve archived files for a reprint?",
        a: "Any archived asset is available on request within 24 hours, and reprints can be set up the same day from the archived production files for full run-to-run consistency.",
      },
    ],
  },
];

const ATLAS_CONFIG: FlatAtlasConfig = {
  atlasLabel: "Services Atlas",
  introTitle: (
    <>
      Nine services beyond
      <br />
      the press.
    </>
  ),
  introBody:
    "From design and structural development through to inventory management and pan-India logistics — DGV Company's value-added services cover every stage before, during and after production.",
  ctaLabel: "Start a conversation",
  faqHeading: "Partnership, answered.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   JSON-LD SCHEMA
   ═══════════════════════════════════════════════════════════════════════════ */

const ITEMLIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "DGV Company Value-Added Services",
  itemListElement: VAS_ITEMS.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: it.title,
      description: it.description,
      provider: { "@type": "Organization", name: "DGV Company" },
    },
  })),
};

export const Route = createFileRoute("/value-added-services")({
  head: () => ({
    meta: [
      {
        title:
          "Value-Added Services — Design, Development & Logistics | DGV Company",
      },
      {
        name: "description",
        content:
          "DGV Company's value-added services cover every stage before, during and after production — label design, packaging development, prototyping, bulk manufacturing, inventory, pan-India logistics, visualisation, design and artwork archiving.",
      },
      { property: "og:title", content: "Value-Added Services — DGV Company" },
      {
        property: "og:description",
        content: "Nine services beyond the press. One complete partnership.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ITEMLIST_SCHEMA),
      },
    ],
  }),
  component: VasPage,
});

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED UI
   ═══════════════════════════════════════════════════════════════════════════ */

type Faq = { q: string; a: string };

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
      <span className="h-px w-8 bg-[var(--sand-400)]" />
      {children}
    </div>
  );
}

function FaqList({ items }: { items: Faq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="border-t border-[var(--sand-300)]">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-start justify-between gap-6 py-5 text-left group"
            aria-expanded={openIdx === i}
          >
            <span className="font-display text-lg md:text-xl leading-snug group-hover:text-foreground transition-colors duration-300">
              {item.q}
            </span>
            <motion.span
              animate={{ rotate: openIdx === i ? 45 : 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="mt-1 flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border border-[var(--sand-400)] text-[var(--sand-700)] group-hover:border-foreground group-hover:text-foreground transition-colors duration-300"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <line
                  x1="5"
                  y1="1"
                  x2="5"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <line
                  x1="1"
                  y1="5"
                  x2="9"
                  y2="5"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openIdx === i && (
              <motion.div
                key="answer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.38, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-[var(--sand-700)] leading-relaxed max-w-2xl">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <div className="border-t border-[var(--sand-300)]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEO CONTENT (below atlas — for search crawlers)
   ═══════════════════════════════════════════════════════════════════════════ */

function SeoServiceSection({ item }: { item: FlatAtlasItem }) {
  type Spec = { k: string; v: string };
  type Reco = { label: string; href: string };
  const listSection = item.sections.find((s) => s.type === "list");
  const specsSection = item.sections.find((s) => s.type === "specs");
  const listItems = listSection?.type === "list" ? listSection.items : [];
  const specs: Spec[] = specsSection?.type === "specs" ? specsSection.specs : [];

  return (
    <section
      id={item.id}
      aria-label={item.title}
      className="border-t border-[var(--sand-300)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-32">
              <Eyebrow>
                <span className="font-mono text-[var(--gold)]">{item.code}</span>
              </Eyebrow>
              <h2 className="mt-5 font-display text-4xl md:text-5xl leading-[0.95] tracking-tight">
                {item.title}
              </h2>
              <p className="mt-6 text-[var(--sand-700)] leading-relaxed max-w-sm">
                {item.description}
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            {listItems.length > 0 && (
              <>
                <h3 className="text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                  What&apos;s included
                </h3>
                <ul className="mt-4">
                  {listItems.map((inc) => (
                    <li
                      key={inc}
                      className="border-t border-[var(--sand-300)] py-3.5 text-[var(--sand-700)] leading-relaxed"
                    >
                      {inc}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {specs.length > 0 && (
              <>
                <h3 className="mt-12 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                  Typical timelines
                </h3>
                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  {specs.map((s: Spec) => (
                    <div
                      key={s.k}
                      className="flex items-baseline justify-between gap-4 border-t border-[var(--sand-300)] py-3"
                    >
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--sand-400)]">
                        {s.k}
                      </dt>
                      <dd className="text-sm text-[var(--sand-700)] text-right">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {item.pairings.length > 0 && (
              <p className="mt-12 text-sm text-[var(--sand-700)] leading-relaxed">
                {item.title} is most paired with:{" "}
                {item.pairings.map((r: Reco, i: number) => (
                  <span key={r.href}>
                    <a
                      href={r.href}
                      className="text-foreground underline underline-offset-4 hover:text-[var(--gold)] transition-colors"
                    >
                      {r.label}
                    </a>
                    {i < item.pairings.length - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            )}

            {item.faqs.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                  Frequently asked
                </h3>
                <FaqList items={item.faqs} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const GENERAL_FAQS: Faq[] = [
  {
    q: "What is DGV Company's typical production lead time?",
    a: "Standard lead times vary by product: labels 5–7 days, commercial print 7–10 days, packaging 10–14 days, rigid boxes 14–21 days. Expedited production is available. All timelines are confirmed at the point of order.",
  },
  {
    q: "Do you serve clients outside India?",
    a: "Yes. DGV Company ships to clients across Asia, Europe, the Americas, Africa, and Oceania. We handle all export documentation, commercial invoicing, and customs coordination.",
  },
  {
    q: "Can I request samples before committing to full production?",
    a: "Yes — pre-production samples are standard for all packaging and labelling projects. For commercial print, press proofs and digital soft-proofs are available. Sampling is included in our standard process.",
  },
];


/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

function VasPage() {
  return (
    <main className="relative bg-background text-foreground overflow-x-clip min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 bg-grid-fine grid-fade opacity-60"
        aria-hidden
      />
      <PremiumNav />

      {/* ── Services Atlas ───────────────────────────────────────────────── */}
      <FlatAtlas items={VAS_ITEMS} config={ATLAS_CONFIG} />

      {/* ── Overall FAQ ──────────────────────────────────────────────────── */}
      <section
        className="border-t border-[var(--sand-300)] py-20 md:py-28"
        aria-label="General questions"
      >
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="md:sticky md:top-32">
                <Eyebrow>FAQ</Eyebrow>
                <h2 className="mt-6 font-display text-4xl md:text-5xl leading-[0.95] text-balance">
                  Partnership, answered.
                </h2>
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <FaqList items={GENERAL_FAQS} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-32 border-t border-[var(--sand-300)]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className="font-display text-3xl md:text-5xl leading-[1.05] text-balance max-w-3xl mx-auto">
              More than a printer.{" "}
              <span className="italic font-light">A production partner.</span>
            </p>
            <p className="mt-6 max-w-md mx-auto text-[var(--sand-700)] leading-relaxed">
              Tell us where you need support — design, development, manufacturing,
              or fulfilment — and we&apos;ll build the right programme around you.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <a
                href="mailto:abhinav@dgvcompany.com"
                className="magnetic-btn inline-flex items-center gap-3 border border-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em]"
              >
                <span>Start a Conversation</span>
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)] hover:text-foreground transition-colors group"
              >
                <span className="h-px w-8 bg-[var(--sand-400)] group-hover:w-14 transition-all duration-500" />
                Back to Home
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
