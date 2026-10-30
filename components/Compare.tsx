"use client";

import { useRef, useState } from "react";
import { Check, Minus, CircleHalf } from "@phosphor-icons/react";
import { compareRows, rivals, type Cell } from "@/content/copy";
import { site } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Container, SectionHeading, Logo } from "./ui";
import { PalDock } from "./pal/PalGuide";

function Mark({ cell, ours = false }: { cell: Cell; ours?: boolean }) {
  const icon =
    cell.mark === "yes" ? (
      <Check size={ours ? 12 : 11} weight="bold" />
    ) : cell.mark === "some" ? (
      <CircleHalf size={12} weight="fill" />
    ) : (
      <Minus size={12} weight="bold" />
    );
  const look =
    cell.mark === "yes"
      ? ours
        ? "bg-lime border-ink"
        : "bg-paper border-ink"
      : cell.mark === "some"
        ? "bg-butter/70 border-ink"
        : "border-transparent text-ink-3";
  return (
    <span className="flex min-w-0 items-start gap-2">
      <span data-mark className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${look}`}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="sr-only">{cell.mark === "yes" ? "Yes" : cell.mark === "some" ? "Partly" : "No"}. </span>
        {cell.note && <span className="block text-[13px] leading-snug">{cell.note}</span>}
      </span>
    </span>
  );
}

const cols = "grid-cols-[1fr_1fr] md:grid-cols-[1.35fr_1.25fr_repeat(4,minmax(0,1fr))]";

export function Compare() {
  const root = useRef<HTMLElement>(null);
  const [pick, setPick] = useState("winv");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");

      // The table swings up into place.
      gsap.fromTo(
        "[data-cmp-table]",
        { y: 120, rotateX: 22, scale: 0.92, transformPerspective: 1400, transformOrigin: "50% 100%" },
        {
          y: 0,
          rotateX: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-cmp-table]", start: "top 98%", end: "top 45%", scrub: 0.6 },
        },
      );

      // Then the story plays with the scroll: each row lands, SnipWise ticks it
      // off, and Win+V's answer fades out like it was forgotten.
      const build = (pin: boolean) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: pin
            ? { trigger: "[data-cmp-table]", start: "center 52%", end: "+=1300", scrub: 0.7, pin: "[data-cmp-wrap]" }
            : { trigger: "[data-cmp-table]", start: "top 70%", end: "bottom 55%", scrub: 0.7 },
        });
        rows.forEach((row, i) => {
          const at = i * 0.5;
          tl.fromTo(row, { opacity: 0.15, x: -24 }, { opacity: 1, x: 0, duration: 0.5 }, at)
            .fromTo(row.querySelector("[data-sw-fill]"), { scaleY: 0 }, { scaleY: 1, duration: 0.5 }, at)
            .fromTo(
              row.querySelectorAll("[data-sw] [data-mark]"),
              { scale: 0, rotate: -60 },
              { scale: 1, rotate: 0, duration: 0.35, ease: "back.out(3)" },
              at + 0.15,
            );
        });
        const forget = rows.length * 0.5;
        tl.to("[data-rv='winv'] [data-forget-text]", { opacity: 0.28, filter: "blur(1.5px)", duration: 0.8, stagger: 0.06 }, forget)
          .fromTo("[data-rv='winv'] [data-strike]", { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.06 }, forget)
          .fromTo("[data-forgot]", { scale: 0, rotate: -30 }, { scale: 1, rotate: -6, duration: 0.4, ease: "back.out(2.5)" }, forget + 0.4)
          .fromTo(
            "[data-keeps]",
            { scale: 2.2, rotate: 18, opacity: 0 },
            { scale: 1, rotate: -8, opacity: 1, duration: 0.5, ease: "back.out(1.8)" },
            forget + 0.9,
          )
          .to({}, { duration: 0.4 });
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (min-height: 760px)", () => build(true));
      mm.add("(max-width: 767px), (max-height: 759px)", () => build(false));
    },
    { scope: root },
  );

  return (
    <section ref={root} id="compare" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          tape="Compare"
          tapeColor="sky"
          title="Win+V forgets. SnipWise doesn't."
          sub="The Windows clipboard is fine for the last few things you copied. Here is how SnipWise stacks up against it, and against the tools people install to fix it."
        />

        {/* Phones: pick who to compare against. */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 md:hidden">
          {rivals.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setPick(r.id)}
              aria-pressed={pick === r.id}
              className={`rounded-full border-2 border-ink px-3.5 py-1.5 text-[13.5px] font-bold transition-transform ${
                pick === r.id ? "-rotate-2 bg-sky shadow-[2px_2px_0_var(--ink)]" : "bg-paper"
              }`}
            >
              vs {r.name}
            </button>
          ))}
        </div>

        <div data-cmp-wrap className="mx-auto mt-6 max-w-[1120px] md:mt-16">
          <div data-cmp-table className="relative">
            <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rotate-[-0.8deg] rounded-[24px] border-2 border-ink bg-sky" />
            <div className="sticker relative overflow-hidden !rounded-[24px]">
              {/* Header */}
              <div className={`grid ${cols} border-b-2 border-ink`}>
                <div className="hidden p-5 md:block" />
                <div className="relative bg-lime p-4 md:border-x-2 md:border-ink md:p-5">
                  <PalDock name="compare" pose="sit" mood="smug" className="right-6 top-0" say={["25 items? cute", "I keep them all", "no contest"]} />
                  <Logo />
                </div>
                {rivals.map((r) => (
                  <div
                    key={r.id}
                    className={`relative flex-col justify-center border-l-2 border-ink p-4 md:flex md:border-l-0 md:px-4 md:py-5 ${
                      pick === r.id ? "flex" : "hidden"
                    }`}
                  >
                    <span className="text-[16px] font-[760] leading-tight tracking-[-0.02em]">{r.name}</span>
                    <span className="text-[11.5px] font-semibold text-ink-3">{r.kind}</span>
                    {r.id === "winv" && (
                      <span data-forgot className="tape absolute -top-1 right-2 bg-pink !px-2 !py-0.5 text-[9.5px]">
                        forgot
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <dl className="relative">
                {compareRows.map((row, i) => (
                  <div key={row.topic} data-row className={`grid ${cols} ${i > 0 ? "border-t-2 border-hair" : ""}`}>
                    <dt className="col-span-2 px-5 pt-4 text-[12.5px] font-bold uppercase tracking-[0.08em] text-ink-3 md:col-span-1 md:py-4 md:text-[15px] md:font-semibold md:normal-case md:tracking-normal md:text-ink">
                      {row.topic}
                    </dt>
                    <dd data-sw className="relative px-5 py-3.5 text-[14px] font-semibold md:border-x-2 md:border-ink md:py-4">
                      <span data-sw-fill aria-hidden className="absolute inset-0 origin-top bg-lime/45" />
                      <span className="relative">
                        <Mark cell={row.snipwise} ours />
                      </span>
                    </dd>
                    {rivals.map((r) => (
                      <dd
                        key={r.id}
                        data-rv={r.id}
                        className={`relative px-4 py-3.5 text-ink-2 md:block md:py-4 ${pick === r.id ? "block" : "hidden"}`}
                      >
                        <span data-forget-text className="block">
                          <Mark cell={row.rivals[r.id]} />
                        </span>
                        {r.id === "winv" && (
                          <span
                            data-strike
                            aria-hidden
                            className="pointer-events-none absolute left-3 right-4 top-1/2 h-[2px] origin-left scale-x-0 rounded-full bg-coral"
                          />
                        )}
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
            </div>
            <span
              data-keeps
              aria-hidden
              className="absolute -bottom-6 left-[22%] rounded-[14px] border-[3px] border-coral bg-paper px-4 py-1.5 font-display text-[22px] font-[800] uppercase tracking-[-0.01em] text-coral-ink shadow-[3px_3px_0_var(--coral)] md:left-[30%] md:text-[26px]"
            >
              Keeps it all
            </span>
          </div>
          <p className="mx-auto mt-12 max-w-[1120px] text-[12.5px] leading-relaxed text-ink-3">
            Based on each app&rsquo;s built-in features and its own docs, October 2026. Win+V from Microsoft Support, &ldquo;Using
            the clipboard&rdquo;. Spot something out of date?{" "}
            <a href={`https://github.com/${site.links.feedbackRepo}/issues/new`} className="font-semibold underline underline-offset-2">
              Tell us
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
