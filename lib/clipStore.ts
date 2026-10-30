"use client";

// What the visitor copies on this page, kept in memory only (never stored or sent).
// The hero dock, the nav counter and the pal all read from here.
import { useSyncExternalStore } from "react";

export type ClipKind = "text" | "code" | "link" | "color";
export type Captured = { id: number; text: string; kind: ClipKind; at: number };

let items: Captured[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function detectKind(text: string): ClipKind {
  const t = text.trim();
  if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t) || /^(rgb|hsl|oklch)a?\(/i.test(t)) return "color";
  if (/^(https?:\/\/|www\.)\S+$/i.test(t) || /^[\w-]+\.[a-z]{2,}(\/\S*)?$/i.test(t)) return "link";
  if (/[{};=]|=>|^\s*(git|npm|npx|docker|cd|curl|def|const|let|import|SELECT)\b/m.test(t)) return "code";
  return "text";
}

export function capture(text: string) {
  const t = text.trim();
  if (!t) return;
  // Re-copying an existing clip moves it to the top instead of duplicating it.
  items = [{ id: nextId++, text: t.slice(0, 400), kind: detectKind(t), at: Date.now() }, ...items.filter((i) => i.text !== t)].slice(0, 12);
  emit();
  window.dispatchEvent(new CustomEvent("snip:captured", { detail: t }));
}

/** Copy to the real clipboard and record it, the way SnipWise would. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* Clipboard can be blocked (iframes, permissions); still show the capture. */
  }
  capture(text);
}

let installed = false;
export function installCopyListener() {
  if (installed || typeof document === "undefined") return;
  installed = true;
  document.addEventListener("copy", () => {
    const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    let text = "";
    if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT") && active.selectionStart !== null) {
      text = active.value.slice(active.selectionStart, active.selectionEnd ?? undefined);
    } else {
      text = document.getSelection()?.toString() ?? "";
    }
    capture(text);
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const empty: Captured[] = [];
export const useCaptured = () => useSyncExternalStore(subscribe, () => items, () => empty);
