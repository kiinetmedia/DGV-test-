import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import heroPackage from "../assets/hero-image.png";

/* ─── STAT CARDS ──────────────────────────────────────────────────────────── */

function HeroStat({ icon, value, label, delay }: { icon: React.ReactNode; value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 rounded-2xl border border-[var(--sand-300)]/55 bg-[var(--sand-50)]/60 backdrop-blur-md px-3 py-3 sm:px-4 sm:py-3.5 cursor-default"
      style={{ boxShadow: "0 2px 16px oklch(0.22 0.018 60 / 0.07), inset 0 1px 0 oklch(1 0 0 / 0.6)" }}
    >
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[var(--sand-700)]"
        style={{ background: "oklch(0.27 0.056 54 / 0.07)", border: "1px solid oklch(0.27 0.056 54 / 0.09)" }}
      >
        {icon}
      </div>
      <div>
        <div className="font-display font-bold text-[1.9rem] leading-none text-foreground tracking-tight">{value}</div>
        <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/80">{label}</div>
      </div>
    </motion.div>
  );
}

/* ─── BACKGROUND LAYERS ───────────────────────────────────────────────────── */

function HeroBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: -5, opacity: 0.035 }} aria-hidden>
        <svg width="100%" height="100%">
          <filter id="paper-bg">
            <feTurbulence type="fractalNoise" baseFrequency="0.85 0.78" numOctaves="4" seed="12"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#paper-bg)" opacity="0.9"/>
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-grid-fine" style={{ zIndex: -4, opacity: 0.04 }} aria-hidden/>
      <svg className="pointer-events-none absolute inset-0 w-full h-full" style={{ zIndex: -3, opacity: 0.030 }} aria-hidden>
        <defs>
          <pattern id="blueprint" patternUnits="userSpaceOnUse" width="180" height="220">
            <rect x="20" y="20" width="140" height="180" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 3"/>
            <line x1="20" y1="70" x2="160" y2="70" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3"/>
            <line x1="20" y1="150" x2="160" y2="150" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3"/>
            <line x1="70" y1="20" x2="70" y2="200" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3"/>
            <line x1="130" y1="20" x2="130" y2="200" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint)" className="text-[var(--sand-700)]"/>
      </svg>
    </>
  );
}

/* ─── MAIN HERO ───────────────────────────────────────────────────────────── */

const BG = "oklch(0.919 0.026 73)";

export function PremiumHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const copyY       = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const imgY        = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const imgOpacity  = useTransform(scrollYProgress, [0, 0.8], [1, 0.55]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen overflow-hidden">

      {/* Ambient light + background pattern */}
      <div className="pointer-events-none absolute inset-0 ambient-light" aria-hidden/>
      <HeroBackground/>

      {/* ── HERO IMAGE — true full-bleed so no panel edge is ever visible ──────── */}
      <motion.div
        className="hidden md:block absolute inset-0 overflow-hidden"
        style={{ y: imgY, opacity: imgOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={heroPackage}
          alt=""
          draggable={false}
          className="w-full h-full object-cover"
          style={{ objectPosition: '72% center' }}
        />
      </motion.div>

      {/* ── GRADIENT OVERLAYS — no hard panel edge, all blending via gradients ── */}

      {/* Left: solid background → transparent, covers text column + generous blend zone */}
      <div
        className="hidden md:block pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: '72%',
          background: `linear-gradient(to right,
            ${BG} 0%,
            ${BG} 32%,
            oklch(0.919 0.026 73 / 0.97) 40%,
            oklch(0.919 0.026 73 / 0.88) 48%,
            oklch(0.919 0.026 73 / 0.68) 56%,
            oklch(0.919 0.026 73 / 0.38) 64%,
            oklch(0.919 0.026 73 / 0.12) 72%,
            oklch(0.919 0.026 73 / 0) 100%)`,
          zIndex: 5,
        }}
        aria-hidden
      />

      {/* Top: feathers the image below the nav bar */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: '22%',
          background: `linear-gradient(to bottom,
            ${BG} 0%,
            oklch(0.919 0.026 73 / 0.85) 40%,
            oklch(0.919 0.026 73 / 0) 100%)`,
          zIndex: 5,
        }}
        aria-hidden
      />

      {/* Bottom: feathers into stat bar */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '28%',
          background: `linear-gradient(to top,
            ${BG} 0%,
            oklch(0.919 0.026 73 / 0.9) 35%,
            oklch(0.919 0.026 73 / 0) 100%)`,
          zIndex: 5,
        }}
        aria-hidden
      />

      {/* Right: soft vignette so image doesn't clip hard at viewport edge */}
      <div
        className="hidden md:block pointer-events-none absolute inset-y-0 right-0"
        style={{
          width: '12%',
          background: `linear-gradient(to left, ${BG} 0%, oklch(0.919 0.026 73 / 0) 100%)`,
          zIndex: 5,
        }}
        aria-hidden
      />

      {/* ── LEFT: text content ───────────────────────────────────────────────── */}
      <motion.div
        style={{ y: copyY, opacity: copyOpacity, paddingTop: 'calc(var(--nav-h) + 1.75rem)' }}
        className="relative z-20 flex flex-col min-h-screen pb-52 md:pb-28 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 md:max-w-[46%]"
      >

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <span
            className="inline-flex items-center gap-2 border border-foreground/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/80"
            style={{ letterSpacing: "0.28em" }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0">
              <path d="M7 1L2 3.5v4C2 10.3 4.2 12.7 7 13.5c2.8-.8 5-3.2 5-6V3.5L7 1z"/>
            </svg>
            ISO 9001:2015 Certified
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="mt-7 font-display font-medium text-[clamp(2.8rem,5.4vw,5.4rem)] leading-[1.18] tracking-normal"
        >
          <em className="italic block">Printing, Packaging<br/>and Label Solutions&hellip;</em>
          <em className="not-italic font-light italic block mt-4 text-[clamp(2.2rem,4.2vw,4.2rem)] leading-[1.18] text-[var(--sand-700)]">
            Engineered for<br/>Performance.
          </em>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          className="mt-6 max-w-[400px] text-foreground/80 leading-relaxed text-[0.95rem]"
        >
          Serving FMCG, Pharmaceutical, Food &amp; Beverage, Personal Care and
          Industrial brands with precision printing and packaging solutions
          trusted across 10+ countries.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          {/* Primary – filled dark */}
          <motion.a
            href="mailto:abhinav@dgvcompany.com"
            whileHover={{ scale: 1.035, y: -2 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 15, mass: 0.5 }}
            className="cursor-pointer inline-flex items-center gap-2 bg-foreground text-[var(--sand-50)] px-7 py-3.5 text-[11px] uppercase tracking-[0.28em] hover:opacity-90 transition-opacity duration-300"
          >
            <span>Request a Quote</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </motion.a>

          {/* Secondary – ghost */}
          <motion.a
            href="#capabilities"
            whileHover={{ scale: 1.035, y: -2 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 15, mass: 0.5 }}
            className="cursor-pointer inline-flex items-center gap-3 border border-foreground/30 px-7 py-3.5 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)] hover:border-foreground hover:text-foreground transition-colors duration-300"
          >
            Explore Products
          </motion.a>
        </motion.div>

        {/* Spacer — pushes content to bottom */}
        <div className="flex-1"/>

      </motion.div>

      {/* ── MOBILE: product image below text ────────────────────────────────── */}
      <div className="md:hidden px-6 pb-28 -mt-6">
        <img
          src={heroPackage}
          alt="Premium packaging by DGV Company"
          draggable={false}
          className="w-full rounded-xl object-cover"
          style={{ aspectRatio: '16/9' }}
        />
      </div>

      {/* ── STAT CARDS ───────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 border-t border-[var(--sand-300)]/45 bg-[var(--sand-50)]/50 backdrop-blur-md"
        style={{ zIndex: 20 }}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <HeroStat
              icon={
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="w-5 h-5">
                  <rect x="2" y="6" width="16" height="11" rx="2"/>
                  <path d="M6 6V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3"/>
                  <line x1="6" y1="10" x2="14" y2="10"/>
                  <line x1="6" y1="13" x2="11" y2="13"/>
                </svg>
              }
              value="12 Million+" label="Labels / Month" delay={0.9}
            />
            <HeroStat
              icon={
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M3 8 L3 16 L13 16 L13 8 Z"/>
                  <path d="M3 8 L7 5 L17 5 L13 8 Z"/>
                  <path d="M13 8 L17 5 L17 13 L13 16 Z"/>
                </svg>
              }
              value="3 Million+" label="Cartons / Month" delay={1.05}
            />
            <HeroStat
              icon={
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="w-5 h-5">
                  <circle cx="10" cy="10" r="7.5"/>
                  <path d="M10 2.5Q13 6 13 10Q13 14 10 17.5Q7 14 7 10Q7 6 10 2.5Z"/>
                  <line x1="2.5" y1="10" x2="17.5" y2="10"/>
                </svg>
              }
              value="10+" label="Countries Served" delay={1.2}
            />
            <HeroStat
              icon={
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M4 16V4l8 0 4 4v8Z"/>
                  <path d="M12 4v4h4"/>
                  <line x1="7" y1="10" x2="13" y2="10"/>
                  <line x1="7" y1="13" x2="11" y2="13"/>
                </svg>
              }
              value="1,000+ Tons" label="Paper Converted / Year" delay={1.35}
            />
          </div>
        </div>
      </div>

    </section>
  );
}
