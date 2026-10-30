"use client";

import { useMemo, useState } from "react";
import { CopySimple, Check, Plus, ArrowUpRight } from "@phosphor-icons/react";
import { colorFormats, colorFriends } from "@/lib/converters";
import { copyText } from "@/lib/clipStore";
import { palSay } from "@/lib/palBus";
import { AppWindow } from "../ui";

type Tab = "colors" | "fonts" | "inspo";

const palette = [
  { name: "Brand coral", hex: "#FF5A36" },
  { name: "Lavender", hex: "#B69CFF" },
  { name: "Pine", hex: "#1F8A70" },
  { name: "Sun", hex: "#FFD23F" },
  { name: "Ink", hex: "#17121F" },
];

const fonts = [
  { name: "Bricolage Grotesque", family: "var(--font-bricolage)", note: "Display, 760", weight: 760 },
  { name: "Geist Mono", family: "var(--font-geist-mono)", note: "Code and labels", weight: 500 },
  { name: "Pixelify Sans", family: "var(--font-pixelify)", note: "Little pixel accents", weight: 500 },
  { name: "Segoe UI", family: '"Segoe UI", system-ui', note: "Windows system font", weight: 600 },
];

// Saved references. The thumbnails are drawn with CSS, standing in for the screenshots SnipWise keeps.
const inspo = [
  { title: "Sticker hero", url: "godly.website/website/sticker-hero", tags: ["hero", "playful"], art: ["bg-butter", "bg-coral", "bg-lilac"] },
  { title: "Pricing with toggles", url: "land-book.com/websites/pricing", tags: ["pricing"], art: ["bg-sky", "bg-paper", "bg-lime"] },
  { title: "Onboarding flow", url: "mobbin.com/flows/onboarding", tags: ["mobile", "ux"], art: ["bg-mint", "bg-pink", "bg-paper"] },
  { title: "Bento features", url: "siteinspire.com/websites/bento", tags: ["layout"], art: ["bg-lilac", "bg-butter", "bg-sky"] },
];

function CopyRow({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        copyText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1100);
      }}
      className="group flex w-full items-center gap-3 rounded-[10px] border-2 border-ink bg-paper px-3 py-2 text-left transition-transform hover:-translate-y-0.5 active:translate-y-0"
    >
      <span className="w-[66px] shrink-0 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">{label}</span>
      <span className="min-w-0 flex-1 truncate font-mono text-[13px] font-semibold">{value}</span>
      {done ? <Check size={15} weight="bold" className="text-[#1F8A70]" /> : <CopySimple size={15} weight="bold" className="text-ink-3 group-hover:text-ink" />}
    </button>
  );
}

export function DesignDesk() {
  const [tab, setTab] = useState<Tab>("colors");
  const [colors, setColors] = useState(palette);
  const [hex, setHex] = useState(palette[0].hex);
  const formats = useMemo(() => colorFormats(hex), [hex]);
  const friends = useMemo(() => colorFriends(hex), [hex]);

  const pick = (h: string) => {
    setHex(h.toUpperCase());
    palSay(h.toUpperCase() === "#FF5A36" ? "my colour!" : "ooh, nice", "love");
  };

  return (
    <AppWindow title="SnipWise  Design folder" bodyClassName="flex min-h-[420px] flex-col">
      <div className="flex gap-1 border-b-2 border-ink bg-chrome px-3 py-2">
        {(
          [
            ["colors", "Colors"],
            ["fonts", "Fonts"],
            ["inspo", "Inspiration"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-[9px] border-2 px-3 py-1 text-[13px] font-semibold transition-colors ${
              tab === id ? "border-ink bg-pink" : "border-transparent hover:border-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "colors" && (
        <div className="grid flex-1 grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-3">
            <div
              className="relative grid min-h-[150px] flex-1 place-items-end rounded-[14px] border-2 border-ink p-3 transition-colors duration-300"
              style={{ background: hex }}
            >
              <span className="rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 font-mono text-[12px] font-bold">{hex}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c.hex + c.name}
                  type="button"
                  title={`${c.name} ${c.hex}`}
                  aria-label={`${c.name} ${c.hex}`}
                  onClick={() => pick(c.hex)}
                  className={`h-9 w-9 rounded-[10px] border-2 border-ink transition-transform hover:-translate-y-1 ${
                    hex === c.hex.toUpperCase() ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
              <label className="grid h-9 w-9 cursor-pointer place-items-center rounded-[10px] border-2 border-dashed border-ink text-ink-2 hover:bg-butter" title="Add your own">
                <Plus size={16} weight="bold" />
                <input
                  type="color"
                  className="sr-only"
                  aria-label="Add a colour"
                  onChange={(e) => {
                    const h = e.target.value.toUpperCase();
                    setColors((cs) => [...cs.slice(-5), { name: "Yours", hex: h }]);
                    setHex(h);
                  }}
                />
              </label>
            </div>
            <div>
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">Goes well with</p>
              <div className="mt-1.5 flex gap-2">
                {friends.map((f, i) => (
                  <button
                    key={f + i}
                    type="button"
                    onClick={() => pick(f)}
                    className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper py-0.5 pl-0.5 pr-2 font-mono text-[11px] font-semibold"
                  >
                    <span className="h-4 w-4 rounded-full border-[1.5px] border-ink" style={{ background: f }} />
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">Copy it as</p>
            {formats.map((f) => (
              <CopyRow key={f.label} label={f.label} value={f.value} />
            ))}
            <p className="mt-auto text-[12px] leading-relaxed text-ink-3">Copy one hex code and SnipWise gives you every format.</p>
          </div>
        </div>
      )}

      {tab === "fonts" && (
        <ul className="grid flex-1 content-start gap-2 p-4">
          {fonts.map((f) => (
            <li key={f.name}>
              <button
                type="button"
                onClick={() => {
                  copyText(`font-family: "${f.name}";`);
                  palSay("good taste", "smug");
                }}
                className="group flex w-full items-center gap-4 rounded-[12px] border-2 border-ink bg-paper px-4 py-3 text-left transition-transform hover:-translate-y-0.5"
              >
                <span className="w-14 shrink-0 text-[34px] leading-none" style={{ fontFamily: f.family, fontWeight: f.weight }}>
                  Aa
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-semibold" style={{ fontFamily: f.family, fontWeight: f.weight }}>
                    {f.name}
                  </span>
                  <span className="block text-[12px] text-ink-3">{f.note}</span>
                </span>
                <span className="hidden font-mono text-[11px] font-semibold text-ink-3 group-hover:block">copy CSS</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {tab === "inspo" && (
        <ul className="grid flex-1 grid-cols-1 content-start gap-3 p-4 sm:grid-cols-2">
          {inspo.map((s) => (
            <li key={s.url}>
              <button
                type="button"
                onClick={() => copyText(`https://${s.url}`)}
                className="group w-full overflow-hidden rounded-[12px] border-2 border-ink bg-paper text-left transition-transform hover:-translate-y-0.5 hover:rotate-[-0.6deg]"
              >
                {/* Mini page: nav bar, hero block, two cards. */}
                <span className={`block h-[86px] border-b-2 border-ink p-2 ${s.art[1]}`}>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-6 rounded-full bg-ink/70" />
                    <span className="ml-auto h-1.5 w-4 rounded-full bg-ink/30" />
                    <span className="h-1.5 w-4 rounded-full bg-ink/30" />
                  </span>
                  <span className={`mt-2 block h-6 w-3/4 rounded-[5px] border-[1.5px] border-ink ${s.art[0]}`} />
                  <span className="mt-1.5 flex gap-1.5">
                    <span className={`h-5 flex-1 rounded-[4px] border-[1.5px] border-ink ${s.art[2]}`} />
                    <span className={`h-5 flex-1 rounded-[4px] border-[1.5px] border-ink ${s.art[0]}`} />
                  </span>
                </span>
                <span className="block p-2.5">
                  <span className="flex items-center justify-between text-[13px] font-semibold">
                    {s.title}
                    <ArrowUpRight size={13} weight="bold" className="text-ink-3" />
                  </span>
                  <span className="block truncate font-mono text-[11px] text-ink-3">{s.url}</span>
                  <span className="mt-1.5 flex gap-1">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-full bg-ink/[0.07] px-1.5 py-[1px] text-[10.5px] font-semibold text-ink-2">
                        #{t}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </AppWindow>
  );
}
