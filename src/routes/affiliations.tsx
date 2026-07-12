import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { PremiumNav } from "@/components/PremiumNav";
import { PremiumFooter } from "@/components/PremiumFooter";
import { useMailtoHref } from "@/lib/contact";

const logoImports = import.meta.glob(
  "/src/assets/clientele/strip/*.webp",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const LOGOS: string[] = Object.keys(logoImports).sort().map((k) => logoImports[k]);

export const Route = createFileRoute("/affiliations")({
  head: () => ({
    meta: [
      { title: "DGV Company Clientele — Printing & Packaging Partners" },
      { name: "description", content: "DGV Company's clientele spans pharmaceuticals, FMCG, luxury, manufacturing, corporate and more — trusted by leading brands across India." },
    ],
    links: [{ rel: "canonical", href: "https://www.dgvcompany.com/affiliations" }],
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

const SECTORS = [
  "Pharmaceutical",
  "Automotive",
  "Food & Drink",
  "Information Technology",
  "Fashion & Apparel",
  "FMCG",
  "Education",
  "Movies & Entertainment",
  "Media",
  "Hospitality",
  "Agriculture",
  "Service Industry",
  "Cosmetics",
  "Real Estate",
  "Electronics",
  "Chocolate & Confectionery",
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

function SectorCell({ index, name }: { index: number; name: string }) {
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);
  const glowX = useSpring(rawX, { stiffness: 120, damping: 22 });
  const glowY = useSpring(rawY, { stiffness: 120, damping: 22 });

  return (
    <motion.div
      variants={sectorCellVariants}
      role="listitem"
      aria-label={name}
      className="group relative flex flex-col justify-end min-h-[10rem] md:min-h-[11rem] border-r border-b border-[var(--sand-300)] px-6 py-8 md:px-7 md:py-9 overflow-hidden select-none"
      onMouseMove={(e) => {
        if (prefersReduced) return;
        const rect = e.currentTarget.getBoundingClientRect();
        rawX.set(e.clientX - rect.left);
        rawY.set(e.clientY - rect.top);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        rawX.set(-9999);
        rawY.set(-9999);
      }}
    >
      {!prefersReduced && (
        <motion.div
          aria-hidden
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            position: "absolute",
            left: glowX,
            top: glowY,
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
        className="relative font-display text-[1.35rem] md:text-[1.5rem] leading-tight tracking-tight transition-transform duration-300 ease-out"
        style={{ transform: hovered ? "translateX(4px)" : "translateX(0)" }}
      >
        {name}
      </span>

      <span
        className="relative mt-2 h-px w-6 transition-all duration-300 ease-out"
        style={{
          backgroundColor: hovered ? "var(--gold)" : "var(--sand-300)",
          width: hovered ? "2.5rem" : "1.5rem",
        }}
      />
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
              Sixteen industries.<br />
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
            {SECTORS.map((name, i) => (
              <SectorCell key={name} index={i + 1} name={name} />
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
