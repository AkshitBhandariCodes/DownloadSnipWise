"use client";

// Anything on the page can make the pal react: palSay("ooh", "love").
export type Mood = "wave" | "happy" | "love" | "focus" | "think" | "wow" | "shy" | "smug" | "excited" | "sleep" | "dizzy";

export type PalEvent = { text: string; mood?: Mood };

export function palSay(text: string, mood?: Mood) {
  window.dispatchEvent(new CustomEvent<PalEvent>("pal:say", { detail: { text, mood } }));
}
