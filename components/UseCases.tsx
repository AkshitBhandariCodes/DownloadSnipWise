"use client";

import { useRef } from "react";
import { CodeIcon } from "mochi-icons/CodeIcon";
import { PaintPaletteIcon } from "mochi-icons/PaintPaletteIcon";
import { EditIcon } from "mochi-icons/EditIcon";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { Mood } from "@/lib/palBus";
import { scrollToTarget } from "./motion/SmoothScroll";
import { Container, SectionHeading, type TapeColor } from "./ui";
import { PalDock } from "./pal/PalGuide";
import { DevDesk } from "./desks/DevDesk";
import { DesignDesk } from "./desks/DesignDesk";
import { WriterDesk } from "./desks/WriterDesk";

type Chapter = {
  id: string;
  no: string;
  who: string;
  tape: TapeColor;
  back: string;
  Icon: typeof CodeIcon;
  title: string;
  body: string;
  points: string[];
  Desk: () => React.ReactNode;
  pal: { mood: Mood; say: string[] };
};

const chapters: Chapter[] = [
  {
    id: "developers",
    no: "01",
    who: "Developers",
    tape: "lime",
    back: "bg-lime",
    Icon: CodeIcon,
    title: "Your prompts and templates, one ;shortcut away.",
    body: "Save the BFS you rewrite every contest, the prompt you paste into every chat, the command you always mistype. Name it once, then type its name anywhere.",
    points: [
      "LeetCode templates on ;bfs, ;dsu, ;bsearch",
      "Prompt library for any AI chat",
      "JSON, YAML and Base64 converted in place",
    ],
    Desk: DevDesk,
    pal: {
      mood: "focus",
      say: ["try ;bsearch", "I know a BFS", "no more retyping"],
    },
  },
  {
    id: "designers",
    no: "02",
    who: "Designers",
    tape: "pink",
    back: "bg-pink",
    Icon: PaintPaletteIcon,
    title: "Colours, fonts and references, all in one folder.",
    body: "Copy a hex code and get RGB, HSL, OKLCH and the Tailwind class. Keep font names and the sites that inspire you right next to them.",
    points: [
      "Every colour format from one copy",
      "Font names with a live preview",
      "An inspiration folder you can search",
    ],
    Desk: DesignDesk,
    pal: { mood: "love", say: ["ooh, colours", "pick the coral", "pretty!"] },
  },
  {
    id: "writers",
    no: "03",
    who: "Writers and marketers",
    tape: "butter",
    back: "bg-butter",
    Icon: EditIcon,
    title: "Your best lines, ready in every app.",
    body: "Intros, booking links, sign-offs, hashtags and CTAs. Type ;sig in Gmail, ;cal in Slack, ;tags in LinkedIn, and turn Markdown into clean HTML for your newsletter.",
    points: [
      "Reusable intros, sign-offs and CTAs",
      "Markdown to HTML in one click",
      "Word and character counts as you write",
    ],
    Desk: WriterDesk,
    pal: { mood: "happy", say: ["type ;sig", "so professional", "send it!"] },
  },
];

export function UseCases() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      // Desktop: chapters pin and stack. Each earlier card shrinks back as the next slides over it.
      mm.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-chapter]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.fromTo(
            card.querySelector("[data-chapter-inner]"),
            { scale: 1, rotate: 0, filter: "brightness(1)" },
            {
              scale: 0.92,
              rotate: i % 2 ? 1.5 : -1.5,
              filter: "brightness(0.93)",
              ease: "none",
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: "top 110px",
                scrub: true,
              },
            },
          );
        });
      });
      // Desk windows slide in from the side the first time they show.
      gsap.utils.toArray<HTMLElement>("[data-desk]").forEach((desk, i) => {
        gsap.from(desk, {
          x: i % 2 ? -120 : 120,
          rotate: i % 2 ? -4 : 4,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: desk, start: "top 85%", once: true },
        });
      });
      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="use-cases" className="relative py-24 md:py-32">
      <Container>
        <SectionHeading
          tape="Use cases"
          tapeColor="lime"
          title="Built for the way you copy."
          sub="Pick your desk. Every window below is a working demo, so type the shortcuts and click the clips for real."
        />
        {/* Chapter index. */}
        <div
          data-reveal="up"
          className="mt-10 flex flex-wrap justify-center gap-2.5"
        >
          {chapters.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(`#${c.id}`);
              }}
              className="btn btn-paper btn-sm gap-2"
            >
              <c.Icon size={20} aria-hidden />
              {c.who}
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-10 lg:gap-[18vh]">
          {chapters.map((c, i) => (
            <div key={c.id} className="contents">
              {/* In-flow marker: sticky cards move, so the pal measures progress from here. */}
              <span
                id={`${c.id}-anchor`}
                aria-hidden
                className="-mb-10 block h-0 lg:-mb-[18vh]"
              />
              <article
                id={c.id}
                data-chapter
                className="lg:sticky"
                style={{ top: 120 + i * 14 }}
              >
                <div data-chapter-inner className="relative origin-top">
                  {/* Stacked paper behind the card. */}
                  <div
                    aria-hidden
                    className={`absolute inset-0 translate-x-2.5 translate-y-3 rotate-[1.2deg] rounded-[24px] border-2 border-ink ${c.back}`}
                  />
                  <div className="sticker relative grid grid-cols-1 gap-8 !rounded-[24px] p-5 md:p-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10 lg:p-10">
                    <span
                      className={`tape absolute -top-3 left-8 !py-1 ${tapeClass[c.tape]}`}
                      style={{ rotate: "-3deg" }}
                    >
                      No.{c.no} · {c.who}
                    </span>
                    <div className="flex flex-col">
                      <c.Icon size={56} aria-hidden />
                      <h3 className="display mt-5 text-balance text-[32px] md:text-[42px]">
                        {c.title}
                      </h3>
                      <p className="mt-4 text-[16px] leading-relaxed text-ink-2 md:text-[17px]">
                        {c.body}
                      </p>
                      <ul className="mt-6 grid gap-2.5">
                        {c.points.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-2.5 text-[15px] font-semibold"
                          >
                            <span
                              className={`mt-[3px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-2 border-ink ${c.back}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-auto hidden pt-8 text-[13px] font-semibold text-ink-3 lg:block">
                        Tip: click a shortcut on the left of the window, or type
                        one yourself.
                      </p>
                    </div>
                    <div data-desk className="relative min-w-0">
                      <PalDock
                        name={c.id}
                        anchor={`${c.id}-anchor`}
                        pose="sit"
                        mood={c.pal.mood}
                        say={c.pal.say}
                        className={
                          i % 2 ? "left-[22%] top-0" : "right-[20%] top-0"
                        }
                      />
                      <c.Desk />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const tapeClass: Record<TapeColor, string> = {
  coral: "bg-coral",
  lime: "bg-lime",
  lilac: "bg-lilac",
  sky: "bg-sky",
  butter: "bg-butter",
  pink: "bg-pink",
  mint: "bg-mint",
};
