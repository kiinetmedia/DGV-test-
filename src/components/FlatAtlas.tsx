import { useState, useCallback, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { useMailtoHref } from "@/lib/contact";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */

export type FlatAtlasSection =
  | { type: "list"; heading: string; items: string[] }
  | { type: "specs"; heading: string; specs: { k: string; v: string }[] };

export type FlatAtlasPairing = { label: string; href: string };

export type FlatAtlasItem = {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  insight?: string;
  image: string;
  imageAlt: string;
  video?: string;
  sections: FlatAtlasSection[];
  pairings: FlatAtlasPairing[];
  faqs: { q: string; a: string }[];
};

export type FlatAtlasConfig = {
  atlasLabel: string;
  introTitle: React.ReactNode;
  introBody: string;
  ctaLabel: string;
  faqHeading: string;
};

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED PRIMITIVES
───────────────────────────────────────────────────────────────────────────── */

function Pairings({ pairings }: { pairings: FlatAtlasPairing[] }) {
  return (
    <div className="flex flex-wrap items-center gap-y-2">
      {pairings.map((p, i) => (
        <motion.span
          key={p.href}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.07, duration: 0.38, ease: EASE }}
          className="flex items-center"
        >
          <a
            href={p.href}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[var(--sand-700)] hover:text-foreground border border-[var(--sand-300)] hover:border-foreground transition-all duration-200"
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] flex-shrink-0"
            />
            {p.label}
          </a>
          {i < pairings.length - 1 && (
            <span className="h-px w-3 bg-[var(--sand-300)]/50" />
          )}
        </motion.span>
      ))}
    </div>
  );
}

function InlineFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {faqs.map((f, i) => (
        <div key={i} className="border-t border-[var(--sand-300)]/60">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-start justify-between gap-4 py-4 text-left group"
            aria-expanded={open === i}
          >
            <span className="text-sm leading-snug text-[var(--sand-700)] group-hover:text-foreground transition-colors duration-200">
              {f.q}
            </span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="mt-0.5 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full border border-[var(--sand-400)] text-[var(--sand-700)] group-hover:border-foreground group-hover:text-foreground transition-colors duration-200"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <line x1="4" y1="1" x2="4" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <line x1="1" y1="4" x2="7" y2="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="ans"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-[var(--sand-700)] leading-relaxed">
                  {f.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <div className="border-t border-[var(--sand-300)]/60" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   INDEX PANEL
───────────────────────────────────────────────────────────────────────────── */

function IndexPanel({
  items,
  activeIdx,
  onSelect,
  atlasLabel,
}: {
  items: FlatAtlasItem[];
  activeIdx: number | null;
  onSelect: (i: number) => void;
  atlasLabel: string;
}) {
  return (
    <div className="w-[22%] md:w-[20%] border-r border-[var(--sand-300)] flex flex-col pt-6 md:pt-8 pb-8 overflow-y-auto shrink-0 bg-[var(--sand-50)]/40">
      <div className="px-5 md:px-6 mb-5">
        <span className="text-[8px] uppercase tracking-[0.32em] text-[var(--sand-400)]">
          Index
        </span>
      </div>

      <div className="flex flex-col flex-1">
        {items.map((item, i) => {
          const isActive = activeIdx === i;
          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(i)}
              className={`relative group flex flex-col gap-0.5 py-4 px-5 md:px-6 text-left transition-colors duration-200 border-b border-[var(--sand-300)]/30 last:border-0 ${
                isActive ? "text-foreground" : "text-[var(--sand-700)] hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="flat-atlas-active-bar"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--gold)]"
                  transition={{ type: "spring", stiffness: 440, damping: 34 }}
                />
              )}
              <span
                className={`font-mono text-[9px] tracking-[0.22em] transition-colors duration-200 ${
                  isActive ? "text-[var(--gold)]" : "text-[var(--sand-400)] group-hover:text-[var(--gold)]"
                }`}
              >
                {item.code}
              </span>
              <span className="text-[9.5px] md:text-[10px] uppercase tracking-[0.16em] leading-tight">
                {item.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="px-5 md:px-6 pt-6 mt-auto">
        <p className="text-[7.5px] uppercase tracking-[0.28em] text-[var(--sand-400)] leading-loose">
          {atlasLabel.split(" ").map((w, i) => (
            <span key={i}>{w}<br /></span>
          ))}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CENTER PANEL VIEWS
───────────────────────────────────────────────────────────────────────────── */

function AtlasIntro({
  config,
  items,
}: {
  config: FlatAtlasConfig;
  items: FlatAtlasItem[];
}) {
  return (
    <div className="flex flex-col justify-center h-full px-8 md:px-12 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-[var(--sand-400)]">
          <span className="h-px w-5 bg-[var(--sand-300)]" />
          {config.atlasLabel}
        </div>
        <h2 className="mt-7 font-display text-[clamp(2rem,3.5vw,4rem)] leading-[0.93] tracking-tight text-balance">
          {config.introTitle}
        </h2>
        <p className="mt-7 text-[var(--sand-700)] leading-relaxed text-sm max-w-xs">
          {config.introBody}
        </p>
        <div className="mt-10 flex flex-col gap-0">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.38, ease: EASE, delay: 0.14 + i * 0.05 }}
              className="flex items-center gap-3 py-2.5 border-b border-[var(--sand-300)]/40 last:border-0"
            >
              <span className="font-mono text-[9px] text-[var(--gold)] tracking-[0.2em] w-6">{item.code}</span>
              <span className="h-px flex-1 bg-[var(--sand-300)]/40" />
              <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--sand-700)] text-right max-w-[55%] leading-tight">
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ItemDetail({
  item,
  config,
}: {
  item: FlatAtlasItem;
  config: FlatAtlasConfig;
}) {
  const mailtoHref = useMailtoHref();
  return (
    <div className="flex flex-col px-8 md:px-12 py-10 md:py-14">
      {/* Eyebrow */}
      <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.3em] text-[var(--sand-400)]">
        <span className="font-mono text-[var(--gold)]">{item.code}</span>
        <span className="h-px w-3 bg-[var(--sand-300)]" />
        {config.atlasLabel}
      </div>

      {/* Title */}
      <h2 className="mt-4 font-display text-[clamp(1.8rem,3vw,3.5rem)] leading-[0.93] tracking-tight">
        {item.title}
      </h2>
      <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-[var(--sand-400)] italic">
        {item.tagline}
      </p>

      {/* Description */}
      <p className="mt-6 text-[var(--sand-700)] leading-relaxed text-sm">
        {item.description}
      </p>

      {/* Insight (optional) */}
      {item.insight && (
        <p className="mt-4 text-[var(--sand-700)] leading-relaxed text-sm border-l-[1.5px] border-[var(--sand-300)] pl-4 italic">
          {item.insight}
        </p>
      )}

      <div className="hairline my-6" />

      {/* Dynamic sections */}
      {item.sections.map((section, si) => {
        if (section.type === "list") {
          return (
            <div key={si} className={si > 0 ? "mt-7" : ""}>
              <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-3">
                {section.heading}
              </div>
              <ul className="space-y-2 mb-1">
                {section.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.04, duration: 0.32, ease: EASE }}
                    className="flex items-start gap-3 text-sm text-[var(--sand-700)]"
                  >
                    <span className="h-px w-4 bg-[var(--sand-400)] mt-[10px] flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          );
        }
        if (section.type === "specs") {
          return (
            <div key={si} className={si > 0 ? "mt-7" : ""}>
              <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-3">
                {section.heading}
              </div>
              <dl className="grid grid-cols-2 gap-x-6">
                {section.specs.map((spec) => (
                  <div
                    key={spec.k}
                    className="flex items-baseline justify-between gap-2 border-t border-[var(--sand-300)]/50 py-2.5"
                  >
                    <dt className="text-[8.5px] uppercase tracking-[0.18em] text-[var(--sand-400)]">
                      {spec.k}
                    </dt>
                    <dd className="text-[11px] text-[var(--sand-700)] text-right">
                      {spec.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        }
        return null;
      })}

      <div className="hairline my-5" />

      {/* Pairings */}
      {item.pairings.length > 0 && (
        <>
          <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-4">
            Works best with
          </div>
          <Pairings pairings={item.pairings} />
          <div className="hairline mt-5 mb-1" />
        </>
      )}

      {/* Inline FAQs */}
      {item.faqs.length > 0 && (
        <div className="mt-4">
          <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-2">
            Frequently asked
          </div>
          <InlineFaq faqs={item.faqs} />
        </div>
      )}

      {/* CTA */}
      <div className="mt-8">
        <a
          href={mailtoHref}
          className="magnetic-btn inline-flex items-center gap-3 border border-foreground px-7 py-3.5 text-[10px] uppercase tracking-[0.28em]"
        >
          <span>{config.ctaLabel} →</span>
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CENTER PANEL
───────────────────────────────────────────────────────────────────────────── */

function CenterPanel({
  items,
  activeIdx,
  config,
}: {
  items: FlatAtlasItem[];
  activeIdx: number | null;
  config: FlatAtlasConfig;
}) {
  const panelKey = activeIdx !== null ? `item-${items[activeIdx].id}` : "intro";

  return (
    <div className="flex-1 border-r border-[var(--sand-300)] relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={panelKey}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.42, ease: EASE }}
          className="absolute inset-0 overflow-y-auto"
        >
          {activeIdx === null ? (
            <AtlasIntro config={config} items={items} />
          ) : (
            <ItemDetail item={items[activeIdx]} config={config} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGE PANEL
───────────────────────────────────────────────────────────────────────────── */

function ImagePanel({
  image,
  alt,
  code,
  video,
}: {
  image: string;
  alt: string;
  code: string;
  video?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const sx = useSpring(mvX, { stiffness: 80, damping: 22, restDelta: 0.001 });
  const sy = useSpring(mvY, { stiffness: 80, damping: 22, restDelta: 0.001 });
  const imgX = useTransform(sx, [-0.5, 0.5], ["-3%", "3%"]);
  const imgY = useTransform(sy, [-0.5, 0.5], ["-3%", "3%"]);

  return (
    <div
      className="hidden md:block w-[35%] relative overflow-hidden shrink-0"
      onMouseMove={(e) => {
        if (prefersReducedMotion || video) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mvX.set((e.clientX - rect.left) / rect.width - 0.5);
        mvY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {video ? (
          <motion.div
            key={video + code}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0"
          >
            <video
              key={video}
              src={video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          </motion.div>
        ) : (
          <motion.div
            key={image + code}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.06 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.75, ease: EASE }}
            style={{
              x: prefersReducedMotion ? 0 : imgX,
              y: prefersReducedMotion ? 0 : imgY,
            }}
            className="absolute inset-0"
          >
            <img
              src={image}
              alt={alt}
              className="h-full w-full object-cover"
              loading="eager"
              width={700}
              height={900}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
        style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
      />

      <div className="pointer-events-none absolute bottom-8 right-6">
        <AnimatePresence mode="wait">
          <motion.span
            key={code}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.38, ease: EASE }}
            className="font-display leading-none text-white/70 mix-blend-overlay select-none"
            style={{ fontSize: "clamp(4rem,8vw,9rem)" }}
          >
            {code}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE FLAT ATLAS
───────────────────────────────────────────────────────────────────────────── */

function MobileFlatAtlas({
  items,
  config,
  externalIdx,
}: {
  items: FlatAtlasItem[];
  config: FlatAtlasConfig;
  externalIdx: number | null;
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const mailtoHref = useMailtoHref();

  useEffect(() => {
    if (externalIdx !== null) setActiveIdx(externalIdx);
  }, [externalIdx]);
  const item = activeIdx !== null ? items[activeIdx] : null;

  return (
    <div className="md:hidden flex flex-col">
      {/* Horizontal index strip */}
      <div className="flex overflow-x-auto gap-0 border-b border-[var(--sand-300)] no-scrollbar">
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
            className={`relative flex-shrink-0 flex flex-col items-center gap-1 px-3 py-3 text-center transition-colors duration-200 border-r border-[var(--sand-300)]/40 last:border-0 ${
              activeIdx === i ? "text-foreground bg-[var(--sand-100)]/60" : "text-[var(--sand-700)]"
            }`}
          >
            {activeIdx === i && (
              <motion.span
                layoutId="mob-flat-bar"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--gold)]"
                transition={{ type: "spring", stiffness: 440, damping: 34 }}
              />
            )}
            <span className="font-mono text-[8px] tracking-widest text-[var(--gold)]">{it.code}</span>
            <span className="text-[8px] uppercase tracking-[0.13em] leading-tight max-w-[72px] text-center">
              {it.title}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {item === null ? (
          <motion.div
            key="mob-intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            className="px-5 py-10"
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--sand-400)] mb-4">
              {config.atlasLabel}
            </p>
            <h2 className="font-display text-3xl leading-tight text-balance">
              {config.introTitle}
            </h2>
            <p className="mt-4 text-sm text-[var(--sand-700)] leading-relaxed">
              {config.introBody}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`mob-${item.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.38, ease: EASE }}
            className="px-5 py-8"
          >
            <p className="font-mono text-[8px] text-[var(--gold)] tracking-widest mb-1">{item.code}</p>
            <h2 className="font-display text-2xl leading-tight mb-1">{item.title}</h2>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--sand-400)] italic mb-4">{item.tagline}</p>
            <p className="text-sm text-[var(--sand-700)] leading-relaxed mb-5">{item.description}</p>

            {item.sections.map((sec, si) => (
              <div key={si} className="mb-5">
                <p className="text-[8px] uppercase tracking-[0.28em] text-[var(--sand-400)] mb-3">{sec.heading}</p>
                {sec.type === "list" && (
                  <ul className="space-y-2">
                    {sec.items.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[var(--sand-700)]">
                        <span className="h-px w-3 bg-[var(--sand-400)] mt-[10px] flex-shrink-0" />{s}
                      </li>
                    ))}
                  </ul>
                )}
                {sec.type === "specs" && (
                  <dl className="grid grid-cols-2 gap-x-4">
                    {sec.specs.map((sp) => (
                      <div key={sp.k} className="flex flex-col border-t border-[var(--sand-300)]/50 py-2">
                        <dt className="text-[8px] uppercase tracking-[0.16em] text-[var(--sand-400)]">{sp.k}</dt>
                        <dd className="text-[11px] text-[var(--sand-700)] mt-0.5">{sp.v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            ))}

            {item.pairings.length > 0 && (
              <>
                <p className="text-[8px] uppercase tracking-[0.28em] text-[var(--sand-400)] mb-3">Works best with</p>
                <Pairings pairings={item.pairings} />
              </>
            )}

            <a
              href={mailtoHref}
              className="magnetic-btn mt-7 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[10px] uppercase tracking-[0.26em]"
            >
              <span>Enquire →</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────────────── */

export function FlatAtlas({
  items,
  config,
}: {
  items: FlatAtlasItem[];
  config: FlatAtlasConfig;
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const location = useLocation();

  const handleSelect = useCallback((i: number) => {
    setActiveIdx((prev) => (prev === i ? null : i));
  }, []);

  useEffect(() => {
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return;
    const idx = items.findIndex((item) => item.id === hash);
    if (idx !== -1) setActiveIdx(idx);
  }, [location.hash, items]);

  const currentItem = activeIdx !== null ? items[activeIdx] : null;
  const currentImage = currentItem?.image ?? items[0].image;
  const currentAlt = currentItem?.imageAlt ?? items[0].imageAlt;
  const currentCode = currentItem?.code ?? "00";
  const currentVideo = currentItem?.video;

  return (
    <>
      {/* Desktop */}
      <section
        className="hidden md:flex relative overflow-hidden"
        style={{ marginTop: "var(--nav-h, 80px)", height: "calc(100vh - var(--nav-h, 80px))" }}
        aria-label={`${config.atlasLabel} explorer`}
      >
        <div className="pointer-events-none absolute inset-0 bg-grid-fine grid-fade opacity-30" aria-hidden />

        <IndexPanel
          items={items}
          activeIdx={activeIdx}
          onSelect={handleSelect}
          atlasLabel={config.atlasLabel}
        />
        <CenterPanel items={items} activeIdx={activeIdx} config={config} />
        <ImagePanel image={currentImage} alt={currentAlt} code={currentCode} video={currentVideo} />
      </section>

      {/* Mobile */}
      <section className="relative bg-background" style={{ paddingTop: "var(--nav-h, 80px)" }} aria-label={`${config.atlasLabel} explorer`}>
        <MobileFlatAtlas items={items} config={config} externalIdx={activeIdx} />
      </section>
    </>
  );
}
