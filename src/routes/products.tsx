import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PremiumNav } from "@/components/PremiumNav";
import { PremiumFooter } from "@/components/PremiumFooter";
import { PackagingAtlas } from "@/components/PackagingAtlas";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   SEO CONTENT — rendered below the Atlas for search engine indexing.
   Visually minimal; semantically complete.
───────────────────────────────────────────────────────────────────────────── */

type Faq = { q: string; a: string };

type SeoSection = {
  id: string;
  code: string;
  title: string;
  positioning: string;
  differentiators: { label: string; detail: string }[];
  applications: string[];
  decisionGuide: { format: string; when: string }[];
  techRef: string;
  faqs: Faq[];
};

const SEO_SECTIONS: SeoSection[] = [
  {
    id: "rigid-boxes",
    code: "01",
    title: "Rigid Boxes",
    positioning:
      "Rigid boxes are the most over- and under-specified format in packaging. We engineer every configuration — from structural brief to first article approval — with documented board weights, wrap paper grades, and tolerance specifications before volume production is released.",
    differentiators: [
      {
        label: "In-house structural engineering",
        detail:
          "Original dielines for non-standard formats, unusual dimensions, and multi-tier constructions. No outsourcing; the same team that designs the structure runs the press.",
      },
      {
        label: "First article before production",
        detail:
          "Every new rigid box specification is built to a physical first article. Adjustments are made before cost is committed at scale.",
      },
      {
        label: "Archived artwork for reorders",
        detail:
          "All specifications are documented and artwork archived at production resolution. Year-over-year reorders reproduce the original exactly.",
      },
    ],
    applications: [
      "Luxury fragrance and cosmetics brands where unboxing is part of the product experience",
      "Jewellery and accessories retailers requiring precision interior inserts",
      "Corporate gifting programmes with annual reorder requirements",
      "Premium confectionery and gifting hamper producers",
    ],
    decisionGuide: [
      { format: "Magnetic closure", when: "fragrance, fine jewellery, high-value gifting — when the open/close mechanism is itself a brand moment" },
      { format: "Drawer type", when: "watches, multi-item corporate sets, accessories where a horizontal reveal presents the product" },
      { format: "Lid & base", when: "apparel, electronics, premium food — when stackability and reusability matter" },
      { format: "Foldable rigid", when: "e-commerce premium programmes where freight cost and storage space are real constraints" },
      { format: "Jewellery box", when: "ring, bangle, and necklace formats requiring interior-engineered fit at micro scale" },
    ],
    techRef:
      "Board: 1200–2400 GSM greyboard. Wraps: art paper 130–170 GSM, textured, specialty. Finishes: soft-touch lamination, hot foil stamping, cold foil, embossing/debossing, spot UV.",
    faqs: [
      {
        q: "What is your minimum order quantity for rigid boxes?",
        a: "Standard minimum is 500 units, varying by format and complexity. Magnetic closure and multi-compartment configurations typically start from 200 units for sampling runs, scaling to volume once the first article is approved.",
      },
      {
        q: "Can you supply rigid boxes with custom structural engineering?",
        a: "Yes. Our structural team produces original dieline designs for non-standard formats — unusual dimensions, multi-tier constructions, and specialist closure mechanisms, handled in-house from brief through to first article.",
      },
      {
        q: "How do I choose between magnetic closure, drawer, and foldable formats?",
        a: "Magnetic closure is the premium unboxing format — choose it when the act of opening is part of the brand experience. Drawer boxes suit multi-component sets where the horizontal reveal matters. Foldable rigid gives the same material quality at lower freight cost — the right choice for e-commerce programmes shipping at volume where storage space counts.",
      },
    ],
  },
  {
    id: "paper-bags",
    code: "02",
    title: "Paper Bags",
    positioning:
      "A paper bag is the last branded surface a customer touches before leaving your store — and the one that travels with them afterward. We engineer bags to carry weight reliably, print to brand specification, and last long enough to be used again.",
    differentiators: [
      {
        label: "Handle specification to weight rating",
        detail:
          "Handle type — twisted paper, ribbon, rope, die-cut — is matched to substrate weight and intended load. Every specification is tested before production commitment.",
      },
      {
        label: "Structural prototyping for custom formats",
        detail:
          "Die-cut bags, shaped bases, and non-standard gussets are prototyped before volume production. You approve the physical structure before cost is committed.",
      },
      {
        label: "PMS colour accuracy across reorders",
        detail:
          "Offset production calibrated to PMS reference, so bag colour remains consistent across runs and across formats in the same campaign.",
      },
    ],
    applications: [
      "Fashion boutiques needing carry packaging that reflects their in-store aesthetic",
      "Luxury food and confectionery brands with seasonal gifting requirements",
      "Corporate events and gifting programmes requiring branded carry at volume",
      "Cosmetics and beauty retail at both boutique and chain scale",
    ],
    decisionGuide: [
      { format: "Kraft", when: "sustainability positioning, food and grocery, minimal aesthetic, fully recyclable" },
      { format: "Laminated board", when: "premium fashion and beauty carry — structured feel, water resistance, soft-touch or gloss finish" },
      { format: "Luxury paper bag", when: "flagship retail, gifting, hospitality — premium board, ribbon handles, designed to outlast the occasion" },
      { format: "Retail carry bag", when: "high-volume store use, exhibition carry, consistent large-run production" },
      { format: "Custom printed", when: "campaign, limited edition, shaped formats, full-canvas structural design briefs" },
    ],
    techRef:
      "Substrates: kraft 90–150 GSM, art card 250–350 GSM, premium board 350–500 GSM, FSC-certified options available. Finishes: gloss, matte, soft-touch lamination, foil blocking, embossing, spot UV.",
    faqs: [
      {
        q: "What handle options are available for paper bags?",
        a: "Twisted paper handles (standard and reinforced), flat ribbon handles in satin and grosgrain, rope handles in cotton and jute, and die-cut soft-touch handles integrated into the bag structure. Handle choice is matched to the bag's weight rating and brand positioning.",
      },
      {
        q: "Can you produce paper bags with fully custom structural shapes?",
        a: "Yes. Die-cut formats — hexagonal bottoms, shaped bags, non-standard gussets — are produced from custom-engineered dielines. Structural prototypes are provided before volume production is committed.",
      },
      {
        q: "What is the practical difference between laminated and luxury paper bags?",
        a: "Laminated bags use a heavy art card with a surface laminate — a rigid, structured carry format for premium everyday retail. Luxury paper bags are built from heavier board (350–500 GSM) with more considered finishing — foil, embossing, satin ribbon handles — and are designed to be kept rather than discarded. The distinction is substrate weight, handle type, and finishing specification. We'll advise on which matches your positioning and volume.",
      },
    ],
  },
  {
    id: "commercial-printing",
    code: "03",
    title: "Commercial Printing",
    positioning:
      "Commercial print fails in two ways: colour drift across a long run, and quality variation between reorders. Our press workflow is calibrated to ISO 12647-2 — the international publishing standard — so every job leaves with a documented Delta E measurement, not an impression.",
    differentiators: [
      {
        label: "ISO 12647-2 press calibration",
        detail:
          "Inline spectrophotometry monitors colour density continuously through every run. Delta E tolerances are agreed before production and documented on every job ticket.",
      },
      {
        label: "Pre-press file verification",
        detail:
          "Every file is checked for resolution, bleed, colour mode, and font embedding before plating. Issues are resolved before the press, not after.",
      },
      {
        label: "Full binding in-house",
        detail:
          "Saddle-stitch, perfect bind, case binding, section sewing, and spiral are all produced on-site. No third-party bindery means no handoff, no delay, no quality gap between print and finish.",
      },
    ],
    applications: [
      "Corporate communications and investor relations teams requiring exact, replicable colour",
      "Product launch campaigns coordinating high-volume print across multiple formats",
      "Educational institutions producing course materials and reference publications",
      "Retail brands maintaining consistent point-of-sale print across locations",
    ],
    decisionGuide: [
      { format: "Brochures", when: "sales presentations, trade show handouts, DL through A4 in folded and perfect-bound formats" },
      { format: "Catalogues", when: "product range documentation, trade buyer reference, 16–300+ pages in soft or case cover" },
      { format: "Flyers & leaflets", when: "single-message promotions, events, high-volume distribution" },
      { format: "Corporate stationery", when: "letterheads, business cards, compliment slips as a coherent brand system" },
      { format: "Notebooks & book printing", when: "corporate notebooks, trade directories, commissioned publications" },
    ],
    techRef:
      "Papers: art paper 90–350 GSM, coated woodfree 80–200 GSM, laid and watermarked stocks. Finishes: lamination (gloss/matte/soft-touch), spot UV, foil blocking. Binding: saddle-stitch, perfect bind, case binding, spiral.",
    faqs: [
      {
        q: "What file formats do you accept for commercial printing?",
        a: "We accept print-ready PDFs (PDF/X-1a or PDF/X-4), Adobe Illustrator AI files, EPS, and high-resolution TIFFs at 300 DPI with 3mm bleed in CMYK. Our pre-press team checks every file before production and flags any issues with colour, resolution, or bleed before plates are committed.",
      },
      {
        q: "How do you ensure colour consistency across long print runs?",
        a: "Our press workflow is calibrated to ISO 12647-2. We use ICC colour profiles, press proofs, and inline spectrophotometry to monitor colour density throughout each run. Delta E tolerances are agreed before production begins.",
      },
      {
        q: "What are the lead times for brochures and catalogues?",
        a: "Standard brochures: 5–7 working days from approved artwork. Catalogues (32+ pages, perfect bound): 7–10 working days. Case-bound or specialty stock specifications: 12–15 working days. Rush turnarounds are available for standard formats — confirm requirements at brief stage.",
      },
    ],
  },
  {
    id: "calendars-diaries",
    code: "04",
    title: "Calendars & Diaries",
    positioning:
      "Calendars and diaries are the only marketing format used every day for 365 days. We design and produce them entirely in-house — from cover brief to archived artwork — so the specification is reproducible without quality loss across consecutive years.",
    differentiators: [
      {
        label: "Full studio design, not customisation",
        detail:
          "Cover concept, monthly spreads, section dividers, and branded content pages are designed by our studio from your brief. You receive an original branded artefact, not an off-the-shelf format with a logo applied.",
      },
      {
        label: "Artwork archiving for annual reorders",
        detail:
          "Every project is archived at production resolution. Year-over-year reorders reproduce the original specification — same cover finish, same foil position, same inner layout.",
      },
      {
        label: "October production programme",
        detail:
          "For year-end corporate gifting, we run a structured October production cycle that guarantees delivery before December. We flag this at briefing, not after it's too late.",
      },
    ],
    applications: [
      "Corporate gifting and employee recognition programmes requiring annual, high-volume production",
      "Real estate, financial services, and insurance brands building daily desk presence with clients",
      "Pharmaceutical and healthcare companies gifting to medical and procurement contacts",
      "FMCG brands using diaries as high-value trade customer retention tools",
    ],
    decisionGuide: [
      { format: "Wall calendars", when: "maximum daily visibility; art-directed, best for client-facing offices where brand impressions per day matter" },
      { format: "Desk calendars", when: "daily workspace reference; tent, easel, and flat pad formats for different desk environments" },
      { format: "Corporate diaries", when: "professional daily use at volume; PU leather and hard-cover options, dated and undated" },
      { format: "Executive diaries", when: "C-suite and high-value client gifting; genuine leather, gilt-edge pages, presentation box delivery" },
      { format: "Custom designed diaries", when: "full layout from brief; original internal content, branded section dividers — not a customised off-the-shelf format" },
    ],
    techRef:
      "Covers: PU leather, genuine leather, art board 250–400 GSM. Inner: 70–100 GSM bond. Finishes: foil blocking, debossing, gilt-edge gilding, ribbon bookmark, elastic closure, sleeve and box presentation.",
    faqs: [
      {
        q: "Can you design and print diaries that are exclusive to our brand?",
        a: "Yes. Our studio produces fully bespoke diary designs — cover concept, internal layout, month spreads, section dividers, and branded content pages — all to brief. We archive artwork for exact reprint continuity across years.",
      },
      {
        q: "What is the lead time for calendars and diaries?",
        a: "Standard lead time is 21–28 working days from approved artwork. Orders above 2,000 units may require up to 35 working days. We recommend placing year-end gifting orders by October.",
      },
      {
        q: "What is the practical difference between corporate and executive diary specifications?",
        a: "Corporate diaries are produced in PU leather or hard-cover board — professional, durable, suitable for company-wide gifting at volume. Executive diaries are produced in genuine leather or premium leatherette with gilt-edge gilding, multiple silk ribbon markers, and presentation box packaging. The distinction is material grade, finishing detail, and unit cost — and the choice comes down to recipient tier and gifting context.",
      },
    ],
  },
  {
    id: "marketing-branding",
    code: "05",
    title: "Marketing & Branding",
    positioning:
      "A corporate profile or presentation folder is often the last printed material a decision-maker handles before forming a view. We produce it at a standard that confirms the impression your team worked to create — not one that quietly undermines it.",
    differentiators: [
      {
        label: "Rush exhibition turnaround",
        detail:
          "We maintain substrate inventory for common exhibition formats. Standard items turn in 3–5 working days from artwork approval. Bespoke die-cut or foiled formats: 7 working days minimum.",
      },
      {
        label: "Print Studio working directly from brand guidelines",
        detail:
          "We produce print-ready artwork from your brand guidelines, not through an agency intermediary. No interpretation errors, no quality gap between concept and press.",
      },
      {
        label: "POS engineered for the retail environment",
        detail:
          "Wobblers, danglers, and shelf-ready materials are specified for their actual context — adhesive type, water resistance, and mounting configuration are part of the brief, not afterthoughts.",
      },
    ],
    applications: [
      "Trade show and conference teams needing exhibition materials under time pressure",
      "Investor relations and board communication teams requiring high-specification documents",
      "New business development teams needing presentation folders matched precisely to pitch materials",
      "Retail brands producing in-store POS at volume across multiple locations",
    ],
    decisionGuide: [
      { format: "Product catalogues", when: "comprehensive range documentation for trade buyers, wholesale and retail presentations" },
      { format: "Corporate profiles & annual reports", when: "investor relations, stakeholder communications, board-level documents" },
      { format: "Presentation folders", when: "sales pitches, tenders, new business development — carries the collateral without compromising it" },
      { format: "Danglers & wobblers", when: "retail shelf and gondola POS; attention capture in FMCG and pharmacy environments" },
      { format: "Exhibition materials", when: "trade show presence from roller banners to full-scale fabric backdrops, 3–7 day turnaround" },
    ],
    techRef:
      "Substrates: premium art board 300–400 GSM, textured and duplex stocks, synthetic and waterproof for display, PVC/acrylic for POS. Finishes: spot UV, soft-touch lamination, die-cutting, foil blocking, embossing, padding.",
    faqs: [
      {
        q: "Can you produce exhibition materials at short notice?",
        a: "Yes — we maintain substrate inventory for common exhibition formats. Rush turnarounds of 3–5 working days are available for standard items. Bespoke die-cut or foiled materials require a minimum of 7 working days from artwork approval.",
      },
      {
        q: "Do you provide design services for marketing collateral?",
        a: "Our in-house studio handles the full creative brief — from concept and layout through to print-ready artwork. We also work with your existing brand guidelines and agency artwork, adapting it correctly for print production.",
      },
      {
        q: "How do you manage multi-format campaigns where everything must match?",
        a: "We establish a centralised colour specification before production begins. All formats — folders, brochures, flyers, exhibition materials — are produced against the same ICC profile and PMS references. A master colour proof is signed off across all formats before any plates are committed.",
      },
    ],
  },
  {
    id: "corrugated-boxes",
    code: "06",
    title: "Corrugated Boxes",
    positioning:
      "Most corrugated box failures happen because specifications were based on assumptions rather than test data. We specify every corrugated box to actual load and stacking conditions — with BCT, drop, and vibration testing in-house — so the box performs as specified at the point that matters.",
    differentiators: [
      {
        label: "In-house BCT, ECT, and FEFCO drop testing",
        detail:
          "Box Compression Test, Edge Crush Test, and drop/vibration testing are performed on every new specification. Results are included in quality documentation as standard, not available on request.",
      },
      {
        label: "Export documentation and fumigation",
        detail:
          "Commercial invoicing, phytosanitary certificates, fumigation documentation, and customs coordination are managed in-house for export shipments. The packaging doesn't hold up the freight.",
      },
      {
        label: "Retail-ready to freight-ready, one facility",
        detail:
          "From litho-laminated D2C unboxing boxes to triple-wall pallet export: same factory, same quality system, same account team.",
      },
    ],
    applications: [
      "E-commerce brands shipping direct-to-consumer, where the outer box is a brand surface",
      "FMCG and food & beverage manufacturers shipping at distribution volume",
      "Industrial and engineering companies requiring tested, documented heavy-duty specifications",
      "Exporters needing export-grade construction with full documentation",
    ],
    decisionGuide: [
      { format: "E-commerce boxes", when: "E/B-flute, auto-bottom, flexographic or litho-laminated print, optimised for packing line speed and unboxing experience" },
      { format: "Standard corrugated", when: "RSC, HSC, FEFCO formats for FMCG distribution, general freight, consistent dimensional tolerance" },
      { format: "Heavy-duty", when: "double-wall EB/BC, triple-wall for export freight, industrial components, and pallet stacking heights of 4m+" },
      { format: "Custom printed", when: "litho-laminated full CMYK for D2C brands making the outer box part of the brand experience" },
      { format: "Die-cut", when: "shelf-ready and display-ready formats, FEFCO 5 and FEFCO 6 display configurations" },
    ],
    techRef:
      "Flutes: E 1.2mm, B 3mm, double-wall EB/BC, triple-wall. Print: flexographic 1–6 colour, litho-laminated full CMYK, water-based coatings. Testing: BCT, ECT, FEFCO drop.",
    faqs: [
      {
        q: "What is your minimum order for custom corrugated boxes?",
        a: "Standard minimum for custom-printed corrugated boxes is 500 units. For plain board or single-colour flexographic print, orders from 250 units can be accommodated. High-volume runs above 10,000 units attract significant per-unit cost reductions.",
      },
      {
        q: "Can you test corrugated boxes for transit performance?",
        a: "Yes. BCT, FEFCO drop and vibration testing, and ECT are performed in-house. Results are provided with each new specification and included in quality documentation.",
      },
      {
        q: "How do I decide between flexographic and litho-laminated print for corrugated boxes?",
        a: "Flexographic is right for functional shipping boxes where brand visibility matters but is not primary — 1–4 colours, cost-efficient at volume, fast turnaround. Litho-laminated treats the box as a brand surface — full CMYK, photographic quality, smooth board liner. The decision comes down to brand intent: is this a shipping box that carries your logo, or a brand experience that happens to be a box?",
      },
    ],
  },
];

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

const ITEMLIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "DGV Company Product Families",
  itemListElement: SEO_SECTIONS.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: s.title,
      description: s.positioning,
      brand: { "@type": "Brand", name: "DGV Company" },
    },
  })),
};

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Rigid Boxes, Paper Bags & Packaging | DGV Company" },
      {
        name: "description",
        content:
          "Explore DGV Company's six product families — luxury rigid boxes, paper bags, commercial printing, calendars & diaries, marketing collaterals, and corrugated packaging. Built for consistency, durability and scale.",
      },
      { property: "og:title", content: "Products — DGV Company" },
      {
        property: "og:description",
        content:
          "Six product families. One trusted print and packaging partner.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ITEMLIST_SCHEMA),
      },
    ],
  }),
  component: ProductsPage,
});

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED UI
───────────────────────────────────────────────────────────────────────────── */

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
                <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
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

function SeoSectionBlock({ section }: { section: SeoSection }) {
  return (
    <section
      id={section.id}
      aria-label={section.title}
      className="border-t border-[var(--sand-300)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid grid-cols-12 gap-8 md:gap-12">

          {/* Left: sticky positioning */}
          <div className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-32">
              <Eyebrow>
                <span className="font-mono text-[var(--gold)]">{section.code}</span>
              </Eyebrow>
              <h2 className="mt-5 font-display text-4xl md:text-5xl leading-[0.95] tracking-tight">
                {section.title}
              </h2>
              <p className="mt-5 text-[var(--sand-700)] leading-relaxed max-w-sm text-sm">
                {section.positioning}
              </p>
            </div>
          </div>

          {/* Right: conversion content */}
          <div className="col-span-12 md:col-span-8 space-y-14">

            {/* Key Differentiators */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                Why DGV for this
              </h3>
              <ul className="mt-5 space-y-0">
                {section.differentiators.map((d) => (
                  <li key={d.label} className="border-t border-[var(--sand-300)] pt-5 pb-5">
                    <span className="block text-sm font-medium text-foreground mb-1.5">{d.label}</span>
                    <span className="text-sm text-[var(--sand-700)] leading-relaxed">{d.detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who orders this */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                Who orders this
              </h3>
              <ul className="mt-4">
                {section.applications.map((app) => (
                  <li
                    key={app}
                    className="border-t border-[var(--sand-300)] py-3.5 text-[var(--sand-700)] leading-relaxed text-sm"
                  >
                    {app}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decision Guide */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                Which format for your need
              </h3>
              <ul className="mt-4">
                {section.decisionGuide.map((item) => (
                  <li
                    key={item.format}
                    className="border-t border-[var(--sand-300)] py-3.5 flex flex-col sm:flex-row sm:gap-6 gap-1 text-sm"
                  >
                    <span className="font-medium text-foreground sm:min-w-[160px] shrink-0">{item.format}</span>
                    <span className="text-[var(--sand-700)] leading-relaxed">{item.when}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Reference */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                Technical reference
              </h3>
              <p className="mt-4 text-sm text-[var(--sand-700)] leading-relaxed border-t border-[var(--sand-300)] pt-4">
                {section.techRef}
              </p>
            </div>

            {/* FAQs */}
            <div>
              <h3 className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                Frequently asked
              </h3>
              <FaqList items={section.faqs} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

function ProductsPage() {
  return (
    <main className="relative bg-background text-foreground overflow-x-clip">
      <PremiumNav />

      {/* ── Packaging Atlas ─────────────────────────────────────────────── */}
      <PackagingAtlas />

      {/* ── General FAQ ──────────────────────────────────────────────────── */}
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
                  Questions, answered.
                </h2>
                <p className="mt-5 text-sm text-[var(--sand-700)] leading-relaxed max-w-xs">
                  The questions above are specific to each product. These cover
                  process, timeline, and geography — the ones that apply to any
                  project, regardless of format.
                </p>
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
              Don&apos;t see exactly what you need?{" "}
              <span className="italic font-light">We&apos;ll make it.</span>
            </p>
            <p className="mt-6 max-w-md mx-auto text-[var(--sand-700)] leading-relaxed">
              Our capabilities extend well beyond this list. Contact us with
              your requirement and we&apos;ll advise on the best solution.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <a
                href="mailto:abhinav@dgvcompany.com,dgvcompany1@gmail.com"
                className="magnetic-btn inline-flex items-center gap-3 border border-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em]"
              >
                <span>Get a Quote in 24 Hours</span>
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
