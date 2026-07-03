import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Resolved values of CSS custom properties used in GSAP (oklch not interpolatable by GSAP)
const GOLD = "oklch(0.72 0.11 75)";
const FOREGROUND = "oklch(0.22 0.018 60)";

const STEPS = [
  {
    number: "01",
    title: "Discovery & Consultation",
    short: "Understand requirements and project goals.",
    detail:
      "We begin with a thorough consultation — understanding your brand, production volumes, timeline, and packaging objectives. Every decision made here shapes the entire engagement.",
  },
  {
    number: "02",
    title: "Packaging Strategy",
    short: "Recommend packaging structure, materials and finishes.",
    detail:
      "Our team evaluates substrate options, structural formats, print finishes, and coatings — recommending solutions that balance aesthetic ambition with production viability and budget.",
  },
  {
    number: "03",
    title: "Design",
    short: "Create production-ready artwork and dieline layouts.",
    detail:
      "We produce high-fidelity dieline artwork, colour separations, and print-ready files — ensuring every design decision is optimised for the chosen print process before a single sheet is pressed.",
  },
  {
    number: "04",
    title: "Sampling & Prototype Testing",
    short: "Validate designs with physical samples before production.",
    detail:
      "Hand-finished prototypes are created and tested for structural integrity, print fidelity, and material performance. Nothing advances to large-scale production without your explicit sign-off on a verified first article.",
  },
  {
    number: "05",
    title: "Production",
    short: "Manufacturing at scale with quality control.",
    detail:
      "Full-scale manufacturing with rigorous quality checks — from pre-press colour management and press approvals to finished goods inspection, packing, and labelling.",
  },
  {
    number: "06",
    title: "Delivery & Support",
    short: "Timely delivery and ongoing support.",
    detail:
      "We manage dispatch, archive your digital assets for seamless future reprints, and provide ongoing support as your requirements grow and evolve. The relationship does not end at delivery.",
  },
] as const;

// Track line x-position; dots + rings all center on this value.
const TRACK_X = 7;

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ringRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const navRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const steps = stepRefs.current.filter((el): el is HTMLDivElement => el !== null);
      const dots = dotRefs.current.filter((el): el is HTMLSpanElement => el !== null);
      const rings = ringRefs.current.filter((el): el is HTMLSpanElement => el !== null);
      const navItems = navRefs.current.filter((el): el is HTMLDivElement => el !== null);

      if (steps.length < 2) return;

      // Let GSAP own all transforms on dots and rings so there's no CSS/GSAP conflict.
      // xPercent/yPercent center each element on the track line without margins.
      gsap.set(dots, { xPercent: -50, yPercent: -50 });
      gsap.set(rings, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

      // First dot starts in active state
      gsap.set(dots[0], { scale: 1.5, backgroundColor: GOLD });
      gsap.set(dots.slice(1), { scale: 1, backgroundColor: FOREGROUND });

      const tl = gsap.timeline();

      // Progress fill grows linearly over the full scroll range
      tl.to(progressFillRef.current, {
        scaleY: 1,
        ease: "none",
        duration: STEPS.length - 1,
      }, 0);

      for (let i = 0; i < STEPS.length - 1; i++) {
        const t = i;

        // Outgoing step: lifts, shrinks, blurs out
        tl.to(steps[i], {
          opacity: 0,
          y: -52,
          scale: 0.97,
          filter: "blur(3px)",
          duration: 1,
          ease: "power3.inOut",
        }, t);

        // Incoming step: rises from below, sharpens in — fromTo for reliable reverse scrub
        tl.fromTo(
          steps[i + 1],
          { opacity: 0, y: 52, scale: 0.97, filter: "blur(3px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1, ease: "power3.inOut" },
          t,
        );

        // Nav label: dim outgoing, lift incoming
        tl.to(navItems[i], { opacity: 0.25, duration: 0.45, ease: "power2.inOut" }, t);
        tl.to(navItems[i + 1], { opacity: 1, duration: 0.45, ease: "power2.inOut" }, t + 0.3);

        // Dot: deactivate outgoing (shrink, grey, fade)
        tl.to(dots[i], {
          scale: 1,
          backgroundColor: FOREGROUND,
          opacity: 0.3,
          duration: 0.4,
          ease: "power2.inOut",
        }, t + 0.1);

        // Dot: activate incoming (grow, gold, full opacity)
        tl.to(dots[i + 1], {
          scale: 1.5,
          backgroundColor: GOLD,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        }, t + 0.2);

        // Ring: radial pulse outward from the activating dot
        tl.fromTo(
          rings[i + 1],
          { scale: 1, opacity: 0.6 },
          { scale: 3.2, opacity: 0, duration: 0.75, ease: "power2.out" },
          t + 0.2,
        );
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${(STEPS.length - 1) * window.innerHeight}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        // 0.8s scrub lag: animation trails scroll slightly, giving a smooth elastic feel
        scrub: 0.8,
        invalidateOnRefresh: true,
        animation: tl,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative h-screen bg-[var(--background)] overflow-hidden"
      aria-label="Our 6-step process"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-fine grid-fade opacity-30" aria-hidden />
      <div className="mx-auto h-full max-w-[1400px] px-6 md:px-10 grid grid-cols-12 gap-8">

        {/* ── LEFT NAV — desktop only ─────────────────────────── */}
        <div className="hidden md:flex col-span-4 flex-col justify-center">

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)] mb-12">
            <span className="h-px w-8 bg-[var(--sand-400)]" aria-hidden />
            Process
          </div>

          <nav className="relative" aria-label="Process steps">
            {/* Static track */}
            <div
              className="absolute top-0 h-full w-px bg-[var(--sand-300)]"
              style={{ left: `${TRACK_X}px` }}
              aria-hidden
            />
            {/* Animated gold fill with glow */}
            <div
              ref={progressFillRef}
              className="absolute top-0 h-full w-px origin-top"
              style={{
                left: `${TRACK_X}px`,
                transform: "scaleY(0.04)",
                backgroundColor: "var(--gold)",
                boxShadow: "0 0 5px 1.5px oklch(0.72 0.11 75 / 0.4)",
              }}
              aria-hidden
            />

            {STEPS.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { navRefs.current[i] = el; }}
                // pl-[22px]: content clears the 14px-wide ring (center 7px + 7px radius = 14px)
                className="relative flex flex-col pl-[22px] py-[14px] select-none"
                style={{ opacity: i === 0 ? 1 : 0.25 }}
              >
                {/* Radial pulse ring — GSAP manages xPercent/yPercent/scale/opacity */}
                <span
                  ref={(el) => { ringRefs.current[i] = el; }}
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: "13px",
                    height: "13px",
                    left: `${TRACK_X}px`,
                    top: "50%",
                    border: "1px solid var(--gold)",
                  }}
                  aria-hidden
                />
                {/* Timeline dot — GSAP manages xPercent/yPercent/scale/backgroundColor */}
                <span
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className="absolute rounded-full"
                  style={{
                    width: "7px",
                    height: "7px",
                    left: `${TRACK_X}px`,
                    top: "50%",
                    backgroundColor: i === 0 ? GOLD : FOREGROUND,
                    opacity: i === 0 ? 1 : 0.3,
                  }}
                  aria-hidden
                />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--sand-400)]">
                  {step.number}
                </span>
                <span className="font-display text-[15px] leading-snug mt-[3px]">
                  {step.title}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* ── RIGHT: Step content ──────────────────────────────── */}
        <div className="col-span-12 md:col-span-8 relative flex items-center">

          <div
            className="absolute top-8 left-0 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--sand-700)] md:hidden"
            aria-hidden
          >
            <span className="h-px w-6 bg-[var(--sand-400)]" />
            Process
          </div>

          {STEPS.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="absolute inset-0 flex flex-col justify-center md:pl-16 pt-20 md:pt-0"
              style={{
                opacity: i === 0 ? 1 : 0,
                // Non-first steps start offset; GSAP will manage from here via fromTo
                transform: i === 0 ? "none" : "translateY(52px) scale(0.97)",
                filter: i === 0 ? "none" : "blur(3px)",
              }}
              aria-hidden={i !== 0}
            >
              {/* Watermark number */}
              <div
                className="pointer-events-none select-none absolute right-0 top-1/2 font-display leading-none tracking-tighter"
                style={{
                  fontSize: "clamp(8rem, 22vw, 26rem)",
                  color: "var(--sand-200)",
                  opacity: 0.55,
                  transform: "translateY(-50%)",
                }}
                aria-hidden
              >
                {step.number}
              </div>

              <p className="relative z-10 text-[11px] uppercase tracking-[0.32em] text-[var(--sand-400)] mb-6">
                Step {step.number}&thinsp;/&thinsp;{String(STEPS.length).padStart(2, "0")}
              </p>

              <h3 className="relative z-10 font-display text-[clamp(2.2rem,4.5vw,5.5rem)] leading-[0.95] tracking-tight text-balance mb-7">
                {step.title}
              </h3>

              <div className="relative z-10 h-px w-12 bg-[var(--sand-400)] mb-7" aria-hidden />

              <p className="relative z-10 text-base md:text-lg text-foreground/80 leading-relaxed max-w-sm md:max-w-md mb-4">
                {step.short}
              </p>

              <p className="relative z-10 text-sm md:text-base text-[var(--sand-700)] leading-relaxed max-w-sm md:max-w-lg">
                {step.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
