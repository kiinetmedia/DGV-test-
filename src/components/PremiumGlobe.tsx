/**
 * PremiumGlobe — SSR-safe wrapper.
 * Lazy-loads the client-only canvas component after mount.
 */
import { Suspense, lazy, useState, useEffect } from "react";

const GlobeCanvas = lazy(() => import("@/components/PremiumGlobeCanvas"));

function GlobeFallback() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
      <div
        className="absolute inset-[8%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 38% 36%, #231a0e 0%, #0d0b07 60%)",
          boxShadow: "0 0 80px 24px oklch(0.45 0.08 55 / 0.10)",
        }}
      />
    </div>
  );
}

export function PremiumGlobe() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
      {mounted ? (
        <Suspense fallback={<GlobeFallback />}>
          <GlobeCanvas />
        </Suspense>
      ) : (
        <GlobeFallback />
      )}
    </div>
  );
}
