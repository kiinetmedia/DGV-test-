import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

const WA_TEXT = encodeURIComponent(
  "Hello, I'd like to enquire about DGV Company's print and packaging solutions. Please get in touch at your earliest convenience."
);
const WA_URL = `https://wa.me/919820791155?text=${WA_TEXT}`;
const TEL_URL = `tel:+919820791155`;

const EASE = [0.16, 1, 0.3, 1] as const;

const FG = "oklch(0.22 0.018 60)";   // --foreground (near-black)
const BG = "oklch(0.965 0.012 80)";  // --background (sandy beige)

/* ── Reusable circular button with sonar-ring haptic on hover ──────────── */
function CtaBtn({
  href,
  target,
  rel,
  label,
  delay,
  children,
}: {
  href: string;
  target?: string;
  rel?: string;
  label: string;
  delay: number;
  children: ReactNode;
}) {
  const [ringKey, setRingKey] = useState(0);

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      aria-label={label}
      onHoverStart={() => setRingKey((n) => n + 1)}
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: EASE }}
      whileHover={{
        scale: 1.13,
        y: -3,
        transition: { type: "spring", stiffness: 380, damping: 13 },
      }}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center justify-center rounded-full shadow-[0_4px_20px_oklch(0.22_0.018_60/0.22)]"
      style={{ width: 50, height: 50, background: FG }}
    >
      {/* Sonar ring — re-keyed on each hover to replay the animation */}
      <AnimatePresence>
        {ringKey > 0 && (
          <motion.span
            key={ringKey}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.1, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1.5px solid ${FG}`,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {children}
    </motion.a>
  );
}

/* ── Main export ────────────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-center gap-3">

      <CtaBtn href={WA_URL} target="_blank" rel="noopener noreferrer" label="Chat on WhatsApp" delay={1.0}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={BG} aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </CtaBtn>

      <CtaBtn href={TEL_URL} label="Call DGV Company" delay={1.15}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
        </svg>
      </CtaBtn>

    </div>
  );
}
