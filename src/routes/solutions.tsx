import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PremiumNav } from "@/components/PremiumNav";
import { PremiumFooter } from "@/components/PremiumFooter";
import { FlatAtlas, type FlatAtlasItem, type FlatAtlasConfig } from "@/components/FlatAtlas";
import heroPackage from "@/assets/hero-package.jpg";
import materialsImg from "@/assets/materials.jpg";
import craftImg from "@/assets/craft.jpg";
import productStoryImg from "@/assets/product-story.jpg";

const EASE = [0.16, 1, 0.3, 1] as const;
const IMAGES = [heroPackage, materialsImg, craftImg, productStoryImg];
const img = (i: number) => IMAGES[i % IMAGES.length];

/* ═══════════════════════════════════════════════════════════════════════════
   PROCESS ATLAS DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const PROCESS_ITEMS: FlatAtlasItem[] = [
  {
    id: "offset-printing",
    code: "01",
    title: "Offset Printing",
    tagline: "The benchmark for colour-critical commercial print",
    description:
      "Sheet-fed offset is the benchmark for colour-critical commercial and packaging print — exceptional consistency, faithful Pantone reproduction, and a full range of inline coatings.",
    insight:
      "Offset printing remains the dominant process for premium commercial and packaging applications because of its unmatched colour fidelity at volume. The quality advantage over digital becomes especially significant on dark backgrounds, metallics, and critical brand colours.",
    image: img(0),
    imageAlt:
      "High-quality offset printing press producing premium packaging with accurate Pantone colour reproduction",
    video: "/videos/solutions/offset-printing.mp4",
    sections: [
      {
        type: "list",
        heading: "Typical applications",
        items: [
          "Mono cartons and folding cartons",
          "Luxury rigid box covers",
          "Corporate brochures and catalogues",
          "Annual reports and magazines",
          "Marketing collaterals and posters",
        ],
      },
      {
        type: "specs",
        heading: "Output specifications",
        specs: [
          { k: "Max sheet size", v: "72 × 102 cm" },
          { k: "Colours", v: "Up to 8 + inline coating" },
          { k: "Run length", v: "500 – 500,000+" },
          { k: "Standard", v: "ISO 12647-2" },
        ],
      },
    ],
    pairings: [
      { label: "Conversion", href: "#conversion" },
      { label: "Binding", href: "#binding" },
      { label: "Digital Printing", href: "#digital-printing" },
    ],
    faqs: [
      {
        q: "What is offset printing best suited for?",
        a: "Offset printing excels at colour-critical, medium-to-high volume work where Pantone accuracy, consistent ink density, and premium substrate options are required — folding cartons, rigid box wraps, brochures, catalogues, and annual reports.",
      },
      {
        q: "What is your minimum quantity for offset printing?",
        a: "Offset printing becomes cost-effective from approximately 500 units upward for most formats, though the break-even versus digital varies by sheet size and number of colours. Below that threshold we typically recommend digital printing.",
      },
    ],
  },
  {
    id: "web-offset-printing",
    code: "02",
    title: "Web Offset Printing",
    tagline: "High-throughput reel-fed production at scale",
    description:
      "Continuous reel printing delivering high throughput at the lowest per-unit cost — the standard choice for long-run publications, direct mail and forms.",
    insight:
      "Web offset is the appropriate process when volume is the overriding variable and the run length makes sheet-fed offset tooling costs prohibitive. The per-copy cost curve drops significantly above 25,000 copies, making it the standard choice for newspaper, insert, and direct mail production.",
    image: img(1),
    imageAlt:
      "Web offset printing press with continuous paper reel producing high-volume commercial print publications",
    video: "/videos/solutions/web-offset-printing.mp4",
    sections: [
      {
        type: "list",
        heading: "Typical applications",
        items: [
          "Newspapers and periodicals",
          "Direct mail and inserts",
          "Large-format leaflet runs",
          "OMR and examination forms",
          "Manuals and documentation",
        ],
      },
      {
        type: "specs",
        heading: "Output specifications",
        specs: [
          { k: "Feed", v: "Continuous reel (web)" },
          { k: "Run length", v: "5,000 – multi-million" },
          { k: "Colours", v: "4 process + spot" },
          { k: "Drying", v: "Heatset & coldset" },
        ],
      },
    ],
    pairings: [
      { label: "Offset Printing", href: "#offset-printing" },
      { label: "Binding", href: "#binding" },
      { label: "Conversion", href: "#conversion" },
    ],
    faqs: [
      {
        q: "When should we choose web offset over sheet-fed offset?",
        a: "Web offset becomes the more economical process above approximately 25,000 copies, where the continuous reel feed and inline finishing outweigh sheet-fed tooling costs. It is the standard choice for newspapers, inserts, and high-volume direct mail.",
      },
      {
        q: "Can web offset handle inline finishing?",
        a: "Yes. Web offset presses fold, cut, and perfect (print both sides simultaneously) inline, producing finished or near-finished signatures in a single pass — a major contributor to its low per-unit cost at volume.",
      },
    ],
  },
  {
    id: "screen-printing",
    code: "03",
    title: "Screen Printing",
    tagline: "Durable ink on substrates no other process can reach",
    description:
      "Vibrant, durable surface printing on substrates where conventional processes cannot perform — PVC, glass, metal, textile and specialty boards.",
    insight:
      "Screen printing's key advantage is ink deposit thickness. A screen-printed white on a black substrate delivers opacity that offset and digital cannot approach. This makes it the correct process for PVC packaging, industrial labels, and garment print where colour vibrancy must survive repeated use or exposure.",
    image: img(2),
    imageAlt:
      "Screen printing process producing vibrant colours on specialty substrate with UV-cured ink system",
    video: "/videos/solutions/screen-printing.mp4",
    sections: [
      {
        type: "list",
        heading: "Typical applications",
        items: [
          "PVC packaging and window graphics",
          "Industrial labels and decals",
          "T-shirt and garment printing",
          "Point-of-sale displays and boards",
          "Promotional merchandise and gift items",
        ],
      },
      {
        type: "specs",
        heading: "Output specifications",
        specs: [
          { k: "Substrates", v: "PVC, glass, metal, textile" },
          { k: "Ink systems", v: "UV-cured & solvent" },
          { k: "Ink deposit", v: "High-opacity, thick film" },
          { k: "Colour", v: "Spot & process" },
        ],
      },
    ],
    pairings: [
      { label: "Conversion", href: "#conversion" },
      { label: "Fabrication", href: "#fabrication" },
      { label: "Digital Printing", href: "#digital-printing" },
    ],
    faqs: [
      {
        q: "Why choose screen printing over digital or offset?",
        a: "Screen printing delivers a far thicker ink deposit, producing high-opacity whites, metallics, and fluorescents that offset and digital cannot match — essential on dark or non-paper substrates such as PVC, glass, metal, and textile.",
      },
      {
        q: "Is screen printing durable for industrial use?",
        a: "Yes. UV-cured and solvent ink systems provide strong resistance to abrasion, chemicals, and weathering, making screen printing the correct process for industrial labels, decals, and outdoor applications.",
      },
    ],
  },
  {
    id: "flexographic-printing",
    code: "04",
    title: "Flexographic Printing",
    tagline: "The standard for label and flexible packaging at volume",
    description:
      "High-speed relief printing for self-adhesive labels, flexible packaging and corrugated board — the most efficient process for volume label production.",
    insight:
      "Flexographic printing is the process of choice for label production at volume because of its speed, substrate flexibility, and inline converting capability. The ability to print, laminate, die-cut and rewind in a single press pass significantly reduces cost and lead time versus multi-process alternatives.",
    image: img(3),
    imageAlt:
      "Flexographic printing press producing self-adhesive BOPP labels with inline die-cutting and varnish coating",
    video: "/videos/solutions/flexographic-printing.mp4",
    sections: [
      {
        type: "list",
        heading: "Typical applications",
        items: [
          "Self-adhesive labels (product, industrial, barcode)",
          "Flexible packaging and pouches",
          "Printed corrugated boxes",
          "Paper bag printing",
          "Shrink sleeves and wraparound labels",
        ],
      },
      {
        type: "specs",
        heading: "Output specifications",
        specs: [
          { k: "Substrates", v: "BOPP, PET, paper, foil, board" },
          { k: "Inline", v: "Die-cut, laminate, varnish" },
          { k: "Inks", v: "Water-based, UV, EB" },
          { k: "Web", v: "Narrow & wide" },
        ],
      },
    ],
    pairings: [
      { label: "Conversion", href: "#conversion" },
      { label: "Digital Printing", href: "#digital-printing" },
      { label: "Offset Printing", href: "#offset-printing" },
    ],
    faqs: [
      {
        q: "What makes flexographic printing ideal for labels?",
        a: "Flexo prints, laminates, varnishes, and die-cuts in a single inline press pass across a wide range of substrates — eliminating multiple converting steps and delivering the lowest cost and lead time for volume label production.",
      },
      {
        q: "Is flexographic printing suitable for food packaging?",
        a: "Yes. Water-based and electron-beam ink systems meet food-contact safety requirements, and flexo is widely used for flexible food packaging, pouches, and labels under the appropriate compliance documentation.",
      },
    ],
  },
  {
    id: "digital-printing",
    code: "05",
    title: "Digital Printing",
    tagline: "On-demand and plate-free, from one unit to thousands",
    description:
      "On-demand, plate-free printing for short runs, variable data and rapid turnaround — economical from a single copy upward.",
    insight:
      "Digital printing's economic advantage is most pronounced below 2,000 copies — the crossover point at which offset plate costs typically become justified. For personalised campaigns, prototype runs, and short-run packaging where every unit can be unique, digital is the only viable process.",
    image: img(4),
    imageAlt:
      "Digital printing machine producing short-run personalised packaging with variable data and unique QR codes",
    video: "/videos/solutions/digital-printing.mp4",
    sections: [
      {
        type: "list",
        heading: "Typical applications",
        items: [
          "Short-run labels and stickers",
          "Personalised direct mail",
          "Prototypes and sampling",
          "Event collaterals and programmes",
          "Variable data packaging inserts",
        ],
      },
      {
        type: "specs",
        heading: "Output specifications",
        specs: [
          { k: "Minimum quantity", v: "From 1 copy" },
          { k: "Variable data", v: "Full — per-unit unique" },
          { k: "Turnaround", v: "Same day – 48 hours" },
          { k: "Finishes", v: "Matte, gloss, satin" },
        ],
      },
    ],
    pairings: [
      { label: "Offset Printing", href: "#offset-printing" },
      { label: "Flexographic Printing", href: "#flexographic-printing" },
      { label: "Conversion", href: "#conversion" },
    ],
    faqs: [
      {
        q: "When is digital printing more economical than offset?",
        a: "Digital is most economical below roughly 2,000 copies, where there are no plate or make-ready costs. It is also the only viable process for fully variable data, personalisation, and rapid prototype runs.",
      },
      {
        q: "Can digital match offset colour?",
        a: "Modern digital presses are calibrated against offset reference profiles, achieving close colour matching for most commercial work. For the most critical brand colours and metallics, offset remains superior, and we advise on the right choice per job.",
      },
    ],
  },
  {
    id: "conversion",
    code: "06",
    title: "Conversion",
    tagline: "Where printed sheets become functional packaging",
    description:
      "The post-press operations that turn flat printed sheets into functional packaging — die-cutting, creasing, lamination and foiling, all in-house.",
    insight:
      "Converting is where a printed sheet becomes a product. The precision of the die-cutting, the consistency of the crease, and the adhesion of the lamination determine whether the finished packaging behaves as designed — or fails in the field. In-house conversion gives us quality control at every stage.",
    image: img(5),
    imageAlt:
      "Die-cutting and foil stamping machine converting printed sheets into luxury packaging components",
    video: "/videos/solutions/conversion.mp4",
    sections: [
      {
        type: "list",
        heading: "Typical applications",
        items: [
          "Folding carton and rigid box manufacturing",
          "Label converting from reel",
          "Surface finishing for premium print",
          "Specialty packaging construction",
          "Security feature integration",
        ],
      },
      {
        type: "specs",
        heading: "Output specifications",
        specs: [
          { k: "Die-cutting", v: "Any shape & tolerance" },
          { k: "Lamination", v: "Gloss, matte, soft-touch" },
          { k: "Foil", v: "Hot & cold stamping" },
          { k: "Output", v: "Reel & sheet" },
        ],
      },
    ],
    pairings: [
      { label: "Offset Printing", href: "#offset-printing" },
      { label: "Fabrication", href: "#fabrication" },
      { label: "Binding", href: "#binding" },
    ],
    faqs: [
      {
        q: "What does conversion include?",
        a: "Conversion covers every post-press operation that transforms a printed sheet into a finished product — die-cutting, creasing, lamination, foiling, embossing, slitting, and perforating — all performed in-house under a single quality system.",
      },
      {
        q: "Why does in-house conversion matter?",
        a: "Keeping conversion in-house means colour, registration, and cut accuracy are controlled end-to-end without handing work to third parties. It removes a major source of defects and delay in packaging production.",
      },
    ],
  },
  {
    id: "fabrication",
    code: "07",
    title: "Fabrication",
    tagline: "Structural build from dieline to hand-finished assembly",
    description:
      "Structural build of packaging forms, retail display units and bespoke print products — from dieline engineering to hand-finished assembly.",
    insight:
      "Fabrication is the most labour-intensive stage of packaging production — and the stage most vulnerable to inconsistency. Our fabrication team operates to a documented build specification for every product, with QC sign-off at each assembly stage before packaging for dispatch.",
    image: img(6),
    imageAlt:
      "Luxury rigid box being hand-assembled and finished in a precision packaging fabrication facility",
    video: "/videos/solutions/fabrication.mp4",
    sections: [
      {
        type: "list",
        heading: "Typical applications",
        items: [
          "Luxury rigid box production",
          "Retail POS and display units",
          "Gift set and hamper construction",
          "Exhibition and event installations",
          "Complex multi-part packaging",
        ],
      },
      {
        type: "specs",
        heading: "Output specifications",
        specs: [
          { k: "Construction", v: "Rigid box, hand-finished" },
          { k: "Display units", v: "Counter & floor" },
          { k: "QC", v: "Sign-off at each stage" },
          { k: "Build", v: "Documented specification" },
        ],
      },
    ],
    pairings: [
      { label: "Conversion", href: "#conversion" },
      { label: "Offset Printing", href: "#offset-printing" },
      { label: "Binding", href: "#binding" },
    ],
    faqs: [
      {
        q: "What kinds of structures do you fabricate?",
        a: "We fabricate luxury rigid boxes, retail counter and floor display units, gift sets and hampers, exhibition installations, and complex multi-component packaging — from dieline engineering through to hand-finished assembly.",
      },
      {
        q: "How do you maintain consistency in hand-finished work?",
        a: "Every product is built to a documented specification with QC sign-off at each assembly stage. This is what prevents the inconsistency that labour-intensive fabrication is otherwise prone to.",
      },
    ],
  },
  {
    id: "binding",
    code: "08",
    title: "Binding",
    tagline: "Bound precision, from saddle-stitch to hardcover",
    description:
      "Professional finishing for publications and bound collaterals — from saddle-stitching through to case-bound hardcover editions.",
    insight:
      "The binding method determines how a publication lays flat, how it ages, and how it is perceived. A perfect-bound catalogue that opens flat and stays open reinforces product quality. A hardcover case-bound annual report communicates institutional permanence. The binding is never neutral.",
    image: img(7),
    imageAlt:
      "Premium hardcover case-bound annual report with foil-blocked cover being quality checked in bindery",
    video: "/videos/solutions/binding.mp4",
    sections: [
      {
        type: "list",
        heading: "Typical applications",
        items: [
          "Corporate diaries and planners",
          "Product catalogues and look-books",
          "Annual reports",
          "Training manuals and documentation",
          "Coffee-table books and collectibles",
        ],
      },
      {
        type: "specs",
        heading: "Output specifications",
        specs: [
          { k: "Methods", v: "Perfect, case, saddle, spiral" },
          { k: "Hardcover", v: "Thread-sewn available" },
          { k: "Inline", v: "Cover lamination & blocking" },
          { k: "Formats", v: "A6 – A3 and custom" },
        ],
      },
    ],
    pairings: [
      { label: "Offset Printing", href: "#offset-printing" },
      { label: "Conversion", href: "#conversion" },
      { label: "Fabrication", href: "#fabrication" },
    ],
    faqs: [
      {
        q: "Which binding method should we choose?",
        a: "Saddle-stitching suits lightweight booklets and magazines; perfect binding suits catalogues, reports, and books; case binding and thread-sewn hardcovers suit premium and collectible editions. We advise based on page count, durability, and how the publication will be used.",
      },
      {
        q: "Can binding be combined with cover finishing?",
        a: "Yes. Cover lamination and foil blocking are applied inline as part of the binding process, ensuring a consistent, premium finish on hardcover and softcover editions alike.",
      },
    ],
  },
];

const ATLAS_CONFIG: FlatAtlasConfig = {
  atlasLabel: "Process Atlas",
  introTitle: (
    <>
      Eight printing
      <br />
      processes.
    </>
  ),
  introBody:
    "From offset sheet-fed to flexographic label production — DGV Company operates the full spectrum of commercial and packaging print technologies, matched to your substrate, volume, timeline and quality requirement.",
  ctaLabel: "Speak to our team",
  faqHeading: "Process, answered.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   JSON-LD SCHEMA
   ═══════════════════════════════════════════════════════════════════════════ */

const ITEMLIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "DGV Company Printing Solutions",
  itemListElement: PROCESS_ITEMS.map((it, i) => ({
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

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      {
        title:
          "Solutions — Offset, Flexo, Digital & Screen Printing | DGV Company",
      },
      {
        name: "description",
        content:
          "DGV Company operates the full spectrum of commercial and packaging print — offset, web offset, screen, flexographic and digital printing, plus conversion, fabrication and binding. The right process, every time.",
      },
      { property: "og:title", content: "Solutions — DGV Company" },
      {
        property: "og:description",
        content: "Eight printing processes. The right one, every time.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ITEMLIST_SCHEMA),
      },
    ],
  }),
  component: SolutionsPage,
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

function SeoProcessSection({ item }: { item: FlatAtlasItem }) {
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
                  Typical applications
                </h3>
                <ul className="mt-4">
                  {listItems.map((app) => (
                    <li
                      key={app}
                      className="border-t border-[var(--sand-300)] py-3.5 text-[var(--sand-700)] leading-relaxed"
                    >
                      {app}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {specs.length > 0 && (
              <>
                <h3 className="mt-12 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                  Output specifications
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
                {item.title} is most used with:{" "}
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
    q: "How do you select the right printing process for our job?",
    a: "We match the process to your substrate, volume, timeline, and quality requirement. Colour-critical packaging at volume points to offset; long-run publications to web offset; labels and flexibles to flexography; non-paper substrates to screen; short runs and personalisation to digital. We advise on the optimal choice — or combination — at quotation stage.",
  },
  {
    q: "Can multiple print processes be combined in a single project?",
    a: "Frequently. A premium rigid box might use offset for the wrap, screen printing for a high-opacity spot, foil stamping in conversion, and fabrication for assembly. Operating the full spectrum in-house lets us combine processes without coordination risk across suppliers.",
  },
  {
    q: "What quality standards do your production processes meet?",
    a: "Our offset workflow is calibrated to ISO 12647-2, and production is managed under an ISO 9001:2015 quality system with batch traceability and documented QC sign-off at each stage. Test and inspection results are provided as part of our quality documentation.",
  },
];


/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

function SolutionsPage() {
  return (
    <main className="relative bg-background text-foreground overflow-x-clip min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 bg-grid-fine grid-fade opacity-60"
        aria-hidden
      />
      <PremiumNav />

      {/* ── Process Atlas ────────────────────────────────────────────────── */}
      <FlatAtlas items={PROCESS_ITEMS} config={ATLAS_CONFIG} />

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
                  Process, answered.
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
              Unsure which process is right for you?{" "}
              <span className="italic font-light">Let&apos;s talk.</span>
            </p>
            <p className="mt-6 max-w-md mx-auto text-[var(--sand-700)] leading-relaxed">
              Our team will recommend the optimal printing solution based on your
              requirements, volumes, and timelines.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <a
                href="/#contact"
                className="magnetic-btn inline-flex items-center gap-3 border border-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em]"
              >
                <span>Speak to Our Team</span>
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
