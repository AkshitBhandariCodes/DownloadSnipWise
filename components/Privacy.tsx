"use client";

import { useRef } from "react";
import { GlobeHemisphereWest } from "@phosphor-icons/react";
import { StorageJarIcon } from "mochi-icons/StorageJarIcon";
import { LockIcon } from "mochi-icons/LockIcon";
import { EyeClosedIcon } from "mochi-icons/EyeClosedIcon";
import { WifiIcon } from "mochi-icons/WifiIcon";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Container, SectionHeading } from "./ui";
import { PalDock } from "./pal/PalGuide";

const facts = [
  { Icon: WifiIcon, title: "Works with Wi-Fi off", body: "Capture, search and paste never touch the internet." },
  { Icon: LockIcon, title: "Passwords skipped", body: "Copies that password managers mark as sensitive are never read." },
  { Icon: EyeClosedIcon, title: "Private notifications", body: "Toasts say a clip was saved, never what it was." },
];

// Clips that fall into the jar as you scroll.
const drops = [
  { c: "bg-lime", label: "snippet" },
  { c: "bg-pink", label: "#FF5A36" },
  { c: "bg-sky", label: "link" },
  { c: "bg-butter", label: "reply" },
  { c: "bg-lilac", label: "prompt" },
];

export function Privacy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const build = (pin: boolean) => {
        const count = { n: 0 };
        const counter = root.current?.querySelector<HTMLElement>("[data-count]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: pin
            ? { trigger: "[data-priv-grid]", start: "center 55%", end: "+=1500", scrub: 0.7, pin: "[data-priv-grid]" }
            : { trigger: "[data-priv-grid]", start: "top 75%", end: "bottom 40%", scrub: 0.7 },
        });

        // 1. Clips fall into the jar one at a time and stack up.
        gsap.utils.toArray<HTMLElement>("[data-drop]").forEach((d, i) => {
          const side = i % 2 ? 1 : -1;
          tl.fromTo(
            d,
            { y: -320, x: gsap.utils.random(-90, 90), rotate: gsap.utils.random(-70, 70), opacity: 0 },
            { y: -i * 15, x: side * (6 + i * 3), rotate: side * 8, opacity: 1, duration: 0.6, ease: "power2.in" },
            i * 0.45,
          ).to(
            "[data-jar]",
            { scaleY: 0.94, scaleX: 1.04, duration: 0.08, yoyo: true, repeat: 1, transformOrigin: "50% 100%" },
            i * 0.45 + 0.6,
          );
        });
        tl.fromTo(
          count,
          { n: 0 },
          {
            n: drops.length,
            duration: drops.length * 0.45,
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(count.n));
            },
          },
          0.3,
        );

        // 2. One tries to leave for the internet, hits the lock, and bounces home.
        const t2 = drops.length * 0.45 + 0.4;
        tl.fromTo("[data-wire]", { scaleX: 0, backgroundColor: "rgb(128 120 140 / 0.35)" }, { scaleX: 1, duration: 0.5 }, t2)
          .fromTo("[data-packet]", { x: 0, y: 0, opacity: 0 }, { opacity: 1, duration: 0.1 }, t2 + 0.3)
          .to("[data-packet]", { x: 96, y: -44, duration: 0.6, ease: "power1.in" }, t2 + 0.4)
          .fromTo("[data-lock]", { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.3, ease: "back.out(3)" }, t2 + 0.75)
          .to("[data-wire]", { backgroundColor: "#ff5a36", duration: 0.2 }, t2 + 0.8)
          .to("[data-packet]", { x: 0, y: 0, rotate: 360, duration: 0.6, ease: "power2.out" }, t2 + 1)
          .to("[data-packet]", { opacity: 0, duration: 0.15 }, t2 + 1.55)
          .fromTo("[data-zero]", { scale: 1 }, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 3 }, t2 + 0.9);

        // 3. The promises slide in from the right.
        const t3 = t2 + 1.4;
        tl.fromTo(
          "[data-promise]",
          { x: 140, rotate: 6, opacity: 0 },
          { x: 0, rotate: 0, opacity: 1, duration: 0.6, stagger: 0.35, ease: "back.out(1.4)" },
          t3,
        )
          .fromTo("[data-no-server]", { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, t3 + 0.8)
          .to({}, { duration: 0.4 });
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (min-height: 760px)", () => build(true));
      mm.add("(max-width: 767px), (max-height: 759px)", () => build(false));
    },
    { scope: root },
  );

  return (
    <section ref={root} id="privacy" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          tape="Privacy"
          tapeColor="pink"
          title="Your clips stay yours."
          sub="SnipWise saves clips on your device. Optional sync encrypts them there, then stores them in your own Google Drive."
        />

        <div data-priv-grid className="mx-auto mt-16 grid max-w-[1040px] grid-cols-1 items-stretch gap-5 md:grid-cols-[1.25fr_1fr]">
          {/* The jar: everything lands on your PC. */}
          <div className="sticker relative flex flex-col items-center !rounded-[24px] bg-paper px-6 pb-8 pt-10">
            <PalDock name="privacy" pose="sit" mood="shy" className="left-[24%] top-0" say={["shh, it stays here", "local only", "I don't peek"]} />
            <span className="tape absolute -top-3 left-1/2 -translate-x-1/2 bg-pink" style={{ rotate: "2deg" }}>
              your PC
            </span>

            {/* The internet, off in the corner, behind a lock. */}
            <span className="absolute right-5 top-6 flex flex-col items-center gap-1 text-ink-3">
              <span className="relative grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-ink/40">
                <GlobeHemisphereWest size={26} weight="duotone" />
                <span data-lock className="absolute -bottom-2 -left-3 grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-paper">
                  <LockIcon size={18} aria-hidden />
                </span>
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">internet</span>
            </span>

            <div className="relative mt-4 h-[200px] w-[200px]">
              {/* The wire from the jar towards the internet. */}
              <span
                data-wire
                aria-hidden
                className="absolute left-[60%] top-[34px] h-[3px] w-[120px] origin-left -rotate-[24deg] rounded-full bg-ink/25"
              />
              <span
                data-packet
                aria-hidden
                className="absolute left-[55%] top-[22px] z-10 h-5 w-7 rounded-[5px] border-2 border-ink bg-coral opacity-0"
              />
              <div data-jar>
                <StorageJarIcon size={200} aria-hidden />
              </div>
              <div className="pointer-events-none absolute bottom-[46px] left-1/2">
                {drops.map((d, i) => (
                  <span
                    key={d.label}
                    data-drop
                    className={`absolute bottom-0 -ml-[30px] whitespace-nowrap rounded-[6px] border-2 border-ink px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-ink ${d.c}`}
                    style={{ zIndex: 10 - i, transform: `translate(${(i % 2 ? 1 : -1) * (6 + i * 3)}px, ${-i * 15}px)` }}
                  >
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 font-mono text-[12px] font-semibold">
              <span className="rounded-[9px] border-2 border-ink bg-lime px-2.5 py-1">
                saved here: <span data-count className="tabular-nums">{drops.length}</span>
              </span>
              <span data-zero className="inline-block rounded-[9px] border-2 border-ink bg-paper px-2.5 py-1">
                sent to us: 0 bytes
              </span>
            </div>
            <p className="mt-4 text-center text-[22px] font-[760] tracking-[-0.03em]">Your history starts here.</p>
            <p className="mt-1 text-center text-[15px] text-ink-2">Capture works offline, without an account.</p>
          </div>

          <div className="flex flex-col gap-5">
            <div data-promise className="sticker relative flex items-center gap-4 !rounded-[20px] p-5">
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-[14px] border-2 border-dashed border-ink/50 font-mono text-[11px] font-bold text-ink-3">
                server
                <span data-no-server className="absolute left-1/2 top-1/2 h-[3px] w-[70px] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-coral" />
              </span>
              <div>
                <p className="text-[17px] font-[760] tracking-[-0.02em]">No clips on our servers</p>
                <p className="mt-0.5 text-[14px] leading-relaxed text-ink-2">The account service handles sign-in, never clipboard content.</p>
              </div>
            </div>
            <ul className="grid gap-3">
              {facts.map(({ Icon, title, body }) => (
                <li key={title} data-promise className="flex items-start gap-3 rounded-[16px] border-2 border-ink bg-paper/70 p-4">
                  <Icon size={30} aria-hidden className="shrink-0" />
                  <span>
                    <span className="block text-[15px] font-bold">{title}</span>
                    <span className="block text-[13.5px] leading-relaxed text-ink-2">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-ink-2">
          Read the <a className="font-semibold underline underline-offset-4" href="/privacy-policy">Privacy Policy</a> for how SnipWise handles account and Google Drive data.
        </p>
      </Container>
    </section>
  );
}
