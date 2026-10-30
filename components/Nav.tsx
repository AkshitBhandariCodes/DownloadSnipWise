"use client";

import { useEffect, useRef, useState } from "react";
import { List, X, DownloadSimple } from "@phosphor-icons/react";
import { PaperclipIcon } from "mochi-icons/PaperclipIcon";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { installCopyListener, useCaptured } from "@/lib/clipStore";
import { scrollToTarget } from "./motion/SmoothScroll";
import { Logo, type TapeColor } from "./ui";
import { ThemeToggle } from "./ThemeToggle";

const links: { href: string; label: string; tape: TapeColor }[] = [
  { href: "#use-cases", label: "Use cases", tape: "lime" },
  { href: "#features", label: "Features", tape: "lilac" },
  { href: "#compare", label: "Compare", tape: "sky" },
  { href: "#privacy", label: "Privacy", tape: "pink" },
  { href: "#faq", label: "FAQ", tape: "butter" },
];
const tapeBg: Record<TapeColor, string> = {
  coral: "bg-coral",
  lime: "bg-lime",
  lilac: "bg-lilac",
  sky: "bg-sky",
  butter: "bg-butter",
  pink: "bg-pink",
  mint: "bg-mint",
};

/**
 * Floating sticker nav with a tape-measure progress ruler on top. Links get a
 * strip of washi tape on hover and while their section is on screen. The
 * paperclip counter shows how many things the visitor has copied on the page.
 */
export function Nav() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const captured = useCaptured();
  const count = captured.length;
  const counter = useRef<HTMLButtonElement>(null);

  useEffect(installCopyListener, []);

  useGSAP(
    () => {
      // Ruler marker follows page progress.
      gsap.to("[data-ruler-fill]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
      // Bar tightens once the page moves.
      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => root.current?.toggleAttribute("data-scrolled", self.isActive),
      });
      links.forEach(({ href }) => {
        const el = document.querySelector(href);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          // Measure after the pinned sections below have added their scroll distance.
          refreshPriority: -1,
          onToggle: (self) => self.isActive && setActive(href),
          onLeaveBack: () => href === links[0].href && setActive(null),
        });
      });
      // Entrance: drops in after the hero headline starts.
      gsap.from("[data-nav-bar]", { y: -90, rotate: -2, duration: 1, ease: "back.out(1.6)", delay: 0.15 });
    },
    { scope: root },
  );

  // Counter hops whenever something new is captured.
  useEffect(() => {
    if (!count || !counter.current) return;
    gsap.fromTo(counter.current, { y: -6, rotate: -8 }, { y: 0, rotate: 0, duration: 0.6, ease: "elastic.out(1.2, 0.4)" });
  }, [count]);

  const go = (href: string) => {
    setOpen(false);
    scrollToTarget(href);
  };

  return (
    <header ref={root} className="group/nav fixed inset-x-0 top-0 z-50">
      {/* Tape-measure ruler: ticks every 8px, a longer tick every 40px. */}
      <div aria-hidden className="relative h-3 border-b-2 border-ink bg-butter">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 8px), repeating-linear-gradient(90deg, var(--ink) 0 2px, transparent 2px 40px)",
            backgroundSize: "auto 4px, auto 7px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "0 0, 0 0",
          }}
        />
        <div data-ruler-fill className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-coral/80" />
      </div>

      <nav
        data-nav-bar
        aria-label="Main"
        className="sticker mx-auto mt-3 flex h-[62px] w-[calc(100%-24px)] max-w-[1120px] items-center justify-between gap-3 !rounded-[18px] pl-3 pr-2.5 transition-[height,margin] duration-300 group-data-[scrolled]/nav:mt-2 group-data-[scrolled]/nav:h-[56px]"
      >
        <a href="#top" onClick={(e) => (e.preventDefault(), go("#top"))} aria-label="SnipWise home" className="relative">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const on = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => (e.preventDefault(), go(l.href))}
                  className="group/link relative block px-3.5 py-2 text-[14.5px] font-semibold text-ink"
                  aria-current={on ? "true" : undefined}
                >
                  <span
                    aria-hidden
                    className={`tape absolute inset-x-1 inset-y-1.5 !p-0 ${tapeBg[l.tape]} origin-left transition-transform duration-300 ease-[cubic-bezier(.3,1.4,.5,1)] ${
                      on ? "scale-x-100 -rotate-2" : "scale-x-0 group-hover/link:scale-x-100 group-hover/link:-rotate-2"
                    }`}
                  />
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={counter}
            type="button"
            onClick={() => go("#dock")}
            title="Things you copied on this page"
            className="hidden h-10 items-center gap-1.5 rounded-[12px] border-2 border-ink bg-paper pl-1.5 pr-3 text-[13px] font-bold sm:inline-flex"
          >
            <PaperclipIcon size={24} aria-hidden />
            <span className="tabular-nums">{count}</span>
            <span className="font-semibold text-ink-2">{count === 1 ? "clip" : "clips"}</span>
          </button>
          <a href="/download" aria-label="Download SnipWise" className="btn btn-primary btn-sm !h-10 max-sm:!w-10 max-sm:!px-0">
            <DownloadSimple size={16} weight="bold" />
            <span className="hidden sm:inline">Download</span>
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-[12px] border-2 border-ink bg-paper lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>

        {/* Where the pal hangs at the top of the page. */}
        <span
          data-pal-dock="nav"
          data-pal-fixed
          data-pose="hang"
          data-mood="wave"
          data-say="hi! copy something|psst: select text, Ctrl+C|I live on your taskbar"
          className="pointer-events-none absolute -bottom-0.5 left-[38%] h-0 w-0 lg:left-[67%]"
        />
      </nav>

      {open && (
        <div className="sticker mx-auto mt-2 w-[calc(100%-24px)] max-w-[1120px] p-3 lg:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => (e.preventDefault(), go(l.href))}
                  className="flex items-center justify-between rounded-[12px] px-3 py-3 text-[17px] font-semibold"
                >
                  {l.label}
                  <span className={`tape ${tapeBg[l.tape]} !py-1 text-[10px]`}>go</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
