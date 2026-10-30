"use client";

// One place to register GSAP plugins so every component gets the same instance.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, useGSAP);
  // Dev only: lets the browser console drive animations by hand.
  if (process.env.NODE_ENV !== "production") Object.assign(window, { gsap, ScrollTrigger });
}

export { gsap, ScrollTrigger, SplitText, Draggable, useGSAP };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
