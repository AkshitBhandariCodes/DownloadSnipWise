"use client";

import { useMemo, useState } from "react";
import { ArrowCounterClockwise, CopySimple } from "@phosphor-icons/react";
import { copyText } from "@/lib/clipStore";
import { AppWindow } from "../ui";
import { useShortcutField } from "./useShortcutField";

const snippets: Record<string, { label: string; body: string }> = {
  intro: { label: "Intro", body: "Thanks for reaching out! I'm Sam, I run partnerships at Northwind." },
  cal: { label: "Booking link", body: "Grab a time that works: **cal.com/sam/20min**" },
  sig: { label: "Signature", body: "Cheers,\nSam Rivera\nPartnerships, Northwind" },
  cta: { label: "Call to action", body: "Want the full playbook? [Get it free](https://northwind.example/playbook)." },
  tags: { label: "Hashtags", body: "#marketing #growth #buildinpublic" },
};
const flat = Object.fromEntries(Object.entries(snippets).map(([k, v]) => [k, v.body]));

// Just enough Markdown for the demo: paragraphs, line breaks, bold, italic, links.
function mdToHtml(md: string) {
  const esc = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return esc
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map((p) => `<p>${inline(p).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

export function WriterDesk() {
  const { ref: fieldRef, ...field } = useShortcutField(flat, "Hi Jordan,\n\n;intro \n\n;cal \n\n;sig ");
  const [view, setView] = useState<"write" | "html">("write");
  const words = useMemo(() => (field.value.trim() ? field.value.trim().split(/\s+/).length : 0), [field.value]);
  const chars = field.value.length;
  const html = useMemo(() => mdToHtml(field.value), [field.value]);

  return (
    <AppWindow title="Draft  Reply to Jordan" bodyClassName="flex flex-col md:flex-row">
      <aside className="flex gap-1.5 overflow-x-auto border-ink bg-chrome p-3 no-scrollbar md:w-[180px] md:flex-col md:border-r-2 md:p-4">
        <p className="hidden font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3 md:block">Your lines</p>
        {Object.entries(snippets).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setView("write");
              field.insert(k);
            }}
            className={`flex shrink-0 items-center justify-between gap-2 rounded-[9px] border-2 px-2.5 py-1.5 text-left transition-colors md:mt-1 ${
              field.lastExpanded === k ? "border-ink bg-butter" : "border-ink/20 bg-paper hover:border-ink"
            }`}
          >
            <span className="font-mono text-[12.5px] font-bold text-coral-ink">;{k}</span>
            <span className="hidden truncate text-[11.5px] text-ink-3 md:block">{v.label}</span>
          </button>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1 border-b-2 border-hair px-3 py-2">
          {(["write", "html"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-[8px] border-2 px-2.5 py-0.5 text-[12.5px] font-semibold ${
                view === v ? "border-ink bg-butter" : "border-transparent text-ink-2 hover:border-ink"
              }`}
            >
              {v === "write" ? "Markdown" : "As HTML"}
            </button>
          ))}
          <button
            type="button"
            onClick={field.replay}
            className="ml-auto flex items-center gap-1 rounded-[8px] px-2 py-1 text-[11.5px] font-semibold text-ink-3 hover:text-ink"
          >
            <ArrowCounterClockwise size={13} weight="bold" />
            replay
          </button>
        </div>

        <label className={view === "write" ? "block" : "hidden"}>
          <span className="sr-only">Email draft. Type a ;shortcut and a space.</span>
          <textarea
            ref={fieldRef}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className="h-[300px] w-full resize-none bg-transparent p-4 text-[15px] leading-relaxed text-ink outline-none md:h-[330px]"
          />
        </label>
        {view === "html" && (
          <pre className="h-[300px] overflow-auto whitespace-pre-wrap p-4 font-mono text-[12px] leading-relaxed text-ink-2 md:h-[330px]">{html}</pre>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t-2 border-hair px-4 py-2.5 text-[12px] font-semibold text-ink-3">
          <span>{words} words</span>
          <span>{chars} characters</span>
          <span className={chars > 280 ? "text-coral-ink" : ""}>{chars > 280 ? `${chars - 280} over a post` : `${280 - chars} left for a post`}</span>
          <button
            type="button"
            onClick={() => copyText(view === "html" ? html : field.value)}
            className="btn btn-paper btn-sm ml-auto !h-8"
          >
            <CopySimple size={14} weight="bold" />
            Copy {view === "html" ? "HTML" : "text"}
          </button>
        </div>
      </div>
    </AppWindow>
  );
}
