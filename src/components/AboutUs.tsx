import { useRef } from "react";
import { motion, useInView } from "motion/react";
import aboutImage from "@/assets/about-us.webp";

const STATS = [
  { value: "25+",  label: "Years of Excellence" },
  { value: "100+", label: "Reputed Clients" },
  { value: "17",   label: "Global Markets" },
];

export function AboutUs() {
  const ref   = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      id="about"
      ref={ref}
      aria-label="About DGV Company — Custom Packaging & Printing Solutions"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Subtle ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 50%, oklch(0.72 0.11 75 / 0.04) 0%, transparent 65%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* ── LEFT: Content ───────────────────────── */}
          <motion.div
            className="col-span-12 lg:col-span-6 xl:col-span-5 order-2 lg:order-1"
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
              <span className="h-px w-8 bg-[var(--sand-400)]" />
              About Us
            </div>

            {/* Heading */}
            <h2
              className="mt-6 font-display text-balance leading-[0.93]"
              style={{ fontSize: "clamp(2.6rem, 4.6vw, 4.8rem)" }}
            >
              India's Trusted
              <br />
              <em className="font-light italic" style={{ color: "var(--sand-700)" }}>
                Print &amp; Packaging Partner.
              </em>
            </h2>

            {/* Body */}
            <p
              className="mt-7 leading-relaxed text-base max-w-[52ch]"
              style={{ color: "var(--sand-700)" }}
            >
              DGV Company is Mumbai's premier integrated commercial design, printing
              and packaging company. Built on a foundation of Passion, Quality and
              Innovation, we combine state-of-the-art machinery with deep craft
              expertise to serve 90+ reputed brands — delivering custom packaging,
              print and merchandise solutions that hit every deadline and exceed every
              quality benchmark.
            </p>

            {/* Mission / Vision */}
            <div className="mt-10 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="border-l-2 pl-5 py-1"
                style={{ borderColor: "var(--sand-400)" }}
              >
                <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--sand-700)] mb-1.5">
                  Mission
                </div>
                <p
                  className="font-display text-xl leading-snug"
                  style={{ color: "var(--foreground)", opacity: 0.9 }}
                >
                  Deliver the highest-quality custom printed packaging, print and
                  merchandise — on time, every time.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="border-l-2 pl-5 py-1"
                style={{ borderColor: "oklch(0.72 0.11 75 / 0.55)" }}
              >
                <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--sand-700)] mb-1.5">
                  Vision
                </div>
                <p
                  className="font-display text-xl leading-snug"
                  style={{ color: "var(--foreground)", opacity: 0.9 }}
                >
                  To become a globally respected partner — creating delighted clients
                  through technology-driven, human-centred print solutions.
                </p>
              </motion.div>
            </div>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-10">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.42 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col gap-1.5"
                >
                  <div
                    className="font-display leading-none"
                    style={{ fontSize: "clamp(2rem, 3vw, 2.6rem)", color: "var(--foreground)" }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.20em] leading-snug"
                    style={{ color: "var(--sand-700)" }}
                  >
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Unsplash Image ────────────────── */}
          <motion.div
            className="col-span-12 lg:col-span-6 xl:col-span-7 order-1 lg:order-2 relative"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.15, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative overflow-hidden w-full"
              style={{
                borderRadius: "1.75rem",
                aspectRatio: "4 / 3",
                boxShadow: [
                  "0 48px 96px oklch(0.22 0.018 60 / 0.20)",
                  "0 16px 40px oklch(0.22 0.018 60 / 0.12)",
                  "inset 0 1px 0 oklch(1 0 0 / 0.08)",
                ].join(", "),
              }}
            >
              <img
                src={aboutImage}
                alt="DGV Company printing press with branded packaging — precision packaging and printing solutions Mumbai"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />

              {/* Tonal overlay — aligns image warmth to site palette */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(150deg, oklch(0.18 0.020 58 / 0.22) 0%, transparent 55%, oklch(0.12 0.014 50 / 0.30) 100%)",
                }}
              />

              {/* Bottom caption pill */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-5 left-5 flex items-center gap-2"
                style={{
                  background: "oklch(0.08 0.012 42 / 0.70)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid oklch(0.92 0.020 75 / 0.18)",
                  borderRadius: "100px",
                  padding: "6px 14px 6px 10px",
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "#D7BE8A" }}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: "oklch(0.88 0.024 74)" }}
                >
                  Passion · Quality · Innovation
                </span>
              </motion.div>
            </div>

            {/* Decorative background accent */}
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 65% 55% at 60% 50%, oklch(0.72 0.11 75 / 0.07), transparent 70%)",
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
