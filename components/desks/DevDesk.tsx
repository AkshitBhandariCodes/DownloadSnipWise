"use client";

import { useState } from "react";
import { ArrowCounterClockwise, PaperPlaneRight } from "@phosphor-icons/react";
import { AppWindow } from "../ui";
import { useShortcutField } from "./useShortcutField";

const code: Record<string, { label: string; body: string }> = {
  bfs: {
    label: "BFS on a grid",
    body: `q = deque([(0, 0, 0)])
        seen = {(0, 0)}
        while q:
            r, c, d = q.popleft()
            if (r, c) == target:
                return d
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in seen:
                    seen.add((nr, nc))
                    q.append((nr, nc, d + 1))
        return -1`,
  },
  dsu: {
    label: "Union find",
    body: `parent = list(range(n))
        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        def union(a, b):
            parent[find(a)] = find(b)`,
  },
  bsearch: {
    label: "Binary search",
    body: `lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return lo`,
  },
};

const prompts: Record<string, { label: string; body: string }> = {
  review: {
    label: "Code review",
    body: "Review this code for bugs, edge cases and unclear names. Reply with a numbered list, most severe first, and show the fix for each.",
  },
  explain: {
    label: "Explain simply",
    body: "Explain what this code does to someone new to the codebase. Start with one sentence, then walk through it step by step.",
  },
  commit: {
    label: "Commit message",
    body: "Write a conventional commit message for this diff. Subject under 60 characters, then a short body that says why.",
  },
};

const flat = (o: Record<string, { body: string }>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.body]));
const codeSnips = flat(code);
const promptSnips = flat(prompts);

function Sidebar({
  groups,
  onPick,
  last,
}: {
  groups: { title: string; items: Record<string, { label: string }> }[];
  onPick: (k: string) => void;
  last: string | null;
}) {
  return (
    <aside className="flex gap-4 overflow-x-auto border-snow/15 p-3 no-scrollbar md:w-[190px] md:flex-col md:gap-5 md:border-r-2 md:p-4">
      {groups.map((g) => (
        <div key={g.title} className="shrink-0">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-snow/45">
            {g.title}
          </p>
          <ul className="mt-2 flex gap-1.5 md:flex-col">
            {Object.entries(g.items).map(([k, v]) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => onPick(k)}
                  className={`group flex w-full items-center justify-between gap-3 rounded-[9px] border-2 px-2.5 py-1.5 text-left transition-colors ${
                    last === k
                      ? "border-lime bg-lime/15"
                      : "border-snow/15 hover:border-snow/50"
                  }`}
                >
                  <span className="font-mono text-[12.5px] font-semibold text-[#d6f57e]">
                    ;{k}
                  </span>
                  <span className="hidden truncate text-[11.5px] text-snow/60 md:block">
                    {v.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

export function DevDesk() {
  const [tab, setTab] = useState<"code" | "chat">("code");
  const { ref: editorRef, ...editor } = useShortcutField(
    codeSnips,
    "class Solution:\n    def shortestPath(self, grid, target):\n        R, C = len(grid), len(grid[0])\n        ;bfs ",
  );
  const { ref: chatRef, ...chat } = useShortcutField(promptSnips, ";review ");

  return (
    <AppWindow
      dark
      title={tab === "code" ? "solution.py  LeetCode" : "New chat"}
      bodyClassName="flex flex-col md:flex-row"
    >
      <Sidebar
        groups={[
          { title: "Templates", items: code },
          { title: "Prompts", items: prompts },
        ]}
        last={tab === "code" ? editor.lastExpanded : chat.lastExpanded}
        onPick={(k) => {
          if (k in code) {
            setTab("code");
            editor.insert(k);
          } else {
            setTab("chat");
            setTimeout(() => chat.insert(k), 30);
          }
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1 border-b-2 border-snow/15 px-3 pt-2">
          {(["code", "chat"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-t-[8px] px-3 py-1.5 font-mono text-[12px] font-semibold ${
                tab === t
                  ? "bg-snow/10 text-snow"
                  : "text-snow/50 hover:text-snow"
              }`}
            >
              {t === "code" ? "solution.py" : "prompt"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => (tab === "code" ? editor.replay() : chat.replay())}
            className="ml-auto flex items-center gap-1 rounded-[8px] px-2 py-1 text-[11.5px] font-semibold text-snow/55 hover:text-snow"
          >
            <ArrowCounterClockwise size={13} weight="bold" />
            replay
          </button>
        </div>

        <label
          className={`relative flex-1 ${tab === "code" ? "block" : "hidden"}`}
        >
          <span className="sr-only">
            Code editor. Type a ;shortcut and a space.
          </span>
          <textarea
            ref={editorRef}
            value={editor.value}
            onChange={(e) => editor.onChange(e.target.value)}
            spellCheck={false}
            className="h-[330px] w-full resize-none bg-transparent [scrollbar-width:thin] p-4 font-mono text-[12.5px] leading-[1.65] text-[#e9e3f5] outline-none md:h-[360px]"
          />
        </label>
        <div
          className={`h-[330px] flex-col justify-end gap-3 p-4 md:h-[360px] ${tab === "chat" ? "flex" : "hidden"}`}
        >
          <p className="text-center text-[13px] text-snow/45">
            Type ;review, ;explain or ;commit, then a space.
          </p>
          <div className="rounded-[14px] border-2 border-snow/25 bg-snow/5 p-3">
            <label>
              <span className="sr-only">Prompt box</span>
              <textarea
                ref={chatRef}
                value={chat.value}
                onChange={(e) => chat.onChange(e.target.value)}
                rows={4}
                placeholder="Message"
                className="w-full resize-none bg-transparent text-[14px] leading-relaxed text-snow outline-none placeholder:text-snow/40"
              />
            </label>
            <div className="flex justify-end">
              <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-lime text-ink">
                <PaperPlaneRight size={15} weight="fill" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
