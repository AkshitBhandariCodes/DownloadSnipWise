"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HeartPixelIcon } from "mochi-icons/pixels/HeartPixelIcon";
import { RocketPixelIcon } from "mochi-icons/pixels/RocketPixelIcon";
import { FirePixelIcon } from "mochi-icons/pixels/FirePixelIcon";
import { MagnifyingGlassPixelIcon } from "mochi-icons/pixels/MagnifyingGlassPixelIcon";
import { LockPixelIcon } from "mochi-icons/pixels/LockPixelIcon";
import { FlowerPixelIcon } from "mochi-icons/pixels/FlowerPixelIcon";
import { DiamondPixelIcon } from "mochi-icons/pixels/DiamondPixelIcon";
import { CursorPixelIcon } from "mochi-icons/pixels/CursorPixelIcon";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import type { Mood, PalEvent } from "@/lib/palBus";

/*
  The pal travels down the page with the visitor.

  Sections place invisible <PalDock> markers. While a dock is on screen the pal
  sits on it (or hangs from it). When its window scrolls away, the pal hops off
  and walks alongside the visitor, zigzagging across the screen, until the next
  dock comes up, then lands on it. It never leaves the viewport.
*/

type Pose = "hang" | "sit" | "sleep";
type Dock = {
  el: HTMLElement;
  mood: Mood;
  lines: string[];
  pose: Pose;
  fixed: boolean;
  sticky: boolean;
  docY: number;
};

const STRING = 40;
const TRAVEL_LINES = ["wheee", "this way!", "follow me", "hop hop", "wait up!"];

const emotes: Partial<Record<Mood, React.ReactNode>> = {
  love: <HeartPixelIcon size={22} />,
  excited: <RocketPixelIcon size={22} />,
  wow: <FirePixelIcon size={22} />,
  think: <MagnifyingGlassPixelIcon size={22} />,
  shy: <LockPixelIcon size={22} />,
  happy: <FlowerPixelIcon size={22} />,
  smug: <DiamondPixelIcon size={22} />,
  focus: <CursorPixelIcon size={22} />,
  wave: (
    <span className="font-pixel text-[20px] font-bold text-coral-ink">!</span>
  ),
  dizzy: <span className="font-pixel text-[20px] font-bold text-ink">@</span>,
  sleep: <span className="font-pixel text-[18px] font-bold text-ink">z z</span>,
};

/** Body language for each mood, played on the inner sprite. */
function act(el: HTMLElement, mood: Mood) {
  gsap.killTweensOf(el);
  gsap.set(el, { y: 0, rotate: 0, scaleX: 1, scaleY: 1 });
  const tl = gsap.timeline({ defaults: { transformOrigin: "50% 100%" } });
  switch (mood) {
    case "happy":
      tl.to(el, { y: -16, duration: 0.18, ease: "power2.out" }).to(el, {
        y: 0,
        duration: 0.5,
        ease: "bounce.out",
      });
      break;
    case "excited":
      tl.to(el, {
        y: -14,
        duration: 0.14,
        yoyo: true,
        repeat: 5,
        ease: "power1.out",
      });
      break;
    case "wow":
      tl.to(el, { scaleY: 0.8, scaleX: 1.15, duration: 0.12 })
        .to(el, {
          y: -26,
          scaleY: 1.15,
          scaleX: 0.92,
          duration: 0.2,
          ease: "power2.out",
        })
        .to(el, {
          y: 0,
          scaleY: 1,
          scaleX: 1,
          duration: 0.5,
          ease: "bounce.out",
        });
      break;
    case "love":
      tl.to(el, {
        scale: 1.12,
        duration: 0.18,
        yoyo: true,
        repeat: 3,
        ease: "sine.inOut",
      });
      break;
    case "think":
      tl.to(el, { rotate: 9, duration: 0.5, ease: "back.out(2)" });
      break;
    case "smug":
      tl.to(el, { rotate: -8, duration: 0.4, ease: "back.out(2)" });
      break;
    case "shy":
      tl.to(el, { scaleY: 0.88, y: 4, duration: 0.3, ease: "power2.out" });
      break;
    case "wave":
      tl.to(el, {
        rotate: 10,
        duration: 0.12,
        yoyo: true,
        repeat: 5,
        ease: "sine.inOut",
        transformOrigin: "50% 0%",
      });
      break;
    case "dizzy":
      tl.to(el, {
        rotate: 360,
        duration: 0.8,
        ease: "power2.inOut",
        transformOrigin: "50% 50%",
      });
      break;
    case "sleep":
      tl.to(el, { rotate: -14, duration: 0.6, ease: "power2.out" }).to(el, {
        scaleY: 0.95,
        duration: 1.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      break;
    case "focus":
      tl.to(el, { rotate: 4, y: -2, duration: 0.3 });
      break;
  }
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function PalGuide() {
  const pal = useRef<HTMLButtonElement>(null);
  const sprite = useRef<HTMLDivElement>(null);
  const string = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const docks = useRef<Dock[]>([]);
  const nearest = useRef(-1);
  const travelling = useRef(false);
  const [bubble, setBubble] = useState<{ text: string; key: number } | null>(
    null,
  );
  const [mood, setMood] = useState<Mood>("wave");
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCount = useRef(0);
  const size = useRef({ w: 88, h: 105 });

  const say = useCallback((text: string, m?: Mood, ms = 2600) => {
    setBubble({ text, key: Date.now() });
    if (m) {
      setMood(m);
      if (sprite.current) act(sprite.current, m);
    }
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), ms);
  }, []);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const el = pal.current!;
    let first = true;
    const cur = { x: 0, y: 0 };

    const collect = () => {
      const w = document.documentElement.clientWidth < 768 ? 66 : 88;
      size.current = { w, h: Math.round((w * 320) / 269) };
      docks.current = Array.from(
        document.querySelectorAll<HTMLElement>("[data-pal-dock]"),
      )
        .filter((d) => d.getClientRects().length > 0)
        .map((d) => {
          const fixed = d.hasAttribute("data-pal-fixed");
          // Docks inside sticky cards measure from an in-flow anchor instead.
          const anchorEl = d.dataset.anchor
            ? document.getElementById(d.dataset.anchor)
            : null;
          const r = (anchorEl ?? d).getBoundingClientRect();
          return {
            el: d,
            mood: (d.dataset.mood as Mood) || "happy",
            lines: (d.dataset.say || "").split("|").filter(Boolean),
            pose: (d.dataset.pose as Pose) || "sit",
            fixed,
            sticky: !!anchorEl,
            docY: fixed ? 0 : r.top + window.scrollY,
          };
        })
        .sort((a, b) => a.docY - b.docY);
    };

    // Top-left of the pal when resting on a dock.
    const restAt = (d: Dock) => {
      const r = d.el.getBoundingClientRect();
      const { w, h } = size.current;
      const x = r.left - w / 2;
      return d.pose === "hang"
        ? { x, y: r.top + STRING }
        : { x, y: r.top - h + 8 };
    };

    const arrive = (i: number) => {
      const d = docks.current[i];
      if (!d) return;
      setMood(d.mood);
      if (sprite.current) act(sprite.current, d.mood);
      if (d.lines[0]) say(d.lines[0], undefined, 3000);
    };

    // Where the pal may stand on screen: below the nav, above the bottom edge.
    const band = (y: number) => {
      const navBottom = document.querySelector("[data-nav-bar]")?.getBoundingClientRect().bottom ?? 80;
      return clamp(y, navBottom + 6, window.innerHeight - size.current.h - 14);
    };

    const tick = () => {
      const list = docks.current;
      if (list.length === 0) return;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const vw = document.documentElement.clientWidth;
      const maxScroll = document.documentElement.scrollHeight - vh;
      // Which pair of docks are we between, and how far along? The pal leaves a
      // dock once its window has scrolled up past ~30% of the screen, and lands when the next dock reaches ~55%.
      let i = 0;
      let t = 0;
      let trip = 1;
      let s0 = 0;
      for (let k = 0; k < list.length - 1; k++) {
        const a = list[k].docY;
        const b = list[k + 1].docY;
        s0 = list[k].fixed
          ? Math.max(40, b - vh * 0.95)
          : list[k].sticky
            ? Math.max(a - vh * 0.3, b - vh) // pinned cards stay on screen until the next one slides in
            : a - vh * 0.3;
        let s1 = b - vh * 0.55;
        if (s1 > maxScroll - 4) s1 = maxScroll - 4;
        if (s1 - s0 < 220) s0 = s1 - 220;
        trip = s1 - s0;
        if (sy < s0) {
          i = k;
          t = 0;
          break;
        }
        if (sy <= s1) {
          i = k;
          t = (sy - s0) / trip;
          break;
        }
        i = k + 1;
        t = 0;
      }
      if (reduce) t = t < 0.5 ? 0 : 1;
      t = clamp(t, 0, 1);
      const e = ease(t);
      const A = restAt(list[i]);
      const B = list[i + 1] ? restAt(list[i + 1]) : A;
      const { w } = size.current;

      // Vertical: follow the old window up a little, cruise around the middle of
      // the screen, then drop onto the new window. Hops while walking.
      const cruise = vh * 0.46;
      const ay = band(A.y);
      const by = band(B.y);
      const walking = smooth(0, 0.12, t) * (1 - smooth(0.88, 1, t));
      const hop = reduce ? 0 : Math.abs(Math.sin((sy - s0) / 60)) * 18 * walking;
      const ty = mix(mix(ay, cruise, smooth(0, 0.16, t)), by, smooth(0.84, 1, t)) - hop;

      // Horizontal: drift towards the next dock, zigzagging across the page on long trips.
      const turns = Math.max(1, Math.round(trip / 1100));
      const amp = Math.min(vw * 0.28, 320);
      const zig = reduce ? 0 : Math.sin(t * Math.PI * turns) * amp * walking * (A.x + w / 2 > vw / 2 ? -1 : 1);
      const tx = mix(A.x, B.x, e) + zig;

      if (first) {
        cur.x = tx;
        cur.y = ty;
        first = false;
      } else {
        const k = reduce ? 1 : 0.22;
        cur.x += (tx - cur.x) * k;
        cur.y += (ty - cur.y) * k;
      }
      const x = clamp(cur.x, 14, vw - w - 14);
      // Lean into the direction of travel.
      const lean = reduce ? 0 : clamp((tx - cur.x) * 0.35, -16, 16) * walking;
      el.style.transform = `translate3d(${x}px, ${cur.y}px, 0) rotate(${lean}deg)`;

      // Keep the speech bubble inside the viewport. Near the top (under the nav)
      // it moves beside the pal, on whichever side has more room.
      if (bubbleRef.current) {
        const b = bubbleRef.current.style;
        const bw = bubbleRef.current.offsetWidth;
        const centre = x + w / 2;
        const shift = clamp(centre, bw / 2 + 6, vw - bw / 2 - 6) - centre;
        const fitsRight = x + w + 8 + bw < vw - 4;
        const fitsLeft = x - 8 - bw > 4;
        if (cur.y >= 170) {
          // Above the head.
          Object.assign(b, { top: "auto", bottom: "calc(100% + 10px)", left: "50%", right: "auto" });
          b.transform = `translateX(calc(-50% + ${shift}px))`;
        } else if (fitsRight || fitsLeft) {
          // Beside the pal, on the side with room.
          const left = fitsLeft && (!fitsRight || x > vw / 2);
          Object.assign(b, {
            top: "auto",
            bottom: "40%",
            left: left ? "auto" : "calc(100% + 8px)",
            right: left ? "calc(100% + 8px)" : "auto",
            transform: "none",
          });
        } else {
          // Narrow screens: below the feet.
          Object.assign(b, { top: "calc(100% + 6px)", bottom: "auto", left: "50%", right: "auto" });
          b.transform = `translateX(calc(-50% + ${shift}px))`;
        }
      }

      // The string only shows while resting under a hanging dock, and snaps as it leaves.
      const hanging = list[i].pose === "hang" && t < 0.5;
      if (string.current)
        string.current.style.transform = `translateX(-50%) scaleY(${hanging ? clamp(1 - t * 8, 0, 1) : 0})`;

      // Set off with a line, land with the new dock's mood.
      const moving = t > 0.06 && t < 0.94;
      if (moving !== travelling.current) {
        travelling.current = moving;
        if (moving && !reduce && sprite.current) {
          gsap.killTweensOf(sprite.current);
          gsap.to(sprite.current, { rotate: 0, y: 0, scale: 1, duration: 0.3 });
          setMood("excited");
          if (trip > 500) say(TRAVEL_LINES[Math.floor(Math.random() * TRAVEL_LINES.length)], undefined, 1400);
        }
      }
      const n = t < 0.9 ? i : i + 1;
      if (n !== nearest.current) {
        nearest.current = n;
        clickCount.current = 0;
        arrive(n);
      }
    };

    collect();
    // Start just above the nav so the pal drops in on its string.
    const firstRest = docks.current[0]
      ? restAt(docks.current[0])
      : { x: 0, y: 0 };
    cur.x = firstRest.x;
    cur.y = reduce ? firstRest.y : firstRest.y - 180;
    first = false;
    if (pal.current) pal.current.style.visibility = "visible";

    gsap.ticker.add(tick);
    const onResize = () => collect();
    ScrollTrigger.addEventListener("refresh", collect);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(collect);
    const late = setTimeout(collect, 1200);

    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener("refresh", collect);
      window.removeEventListener("resize", onResize);
      clearTimeout(late);
    };
  }, [say]);

  // Page-wide reactions: copies and explicit palSay() calls.
  useEffect(() => {
    const onCaptured = () => {
      const lines = ["saved!", "got it!", "kept it!", "mine now", "safe!"];
      say(lines[Math.floor(Math.random() * lines.length)], "happy", 1800);
    };
    const onSay = (e: Event) => {
      const { text, mood: m } = (e as CustomEvent<PalEvent>).detail;
      say(text, m ?? "happy");
    };
    window.addEventListener("snip:captured", onCaptured);
    window.addEventListener("pal:say", onSay);
    return () => {
      window.removeEventListener("snip:captured", onCaptured);
      window.removeEventListener("pal:say", onSay);
    };
  }, [say]);

  const poke = () => {
    const d = docks.current[nearest.current];
    clickCount.current += 1;
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      say("ok ok, I'm dizzy", "dizzy");
      return;
    }
    const pool =
      d && d.lines.length > 1
        ? d.lines.slice(1)
        : ["hi!", "boop", "copy something!", "I keep your clips"];
    say(
      pool[(clickCount.current - 1) % pool.length],
      d?.mood === "sleep" ? "wave" : "happy",
    );
  };

  return (
    // A clipped full-screen layer, so the pal and its bubble can never widen the page.
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <button
        ref={pal}
        type="button"
        onClick={poke}
        aria-label="The SnipWise pal. Poke it."
        className="pointer-events-auto absolute left-0 top-0 block cursor-pointer will-change-transform"
        style={{
          width: "var(--pal-w)",
          visibility: "hidden",
        }}
      >
        <style>{`:root{--pal-w:66px}@media(min-width:768px){:root{--pal-w:88px}}`}</style>
        {/* The string it hangs from. */}
        <span
          ref={string}
          aria-hidden
          className="absolute bottom-full left-1/2 w-[2px] origin-bottom bg-ink"
          style={{ height: STRING, transform: "translateX(-50%) scaleY(0)" }}
        />
        <div ref={sprite} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/pal.png"
            alt=""
            width={269}
            height={320}
            className="pixelated block h-auto w-full select-none"
            draggable={false}
          />
          {emotes[mood] && (
            <span
              key={mood}
              className="absolute -right-2 -top-4 scale-125 animate-[emote_0.5s_cubic-bezier(.3,1.6,.5,1)_both]"
            >
              {emotes[mood]}
            </span>
          )}
        </div>
        <span
          ref={bubbleRef}
          aria-live="polite"
          className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2"
          style={{ transform: "translateX(calc(-50% + var(--shift, 0px)))" }}
        >
          {bubble && (
            <span
              key={bubble.key}
              className="block animate-[bubble_0.35s_cubic-bezier(.3,1.6,.5,1)_both] whitespace-nowrap rounded-[10px] border-2 border-ink bg-paper px-2.5 py-1 font-pixel text-[15px] font-medium leading-none text-ink shadow-[2px_2px_0_var(--ink)]"
            >
              {bubble.text}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}

/** Marks a spot the pal visits. Place inside a relatively positioned element. */
export function PalDock({
  name,
  mood,
  say,
  pose = "sit",
  anchor,
  className = "",
}: {
  name: string;
  mood: Mood;
  say: string[];
  pose?: Pose;
  anchor?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      data-pal-dock={name}
      data-mood={mood}
      data-say={say.join("|")}
      data-pose={pose}
      data-anchor={anchor}
      className={`pointer-events-none absolute h-0 w-0 ${className}`}
    />
  );
}
