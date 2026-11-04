"use client";

import { useMemo, useRef, useState } from "react";
import { MagnifyingGlass, ArrowElbowDownLeft, CopySimple } from "@phosphor-icons/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { copyText, useCaptured, type ClipKind } from "@/lib/clipStore";
import { AppWindow, Container, Kbd, KindTag } from "./ui";
import { PalDock } from "./pal/PalGuide";

type Row = { id: string; title: string; text: string; kind: ClipKind; source: string; mine?: boolean; when: string };

const samples: Row[] = [
  { id: "s1", title: "Code review prompt", text: "Review this diff for bugs and edge cases. Most severe first.", kind: "text", source: "ChatGPT", when: "2m" },
  { id: "s2", title: "Deploy command", text: "docker compose up -d --build api", kind: "code", source: "Terminal", when: "14m" },
  { id: "s3", title: "Brand coral", text: "#FF5A36", kind: "color", source: "Figma", when: "1h" },
  { id: "s4", title: "Design review", text: "figma.com/file/q4-launch", kind: "link", source: "Edge", when: "3h" },
  { id: "s5", title: "Support reply", text: "Thanks for the report! A fix ships in the next build.", kind: "text", source: "Outlook", when: "yesterday" },
];

const filters: ("all" | ClipKind)[] = ["all", "text", "code", "link", "color"];

/**
 * The live Quick Dock under the hero. Anything the visitor copies on the page
 * lands at the top, tagged "this page". Clicking a row copies it back.
 */
export function HeroDock() {
  const root = useRef<HTMLDivElement>(null);
  const captured = useCaptured();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [flash, setFlash] = useState<string | null>(null);

  const rows = useMemo<Row[]>(() => {
    const mine = captured.map((c) => ({
      id: `c${c.id}`,
      title: c.kind === "color" ? "Color from this page" : c.kind === "link" ? "Link from this page" : "Copied from this page",
      text: c.text,
      kind: c.kind,
      source: "This page",
      mine: true,
      when: "now",
    }));
    const all = [...mine, ...samples.filter((s) => !captured.some((c) => c.text === s.text))];
    const needle = q.trim().toLowerCase();
    return all
      .filter((r) => filter === "all" || r.kind === filter)
      .filter((r) => !needle || `${r.title} ${r.text} ${r.source}`.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [captured, q, filter]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // The window rises and flattens as it scrolls in.
      gsap.fromTo(
        "[data-dock-window]",
        { rotateX: 28, scale: 0.84, y: 60, transformPerspective: 1600, transformOrigin: "50% 0%" },
        {
          rotateX: 0,
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 30%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  // New captures pop in.
  useGSAP(
    () => {
      if (!captured.length || prefersReducedMotion()) return;
      gsap.from("[data-row-mine='true']:first-child", { x: -30, scale: 0.9, opacity: 0, duration: 0.6, ease: "back.out(2)" });
    },
    { scope: root, dependencies: [captured.length] },
  );

  const use = (r: Row) => {
    copyText(r.text);
    setFlash(r.id);
    setTimeout(() => setFlash(null), 900);
  };

  return (
    <div ref={root} id="dock" className="relative mt-16 pb-24 md:mt-20 md:pb-32">
      <Container className="max-w-[1000px]">
        <div data-dock-window className="relative">
          <PalDock name="dock" pose="sit" mood="happy" className="right-[18%] top-0" say={["I'll hold onto that", "copy anything here", "I never forget"]} />
          <AppWindow
            title="SnipWise  Quick Dock"
            icon={
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/brand/pal.png" alt="" width={14} height={17} className="pixelated" />
            }
            bodyClassName="grid grid-cols-1 md:grid-cols-[1fr_300px]"
          >
            <div className="min-w-0 border-ink md:border-r-2">
              <div className="flex items-center gap-2 border-b-2 border-hair px-4 py-3">
                <MagnifyingGlass size={18} weight="bold" className="text-ink-3" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search everything you copied"
                  aria-label="Search clips"
                  className="h-8 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-ink-3"
                />
                <span className="hidden items-center gap-1 sm:flex">
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Shift</Kbd>
                  <Kbd>V</Kbd>
                </span>
              </div>
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pt-3">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`shrink-0 rounded-full border-2 border-ink px-3 py-0.5 text-[12.5px] font-semibold capitalize transition-colors ${
                      filter === f ? "bg-ink text-paper" : "bg-paper hover:bg-butter"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <ul className="min-h-[338px] p-3">
                {rows.map((r) => (
                  <li key={r.id} data-row-mine={r.mine ? "true" : "false"}>
                    <button
                      type="button"
                      onClick={() => use(r)}
                      className={`group flex w-full items-center gap-3 rounded-[12px] border-2 px-3 py-2.5 text-left transition-colors ${
                        r.mine ? "border-ink bg-butter/60" : "border-transparent hover:border-ink hover:bg-paper"
                      } ${flash === r.id ? "!bg-lime" : ""}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[14px] font-semibold">{r.title}</span>
                          <KindTag kind={r.kind} />
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 truncate font-mono text-[12px] text-ink-2">
                          {r.kind === "color" && /^#/.test(r.text) && (
                            <span className="h-3 w-3 shrink-0 rounded-[3px] border-[1.5px] border-ink" style={{ background: r.text }} />
                          )}
                          <span className="truncate">{r.text}</span>
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-[11.5px] font-medium text-ink-3">
                        <span className="block">{r.source}</span>
                        <span className="block">{flash === r.id ? "copied" : r.when}</span>
                      </span>
                      <ArrowElbowDownLeft size={16} weight="bold" className="hidden shrink-0 text-ink-3 group-hover:block" />
                    </button>
                  </li>
                ))}
                {rows.length === 0 && (
                  <li className="grid h-[300px] place-items-center text-center text-[14px] text-ink-3">
                    Nothing matches “{q}”. Try “deploy” or “#”.
                  </li>
                )}
              </ul>
            </div>

            {/* Hint panel. */}
            <div className="dots hidden flex-col justify-between gap-6 bg-chrome p-6 md:flex">
              <div>
                <p className="font-pixel text-[15px] text-coral-ink">try it</p>
                <p className="mt-2 text-[22px] font-[760] leading-[1.1] tracking-[-0.03em]">
                  Copy anything on this page. It lands here.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
                  Select some text, press <Kbd>Ctrl</Kbd> <Kbd>C</Kbd>, and watch the list. Click any row to copy it back.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyText("Hello from SnipWise!")}
                className="btn btn-paper btn-sm w-fit"
              >
                <CopySimple size={15} weight="bold" />
                Copy a sample
              </button>
              <p className="text-[12px] leading-relaxed text-ink-3">
                Stays in this tab. Nothing you copy here is stored or sent anywhere.
              </p>
            </div>
          </AppWindow>
          {/* Taskbar shelf under the window. */}
          <div aria-hidden className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-[14px] border-2 border-ink bg-paper/80 px-3 py-2 shadow-[3px_3px_0_var(--ink)]">
            {["bg-sky", "bg-lime", "bg-pink", "bg-butter"].map((c) => (
              <span key={c} className={`h-6 w-6 rounded-[7px] border-2 border-ink ${c}`} />
            ))}
            <span className="ml-1 font-mono text-[11px] font-semibold text-ink-2">SnipWise is running</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
