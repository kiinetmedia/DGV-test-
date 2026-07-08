import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   EDITORIAL CAROUSEL
   A reusable, scroll-pinned editorial carousel.
   - Left 60%: parallax image with SVG turbulence distortion on transition
   - Right 40%: editorial content panel
   - Bottom: navigation bar with category codes + prev/next arrows
   - Mobile: stacked, image on top, content below, touch-swipe navigation
   ═══════════════════════════════════════════════════════════════════════════ */

export type CarouselItem = {
  id: string;
  code: string;
  title: string;
  intro: string;
  capabilities: readonly [string, string, string];
  insight: string;
  imageSrc: string;
  imageAlt: string;
};

export function EditorialCarousel({
  items,
  instanceId,
}: {
  items: CarouselItem[];
  instanceId: string;
}) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const activeRef = useRef(0);
  const dragStartX = useRef<number | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const filterId = `carousel-distortion-${instanceId}`;

  /* ── Mouse parallax ─────────────────────────────────────────────────────── */
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const sx = useSpring(mvX, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const sy = useSpring(mvY, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const parallaxX = useTransform(sx, [-0.5, 0.5], ["-1.5%", "1.5%"]);
  const parallaxY = useTransform(sy, [-0.5, 0.5], ["-1.5%", "1.5%"]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mvX.set((e.clientX - rect.left) / rect.width - 0.5);
      mvY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mvX, mvY, prefersReducedMotion],
  );

  /* ── Navigation ─────────────────────────────────────────────────────────── */
  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, target));
      if (clamped === activeRef.current) return;

      const st = stRef.current;
      if (st) {
        // Drive navigation through scroll so the pin stays in sync.
        const total = st.end - st.start;
        const scrollTarget =
          st.start + ((clamped + 0.5) / items.length) * total;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(scrollTarget, { duration: 1.1 });
        } else {
          window.scrollTo({ top: scrollTarget, behavior: "smooth" });
        }
        // onUpdate sets the active state once the scroll resolves.
      } else {
        setDirection(clamped > activeRef.current ? 1 : -1);
        activeRef.current = clamped;
        setActive(clamped);
      }
    },
    [items.length],
  );

  const advance = useCallback(() => goTo(activeRef.current + 1), [goTo]);
  const retreat = useCallback(() => goTo(activeRef.current - 1), [goTo]);

  /* ── Distortion pulse on category change ────────────────────────────────── */
  useEffect(() => {
    if (prefersReducedMotion || !turbRef.current) return;
    const turb = turbRef.current;
    gsap.killTweensOf(turb);
    const proxy = { f: 0 };
    const apply = () =>
      turb.setAttribute(
        "baseFrequency",
        `${proxy.f.toFixed(4)} ${(proxy.f * 0.5).toFixed(4)}`,
      );
    const tl = gsap.timeline();
    tl.to(proxy, { f: 0.035, duration: 0.25, ease: "power2.in", onUpdate: apply });
    tl.to(proxy, { f: 0, duration: 0.45, ease: "power2.out", onUpdate: apply });
    return () => {
      tl.kill();
    };
  }, [active, prefersReducedMotion]);

  /* ── Reset expandable insight on category change ────────────────────────── */
  useEffect(() => {
    setExpanded(false);
  }, [active]);

  /* ── Lenis + GSAP ScrollTrigger pin ─────────────────────────────────────── */
  useEffect(() => {
    if (prefersReducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${items.length * 1.1 * window.innerHeight}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(
            items.length - 1,
            Math.floor(self.progress * items.length),
          );
          if (idx !== activeRef.current) {
            setDirection(idx > activeRef.current ? 1 : -1);
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
      stRef.current = st;
      return () => {
        stRef.current = null;
      };
    });

    return () => {
      mm.revert();
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(onRaf);
    };
  }, [items.length, prefersReducedMotion]);

  /* ── Keyboard navigation ────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!inView) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        retreat();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, retreat]);

  /* ── Drag / swipe ───────────────────────────────────────────────────────── */
  const onDragStart = useCallback((clientX: number) => {
    dragStartX.current = clientX;
  }, []);
  const onDragEnd = useCallback(
    (clientX: number) => {
      if (dragStartX.current === null) return;
      const delta = clientX - dragStartX.current;
      dragStartX.current = null;
      if (Math.abs(delta) > 60) {
        if (delta < 0) advance();
        else retreat();
      }
    },
    [advance, retreat],
  );

  const item = items[active];

  /* ── Content panel slide variants ───────────────────────────────────────── */
  const panelVariants = {
    enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 38 : -38 }),
    center: { opacity: 1, y: 0 },
    exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -38 : 38 }),
  };

  return (
    <section
      ref={sectionRef}
      aria-label={`${instanceId} editorial carousel`}
      aria-roledescription="carousel"
      className="relative h-screen w-full flex flex-col overflow-hidden bg-background"
    >
      {/* Hidden SVG turbulence filter definition */}
      <svg
        aria-hidden
        className="absolute h-0 w-0 overflow-hidden"
        focusable="false"
      >
        <filter id={filterId}>
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0 0"
            numOctaves={2}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={28}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-12">
        {/* ── Left: image ─────────────────────────────────────────────────── */}
        <div
          className="relative md:col-span-7 h-[45vh] md:h-full overflow-hidden select-none"
          onMouseMove={handleMouseMove}
          onMouseDown={(e) => onDragStart(e.clientX)}
          onMouseUp={(e) => onDragEnd(e.clientX)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1.06 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.75, ease: EASE }}
              className="absolute inset-0"
              style={{
                x: prefersReducedMotion ? 0 : parallaxX,
                y: prefersReducedMotion ? 0 : parallaxY,
                willChange: "transform",
                filter: prefersReducedMotion ? undefined : `url(#${filterId})`,
              }}
            >
              <img
                src={item.imageSrc}
                alt={item.imageAlt}
                loading={active === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient fades */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-1/3 hidden md:block"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--background))",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--background))",
            }}
          />

          {/* Code overlay */}
          <div className="pointer-events-none absolute top-6 left-6 md:top-8 md:left-8">
            <span className="font-display text-[clamp(3rem,6vw,6rem)] leading-none text-white/85 mix-blend-overlay">
              {item.code}
            </span>
          </div>
        </div>

        {/* ── Right: content panel ────────────────────────────────────────── */}
        <div className="md:col-span-5 flex-1 min-h-0 overflow-y-auto bg-[var(--sand-50)] flex flex-col justify-center px-6 py-8 md:px-12 md:py-16 max-h-[55vh] md:max-h-none">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={item.id}
              custom={direction}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: EASE }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)]">
                <span className="h-px w-8 bg-[var(--sand-400)]" />
                <span className="font-mono text-[var(--gold)]">{item.code}</span>
              </div>

              {/* Title */}
              <h2 className="mt-5 font-display leading-[0.95] tracking-tight text-foreground text-[clamp(2rem,3.8vw,4.2rem)]">
                {item.title}
              </h2>

              {/* Intro */}
              <p className="mt-5 max-w-md text-[var(--sand-700)] leading-relaxed">
                {item.intro}
              </p>

              {/* Hairline */}
              <div className="hairline my-7" />

              {/* Capabilities */}
              <ul className="space-y-4">
                {item.capabilities.map((cap, i) => (
                  <motion.li
                    key={cap}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: 0.12 + i * 0.08,
                    }}
                    className="flex items-start gap-4"
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--gold)] mt-[3px] flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-[var(--sand-700)]">
                      {cap}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Deeper insight (expandable) */}
              <div className="mt-7 border-t border-[var(--sand-300)]">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left group"
                >
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--sand-700)] group-hover:text-foreground transition-colors duration-300">
                    Deeper insight
                  </span>
                  <motion.span
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border border-[var(--sand-400)] text-[var(--sand-700)] group-hover:border-foreground group-hover:text-foreground transition-colors duration-300"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      key="insight"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-[var(--sand-700)] max-w-md">
                        {item.insight}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA */}
              <a
                href="mailto:abhinav@dgvcompany.com"
                className="magnetic-btn mt-6 inline-flex items-center gap-3 border border-foreground px-7 py-3.5 text-[11px] uppercase tracking-[0.28em]"
              >
                <span>Enquire →</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom navigation bar ─────────────────────────────────────────── */}
      <nav
        aria-label="Carousel navigation"
        className="shrink-0 border-t border-[var(--sand-300)] bg-[var(--sand-50)]"
      >
        <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-3.5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {items.map((it, i) => (
              <button
                key={it.id}
                onClick={() => goTo(i)}
                aria-current={i === active}
                aria-label={`Go to ${it.title}`}
                className="relative flex items-center gap-2 py-1.5 group"
              >
                <span
                  className={`font-mono text-[11px] tracking-[0.2em] transition-colors duration-300 ${
                    i === active
                      ? "text-foreground"
                      : "text-[var(--sand-400)] group-hover:text-[var(--sand-700)]"
                  }`}
                >
                  {it.code}
                </span>
                {i === active && (
                  <motion.span
                    layoutId={`carousel-indicator-${instanceId}`}
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-[var(--gold)]"
                    transition={{ type: "spring", stiffness: 440, damping: 34 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={retreat}
              disabled={active === 0}
              aria-label="Previous"
              className="relative h-9 w-9 flex items-center justify-center border border-[var(--sand-300)] text-[var(--sand-700)] hover:border-foreground hover:text-foreground disabled:opacity-30 disabled:hover:border-[var(--sand-300)] disabled:hover:text-[var(--sand-700)] transition-colors duration-300 before:absolute before:-inset-[4px] before:content-['']"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M13 5H1M4.5 1L1 5L4.5 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={advance}
              disabled={active === items.length - 1}
              aria-label="Next"
              className="relative h-9 w-9 flex items-center justify-center border border-[var(--sand-300)] text-[var(--sand-700)] hover:border-foreground hover:text-foreground disabled:opacity-30 disabled:hover:border-[var(--sand-300)] disabled:hover:text-[var(--sand-700)] transition-colors duration-300 before:absolute before:-inset-[4px] before:content-['']"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5H13M9.5 1L13 5L9.5 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </section>
  );
}
