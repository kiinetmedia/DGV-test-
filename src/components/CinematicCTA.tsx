import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LUXE = [0.16, 1, 0.3, 1] as const;

/* ─── Magnetic primary CTA ─────────────────────────────────────────────── */

function MagneticBtn({ href }: { href: string }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 24 });
  const sy = useSpring(my, { stiffness: 200, damping: 24 });

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left - r.width / 2) * 0.3);
      my.set((e.clientY - r.top - r.height / 2) * 0.3);
    },
    [mx, my]
  );

  const onLeave = useCallback(() => {
    setHovered(false);
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const borderSides = [
    // top — left→right
    { cls: "top-0 left-0 h-px", axis: "width" as const, delay: 0 },
    // right — top→bottom
    { cls: "top-0 right-0 w-px", axis: "height" as const, delay: 0.14 },
    // bottom — right→left (anchored right)
    { cls: "bottom-0 right-0 h-px", axis: "width" as const, delay: 0.28 },
    // left — bottom→top (anchored bottom)
    { cls: "bottom-0 left-0 w-px", axis: "height" as const, delay: 0.42 },
  ];

  return (
    <motion.a
      ref={btnRef}
      href={href}
      className="cta-primary group relative inline-flex items-center text-[11px] uppercase tracking-[0.28em]"
      style={{
        x: sx,
        y: sy,
        boxShadow: hovered
          ? "0 16px 56px oklch(0.22 0.018 60 / 0.20), 0 4px 20px oklch(0.22 0.018 60 / 0.10)"
          : "0 2px 8px oklch(0.22 0.018 60 / 0.04)",
        willChange: "transform, box-shadow",
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
    >
      {/* Static border */}
      <span className="absolute inset-0 border border-foreground pointer-events-none" />

      {/* Perimeter border animation — clockwise */}
      {borderSides.map(({ cls, axis, delay }, i) => (
        <motion.span
          key={i}
          className={`absolute ${cls} bg-foreground pointer-events-none`}
          animate={{ [axis]: hovered ? "100%" : "0%" }}
          transition={{
            duration: 0.18,
            delay: hovered ? delay : 0,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Fill sweep from bottom */}
      <motion.span
        className="absolute inset-0 bg-foreground pointer-events-none"
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: LUXE }}
        style={{ originY: "bottom" }}
      />

      {/* Label */}
      <motion.span
        className="relative z-10 px-10 py-5 block leading-none"
        animate={{
          color: hovered ? "oklch(0.965 0.012 80)" : "oklch(0.22 0.018 60)",
        }}
        transition={{ duration: 0.32 }}
      >
        Get a Quote in 24 Hours
      </motion.span>
    </motion.a>
  );
}

/* ─── Secondary link ────────────────────────────────────────────────────── */

function SecondaryLink({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      className="cta-secondary inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]"
      animate={{ color: hovered ? "oklch(0.22 0.018 60)" : "oklch(0.38 0.025 55)" }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative">
        Explore Products
        <motion.span
          className="absolute bottom-0 left-0 h-px bg-foreground"
          animate={{ width: hovered ? "100%" : "0%" }}
          transition={{ duration: 0.42, ease: LUXE }}
        />
      </span>
      <motion.span
        className="text-[var(--gold)]"
        animate={{ x: hovered ? 6 : 0 }}
        transition={{ duration: 0.3, ease: LUXE }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

/* ─── Contact meta block ────────────────────────────────────────────────── */

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="cta-meta-item border-t border-[var(--sand-300)] pt-4">
      <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
        {label}
      </div>
      <div className="mt-2 font-display text-xl break-words">{value}</div>
    </div>
  );
}

/* ─── Depth decoration layer ────────────────────────────────────────────── */

function DecoLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden
    >
      {/* Top-right dieline template */}
      <svg
        className="absolute text-[var(--sand-700)]"
        style={{ top: "8%", right: "5%", opacity: 0.04, width: 200 }}
        viewBox="0 0 200 255"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeDasharray="5 3"
      >
        <path d="M50 7 L150 7 L150 50 L188 50 L188 205 L150 205 L150 248 L50 248 L50 205 L12 205 L12 50 L50 50 Z" />
        <line x1="50" y1="50" x2="150" y2="50" />
        <line x1="50" y1="205" x2="150" y2="205" />
      </svg>

      {/* Bottom-left registration cross */}
      <svg
        className="absolute text-[var(--sand-700)]"
        style={{ bottom: "18%", left: "7%", opacity: 0.05, width: 48 }}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      >
        <circle cx="24" cy="24" r="13" />
        <line x1="0" y1="24" x2="48" y2="24" />
        <line x1="24" y1="0" x2="24" y2="48" />
      </svg>

      {/* Bottom-right barcode fragment */}
      <svg
        className="absolute text-[var(--sand-700)]"
        style={{ bottom: "20%", right: "6%", opacity: 0.035, width: 24, height: 34 }}
        viewBox="0 0 24 34"
        fill="currentColor"
      >
        <rect x="0" y="0" width="2" height="34" />
        <rect x="5" y="0" width="1" height="34" />
        <rect x="8" y="0" width="2.5" height="34" />
        <rect x="13" y="0" width="1" height="34" />
        <rect x="16" y="0" width="2" height="34" />
        <rect x="21" y="0" width="1.5" height="34" />
      </svg>

      {/* Top-left crop mark */}
      <svg
        className="absolute text-[var(--sand-700)]"
        style={{ top: "14%", left: "36%", opacity: 0.04, width: 26 }}
        viewBox="0 0 26 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      >
        <path d="M13 0 L13 9 M0 13 L9 13" />
      </svg>

      {/* Dashed cut line */}
      <svg
        className="absolute text-[var(--sand-700)]"
        style={{ top: "55%", right: "12%", opacity: 0.032, width: 48, transform: "rotate(-30deg)" }}
        viewBox="0 0 48 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="3 2.5"
      >
        <line x1="0" y1="2" x2="48" y2="2" />
      </svg>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────────────── */

export function CinematicCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /* ── GSAP scroll sequence — desktop only ────────────────────────────── */
  useEffect(() => {
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Hide decorative layers only (content stays visible during entry scroll)
      gsap.set(".cta-grid-layer", { opacity: 0 });
      gsap.set(".cta-spotlight", { opacity: 0 });

      // Hide content — will be revealed by time-based animation on pin
      gsap.set(".cta-char", { opacity: 0, yPercent: 78, scale: 1.05 });
      gsap.set(".cta-eyebrow", { opacity: 0, y: 18 });
      gsap.set(".cta-sub", { opacity: 0, y: 22 });
      gsap.set(".cta-btns", { opacity: 0, y: 26 });
      gsap.set(".cta-meta-item", { opacity: 0, y: 14 });

      // Decorative scrub — grid + spotlight fade in as user scrolls through pin
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
      scrubTl.to(".cta-grid-layer", { opacity: 0.18, ease: "none", duration: 1 }, 0);
      scrubTl.to(".cta-spotlight", { opacity: 1, ease: "power1.out", duration: 2 }, 0);

      // Content reveal — time-based, fires the moment the section pins at top
      const contentTl = gsap.timeline({ paused: true });
      contentTl
        .to(".cta-eyebrow", { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0)
        .to(
          ".cta-char",
          { opacity: 1, yPercent: 0, scale: 1, stagger: 0.032, duration: 0.7, ease: "power3.out" },
          0.08
        )
        .to(".cta-sub",  { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.25")
        .to(".cta-btns", { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.35")
        .to(
          ".cta-meta-item",
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power3.out" },
          "-=0.3"
        );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        onEnter: () => contentTl.play(0),
        onLeaveBack: () => {
          // Reset so re-entering replays the animation
          contentTl.pause(0);
          gsap.set(".cta-char", { opacity: 0, yPercent: 78, scale: 1.05 });
          gsap.set(".cta-eyebrow", { opacity: 0, y: 18 });
          gsap.set(".cta-sub", { opacity: 0, y: 22 });
          gsap.set(".cta-btns", { opacity: 0, y: 26 });
          gsap.set(".cta-meta-item", { opacity: 0, y: 14 });
        },
      });

      return () => { scrubTl.kill(); contentTl.kill(); };
    });

    return () => mm.revert();
  }, [prefersReducedMotion]);

  /* ── headline character split ──────────────────────────────────────── */
  const line1 = "Start a ";
  const line2 = "conversation.";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen"
      aria-label="Contact DGV Company"
    >
      {/* Pinned viewport container */}
      <div className="md:sticky md:top-0 h-screen flex items-center justify-center overflow-hidden relative">

        {/* Animated grid layer */}
        <div
          className="cta-grid-layer bg-grid-fine absolute inset-0 pointer-events-none"
          aria-hidden
        />

        {/* Grain texture */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.14 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            opacity: 0.5,
            mixBlendMode: "multiply",
          }}
          aria-hidden
        />

        {/* Radial spotlight from top */}
        <div
          className="cta-spotlight pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "65vw",
            height: "58vh",
            background:
              "radial-gradient(ellipse at center top, oklch(1 0.02 80 / 0.65), transparent 72%)",
          }}
          aria-hidden
        />

        {/* Ambient warm light */}
        <div className="ambient-light absolute inset-0 pointer-events-none" aria-hidden />

        {/* Depth decoration overlays */}
        <DecoLayer />

        {/* Main content */}
        <div className="relative z-10 mx-auto max-w-[1100px] w-full px-5 md:px-8 text-center">

          {/* Eyebrow */}
          <div className="cta-eyebrow flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
            <span className="h-px w-8 bg-[var(--sand-400)]" />
            Get in Touch
            <span className="h-px w-8 bg-[var(--sand-400)]" />
          </div>

          {/* Headline — split into individual characters for GSAP stagger */}
          <h2
            className="mt-8 font-display text-[clamp(3.2rem,8.5vw,9rem)] leading-[0.9] tracking-tighter text-balance"
            aria-label="Start a conversation."
          >
            {line1.split("").map((ch, i) => (
              <span
                key={i}
                className="cta-char"
                aria-hidden
                style={{
                  display: ch === " " ? "inline" : "inline-block",
                  willChange: "transform, opacity",
                }}
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
            <em className="italic font-light">
              {line2.split("").map((ch, i) => (
                <span
                  key={"c" + i}
                  className="cta-char"
                  aria-hidden
                  style={{
                    display: "inline-block",
                    willChange: "transform, opacity",
                  }}
                >
                  {ch}
                </span>
              ))}
            </em>
          </h2>

          {/* Supporting text */}
          <p className="cta-sub mx-auto mt-10 max-w-xl text-[var(--sand-700)] leading-relaxed text-base md:text-lg">
            Looking for a reliable print and packaging partner? Write to us
            with your requirements and we will get back to you within 24 hours.
          </p>

          {/* CTA buttons */}
          <div className="cta-btns mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <MagneticBtn href="mailto:abhinav@dgvcompany.com" />
            <SecondaryLink href="/products" />
          </div>

          {/* Contact information */}
          <div className="mt-12 md:mt-24 grid grid-cols-1 min-[440px]:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-left">
            <MetaBlock label="Location" value="Mumbai, India" />
            <MetaBlock label="Contact" value="Mr. Abhinav Savla" />
            <MetaBlock label="Phone" value="+91 98207 91155" />
            <MetaBlock label="Email" value="abhinav@dgvcompany.com" />
          </div>
        </div>
      </div>
    </section>
  );
}
