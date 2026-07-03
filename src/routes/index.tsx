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

/* ───────────────────────── HERO ───────────────────────── */

const INDUSTRY_CHIPS = ["FMCG", "Pharmaceuticals", "Food & Beverage", "Personal Care", "Industrial"];

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const envY        = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const typeY       = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);
  const typeOpacity = useTransform(scrollYProgress, [0, 0.65], [0.9, 0]);
  const copyY       = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const layer1Y     = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const layer2Y     = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const layer3Y     = useTransform(scrollYProgress, [0, 1], ["0%", "44%"]);
  const compY       = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);

  return (
    <section id="top" ref={ref} className="relative h-[200vh]">
      <div className="hero-sticky sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ y: envY }} className="absolute inset-0 ambient-light" aria-hidden />

        {/* z-3: Dieline graphics / carton templates */}
        <motion.div style={{ y: layer2Y }} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <svg className="absolute text-[var(--sand-700)]" style={{ top: "12%", right: "6%", opacity: 0.04, width: 300 }} viewBox="0 0 300 360" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="5 3">
            <path d="M75 10 L225 10 L225 75 L265 75 L265 285 L225 285 L225 350 L75 350 L75 285 L35 285 L35 75 L75 75 Z" />
            <line x1="75" y1="75" x2="225" y2="75" />
            <line x1="75" y1="285" x2="225" y2="285" />
          </svg>
          <svg className="absolute text-[var(--sand-700)]" style={{ top: "64%", left: "10%", opacity: 0.04, width: 80 }} viewBox="0 0 80 4" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="4 3">
            <line x1="0" y1="2" x2="80" y2="2" />
          </svg>
        </motion.div>

        {/* z-2: Large partial circles — label roll inspired */}
        <motion.div style={{ y: layer1Y }} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <svg className="absolute text-[var(--sand-700)]" style={{ top: "-30%", right: "-20%", opacity: 0.06, width: 640 }} viewBox="0 0 640 640" fill="none" stroke="currentColor" strokeWidth="0.8">
            <circle cx="320" cy="320" r="308" />
            <circle cx="320" cy="320" r="248" />
            <circle cx="320" cy="320" r="178" />
          </svg>
          <svg className="absolute text-[var(--sand-700)]" style={{ bottom: "-22%", left: "-14%", opacity: 0.05, width: 400 }} viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="0.7">
            <circle cx="200" cy="200" r="190" />
            <circle cx="200" cy="200" r="138" />
          </svg>
        </motion.div>

        {/* z-1: Registration marks + crop marks + barcode fragments */}
        <motion.div style={{ y: layer3Y }} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <svg className="absolute text-[var(--sand-700)]" style={{ top: "18%", right: "16%", opacity: 0.045, width: 62 }} viewBox="0 0 62 62" fill="none" stroke="currentColor" strokeWidth="0.7">
            <circle cx="31" cy="31" r="18" /><line x1="0" y1="31" x2="62" y2="31" /><line x1="31" y1="0" x2="31" y2="62" />
          </svg>
          <svg className="absolute text-[var(--sand-700)]" style={{ bottom: "26%", left: "8%", opacity: 0.038, width: 42 }} viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="0.7">
            <circle cx="21" cy="21" r="12" /><line x1="0" y1="21" x2="42" y2="21" /><line x1="21" y1="0" x2="21" y2="42" />
          </svg>
          <svg className="absolute text-[var(--sand-700)]" style={{ top: "10%", left: "42%", opacity: 0.04, width: 28 }} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="0.7">
            <path d="M14 0 L14 10 M0 14 L10 14" />
          </svg>
          <svg className="absolute text-[var(--sand-700)]" style={{ top: "58%", left: "6%", opacity: 0.035, width: 28, height: 40 }} viewBox="0 0 28 40" fill="currentColor">
            <rect x="0" y="0" width="2" height="40" /><rect x="5" y="0" width="1" height="40" /><rect x="8" y="0" width="3" height="40" />
            <rect x="14" y="0" width="1" height="40" /><rect x="18" y="0" width="2" height="40" /><rect x="23" y="0" width="1.5" height="40" /><rect x="26" y="0" width="2" height="40" />
          </svg>
          <svg className="absolute text-[var(--sand-700)]" style={{ top: "24%", left: "44%", opacity: 0.035, width: 50, transform: "rotate(35deg)" }} viewBox="0 0 50 4" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 2.5">
            <line x1="0" y1="2" x2="50" y2="2" />
          </svg>
        </motion.div>

        {/* Editorial backdrop wordmark */}
        <motion.div
          style={{ y: typeY, opacity: typeOpacity }}
          className="absolute inset-x-0 bottom-[8%] flex justify-center pointer-events-none"
          aria-hidden
        >
          <span className="font-display text-stroke text-[34vw] leading-[0.8] tracking-tighter select-none">DGV</span>
        </motion.div>

        {/* Content grid */}
        <div className="relative z-10 mx-auto grid h-full max-w-[1400px] grid-cols-12 gap-8 px-6 md:px-10 pt-24 md:pt-28 pb-28 md:pb-32">

          {/* Left: copy + chips + CTAs */}
          <motion.div style={{ y: copyY, opacity: copyOpacity }} className="col-span-12 md:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
              <span className="h-px w-8 bg-[var(--sand-400)]" />
              PASSION · QUALITY · INNOVATION
            </div>
            <h1 className="mt-8 font-display text-[clamp(2.8rem,5.6vw,5.5rem)] leading-[0.95] tracking-tight text-balance">
              Packaging & Label Solutions<br />
              <span className="italic font-light">Engineered for Performance.</span>
            </h1>
            <p className="mt-7 max-w-md text-[var(--sand-700)] leading-relaxed text-base md:text-lg">
              Serving FMCG, Pharmaceutical, Food & Beverage, Personal Care and
              Industrial brands across 10+ countries.
            </p>

            {/* Industry chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {INDUSTRY_CHIPS.map(chip => (
                <span
                  key={chip}
                  className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] border border-[var(--sand-400)]/60 text-[var(--sand-700)] bg-[var(--sand-50)]/60 backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href="mailto:abhinav@dgvcompany.com"
                className="magnetic-btn inline-flex items-center gap-3 border border-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em]"
              >
                <span>Request a Quote</span>
              </a>
              <a
                href="#capabilities"
                className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)] hover:text-foreground transition-colors group"
              >
                <span className="h-px w-8 bg-[var(--sand-400)] group-hover:w-14 transition-all duration-500" />
                Explore Products
              </a>
            </div>
          </motion.div>

          {/* Right: packaging composition */}
          <motion.div
            style={{ y: compY }}
            className="col-span-12 md:col-span-7 relative flex items-center justify-center h-[72vw] md:h-full"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="w-full h-full"
            >
              <PackagingComposition />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom: glassmorphic stat cards */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-[var(--sand-300)]/50 bg-[var(--sand-50)]/55 backdrop-blur-md">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <HeroStatCard icon="label"  value="12 Million+"  label="Labels / Month"          delay={0.9} />
              <HeroStatCard icon="carton" value="0.3 Million+" label="Cartons / Month"       delay={1.05} />
              <HeroStatCard icon="globe"  value="10+"       label="Countries Served"        delay={1.2} />
              <HeroStatCard icon="paper"  value="1,000+ T"  label="Paper Converted / Year"  delay={1.35} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stat card icon ─────────────────────────────────────────────────────── */

type StatIconType = "label" | "carton" | "globe" | "paper";

function StatIcon({ type }: { type: StatIconType }) {
  const cls = "w-5 h-5 text-[var(--sand-700)]";
  if (type === "label") return (
    <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <rect x="2" y="6" width="16" height="11" rx="2" />
      <path d="M6 6V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3" />
      <line x1="6" y1="10" x2="14" y2="10" /><line x1="6" y1="13" x2="11" y2="13" />
    </svg>
  );
  if (type === "carton") return (
    <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8 L3 16 L13 16 L13 8 Z" />
      <path d="M3 8 L7 5 L17 5 L13 8 Z" />
      <path d="M13 8 L17 5 L17 13 L13 16 Z" />
    </svg>
  );
  if (type === "globe") return (
    <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 2.5Q13 6 13 10Q13 14 10 17.5Q7 14 7 10Q7 6 10 2.5Z" />
      <line x1="2.5" y1="10" x2="17.5" y2="10" />
    </svg>
  );
  return (
    <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16V4l8 0 4 4v8Z" />
      <path d="M12 4v4h4" />
      <line x1="7" y1="10" x2="13" y2="10" /><line x1="7" y1="13" x2="11" y2="13" />
    </svg>
  );
}

function HeroStatCard({ icon, value, label, delay }: { icon: StatIconType; value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 rounded-xl border border-[var(--sand-300)]/60 bg-[var(--sand-50)]/65 backdrop-blur px-3 py-2.5"
      style={{ boxShadow: "0 2px 12px oklch(0.22 0.018 60 / 0.06), inset 0 1px 0 oklch(1 0 0 / 0.55)" }}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "oklch(0.27 0.056 54 / 0.06)", border: "1px solid oklch(0.27 0.056 54 / 0.08)" }}
      >
        <StatIcon type={icon} />
      </div>
      <div>
        <div className="font-display text-base leading-none text-foreground">{value}</div>
        <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[var(--sand-700)]">{label}</div>
      </div>
    </motion.div>
  );
}

/* ── Packaging composition ──────────────────────────────────────────────── */

function PackagingComposition() {
  return (
    <div className="relative w-full h-full select-none pointer-events-none" style={{ minHeight: 480 }}>

      {/* Ambient radial glow */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 65% 55% at 58% 46%, oklch(0.72 0.11 75 / 0.07) 0%, transparent 68%)" }}
        aria-hidden
      />

      {/* 1 — Label roll, top-left anchor */}
      <motion.div
        className="absolute"
        style={{ left: "2%", top: "2%", width: "42%" }}
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 25, ease: "easeInOut", repeat: Infinity }}
      >
        <svg viewBox="0 0 200 250" fill="none" className="w-full" style={{ filter: "drop-shadow(0 8px 24px oklch(0.3 0.03 60 / 0.18))" }}>
          <defs>
            <linearGradient id="rlG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.62 0.05 66)" stopOpacity="0.45"/>
              <stop offset="18%" stopColor="oklch(0.25 0.028 56)" stopOpacity="0"/>
              <stop offset="82%" stopColor="oklch(0.25 0.028 56)" stopOpacity="0"/>
              <stop offset="100%" stopColor="oklch(0.55 0.045 66)" stopOpacity="0.5"/>
            </linearGradient>
            <linearGradient id="rlT" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.97 0.008 78)"/>
              <stop offset="100%" stopColor="oklch(0.90 0.025 76)"/>
            </linearGradient>
          </defs>
          <rect x="14" y="66" width="172" height="146" fill="oklch(0.96 0.010 78)"/>
          <rect x="14" y="66" width="172" height="146" fill="url(#rlG)"/>
          <ellipse cx="100" cy="66" rx="86" ry="31" fill="url(#rlT)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.7"/>
          {[4, 8, 12, 16].map(d => (
            <ellipse key={d} cx="100" cy={66 + d} rx={86 - d * 0.9} ry={31 - d * 0.6} fill="none" stroke="oklch(0.82 0.038 72)" strokeWidth="0.4" strokeOpacity={Math.max(0, 0.45 - d * 0.07)}/>
          ))}
          <rect x="34" y="100" width="132" height="80" fill="oklch(0.95 0.013 76)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5"/>
          <rect x="34" y="100" width="132" height="20" fill="oklch(0.25 0.028 56)" fillOpacity="0.88"/>
          <rect x="42" y="107" width="70" height="4" rx="2" fill="white" fillOpacity="0.85"/>
          <rect x="42" y="114" width="46" height="2.5" rx="1.25" fill="white" fillOpacity="0.5"/>
          <rect x="42" y="128" width="80" height="3" rx="1.5" fill="oklch(0.25 0.028 56)" fillOpacity="0.55"/>
          <rect x="42" y="135" width="60" height="2.5" rx="1.25" fill="oklch(0.52 0.044 68)" fillOpacity="0.5"/>
          <rect x="42" y="142" width="72" height="2" rx="1" fill="oklch(0.52 0.044 68)" fillOpacity="0.4"/>
          <rect x="42" y="151" width="28" height="2" rx="1" fill="oklch(0.72 0.11 75)" fillOpacity="0.8"/>
          {[0,3,6,8,11,14,17,19,22,25,28].map((x, i) => (
            <rect key={i} x={42 + x} y="158" width={i % 3 === 0 ? 2 : 1} height="16" fill="oklch(0.25 0.028 56)" fillOpacity="0.7"/>
          ))}
          <ellipse cx="100" cy="212" rx="86" ry="31" fill="oklch(0.88 0.032 74)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.7"/>
          <ellipse cx="100" cy="212" rx="32" ry="11" fill="oklch(0.74 0.058 68)" stroke="oklch(0.64 0.052 66)" strokeWidth="0.7"/>
          <ellipse cx="100" cy="212" rx="22" ry="7" fill="oklch(0.62 0.048 64)"/>
        </svg>
      </motion.div>

      {/* 2 — Carton box, dominant center-right */}
      <motion.div
        className="absolute"
        style={{ right: "1%", top: "5%", width: "56%" }}
        animate={{ y: [0, -12, 0], rotate: [0, 0.25, 0] }}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity, delay: 3 }}
      >
        <svg viewBox="0 0 290 330" fill="none" className="w-full" style={{ filter: "drop-shadow(0 12px 32px oklch(0.3 0.03 60 / 0.2))" }}>
          <defs>
            <linearGradient id="bxF" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.97 0.008 78)"/>
              <stop offset="100%" stopColor="oklch(0.91 0.024 76)"/>
            </linearGradient>
            <linearGradient id="bxT" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.89 0.028 74)"/>
              <stop offset="100%" stopColor="oklch(0.95 0.012 78)"/>
            </linearGradient>
            <linearGradient id="bxS" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.82 0.038 72)"/>
              <stop offset="100%" stopColor="oklch(0.76 0.044 70)"/>
            </linearGradient>
          </defs>
          <path d="M28 118 L28 296 L218 296 L218 118 Z" fill="url(#bxF)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.8"/>
          <path d="M28 118 L98 68 L288 68 L218 118 Z" fill="url(#bxT)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.8"/>
          <path d="M218 118 L288 68 L288 246 L218 296 Z" fill="url(#bxS)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.8"/>
          <rect x="28" y="138" width="190" height="44" fill="oklch(0.25 0.028 56)" fillOpacity="0.9"/>
          <rect x="42" y="148" width="100" height="6" rx="3" fill="white" fillOpacity="0.88"/>
          <rect x="42" y="158" width="68" height="3.5" rx="1.75" fill="white" fillOpacity="0.52"/>
          <rect x="42" y="165" width="32" height="2" rx="1" fill="oklch(0.72 0.11 75)" fillOpacity="0.9"/>
          <rect x="42" y="197" width="160" height="62" fill="none" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeOpacity="0.4"/>
          <path d="M65 216 Q123 200 178 216 Q192 228 175 242 Q145 252 108 246 Q68 240 65 226 Z" fill="oklch(0.25 0.028 56)" fillOpacity="0.05" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeOpacity="0.28"/>
          <line x1="28" y1="270" x2="218" y2="270" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.4"/>
          {[0,3,6,8,11,14,16,19,22,25].map((x, i) => (
            <rect key={i} x={62 + x} y="275" width={i % 3 === 0 ? 1.5 : 1} height="13" fill="oklch(0.25 0.028 56)" fillOpacity="0.55"/>
          ))}
          <rect x="228" y="108" width="46" height="4" rx="2" fill="oklch(0.88 0.032 74)" fillOpacity="0.5"/>
          <rect x="228" y="116" width="32" height="2.5" rx="1.25" fill="oklch(0.78 0.044 72)" fillOpacity="0.45"/>
          <path d="M98 68 L138 42 L170 50 L170 68" fill="oklch(0.95 0.012 78)" fillOpacity="0.85" stroke="oklch(0.78 0.044 72)" strokeWidth="0.7"/>
          <line x1="170" y1="68" x2="170" y2="42" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeDasharray="3 2"/>
        </svg>
      </motion.div>

      {/* 3 — Stand-up pouch, bottom center */}
      <motion.div
        className="absolute"
        style={{ left: "25%", bottom: "2%", width: "28%" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, delay: 6 }}
      >
        <svg viewBox="0 0 150 210" fill="none" className="w-full" style={{ filter: "drop-shadow(0 6px 18px oklch(0.3 0.03 60 / 0.15))" }}>
          <defs>
            <linearGradient id="pchG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.68 0.055 68)" stopOpacity="0.55"/>
              <stop offset="22%" stopColor="oklch(0.25 0.028 56)" stopOpacity="0"/>
              <stop offset="78%" stopColor="oklch(0.25 0.028 56)" stopOpacity="0"/>
              <stop offset="100%" stopColor="oklch(0.60 0.050 66)" stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <path d="M32 28 Q28 18 38 14 L112 14 Q122 18 118 28 L126 180 Q126 195 75 197 Q24 195 24 180 Z" fill="oklch(0.95 0.013 76)" stroke="oklch(0.78 0.044 72)" strokeWidth="1"/>
          <path d="M32 28 Q28 18 38 14 L112 14 Q122 18 118 28 L126 180 Q126 195 75 197 Q24 195 24 180 Z" fill="url(#pchG)"/>
          <path d="M32 28 Q28 18 38 14 L112 14 Q122 18 118 28" fill="oklch(0.80 0.042 70)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.8"/>
          <line x1="32" y1="24" x2="118" y2="24" stroke="oklch(0.78 0.044 72)" strokeWidth="0.4" strokeOpacity="0.5"/>
          <rect x="36" y="44" width="78" height="100" rx="2" fill="oklch(0.94 0.015 76)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeOpacity="0.5"/>
          <rect x="36" y="44" width="78" height="22" rx="2" fill="oklch(0.25 0.028 56)" fillOpacity="0.88"/>
          <rect x="44" y="51" width="60" height="5" rx="2.5" fill="white" fillOpacity="0.85"/>
          <rect x="44" y="59" width="38" height="3" rx="1.5" fill="white" fillOpacity="0.5"/>
          <rect x="36" y="66" width="78" height="2" fill="oklch(0.72 0.11 75)" fillOpacity="0.75"/>
          <rect x="44" y="72" width="60" height="3" rx="1.5" fill="oklch(0.25 0.028 56)" fillOpacity="0.5"/>
          <rect x="44" y="79" width="44" height="2.5" rx="1.25" fill="oklch(0.52 0.044 68)" fillOpacity="0.45"/>
          <rect x="44" y="85" width="52" height="2" rx="1" fill="oklch(0.52 0.044 68)" fillOpacity="0.38"/>
          <rect x="44" y="94" width="32" height="3" rx="1.5" fill="oklch(0.25 0.028 56)" fillOpacity="0.35"/>
          <rect x="44" y="118" width="42" height="2" rx="1" fill="oklch(0.52 0.044 68)" fillOpacity="0.3"/>
          <rect x="44" y="124" width="30" height="2" rx="1" fill="oklch(0.52 0.044 68)" fillOpacity="0.25"/>
          <path d="M24 180 Q24 198 75 200 Q126 198 126 180" fill="oklch(0.86 0.038 72)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.8"/>
          <line x1="24" y1="185" x2="126" y2="185" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeOpacity="0.4"/>
        </svg>
      </motion.div>

      {/* 4 — Shrink sleeve container, left lower */}
      <motion.div
        className="absolute"
        style={{ left: "0%", bottom: "10%", width: "22%" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 20, ease: "easeInOut", repeat: Infinity, delay: 9 }}
      >
        <svg viewBox="0 0 100 190" fill="none" className="w-full" style={{ filter: "drop-shadow(0 4px 14px oklch(0.3 0.03 60 / 0.14))" }}>
          <defs>
            <linearGradient id="slvG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.65 0.052 68)" stopOpacity="0.5"/>
              <stop offset="20%" stopColor="oklch(0.25 0.028 56)" stopOpacity="0"/>
              <stop offset="80%" stopColor="oklch(0.25 0.028 56)" stopOpacity="0"/>
              <stop offset="100%" stopColor="oklch(0.58 0.048 66)" stopOpacity="0.55"/>
            </linearGradient>
          </defs>
          <path d="M16 38 L84 38 L84 162 Q84 174 50 175 Q16 174 16 162 Z" fill="oklch(0.95 0.013 76)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.8"/>
          <path d="M16 38 L84 38 L84 162 Q84 174 50 175 Q16 174 16 162 Z" fill="url(#slvG)"/>
          <path d="M36 16 Q36 8 50 8 Q64 8 64 16 L84 38 L16 38 Z" fill="oklch(0.87 0.032 74)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.8"/>
          <ellipse cx="50" cy="8" rx="14" ry="5" fill="oklch(0.74 0.044 70)" stroke="oklch(0.64 0.050 68)" strokeWidth="0.8"/>
          <rect x="18" y="50" width="64" height="100" fill="oklch(0.93 0.016 76)"/>
          <rect x="18" y="50" width="64" height="100" fill="url(#slvG)"/>
          <rect x="26" y="60" width="48" height="5" rx="2.5" fill="oklch(0.25 0.028 56)" fillOpacity="0.85"/>
          <rect x="26" y="69" width="32" height="3" rx="1.5" fill="oklch(0.52 0.044 68)" fillOpacity="0.5"/>
          <rect x="26" y="76" width="22" height="2" rx="1" fill="oklch(0.72 0.11 75)" fillOpacity="0.75"/>
          <rect x="26" y="83" width="48" height="2.5" rx="1.25" fill="oklch(0.25 0.028 56)" fillOpacity="0.4"/>
          <rect x="26" y="89" width="35" height="2" rx="1" fill="oklch(0.52 0.044 68)" fillOpacity="0.35"/>
          <rect x="26" y="95" width="40" height="2" rx="1" fill="oklch(0.52 0.044 68)" fillOpacity="0.3"/>
          <ellipse cx="50" cy="169" rx="34" ry="7" fill="oklch(0.83 0.040 70)" stroke="oklch(0.74 0.044 70)" strokeWidth="0.6"/>
        </svg>
      </motion.div>

      {/* 5 — Flat label stack, right lower */}
      <motion.div
        className="absolute"
        style={{ right: "2%", bottom: "16%", width: "17%" }}
        animate={{ y: [0, -7, 0], rotate: [2.5, 3.5, 2.5] }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity, delay: 11 }}
      >
        <svg viewBox="0 0 110 130" fill="none" className="w-full" style={{ filter: "drop-shadow(0 4px 12px oklch(0.3 0.03 60 / 0.16))" }}>
          <rect x="7" y="12" width="98" height="62" rx="4" fill="oklch(0.86 0.036 72)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.6"/>
          <rect x="3" y="8"  width="98" height="62" rx="4" fill="oklch(0.91 0.024 76)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.6"/>
          <rect x="0" y="4"  width="98" height="62" rx="4" fill="oklch(0.97 0.008 78)" stroke="oklch(0.78 0.044 72)" strokeWidth="0.8"/>
          <rect x="0" y="4"  width="98" height="20" rx="4" fill="oklch(0.25 0.028 56)" fillOpacity="0.88"/>
          <rect x="0" y="15" width="98" height="9"  fill="oklch(0.25 0.028 56)" fillOpacity="0.88"/>
          <rect x="8" y="8"  width="54" height="5" rx="2.5" fill="white" fillOpacity="0.87"/>
          <rect x="8" y="16" width="36" height="3" rx="1.5" fill="white" fillOpacity="0.5"/>
          <rect x="8" y="28" width="24" height="2" rx="1" fill="oklch(0.72 0.11 75)" fillOpacity="0.8"/>
          <rect x="8" y="34" width="80" height="3" rx="1.5" fill="oklch(0.25 0.028 56)" fillOpacity="0.5"/>
          <rect x="8" y="41" width="58" height="2.5" rx="1.25" fill="oklch(0.52 0.044 68)" fillOpacity="0.45"/>
          {[0,2,5,7,10,13,15,18,21,24].map((x, i) => (
            <rect key={i} x={8 + x} y="52" width={i % 4 === 0 ? 1.5 : 1} height="10" fill="oklch(0.25 0.028 56)" fillOpacity="0.6"/>
          ))}
          <line x1="0"   y1="66" x2="3"   y2="70" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeOpacity="0.5"/>
          <line x1="98"  y1="66" x2="101" y2="70" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeOpacity="0.5"/>
          <line x1="3"   y1="70" x2="7"   y2="74" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeOpacity="0.35"/>
          <line x1="101" y1="70" x2="105" y2="74" stroke="oklch(0.78 0.044 72)" strokeWidth="0.5" strokeOpacity="0.35"/>
        </svg>
      </motion.div>

    </div>
  );
}

/* ───────────────────────── PRODUCTS ───────────────────────── */

const PRODUCT_ROWS = [
  {
    code: "01",
    title: "Printing and Barcode Labels",
    description: "Brochures, catalogues, letterheads, notebooks and corporate stationery produced to ISO colour standards with documented reorder consistency.",
    href: "/products#commercial-printing",
  },
  {
    code: "02",
    title: "Paper Bags",
    description: "Kraft, laminated, luxury and retail carry bags with custom print. Structured handles, strong construction, consistent finish across high-volume runs.",
    href: "/products#paper-bags",
  },
  {
    code: "03",
    title: "Rigid Boxes",
    description: "Magnetic closure, drawer, lid & base, foldable rigid and jewellery formats — engineered to specification with first-article verification before volume production.",
    href: "/products#rigid-boxes",
  },
  {
    code: "04",
    title: "Calendars & Diaries",
    description: "Wall, desk, corporate and executive formats — custom designed with precision binding and on-time delivery for annual production cycles.",
    href: "/products#calendars-diaries",
  },
  {
    code: "05",
    title: "Marketing & Branding",
    description: "Catalogues, corporate profiles, annual reports, presentation folders, danglers and exhibition materials designed to convert and built to impress.",
    href: "/products#marketing-branding",
  },
  {
    code: "06",
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
      intro="Offset to digital, conversion to binding — we operate the full production stack so your brief moves from artwork to delivery without leaving a single supplier."
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
