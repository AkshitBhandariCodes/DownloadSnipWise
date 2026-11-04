"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { features, type Feature } from "@/content/features";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { previews } from "./previews/Previews";
import { Container, SectionHeading, type TapeColor } from "./ui";
import { PalDock } from "./pal/PalGuide";

const surface: Record<TapeColor, string> = {
  coral: "bg-coral/25",
  lime: "bg-lime/55",
  lilac: "bg-lilac/60",
  sky: "bg-sky/60",
  butter: "bg-butter/60",
  pink: "bg-pink/60",
  mint: "bg-mint/70",
};
const chip: Record<TapeColor, string> = {
  coral: "bg-coral/30",
  lime: "bg-lime",
  lilac: "bg-lilac",
  sky: "bg-sky",
  butter: "bg-butter",
  pink: "bg-pink",
  mint: "bg-mint",
};

function Card({ f, onPlay }: { f: Feature; onPlay: (f: Feature) => void }) {
  const Preview = previews[f.id];
  return (
    <article className="group sticker flex h-full flex-col !rounded-[22px] p-2.5 transition-transform duration-300 ease-[cubic-bezier(.3,1.4,.5,1)] hover:-translate-y-1.5 hover:rotate-[-0.6deg]">
      {/* Tiny preview, or the recorded clip once it exists. */}
      <div className={`dots relative h-[188px] overflow-hidden rounded-[15px] border-2 border-ink ${surface[f.color]}`}>
        {f.video ? (
          <video
            src={f.video}
            poster={f.poster}
            muted
            loop
            playsInline
            autoPlay={!prefersReducedMotion()}
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          Preview ? <Preview /> : null
        )}
        <span className="absolute right-2.5 top-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ink/60">{f.corner}</span>
        {f.soon && (
          <span className="tape absolute left-2.5 top-2.5 bg-butter !py-0.5 text-[10px]" style={{ rotate: "-4deg" }}>
            soon
          </span>
        )}
        {f.video && (
          <button
            type="button"
            onClick={() => onPlay(f)}
            className="btn btn-paper btn-sm absolute bottom-2.5 left-2.5 !h-8"
            aria-label={`Watch ${f.name}`}
          >
            <Play size={13} weight="fill" />
            Watch
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-1.5 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[22px] font-[760] leading-tight tracking-[-0.03em]">{f.name}</h3>
          <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            No.{f.no} · {f.verb}
          </span>
        </div>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{f.body}</p>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {f.tags.map((t) => (
            <span key={t} className={`rounded-[7px] border-[1.5px] border-ink ${chip[f.color]} px-2 py-0.5 text-[11.5px] font-bold`}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Lightbox({ f, onClose }: { f: Feature; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto w-[min(960px,92vw)] overflow-visible bg-transparent p-0 backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="sticker overflow-hidden !rounded-[20px]">
        <div className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5">
          <span className="text-[15px] font-bold">{f.name}</span>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close video" className="grid h-8 w-8 place-items-center rounded-[9px] border-2 border-ink">
            <X size={14} weight="bold" />
          </button>
        </div>
        {f.video && <video src={f.video} poster={f.poster} controls autoPlay playsInline className="block aspect-video w-full bg-ink" />}
      </div>
    </dialog>
  );
}

export function FeatureGallery() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState<Feature | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Cards deal onto the table row by row.
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card, i) => {
        gsap.from(card, {
          y: 90,
          rotate: gsap.utils.random(-7, 7),
          scale: 0.9,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.4)",
          delay: (i % 3) * 0.09,
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="features" className="relative py-24 md:py-32">
      <Container>
        <div className="relative">
          <SectionHeading
            tape="Everything in the box"
            tapeColor="lilac"
            title={
              <>
                Eleven tiny tools.
                <br />
                One clipboard.
              </>
            }
            sub="Each one solves a small daily annoyance. Copy a strip at the bottom of any card and it lands in your dock up top."
          />
        </div>
        <div className="relative mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <PalDock name="features" pose="sit" mood="wow" className="left-[22%] top-0 sm:left-[38%] lg:left-[26%]" say={["look at all this", "twelve! I counted", "copy a strip"]} />
          {features.map((f) => (
            <div key={f.id} data-card>
              <Card f={f} onPlay={setPlaying} />
            </div>
          ))}
        </div>
      </Container>
      {playing && <Lightbox f={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
