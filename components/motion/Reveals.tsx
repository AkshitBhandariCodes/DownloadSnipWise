"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type Variant = "up" | "window" | "pop" | "left" | "right" | "stagger";

// Starting states for elements marked data-reveal="<variant>".
const from: Record<Exclude<Variant, "stagger">, gsap.TweenVars> = {
  up: { y: 48, autoAlpha: 0 },
  window: { y: 140, rotateX: 24, scale: 0.9, autoAlpha: 0, transformPerspective: 1400, transformOrigin: "50% 100%" },
  pop: { scale: 0.4, rotate: () => gsap.utils.random(-14, 14), autoAlpha: 0 },
  left: { x: -90, rotate: -5, autoAlpha: 0 },
  right: { x: 90, rotate: 5, autoAlpha: 0 },
};

const ease: Record<Exclude<Variant, "stagger">, string> = {
  up: "power3.out",
  window: "expo.out",
  pop: "back.out(2.2)",
  left: "power3.out",
  right: "power3.out",
};

/**
 * Scroll reveals for every element marked data-reveal. Rendered at the end of
 * the page so it runs after the page content has hydrated.
 */
export function Reveals() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const variant = (el.dataset.reveal || "up") as Variant;
        const delay = Number(el.dataset.revealDelay || 0);
        const trigger = { trigger: el, start: "top 88%", once: true };
        if (variant === "stagger") {
          gsap.set(el, { autoAlpha: 1 });
          gsap.from(el.children, { y: 36, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, delay, scrollTrigger: trigger });
          return;
        }
        gsap.fromTo(el, from[variant], {
          x: 0,
          y: 0,
          rotate: 0,
          rotateX: 0,
          scale: 1,
          autoAlpha: 1,
          duration: variant === "window" ? 1.3 : 0.9,
          ease: ease[variant],
          delay,
          scrollTrigger: trigger,
        });
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);
  return null;
}
