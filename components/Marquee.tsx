"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const words = ["copy once", "search it", "convert it", ";shortcuts", "drag it out", "works offline", "skips passwords", "snip pal", "Ctrl+Shift+V"];

/** Two tilted tape strips that run in opposite directions and lean with scroll speed. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const skew = gsap.quickTo("[data-strip]", "skewX", { duration: 0.5, ease: "power3" });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => skew(gsap.utils.clamp(-10, 10, self.getVelocity() / -260)),
      });
    },
    { scope: root },
  );

  const row = (dir: "l" | "r", bg: string, rot: string) => (
    <div data-strip className={`border-y-2 border-ink ${bg} py-3`} style={{ rotate: rot }}>
      <div className="flex w-max" style={{ animation: `marquee 38s linear infinite ${dir === "r" ? "reverse" : ""}` }}>
        {[0, 1].map((k) => (
          <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center">
            {words.map((w) => (
              <span key={w} className="flex items-center gap-6 px-6 font-display text-[26px] font-[760] tracking-[-0.03em] md:text-[34px]">
                {w}
                <span className="h-3 w-3 rotate-45 rounded-[2px] border-2 border-ink bg-coral" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={root} className="relative overflow-hidden py-10">
      {row("l", "bg-butter", "-2deg")}
      <div className="-mt-3">{row("r", "bg-lilac", "1.5deg")}</div>
    </div>
  );
}
