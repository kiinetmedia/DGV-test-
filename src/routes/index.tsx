import { createFileRoute } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, type MotionValue } from "motion/react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PremiumNav } from "@/components/PremiumNav";
import { ProcessSection } from "@/components/ProcessSection";
import { CaseStudiesSection } from "@/components/CaseStudiesSection";
import { GlobalPresence } from "@/components/GlobalPresence";
import { PremiumHero } from "@/components/PremiumHero";
import { AboutUs } from "@/components/AboutUs";
import { CinematicCTA } from "@/components/CinematicCTA";
import { PremiumFooter } from "@/components/PremiumFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DGV Company — Print & Packaging Solutions" },
      { name: "description", content: "DGV Company delivers premium print and packaging solutions — labels, packaging, stationery and branding — with consistent quality and reliable timelines." },
      { property: "og:title", content: "DGV Company — Print & Packaging Solutions" },
      { property: "og:description", content: "DGV Company delivers print and packaging solutions designed for consistency, durability, and large-scale performance." },
    ],
  }),
  component: Index,
});

function Index() {
  /* ── Lenis smooth scroll + GSAP ScrollTrigger integration ── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    const onStop = () => lenis.stop();
    const onStart = () => lenis.start();
    document.addEventListener("lenis:stop", onStop);
    document.addEventListener("lenis:start", onStart);

    // When arriving from another page via /#contact (or any hash), Lenis
    // suppresses the browser's native hash scroll. Detect it and scroll manually.
    let hashTimer: ReturnType<typeof setTimeout> | null = null;
    const hash = window.location.hash;
    if (hash) {
      hashTimer = setTimeout(() => {
        lenis.scrollTo(hash, { duration: 1.4, offset: -80 });
      }, 350);
    }

    return () => {
      if (hashTimer) clearTimeout(hashTimer);
      document.removeEventListener("lenis:stop", onStop);
      document.removeEventListener("lenis:start", onStart);
      lenis.destroy();
      gsap.ticker.remove(onRaf);
    };
  }, []);

  return (
    <main className="relative bg-background text-foreground overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 bg-grid-fine grid-fade opacity-60" aria-hidden />
      <AtmosphericParticles />
      <PremiumNav />
      <PremiumHero />
      <AboutUs />
      <GlobalPresence />
      <Products />
      <Solutions />
      <ProcessSection />
      <CaseStudiesSection />
      <FAQ />
      <CinematicCTA />
      <PremiumFooter />
    </main>
  );
}

/* ───────────────────────── ATMOSPHERIC PARTICLES ───────────────────────── */

function AtmosphericParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number; size: number; opacity: number;
      vx: number; vy: number; type: "dot" | "cross" | "reg";
    };

    const N = 28;
    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.2 + 0.4,
      opacity: Math.random() * 0.09 + 0.02,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.1,
      type: Math.random() > 0.72 ? "cross" : Math.random() > 0.55 ? "reg" : "dot",
    }));

    let rafId: number;
    const COLOR = "60,48,38";

    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.strokeStyle = `rgb(${COLOR})`;
        ctx.fillStyle = `rgb(${COLOR})`;
        ctx.lineWidth = 0.55;

        if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "cross") {
          const s = 4;
          ctx.beginPath();
          ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y);
          ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s);
          ctx.stroke();
        } else {
          // registration mark
          const r = 5;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p.x - r * 2, p.y); ctx.lineTo(p.x + r * 2, p.y);
          ctx.moveTo(p.x, p.y - r * 2); ctx.lineTo(p.x, p.y + r * 2);
          ctx.stroke();
        }

        ctx.restore();
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
      }
      rafId = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.55 }}
      aria-hidden
    />
  );
}

/* ───────────────────────── PRODUCTS ───────────────────────── */

const PRODUCT_ROWS = [
  {
    code: "01",
    title: "Commercial Printing",
    description: "Brochures, catalogues, letterheads, notebooks and corporate stationery produced to ISO colour standards with documented reorder consistency.",
    href: "/products#commercial-printing",
  },
  {
    code: "02",
    title: "Barcode Labels",
    description: "Product, pharmaceutical, cosmetic, FMCG, food and chemical labels in vinyl, transparent and tamper-evident formats — precision printed for accurate, scannable results at volume.",
    href: "/products#barcode-labels",
  },
  {
    code: "03",
    title: "Paper Bags",
    description: "Kraft, laminated, luxury and retail carry bags with custom print. Structured handles, strong construction, consistent finish across high-volume runs.",
    href: "/products#paper-bags",
  },
  {
    code: "04",
    title: "Rigid Boxes",
    description: "Magnetic closure, drawer, lid & base, foldable rigid and jewellery formats — engineered to specification with first-article verification before volume production.",
    href: "/products#rigid-boxes",
  },
  {
    code: "05",
    title: "Calendars & Diaries",
    description: "Wall, desk, corporate and executive formats — custom designed with precision binding and on-time delivery for annual production cycles.",
    href: "/products#calendars-diaries",
  },
  {
    code: "06",
    title: "Marketing & Branding",
    description: "Catalogues, corporate profiles, annual reports, presentation folders, estimate pads, danglers and other exhibition materials designed to convert and built to impress.",
    href: "/products#marketing-branding",
  },
  {
    code: "07",
    title: "Corrugated Boxes",
    description: "E-commerce, standard, heavy-duty and die-cut corrugated formats with custom print — structural engineering for transit protection at every scale.",
    href: "/products#corrugated-boxes",
  },
];

const SOLUTION_ROWS = [
  {
    code: "01",
    title: "Offset Printing",
    description: "Sheet-fed colour printing at the highest standard of fidelity — the benchmark process for commercial and packaging requiring Pantone accuracy at volume.",
    href: "/solutions#offset-printing",
  },
  {
    code: "02",
    title: "Web Offset Printing",
    description: "Continuous reel production at the lowest per-unit cost. The correct choice when run length exceeds 25,000 copies and throughput is the primary variable.",
    href: "/solutions#web-offset-printing",
  },
  {
    code: "03",
    title: "Flexographic Printing",
    description: "High-speed relief printing on labels, flexible packaging and continuous web substrates. Cost-effective at volume with consistent colour across long runs.",
    href: "/solutions#flexographic-printing",
  },
  {
    code: "04",
    title: "Digital Printing",
    description: "On-demand, plate-free production from one unit to thousands. Variable data, personalised content and fast turnaround without tooling cost or minimum commitment.",
    href: "/solutions#digital-printing",
  },
  {
    code: "05",
    title: "Screen Printing",
    description: "Durable ink on substrates no other process can reach — textiles, plastics, glass and speciality surfaces where adhesion and permanence are non-negotiable.",
    href: "/solutions#screen-printing",
  },
  {
    code: "06",
    title: "Conversion",
    description: "Precision cutting, creasing, laminating and slitting that transforms printed sheets into functional packaging — folding cartons, labels, pouches and display units.",
    href: "/solutions#conversion",
  },
  {
    code: "07",
    title: "Fabrication",
    description: "Structural build from dieline to hand-finished assembly. Complex constructions, specialty closures and bespoke forms engineered for the brief, not the template.",
    href: "/solutions#fabrication",
  },
  {
    code: "08",
    title: "Binding",
    description: "Perfect binding, saddle-stitching, spiral, case and thread-sewn finishing. Every method in-house, selected by use case and delivered to specification.",
    href: "/solutions#binding",
  },
];

type EditorialRowData = { code: string; title: string; description: string; href: string };

function EditorialRow({
  row,
  index,
  activeIndex,
  onEnter,
  onLeave,
}: {
  row: EditorialRowData;
  index: number;
  activeIndex: number | null;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const isActive   = activeIndex === index;
  const hasActive  = activeIndex !== null;
  const rowOpacity = hasActive ? (isActive ? 1 : 0.28) : 0.88;
  const titleColor = isActive ? "var(--foreground)" : "inherit";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{ duration: 0.85, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      style={{ opacity: rowOpacity, transition: "opacity 0.45s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Top hairline */}
      <div className="hairline" />

      <a
        href={row.href}
        className="grid grid-cols-12 items-center gap-x-6 md:gap-x-8 py-7 md:py-9 cursor-pointer group"
        style={{ textDecoration: "none" }}
      >
        {/* Index code */}
        <div
          className="col-span-1 text-[10px] uppercase tracking-[0.30em] leading-none self-start pt-1"
          style={{ color: "var(--sand-400)", transition: "color 0.35s" }}
        >
          {row.code}
        </div>

        {/* Category title */}
        <div
          className="col-span-11 md:col-span-4 font-display leading-[0.93]"
          style={{
            fontSize: "clamp(2rem, 3.8vw, 4.5rem)",
            color: titleColor,
            transition: "color 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {row.title}
        </div>

        {/* Description */}
        <div
          className="hidden md:block md:col-span-6 text-sm leading-relaxed"
          style={{
            color: "var(--sand-700)",
            opacity: isActive ? 1 : 0.75,
            transition: "opacity 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {row.description}
        </div>

        {/* Arrow */}
        <div
          className="hidden md:flex col-span-1 justify-end items-center"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 0.35s, transform 0.45s cubic-bezier(0.16,1,0.3,1)",
            color: "var(--gold)",
          }}
          aria-hidden
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <path d="M0 7H20M14 1L20 7L14 13" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </a>
    </motion.div>
  );
}

function EditorialSection({
  id,
  eyebrow,
  headline,
  subheadline,
  intro,
  rows,
  ctaLabel,
  ctaHref,
}: {
  id: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  intro: string;
  rows: EditorialRowData[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sectionY = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  return (
    <section id={id} ref={ref} className="relative py-16 md:py-24">
      <motion.div style={{ y: sectionY }} className="mx-auto max-w-[1400px] px-5 md:px-8">

        {/* Section header */}
        <div className="grid grid-cols-12 gap-x-8 items-end mb-10 md:mb-16">
          <div className="col-span-12 md:col-span-5">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display leading-[0.93]" style={{ fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)" }}>
              {headline}<br />
              <em className="font-light italic" style={{ color: "var(--sand-700)" }}>{subheadline}</em>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 mt-6 md:mt-0">
            <p className="text-sm leading-relaxed" style={{ color: "var(--sand-700)" }}>{intro}</p>
          </div>
        </div>

        {/* Row list */}
        <div>
          {rows.map((row, i) => (
            <EditorialRow
              key={row.code}
              row={row}
              index={i}
              activeIndex={activeIndex}
              onEnter={() => setActiveIndex(i)}
              onLeave={() => setActiveIndex(null)}
            />
          ))}
          {/* Bottom hairline */}
          <div className="hairline" />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 md:mt-12 flex justify-end"
        >
          <a
            href={ctaHref}
            className="group inline-flex items-center gap-3 border border-foreground/65 px-7 py-3.5 text-[11px] uppercase tracking-[0.26em] transition-all duration-300"
            style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--foreground)";
              (e.currentTarget as HTMLElement).style.color = "var(--sand-50)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = "";
            }}
          >
            {ctaLabel}
            <svg
              width="18" height="12" viewBox="0 0 18 12" fill="none"
              className="transition-transform duration-500 group-hover:translate-x-1"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            >
              <path d="M0 6H16M11 1L16 6L11 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>

      </motion.div>
    </section>
  );
}

function Products() {
  return (
    <EditorialSection
      id="capabilities"
      eyebrow="Products"
      headline="Engineered for"
      subheadline="every format."
      intro="From a single luxury rigid box to a million corrugated shippers — every format, every finish, every scale. One integrated studio, end to end."
      rows={PRODUCT_ROWS}
      ctaLabel="Explore All Products"
      ctaHref="/products"
    />
  );
}

function Solutions() {
  return (
    <EditorialSection
      id="solutions"
      eyebrow="Solutions"
      headline="Every process,"
      subheadline="one partnership."
      intro="With state of the art production capabilities—from offset and digital printing to binding and finishing—we deliver a seamless, end-to-end experience, ensuring your project stays under one expert partner from concept to completion."
      rows={SOLUTION_ROWS}
      ctaLabel="Explore All Solutions"
      ctaHref="/solutions"
    />
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

const FAQ_CATEGORIES = [
  { id: "all",      label: "All"         },
  { id: "general",  label: "General"     },
  { id: "rigid",    label: "Rigid Boxes" },
  { id: "bags",     label: "Paper Bags"  },
  { id: "labels",   label: "Labels"      },
  { id: "printing", label: "Printing"    },
  { id: "process",  label: "Process"     },
] as const;

type FAQCat = "general" | "rigid" | "bags" | "labels" | "printing" | "process";

const FAQ_ITEMS: { q: string; a: string; list?: string[]; cat: FAQCat }[] = [
  {
    cat: "general",
    q: "What types of printing and packaging solutions do you offer?",
    a: "We provide end-to-end printing and packaging solutions including premium rigid boxes, corrugated boxes, paper bags, product labels, brochures, catalogues, calendars, diaries, corporate stationery, marketing materials, and customized packaging for various industries.",
  },
  {
    cat: "general",
    q: "Can you manufacture custom-sized boxes?",
    a: "Yes. Every box is manufactured according to your product dimensions and branding requirements. We specialize in fully customized packaging with various board thicknesses, inserts, foams, magnets, ribbons, and premium finishes.",
  },
  {
    cat: "general",
    q: "What is your minimum order quantity (MOQ)?",
    a: "Our MOQ depends on the product. While some commercial printing jobs can be undertaken in smaller quantities, premium packaging such as rigid boxes generally has a higher MOQ to ensure cost efficiency.",
  },
  {
    cat: "general",
    q: "Do you help with packaging design?",
    a: "Absolutely. We work closely with our clients to develop packaging that is visually appealing, functional, and aligned with their brand identity. We can also collaborate with your existing designer.",
  },
  {
    cat: "general",
    q: "How long does production usually take?",
    a: "Production timelines vary depending on product complexity and quantity. Most orders are completed within 7–21 working days after artwork approval.",
  },
  {
    cat: "general",
    q: "Can I order a sample before placing a bulk order?",
    a: "Yes. We can provide prototype samples or dummy models so you can evaluate the size, structure, finish, and overall quality before proceeding with mass production.",
  },
  {
    cat: "general",
    q: "Which industries do you serve?",
    a: "We work with businesses across industries including pharmaceuticals, cosmetics, jewellery, fashion, gifting, FMCG, electronics, food & beverages, luxury retail, and corporate organizations.",
  },
  {
    cat: "general",
    q: "Do you ship across India?",
    a: "Yes. We deliver orders across India through trusted logistics partners and ensure secure packaging for safe transportation.",
  },
  {
    cat: "rigid",
    q: "What is a rigid box?",
    a: "Rigid boxes are premium packaging boxes made using thick paperboard (Kappa Board or Grey Board). They offer excellent strength, luxury appeal, and superior product protection.",
  },
  {
    cat: "rigid",
    q: "What products are rigid boxes suitable for?",
    a: "Rigid boxes are ideal for luxury products such as jewellery, perfumes, cosmetics, premium garments, electronics, corporate gifts, watches, chocolates, and festive hampers.",
  },
  {
    cat: "rigid",
    q: "What finishes can be added to rigid boxes?",
    a: "Popular premium finishes include:",
    list: [
      "Gold & Silver Foiling",
      "Spot UV",
      "Embossing",
      "Debossing",
      "Textured Papers",
      "Velvet Lamination",
      "Soft Touch Lamination",
      "Magnetic Closures",
      "Ribbon Pulls",
      "EVA Foam Inserts",
      "Satin Fabric Inserts",
    ],
  },
  {
    cat: "rigid",
    q: "Can rigid boxes be made foldable?",
    a: "Yes. We manufacture both traditional rigid boxes and collapsible rigid boxes, helping businesses reduce storage space and transportation costs.",
  },
  {
    cat: "bags",
    q: "What types of paper bags do you manufacture?",
    a: "We manufacture luxury paper bags, retail shopping bags, garment bags, gift bags, promotional bags, laminated bags, kraft paper bags, and custom corporate bags.",
  },
  {
    cat: "bags",
    q: "Which handle options are available?",
    a: "Available options include:",
    list: [
      "Cotton Rope",
      "Nylon Rope",
      "Satin Ribbon",
      "Paper Twisted Handle",
      "Die-Cut Handle",
      "Flat Paper Handle",
    ],
  },
  {
    cat: "bags",
    q: "Are your paper bags eco-friendly?",
    a: "Yes. We offer recyclable paper bags and environmentally conscious packaging solutions using FSC-certified papers upon request.",
  },
  {
    cat: "labels",
    q: "What kinds of labels do you print?",
    a: "We print:",
    list: [
      "Product Labels",
      "Barcode Labels",
      "Pharmaceutical Labels",
      "Cosmetic Labels",
      "FMCG Labels",
      "Food Labels",
      "Chemical Labels",
      "Vinyl Labels",
      "Transparent Labels",
      "Tamper-Evident Labels",
    ],
  },
  {
    cat: "labels",
    q: "Which label materials do you offer?",
    a: "We offer paper labels, vinyl, PP, PET, transparent films, metallic labels, security labels, and waterproof materials depending on the application.",
  },
  {
    cat: "printing",
    q: "What commercial printing services do you provide?",
    a: "Our services include brochures, catalogues, flyers, presentation folders, annual reports, calendars, diaries, letterheads, envelopes, posters, danglers, wobblers, standees, and corporate marketing materials.",
  },
  {
    cat: "printing",
    q: "Can you print in Pantone colours?",
    a: "Yes. We offer both CMYK and Pantone colour printing to ensure accurate brand colour reproduction.",
  },
  {
    cat: "printing",
    q: "What printing finishes are available?",
    a: "Available finishing options include:",
    list: [
      "Gloss Lamination",
      "Matt Lamination",
      "Soft Touch Lamination",
      "Spot UV",
      "Foiling",
      "Embossing",
      "Debossing",
      "Die-Cutting",
      "Perforation",
      "Numbering",
      "Variable Data Printing",
    ],
  },
  {
    cat: "process",
    q: "What file formats do you accept?",
    a: "We prefer print-ready PDF, AI, EPS, and high-resolution TIFF files. Our team can also assist in preparing artwork for print.",
  },
  {
    cat: "process",
    q: "Will I receive a proof before production?",
    a: "Yes. We share digital proofs for approval before commencing production. Physical samples can also be arranged where required.",
  },
  {
    cat: "process",
    q: "How is pricing determined?",
    a: "Pricing depends on:",
    list: [
      "Quantity",
      "Material",
      "Printing Colours",
      "Box Size",
      "Special Finishes",
      "Fabrication",
      "Packing Requirements",
      "Delivery Location",
    ],
  },
  {
    cat: "process",
    q: "Can you handle urgent orders?",
    a: "Yes. Depending on production capacity and job complexity, we can accommodate urgent orders with expedited production schedules.",
  },
  {
    cat: "process",
    q: "Why should I choose DGV Company?",
    a: "With decades of experience in printing and packaging, we combine premium materials, advanced manufacturing, stringent quality control, competitive pricing, and reliable delivery to create packaging that enhances your brand and protects your products.",
  },
];

function FAQ() {
  const [openIdx, setOpenIdx]   = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<"all" | FAQCat>("all");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sectionY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  const filtered = activeCat === "all"
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.cat === activeCat);

  return (
    <section id="faq" ref={ref} className="relative py-16 md:py-24 overflow-hidden">
      <motion.div style={{ y: sectionY }} className="mx-auto max-w-[1400px] px-5 md:px-8">

        {/* ── Section header ── */}
        <div className="grid grid-cols-12 gap-x-8 items-end mb-8 md:mb-12">
          <div className="col-span-12 md:col-span-6">
            <Eyebrow>FAQ</Eyebrow>
            <h2
              className="mt-6 font-display leading-[0.93]"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)" }}
            >
              Questions,{" "}
              <em className="font-light italic" style={{ color: "var(--sand-700)" }}>
                answered.
              </em>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 mt-4 md:mt-0">
            <p className="text-sm leading-relaxed" style={{ color: "var(--sand-700)" }}>
              Everything you need to know before getting started.{" "}
              <a
                href="mailto:abhinav@dgvcompany.com"
                className="underline underline-offset-4 transition-colors duration-300"
                style={{ color: "var(--sand-700)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--foreground)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--sand-700)")}
              >
                Can't find your answer?
              </a>
            </p>
          </div>
        </div>

        {/* ── Category pills ── */}
        <div
          className="flex flex-wrap gap-2 mb-6 md:mb-10"
          role="tablist"
          aria-label="FAQ categories"
        >
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            return (
              <motion.button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveCat(cat.id as "all" | FAQCat);
                  setOpenIdx(null);
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="px-5 py-2 text-[11px] uppercase tracking-[0.22em] rounded-full border transition-all duration-300"
                style={{
                  background:   isActive ? "var(--foreground)" : "transparent",
                  color:        isActive ? "var(--sand-50)"    : "var(--sand-700)",
                  borderColor:  isActive ? "var(--foreground)" : "var(--sand-400)",
                }}
              >
                {cat.label}
              </motion.button>
            );
          })}
        </div>

        {/* ── Card grid ── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const globalIdx = FAQ_ITEMS.indexOf(item);
              return (
                <FAQCard
                  key={globalIdx}
                  item={item}
                  index={globalIdx}
                  isOpen={openIdx === globalIdx}
                  onToggle={() => setOpenIdx(openIdx === globalIdx ? null : globalIdx)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

      </motion.div>
    </section>
  );
}

function FAQCard({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string; list?: string[] };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-[18px] border overflow-hidden"
      style={{
        borderColor: isOpen ? "var(--sand-400)" : "var(--sand-300)",
        background:  isOpen ? "var(--sand-50)"  : "oklch(0.960 0.016 74 / 0.55)",
        boxShadow: isOpen
          ? "0 8px 40px oklch(0.22 0.018 60 / 0.09), inset 0 1px 0 oklch(1 0 0 / 0.7)"
          : "0 2px 10px oklch(0.22 0.018 60 / 0.04), inset 0 1px 0 oklch(1 0 0 / 0.5)",
        transition: "border-color 0.35s, background 0.35s, box-shadow 0.45s",
      }}
    >
      {/* Hover glow ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "inset 0 0 0 1px var(--sand-400), 0 6px 28px oklch(0.22 0.018 60 / 0.07)" }}
      />

      {/* Trigger */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-trigger-${index}`}
        className="w-full text-left p-6 md:p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sand-400)] focus-visible:ring-offset-2 rounded-[18px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div
              aria-hidden
              className="font-display text-[10px] tracking-[0.35em] uppercase mb-3 transition-colors duration-350"
              style={{ color: isOpen ? "var(--gold)" : "var(--sand-400)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <span className="font-display text-lg md:text-xl leading-snug block" style={{ color: "var(--foreground)" }}>
              {item.q}
            </span>
          </div>

          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
            className="mt-7 flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-full border transition-colors duration-300"
            style={{
              borderColor: isOpen ? "var(--foreground)" : "var(--sand-400)",
              color:        isOpen ? "var(--foreground)" : "var(--sand-700)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </motion.span>
        </div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-trigger-${index}`}
            key="answer"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
              className="px-6 md:px-7 pb-6 md:pb-7"
            >
              <div className="h-px mb-5" style={{ background: "var(--sand-300)" }} />
              <p className="text-sm leading-relaxed" style={{ color: "var(--sand-700)" }}>
                {item.a}
              </p>
              {item.list && (
                <ul className="mt-3.5 space-y-2" role="list">
                  {item.list.map((point, li) => (
                    <motion.li
                      key={li}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 + li * 0.03 }}
                      className="flex items-center gap-2.5 text-sm"
                      style={{ color: "var(--sand-700)" }}
                    >
                      <span
                        aria-hidden
                        className="h-1 w-1 rounded-full flex-shrink-0"
                        style={{ background: "var(--sand-400)" }}
                      />
                      {point}
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}


function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)] ${center ? "justify-center" : ""}`}>
      <span className="h-px w-8 bg-[var(--sand-400)]" />
      {children}
      {center && <span className="h-px w-8 bg-[var(--sand-400)]" />}
    </div>
  );
}
