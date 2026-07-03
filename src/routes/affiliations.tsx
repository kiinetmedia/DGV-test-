import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PremiumNav } from "@/components/PremiumNav";
import { PremiumFooter } from "@/components/PremiumFooter";

const logoImports = import.meta.glob(
  "/src/assets/clientele/strip/*.jpeg",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const LOGOS: string[] = Object.keys(logoImports).sort().map((k) => logoImports[k]);

export const Route = createFileRoute("/affiliations")({
  head: () => ({
    meta: [
      { title: "Clientele — DGV Company" },
      { name: "description", content: "DGV Company's clientele spans pharmaceuticals, FMCG, luxury, manufacturing, corporate and more — trusted by leading brands across India." },
    ],
  }),
  component: ClientelePage,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const MAILTO_HREF = [
  "mailto:abhinav@dgvcompany.com",
  "?subject=Request%20to%20View%20DGV%20Clientele%20Brochure",
  "&body=Hello%20DGV%20Company%2C%0A%0A",
  "I%20would%20like%20to%20request%20access%20to%20your%20clientele%20brochure.",
  "%0A%0APlease%20share%20the%20brochure%20at%20your%20earliest%20convenience.",
  "%0A%0AThank%20you.",
].join("");

const INDUSTRIES = [
  "Pharmaceuticals",
  "FMCG",
  "Food & Beverage",
  "Personal Care",
  "Industrial",
  "Luxury",
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

function ClientelePage() {
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
                    href={MAILTO_HREF}
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
