"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let lenis: Lenis | null = null;
/** The page's Lenis instance, or null when smooth scroll is off (reduced motion). */
export const getLenis = () => lenis;

/** Scroll to an element or y position, through Lenis when it is running. */
export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : -96, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target });
  else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = prefersReducedMotion();

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, anchors: { offset: -96 } });
      if (process.env.NODE_ENV !== "production") Object.assign(window, { lenis });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Fonts and images change heights after the first layout.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("load", refresh);
        lenis?.destroy();
        lenis = null;
      };
    }
  }, []);

  return <>{children}</>;
}
