"use client";

import { useEffect, useRef, useState } from "react";
import { WindowsLogo, ArrowDown, HandPointing } from "@phosphor-icons/react";
import { gsap, SplitText, Draggable, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { copyText, type ClipKind } from "@/lib/clipStore";
import { palSay } from "@/lib/palBus";
import { scrollToTarget } from "./motion/SmoothScroll";
import { downloadUrl } from "@/content/site";
import { Container, KindTag, Tape } from "./ui";
import { HeroDock } from "./HeroDock";

// The rotating word in the headline doubles as a list of what people re-copy all day.
const words: { text: string; bg: string }[] = [
  { text: "prompt", bg: "bg-lilac" },
  { text: "hex code", bg: "bg-pink" },
  { text: "snippet", bg: "bg-lime" },
  { text: "address", bg: "bg-sky" },
  { text: "reply", bg: "bg-butter" },
  { text: "link", bg: "bg-mint" },
];

// Clips floating around the headline. Drag them, or click to really copy one.
const floaters: { kind: ClipKind; label: string; text: string; pos: string; depth: number; tilt: number }[] = [
  { kind: "color", label: "Brand coral", text: "#FF5A36", pos: "left-0 top-[52px]", depth: 0.6, tilt: -8 },
  { kind: "code", label: "Deploy", text: "docker compose up -d", pos: "right-0 top-[10px]", depth: 1, tilt: 6 },
  { kind: "text", label: "Prompt", text: "Explain this like I'm new to the codebase.", pos: "left-[1%] top-[372px]", depth: 1.2, tilt: 5 },
  { kind: "link", label: "Booking", text: "cal.com/you/20min", pos: "right-[1%] top-[400px]", depth: 0.8, tilt: -5 },
];

function RotatingWord() {
  const [i, setI] = useState(0);
  const box = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const measure = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => {
      const next = (i + 1) % words.length;
      const tl = gsap.timeline();
      tl.to(inner.current, { yPercent: -110, rotateX: 60, opacity: 0, duration: 0.28, ease: "power2.in" })
        .add(() => {
          if (measure.current) measure.current.textContent = words[next].text;
          const w = measure.current?.offsetWidth ?? 0;
          setI(next);
          gsap.to(box.current, { width: w, duration: 0.45, ease: "back.out(1.6)" });
        })
        .fromTo(
          inner.current,
          { yPercent: 110, rotateX: -60, opacity: 0 },
          { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" },
          "+=0.02",
        );
    }, 2300);
    return () => clearInterval(id);
  }, [i]);

  return (
    <span className="relative inline-block align-baseline [perspective:600px]">
      {/* Invisible copy used to measure the next word's width. */}
      <span ref={measure} aria-hidden className="invisible absolute whitespace-nowrap px-[0.18em]">
        {words[0].text}
      </span>
      <span
        ref={box}
        data-hero-word
        className={`relative inline-flex -rotate-2 justify-center overflow-hidden whitespace-nowrap rounded-[0.18em] border-[3px] border-ink px-[0.18em] pb-[0.06em] align-baseline shadow-[4px_4px_0_var(--ink)] transition-colors duration-300 ${words[i].bg}`}
      >
        <span ref={inner} className="inline-block">
          {words[i].text}
        </span>
      </span>
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (reduce) return;
      const split = SplitText.create("[data-hero-line]", { type: "words,chars", mask: "words" });
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-hero-tape]", { scale: 0, rotate: -30, duration: 0.7, ease: "back.out(2.5)" }, 0.1)
        .from(split.chars, { yPercent: 115, rotate: 8, duration: 0.9, stagger: 0.018 }, 0.2)
        .from("[data-hero-word]", { scale: 2.4, rotate: -24, opacity: 0, duration: 0.8, ease: "back.out(1.8)" }, 0.75)
        .from("[data-hero-fade]", { y: 26, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.9)
        // fromTo, not from: Draggable can leave a half-set transform behind on remount.
        .fromTo(
          "[data-floater]",
          { scale: 0, rotate: () => gsap.utils.random(-40, 40), opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.55)", stagger: 0.09 },
          1.05,
        );

      // Floaters drift with the mouse at different depths and can be dragged around.
      const floaters = gsap.utils.toArray<HTMLElement>("[data-floater]");
      const movers = floaters.map((f) => ({
        x: gsap.quickTo(f.firstElementChild, "x", { duration: 0.9, ease: "power3" }),
        y: gsap.quickTo(f.firstElementChild, "y", { duration: 0.9, ease: "power3" }),
        depth: Number(f.dataset.depth || 1),
      }));
      const onMove = (e: PointerEvent) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(cx * 40 * m.depth);
          m.y(cy * 30 * m.depth);
        });
      };
      window.addEventListener("pointermove", onMove);
      Draggable.create(floaters, {
        bounds: root.current,
        zIndexBoost: true,
        onPress() {
          gsap.to(this.target, { scale: 1.08, rotate: 0, duration: 0.2 });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        },
        onDragEnd() {
          palSay("wheee", "excited");
        },
        onClick() {
          const t = this.target as HTMLElement;
          copyText(t.dataset.text || "");
          gsap.fromTo(t, { rotate: -6 }, { rotate: 0, duration: 0.6, ease: "elastic.out(1.2, 0.4)" });
        },
      });

      // The headline block drifts up and fades a little as the dock rises over it.
      gsap.to("[data-hero-copy]", {
        yPercent: -18,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: true },
      });

      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative pt-[200px] md:pt-[170px]">
      <Container className="relative">
        {/* Floating clips (desktop). */}
        <div aria-hidden={false} className="pointer-events-none absolute inset-0 hidden lg:block">
          {floaters.map((f) => (
            <div
              key={f.label}
              data-floater
              data-depth={f.depth}
              data-text={f.text}
              className={`pointer-events-auto absolute ${f.pos} z-10 w-[188px] cursor-grab touch-none active:cursor-grabbing`}
              style={{ rotate: `${f.tilt}deg` }}
              title="Drag me, or click to copy"
            >
              <div className="group sticker relative p-3">
                <span className={`tape absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 !p-0 ${f.tilt > 0 ? "bg-lilac" : "bg-butter"}`} />
                <div className="flex items-center justify-between">
                  <KindTag kind={f.kind} />
                  <span className="text-[11px] font-semibold text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">
                    click to copy
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold">{f.label}</p>
                <p className="mt-0.5 flex items-center gap-2 truncate font-mono text-[12px] text-ink-2">
                  {f.kind === "color" && <span className="h-3.5 w-3.5 shrink-0 rounded-[4px] border-2 border-ink" style={{ background: f.text }} />}
                  {f.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div data-hero-copy className="relative mx-auto flex max-w-[980px] flex-col items-center text-center">
          <div data-hero-tape>
            <Tape color="lime" tilt={-3}>
              New: SnipWise beta for Windows
            </Tape>
          </div>
          <h1 className="display mt-7 text-[46px] sm:text-[64px] md:text-[80px] lg:text-[90px]">
            <span data-hero-line className="block">
              Never copy the
            </span>
            <span className="block">
              <span data-hero-line className="mr-[0.22em] inline-block">same</span>
              <RotatingWord />
              <span data-hero-line className="ml-[0.22em] inline-block">twice.</span>
            </span>
          </h1>
          <p data-hero-fade className="mt-7 max-w-[56ch] text-pretty text-[18px] leading-relaxed text-ink-2 md:text-[20px]">
            SnipWise remembers everything you copy on Windows. Name it, search it, convert it, and paste it back with one
            shortcut.
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary !h-[54px] !px-6 !text-[16px]"
            >
              <WindowsLogo size={19} weight="fill" />
              Download for Windows
            </a>
            <button type="button" onClick={() => scrollToTarget("#dock")} className="btn btn-paper !h-[54px] !px-6 !text-[16px]">
              Try it right here
              <ArrowDown size={17} weight="bold" />
            </button>
          </div>
          <p data-hero-fade className="mt-5 flex items-center gap-2 text-[13.5px] font-medium text-ink-3">
            <HandPointing size={16} weight="duotone" className="hidden lg:block" />
            <span className="hidden lg:inline">Drag the clips around, or click one to copy it.</span>
            <span className="lg:hidden">Free while in beta. Windows 10 and 11.</span>
          </p>
        </div>
      </Container>

      <HeroDock />
    </section>
  );
}
