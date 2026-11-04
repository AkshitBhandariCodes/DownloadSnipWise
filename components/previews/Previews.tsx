"use client";

import { useRef } from "react";
import { MagnifyingGlass, WifiSlash, Lock, FolderSimple, PushPin, CloudCheck, Desktop } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/*
  Tiny looping previews for the feature cards. Each one is a short GSAP
  timeline that only plays while the card is on screen. With reduced motion
  they hold a representative frame.
*/

function useLoop(build: (tl: gsap.core.Timeline) => void, hold = 0.6) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
      build(tl);
      if (prefersReducedMotion()) {
        tl.progress(hold).pause();
        return;
      }
      ScrollTrigger.create({
        trigger: scope.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (s) => (s.isActive ? tl.play() : tl.pause()),
      });
    },
    { scope },
  );
  return scope;
}

const Row = ({ w = "w-24", tone = "bg-ink/15", className = "" }: { w?: string; tone?: string; className?: string }) => (
  <span className={`block h-2 rounded-full ${w} ${tone} ${className}`} />
);

const Mini = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-[10px] border-2 border-ink bg-paper shadow-[2px_2px_0_var(--ink)] ${className}`}>{children}</div>
);

function Dock() {
  const s = useLoop((tl) => {
    tl.set(".d-panel", { yPercent: 120 })
      .to(".d-key", { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1 })
      .to(".d-panel", { yPercent: 0, duration: 0.6, ease: "back.out(1.4)" })
      .from(".d-row", { x: -12, opacity: 0, stagger: 0.08, duration: 0.3 }, "<0.2")
      .to(".d-sel", { y: 22, duration: 0.25 }, "+=0.4")
      .to(".d-sel", { y: 44, duration: 0.25 }, "+=0.3")
      .to(".d-panel", { yPercent: 120, duration: 0.4, ease: "power2.in" }, "+=0.6");
  });
  return (
    <div ref={s} className="relative h-full w-full overflow-hidden">
      <div className="d-key absolute left-4 top-4 flex gap-1 font-mono text-[11px] font-bold">
        <span className="rounded-[6px] border-2 border-ink bg-paper px-1.5">Win</span>
        <span className="rounded-[6px] border-2 border-ink bg-paper px-1.5">V</span>
      </div>
      <Mini className="d-panel absolute bottom-7 left-1/2 w-[62%] -translate-x-1/2 p-2">
        <div className="relative grid gap-1.5">
          <span className="d-sel absolute -inset-x-1 top-[-3px] h-[20px] rounded-[6px] bg-sky/70" />
          {["w-28", "w-20", "w-24"].map((w, i) => (
            <div key={i} className="d-row relative flex h-[16px] items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[3px] border-[1.5px] border-ink bg-butter" />
              <Row w={w} tone="bg-ink/30" />
            </div>
          ))}
        </div>
      </Mini>
      <div className="absolute inset-x-0 bottom-0 flex h-5 items-center justify-center gap-1 border-t-2 border-ink bg-paper/80">
        {["bg-sky", "bg-lime", "bg-pink"].map((c) => (
          <span key={c} className={`h-2.5 w-2.5 rounded-[3px] border-[1.5px] border-ink ${c}`} />
        ))}
      </div>
    </div>
  );
}

function Search() {
  const s = useLoop((tl) => {
    tl.set(".s-text", { width: 0 })
      .set(".s-row", { opacity: 1, height: 16 })
      .to(".s-text", { width: 34, duration: 0.8, ease: "steps(3)" })
      .to(".s-row.no", { opacity: 0, height: 0, duration: 0.35, stagger: 0.05 }, "+=0.1")
      .to(".s-hit", { backgroundColor: "var(--lilac)", duration: 0.2 })
      .to({}, { duration: 1.1 })
      .to(".s-hit", { backgroundColor: "transparent", duration: 0.2 });
  });
  return (
    <div ref={s} className="grid h-full place-items-center">
      <Mini className="w-[70%] p-2.5">
        <div className="flex items-center gap-1.5 border-b-2 border-hair pb-1.5">
          <MagnifyingGlass size={12} weight="bold" />
          <span className="s-text block overflow-hidden whitespace-nowrap font-mono text-[11px] font-bold">dep</span>
          <span className="h-3 w-[2px] animate-[caret_1s_steps(1)_infinite] bg-ink" />
        </div>
        <div className="mt-1.5 grid gap-1">
          <div className="s-row no flex items-center overflow-hidden"><Row w="w-20" /></div>
          <div className="s-row s-hit flex items-center overflow-hidden rounded-[5px] px-1"><Row w="w-28" tone="bg-ink/40" /></div>
          <div className="s-row no flex items-center overflow-hidden"><Row w="w-16" /></div>
          <div className="s-row no flex items-center overflow-hidden"><Row w="w-24" /></div>
        </div>
      </Mini>
    </div>
  );
}

function Shortcuts() {
  const s = useLoop((tl) => {
    tl.set(".k-trig", { width: 0, opacity: 1 })
      .set(".k-out", { width: 0 })
      .to(".k-trig", { width: 36, duration: 0.7, ease: "steps(4)" })
      .to(".k-trig", { opacity: 0, width: 0, duration: 0.15 }, "+=0.3")
      .to(".k-out", { width: "auto", duration: 0.01 })
      .from(".k-out span", { opacity: 0, y: 6, stagger: 0.04, duration: 0.2 })
      .to({}, { duration: 1.2 });
  }, 0.9);
  return (
    <div ref={s} className="grid h-full place-items-center">
      <Mini className="w-[74%] p-3 text-[12px] font-semibold">
        <p className="text-ink-3">Thanks for the call!</p>
        <p className="mt-1 flex items-center">
          <span className="k-trig inline-block overflow-hidden whitespace-nowrap font-mono text-coral-ink">;sig&nbsp;</span>
          <span className="k-out inline-flex gap-1 overflow-hidden whitespace-nowrap">
            {"Cheers, Sam".split(" ").map((w) => (
              <span key={w} className="rounded-[4px] bg-butter px-0.5">{w}</span>
            ))}
          </span>
          <span className="ml-0.5 h-3.5 w-[2px] animate-[caret_1s_steps(1)_infinite] bg-ink" />
        </p>
      </Mini>
    </div>
  );
}

function Convert() {
  const s = useLoop((tl) => {
    tl.set(".c-json", { opacity: 1, rotateY: 0 })
      .set(".c-yaml", { opacity: 0, rotateY: -90 })
      .to(".c-json", { rotateY: 90, opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.9")
      .to(".c-yaml", { rotateY: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" })
      .to({}, { duration: 1.4 });
  }, 0.8);
  return (
    <div ref={s} className="grid h-full place-items-center [perspective:600px]">
      <div className="relative h-[92px] w-[64%]">
        <Mini className="c-json absolute inset-0 grid place-items-center p-2 font-mono text-[10.5px] font-semibold">
          {'{"ship":true,"tags":["beta"]}'}
        </Mini>
        <Mini className="c-yaml absolute inset-0 bg-[#1d1826] p-2.5 font-mono text-[10.5px] font-semibold leading-snug text-[#d6f57e]">
          ship: true
          <br />
          tags:
          <br />
          &nbsp;&nbsp;- beta
        </Mini>
      </div>
    </div>
  );
}

function Drag() {
  const s = useLoop((tl) => {
    tl.set(".g-card", { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 })
      .set(".g-msg", { opacity: 0, y: 6 })
      .to(".g-card", { rotate: -6, scale: 1.06, duration: 0.2 })
      .to(".g-card", { x: 96, y: 18, duration: 0.8, ease: "power2.inOut" })
      .to(".g-card", { scale: 0.4, opacity: 0, duration: 0.2 })
      .to(".g-msg", { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" })
      .to({}, { duration: 1 });
  }, 0.95);
  return (
    <div ref={s} className="relative h-full w-full">
      <Mini className="absolute right-[10%] top-[18%] h-[70%] w-[46%] p-2">
        <Row w="w-10" tone="bg-ink/40" />
        <div className="g-msg mt-6 ml-auto w-fit rounded-[8px] border-[1.5px] border-ink bg-pink px-1.5 py-0.5 font-mono text-[10px] font-bold">#FF5A36</div>
        <div className="absolute inset-x-2 bottom-2 h-4 rounded-[5px] border-[1.5px] border-dashed border-ink/40" />
      </Mini>
      <Mini className="g-card absolute left-[10%] top-[34%] z-10 w-[34%] p-1.5">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-[3px] border-[1.5px] border-ink" style={{ background: "#FF5A36" }} />
          <span className="font-mono text-[9.5px] font-bold">#FF5A36</span>
        </div>
      </Mini>
    </div>
  );
}

function Types() {
  const s = useLoop((tl) => {
    tl.set(".t-tag", { scale: 0, rotate: -30 })
      .to(".t-tag", { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(3)", stagger: 0.35 })
      .to({}, { duration: 1.3 });
  }, 1);
  const rows = [
    { text: "git push", tag: "Code", bg: "bg-lime" },
    { text: "cal.com/sam", tag: "Link", bg: "bg-sky" },
    { text: "#B69CFF", tag: "Color", bg: "bg-pink" },
  ];
  return (
    <div ref={s} className="grid h-full place-items-center">
      <div className="grid w-[70%] gap-1.5">
        {rows.map((r) => (
          <Mini key={r.text} className="flex items-center justify-between px-2 py-1">
            <span className="font-mono text-[10.5px] font-bold">{r.text}</span>
            <span className={`t-tag rounded-full border-[1.5px] border-ink ${r.bg} px-1.5 text-[9.5px] font-bold`}>{r.tag}</span>
          </Mini>
        ))}
      </div>
    </div>
  );
}

function Folders() {
  const s = useLoop((tl) => {
    tl.set(".f-clip", { x: 0, y: 0, scale: 1, opacity: 1 })
      .set(".f-pin", { y: -20, opacity: 0 })
      .to(".f-pin", { y: 0, opacity: 1, duration: 0.4, ease: "bounce.out" })
      .to(".f-clip", { x: 70, y: 26, scale: 0.3, opacity: 0, duration: 0.7, ease: "power2.in" }, "+=0.4")
      .to(".f-folder", { scale: 1.15, duration: 0.12, yoyo: true, repeat: 1 })
      .to({}, { duration: 1 });
  }, 0.5);
  return (
    <div ref={s} className="relative grid h-full place-items-center">
      <div className="flex items-end gap-6">
        <div className="grid gap-1.5">
          <Mini className="relative flex items-center gap-1 px-2 py-1">
            <PushPin size={11} weight="fill" className="f-pin text-coral" />
            <Row w="w-14" tone="bg-ink/40" />
          </Mini>
          <Mini className="f-clip px-2 py-1">
            <Row w="w-16" />
          </Mini>
        </div>
        <div className="f-folder grid place-items-center">
          <FolderSimple size={44} weight="duotone" className="text-ink" />
          <span className="font-mono text-[9.5px] font-bold">Client A</span>
        </div>
      </div>
    </div>
  );
}

function Passwords() {
  const s = useLoop((tl) => {
    tl.set(".p-stamp", { scale: 2, opacity: 0, rotate: -30 })
      .set(".p-dots", { opacity: 1 })
      .to(".p-stamp", { scale: 1, opacity: 1, rotate: -12, duration: 0.35, ease: "back.out(2)" }, "+=0.6")
      .to(".p-dots", { opacity: 0.25, duration: 0.3 }, "<")
      .to({}, { duration: 1.4 });
  }, 0.9);
  return (
    <div ref={s} className="relative grid h-full place-items-center">
      <Mini className="flex w-[62%] items-center gap-2 px-3 py-2">
        <Lock size={14} weight="bold" />
        <span className="p-dots font-mono text-[14px] font-bold tracking-[0.2em]">••••••••</span>
      </Mini>
      <span className="p-stamp absolute rounded-[6px] border-[3px] border-coral-ink px-2 py-0.5 font-mono text-[12px] font-black uppercase tracking-wider text-coral-ink">
        not saved
      </span>
    </div>
  );
}

function Offline() {
  const s = useLoop((tl) => {
    tl.set(".o-n", { innerText: 41 })
      .to(".o-n", { innerText: 44, snap: { innerText: 1 }, duration: 1.4, ease: "none" })
      .from(".o-tick", { scale: 0, duration: 0.3, ease: "back.out(3)" }, "<0.2")
      .to({}, { duration: 1.2 });
  }, 0.9);
  return (
    <div ref={s} className="grid h-full place-items-center">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-ink bg-paper">
          <WifiSlash size={26} weight="bold" />
        </span>
        <Mini className="px-3 py-2 text-center">
          <span className="o-n block font-display text-[30px] font-[760] leading-none">44</span>
          <span className="o-tick block font-mono text-[10px] font-bold text-ink-2">clips saved</span>
        </Mini>
      </div>
    </div>
  );
}

function Pal() {
  const s = useLoop((tl) => {
    tl.set(".pl-b", { scale: 0, opacity: 0 })
      .to(".pl-p", { y: -16, duration: 0.18, ease: "power2.out" }, "+=0.5")
      .to(".pl-p", { y: 0, duration: 0.45, ease: "bounce.out" })
      .to(".pl-b", { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(3)" }, "<")
      .to({}, { duration: 1.2 })
      .to(".pl-b", { scale: 0, opacity: 0, duration: 0.2 });
  }, 0.6);
  return (
    <div ref={s} className="relative h-full w-full">
      <div className="absolute bottom-5 right-[22%] flex flex-col items-center">
        <span className="pl-b mb-1 rounded-[7px] border-2 border-ink bg-paper px-1.5 font-pixel text-[12px]">saved!</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/pal.png" alt="" width={44} height={52} className="pl-p pixelated" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-5 items-center justify-center gap-1 border-t-2 border-ink bg-paper/80">
        {["bg-sky", "bg-lime", "bg-pink"].map((c) => (
          <span key={c} className={`h-2.5 w-2.5 rounded-[3px] border-[1.5px] border-ink ${c}`} />
        ))}
      </div>
    </div>
  );
}

function Sync() {
  const s = useLoop((tl) => {
    tl.set(".y-dot", { left: "18%", opacity: 1 })
      .to(".y-dot", { left: "78%", duration: 1.4, ease: "power1.inOut" })
      .to(".y-dot", { opacity: 0, duration: 0.2 })
      .to({}, { duration: 0.6 });
  }, 0.5);
  return (
    <div ref={s} className="relative grid h-full place-items-center">
      <div className="relative flex w-[78%] items-center justify-between">
        <Desktop size={34} weight="duotone" />
        <span className="absolute inset-x-[16%] top-1/2 border-t-2 border-dashed border-ink/50" />
        <span className="y-dot absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-mint">
          <Lock size={11} weight="bold" />
        </span>
        <CloudCheck size={34} weight="duotone" />
      </div>
    </div>
  );
}

function Mac() {
  const s = useLoop((tl) => {
    tl.set(".m-notch", { width: 64, height: 18 })
      .set(".m-clip", { opacity: 0, scale: 0.8 })
      .to(".m-notch", { width: 168, height: 32, duration: 0.5, ease: "back.out(1.5)" }, "+=0.3")
      .to(".m-clip", { opacity: 1, scale: 1, duration: 0.25 }, "<0.2")
      .to({}, { duration: 1.4 })
      .to(".m-clip", { opacity: 0, duration: 0.2 })
      .to(".m-notch", { width: 64, height: 18, duration: 0.4, ease: "power2.inOut" });
  }, 0.5);
  return (
    <div ref={s} className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 flex h-7 items-center justify-between border-b-2 border-ink bg-paper/90 px-3">
        <span className="font-mono text-[10px] font-bold text-ink"></span>
        <div className="m-notch flex items-center justify-center rounded-full bg-ink px-2 text-paper shadow-sm">
          <span className="m-clip truncate font-mono text-[10px] font-bold">Ctrl+Shift+V</span>
        </div>
        <span className="font-mono text-[9px] font-bold text-ink-3">10:42</span>
      </div>
      <div className="grid h-full place-items-center pt-6">
        <div className="flex gap-1.5 font-mono text-[11px] font-bold">
          <span className="rounded-[6px] border-2 border-ink bg-paper px-1.5 shadow-[2px_2px_0_var(--ink)]">Ctrl</span>
          <span className="rounded-[6px] border-2 border-ink bg-paper px-1.5 shadow-[2px_2px_0_var(--ink)]">Shift</span>
          <span className="rounded-[6px] border-2 border-ink bg-paper px-1.5 shadow-[2px_2px_0_var(--ink)]">V</span>
        </div>
      </div>
    </div>
  );
}

function Tray() {
  const s = useLoop((tl) => {
    tl.set(".r-toast", { x: 140, opacity: 0 })
      .to(".r-icon", { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1 }, "+=0.4")
      .to(".r-toast", { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" })
      .to(".r-toast", { x: 140, opacity: 0, duration: 0.35, ease: "power2.in" }, "+=1.4");
  }, 0.55);
  return (
    <div ref={s} className="relative h-full w-full overflow-hidden">
      <Mini className="r-toast absolute bottom-8 right-3 w-[58%] p-2">
        <p className="text-[11px] font-bold">SnipWise</p>
        <p className="text-[10.5px] font-semibold text-ink-2">Saved a clip</p>
      </Mini>
      <div className="absolute inset-x-0 bottom-0 flex h-6 items-center justify-end gap-1.5 border-t-2 border-ink bg-paper/80 px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/pal.png" alt="" width={13} height={16} className="r-icon pixelated" />
        <span className="font-mono text-[9px] font-bold text-ink-2">10:42</span>
      </div>
    </div>
  );
}

export const previews: Record<string, () => React.ReactNode> = {
  dock: Dock,
  search: Search,
  shortcuts: Shortcuts,
  convert: Convert,
  drag: Drag,
  types: Types,
  folders: Folders,
  passwords: Passwords,
  offline: Offline,
  pal: Pal,
  sync: Sync,
  tray: Tray,
  mac: Mac,
};
