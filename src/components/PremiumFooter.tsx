import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { useMailtoHref, useContactEmail } from "@/lib/contact";

const LUXE = [0.16, 1, 0.3, 1] as const;

/* ─── Color tokens (dark footer) ──────────────────────────────────────────── */
const ESPRESSO  = "oklch(0.13 0.018 55)";
const IVORY     = "oklch(0.965 0.012 80)";
const IVORY_DIM = "oklch(0.965 0.012 80 / 0.48)";
const DIVIDER   = "oklch(0.965 0.012 80 / 0.1)";
const GOLD      = "oklch(0.72 0.11 75)";

/* ─── Navigation data ─────────────────────────────────────────────────────── */
const NAV = [
  {
    title: "Company",
    links: [
      { label: "About",        href: "/#about" },
      { label: "Industries",   href: "/#capabilities" },
      { label: "Case Studies", href: "/#case-studies" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Rigid Boxes",          href: "/products#rigid-boxes" },
      { label: "Paper Bags",          href: "/products#paper-bags" },
      { label: "Commercial Printing", href: "/products#commercial-printing" },
      { label: "Barcode Labels",      href: "/products#barcode-labels" },
      { label: "Calendars & Diaries", href: "/products#calendars-diaries" },
      { label: "Marketing & Branding",href: "/products#marketing-branding" },
      { label: "Corrugated Boxes",    href: "/products#corrugated-boxes" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Offset Printing",       href: "/solutions#offset-printing" },
      { label: "Web Offset Printing",  href: "/solutions#web-offset-printing" },
      { label: "Screen Printing",      href: "/solutions#screen-printing" },
      { label: "Flexographic Printing",href: "/solutions#flexographic-printing" },
      { label: "Digital Printing",     href: "/solutions#digital-printing" },
      { label: "Conversion",           href: "/solutions#conversion" },
      { label: "Fabrication",          href: "/solutions#fabrication" },
      { label: "Binding",              href: "/solutions#binding" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Catalogue",  href: "/products" },
      { label: "FAQs",       href: "/#faq" },
      { label: "Clientele", href: "/affiliations" },
      { label: "Contact",    href: "/#contact" },
      { label: "Get Quote",  href: "mailto:abhinav@dgvcompany.com,dgvcompany1@gmail.com" },
    ],
  },
];

const TAPE = "PACKAGING  ·  PRINT  ·  LABELS  ·  DGV COMPANY  ·  SINCE 2006  ·  CORRUGATED  ·  RIGID BOXES  ·  MUMBAI, INDIA  ·  ";

/* ─── Micro-helpers ───────────────────────────────────────────────────────── */

function FooterLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);
  const isExternal = href.startsWith("mailto:");
  const mailtoHref = useMailtoHref();

  return (
    <a
      href={isExternal ? mailtoHref : href}
      {...(isExternal ? {} : {})}
      className="group relative flex items-center py-[10px] text-[12px] leading-none tracking-wide"
      style={{ color: hov ? IVORY : IVORY_DIM }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <motion.span
        className="absolute bottom-0 left-0 h-px"
        style={{ background: GOLD }}
        animate={{ width: hov ? "100%" : "0%" }}
        transition={{ duration: 0.36, ease: LUXE }}
      />
      {label}
    </a>
  );
}

function FooterColumn({
  title,
  links,
  delay,
}: {
  title: string;
  links: { label: string; href: string }[];
  delay: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, ease: LUXE, delay }}
      className="border-b lg:border-b-0"
      style={{ borderColor: DIVIDER }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 lg:pointer-events-none lg:cursor-default lg:py-0 lg:mb-4"
      >
        <span
          className="text-[10px] uppercase tracking-[0.28em] font-medium"
          style={{ color: GOLD }}
        >
          {title}
        </span>
        <motion.svg
          className="lg:hidden shrink-0"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.36, ease: LUXE }}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3.5L5 6.5L8 3.5" />
        </motion.svg>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-[400ms] ease-out lg:!grid-rows-[1fr]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col pb-4 lg:pb-0">
            {links.map((l) => (
              <FooterLink key={l.label} label={l.label} href={l.href} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Looping tape strip ─────────────────────────────────────────────────── */

function TapeStrip() {
  const doubled = TAPE + TAPE;
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: IVORY,
        borderTop: `1px solid ${DIVIDER}`,
        height: 36,
      }}
      aria-hidden
    >
      <motion.div
        className="absolute top-0 left-0 flex items-center h-full whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity, repeatType: "loop" }}
        style={{ color: ESPRESSO }}
      >
        <span className="text-[10px] uppercase tracking-[0.32em] font-medium select-none">
          {doubled}
        </span>
        <span className="text-[10px] uppercase tracking-[0.32em] font-medium select-none">
          {doubled}
        </span>
      </motion.div>
    </div>
  );
}

/* ─── Scroll progress bar ────────────────────────────────────────────────── */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 h-[2px] origin-left pointer-events-none"
      style={{ scaleX, background: GOLD }}
    />
  );
}

/* ─── Back to top ─────────────────────────────────────────────────────────── */

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.85 }}
          transition={{ duration: 0.4, ease: LUXE }}
          onClick={scrollTop}
          aria-label="Back to top"
          className="fixed bottom-24 right-5 z-40 flex items-center justify-center rounded-full border transition-colors duration-300 before:absolute before:-inset-1 before:content-['']"
          style={{
            width: 40,
            height: 40,
            background: ESPRESSO,
            borderColor: "oklch(0.965 0.012 80 / 0.25)",
            color: IVORY,
          }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.93 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 12 L7 2 M2 7 L7 2 L12 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ─── Social icons ────────────────────────────────────────────────────────── */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="relative flex items-center justify-center rounded-full border transition-colors duration-300 before:absolute before:-inset-1.5 before:content-['']"
      style={{
        width: 36,
        height: 36,
        borderColor: hov ? IVORY : "oklch(0.965 0.012 80 / 0.25)",
        color: hov ? IVORY : IVORY_DIM,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.93 }}
    >
      {children}
    </motion.a>
  );
}

/* ─── Packaging microcopy watermarks ──────────────────────────────────────── */

function Watermarks() {
  const marks = [
    { text: "HANDLE WITH CARE", top: "10%",  right: "4%",  rotate: -90, opacity: 0.04 },
    { text: "THIS SIDE UP ↑",   top: "38%",  left: "2%",   rotate: -90, opacity: 0.04 },
    { text: "PREMIUM PRINT",    bottom: "28%", right: "3%", rotate: 0,   opacity: 0.04 },
    { text: "SINCE 2006",       top: "15%",  left: "50%",  rotate: 0,   opacity: 0.035 },
    { text: "CUSTOM PACKAGING", bottom: "14%", left: "4%", rotate: 0,   opacity: 0.035 },
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden>
      {marks.map((m) => (
        <span
          key={m.text}
          className="absolute text-[9px] uppercase tracking-[0.32em] font-mono whitespace-nowrap"
          style={{
            color: IVORY,
            opacity: m.opacity,
            transform: `rotate(${m.rotate}deg)`,
            ...("top" in m ? { top: m.top } : {}),
            ...("bottom" in m ? { bottom: m.bottom } : {}),
            ...("left" in m ? { left: m.left } : {}),
            ...("right" in m ? { right: m.right } : {}),
          }}
        >
          {m.text}
        </span>
      ))}

      {/* Dieline fragment top-right */}
      <svg
        className="absolute"
        style={{ top: "5%", right: "5%", opacity: 0.04, width: 120 }}
        viewBox="0 0 120 150"
        fill="none"
        stroke={IVORY}
        strokeWidth="0.6"
        strokeDasharray="4 3"
      >
        <path d="M30 5 L90 5 L90 35 L112 35 L112 115 L90 115 L90 145 L30 145 L30 115 L8 115 L8 35 L30 35 Z" />
        <line x1="30" y1="35" x2="90" y2="35" />
        <line x1="30" y1="115" x2="90" y2="115" />
      </svg>

      {/* Registration mark */}
      <svg
        className="absolute"
        style={{ bottom: "20%", left: "5%", opacity: 0.04, width: 40 }}
        viewBox="0 0 40 40"
        fill="none"
        stroke={IVORY}
        strokeWidth="0.6"
      >
        <circle cx="20" cy="20" r="10" />
        <line x1="0" y1="20" x2="40" y2="20" />
        <line x1="20" y1="0" x2="20" y2="40" />
      </svg>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────────────── */

export function PremiumFooter() {
  const mailtoHref = useMailtoHref();
  const contactEmail = useContactEmail();

  return (
    <>
      <BackToTop />

      <footer
        className="relative overflow-hidden"
        style={{ background: ESPRESSO }}
        aria-label="DGV Company footer"
      >
        {/* Scroll progress indicator */}
        <ScrollProgress />

        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.85  0 0 0 0 0.75  0 0 0 0 0.6  0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            opacity: 0.6,
            mixBlendMode: "screen",
          }}
          aria-hidden
        />

        {/* Packaging watermarks */}
        <Watermarks />

        {/* Content */}
        <div className="relative z-10">

          {/* ── Top statement band ────────────────────────────────────── */}
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 pt-16 md:pt-24 pb-12 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 1, ease: LUXE }}
            >
              <div
                className="flex items-center gap-3 mb-8 text-[10px] uppercase tracking-[0.32em]"
                style={{ color: GOLD }}
              >
                <span className="h-px w-8" style={{ background: GOLD }} />
                DGV Company — Est. 2006
              </div>

              <h2
                className="font-display text-[clamp(2.4rem,6.5vw,7rem)] leading-[0.92] tracking-tighter text-balance"
                style={{ color: IVORY }}
              >
                Packaging built to{" "}
                <em className="italic font-light">leave an impression.</em>
              </h2>

              <p
                className="mt-6 max-w-lg text-sm md:text-base leading-relaxed"
                style={{ color: IVORY_DIM }}
              >
                Trusted by 100+ reputed brands across 10+ countries — delivering
                print, packaging and labels with consistent quality and
                reliable timelines.
              </p>
            </motion.div>
          </div>

          {/* Thin divider */}
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="h-px" style={{ background: DIVIDER }} />
          </div>

          {/* ── 5-column nav grid ─────────────────────────────────────── */}
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-4 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-0 lg:gap-y-10">
              {NAV.map((col, i) => (
                <FooterColumn
                  key={col.title}
                  title={col.title}
                  links={col.links}
                  delay={i * 0.06}
                />
              ))}
            </div>
          </div>

          {/* Thin divider */}
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="h-px" style={{ background: DIVIDER }} />
          </div>

          {/* ── Bottom band ───────────────────────────────────────────── */}
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-8 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-0 md:justify-between">

              {/* Left: copyright + tagline + ISO */}
              <div className="flex flex-col gap-2">
                <span
                  className="text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: IVORY_DIM }}
                >
                  © 2026 · DGV Company
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: "oklch(0.965 0.012 80 / 0.28)" }}
                >
                  Made with precision in India 🇮🇳
                </span>
                <span
                  className="mt-1 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] border px-2.5 py-1 w-fit"
                  style={{
                    color: GOLD,
                    borderColor: `${GOLD}55`,
                  }}
                >
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 shrink-0">
                    <path d="M7 1L2 3.5v4C2 10.3 4.2 12.7 7 13.5c2.8-.8 5-3.2 5-6V3.5L7 1z"/>
                  </svg>
                  ISO 9001:2015 Certified
                </span>
              </div>

              {/* Center: contact info */}
              <div
                className="flex flex-wrap gap-x-6 gap-y-1.5 text-[11px] tracking-wide"
                style={{ color: IVORY_DIM }}
              >
                <a
                  href="tel:+919820791155"
                  className="hover:opacity-100 transition-opacity duration-200"
                  style={{ opacity: 0.7 }}
                >
                  +91 98207 91155
                </a>
                <span style={{ opacity: 0.3 }}>·</span>
                <a
                  href={mailtoHref}
                  className="hover:opacity-100 transition-opacity duration-200"
                  style={{ opacity: 0.7 }}
                >
                  {contactEmail || "Email us"}
                </a>
                <span style={{ opacity: 0.3 }}>·</span>
                <span style={{ opacity: 0.7 }}>Mumbai, India</span>
              </div>

              {/* Right: social links */}
              <div className="flex items-center gap-2.5">
                <SocialLink href="https://www.linkedin.com/company/dgv-company/" label="LinkedIn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </SocialLink>

                <SocialLink href="https://www.instagram.com/dgvcompany/" label="Instagram">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </SocialLink>

                <SocialLink href={mailtoHref} label="Email DGV Company">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </SocialLink>
              </div>
            </div>
          </div>
        </div>

        {/* ── Looping tape strip ─────────────────────────────────────── */}
        <TapeStrip />
      </footer>
    </>
  );
}
