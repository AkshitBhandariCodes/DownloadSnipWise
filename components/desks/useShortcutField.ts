"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { palSay } from "@/lib/palBus";

const TRIGGER = /;([a-z0-9-]+)[ \n]$/i;

/**
 * A text field that behaves like SnipWise inline shortcuts: typing `;name`
 * followed by a space swaps the trigger for the saved snippet, typed out fast.
 * `intro` is auto-typed once the field scrolls into view, until the visitor
 * takes over.
 */
export function useShortcutField(snippets: Record<string, string>, intro: string) {
  const [value, setValue] = useState("");
  const [lastExpanded, setLastExpanded] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const valueRef = useRef("");
  const touched = useRef(false);
  const alive = useRef(true);
  const ref = useRef<HTMLTextAreaElement>(null);

  const set = (v: string) => {
    valueRef.current = v;
    setValue(v);
  };

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  // Types `text` after `base`, then calls `done`.
  const typeOut = useCallback((base: string, text: string, speed: number, done?: () => void) => {
    stop();
    if (prefersReducedMotion()) {
      set(base + text);
      done?.();
      return;
    }
    let i = 0;
    timer.current = setInterval(() => {
      i = Math.min(text.length, i + speed);
      set(base + text.slice(0, i));
      if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
      if (i >= text.length) {
        stop();
        done?.();
      }
    }, 16);
  }, []);

  const tryExpand = useCallback(
    (v: string) => {
      const m = v.match(TRIGGER);
      if (!m) return false;
      const key = m[1].toLowerCase();
      const snip = snippets[key];
      if (!snip) return false;
      const before = v.slice(0, v.length - m[0].length);
      setLastExpanded(key);
      palSay(`;${key}!`, "focus");
      typeOut(before, snip, 5);
      return true;
    },
    [snippets, typeOut],
  );

  // Auto-type the intro one character at a time, expanding triggers on the way.
  const playIntro = useCallback(() => {
    if (touched.current) return;
    stop();
    set("");
    const run = (base: string, rest: string) => {
      let j = 0;
      const tick = () => {
        if (touched.current || !alive.current || j >= rest.length) return;
        j += 1;
        const v = base + rest.slice(0, j);
        set(v);
        const m = v.match(TRIGGER);
        const key = m?.[1].toLowerCase();
        if (m && key && snippets[key]) {
          const before = v.slice(0, v.length - m[0].length);
          setLastExpanded(key);
          typeOut(before, snippets[key], 5, () => setTimeout(() => run(before + snippets[key], rest.slice(j)), 450));
          return;
        }
        setTimeout(tick, 45);
      };
      setTimeout(tick, 300);
    };
    run("", intro);
  }, [intro, snippets, typeOut]);

  // Start the intro the first time the field is mostly on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    alive.current = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          playIntro();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      alive.current = false;
      stop();
    };
  }, [playIntro]);

  const onChange = (v: string) => {
    touched.current = true;
    stop();
    set(v);
    tryExpand(v);
  };

  /** Insert `;key ` at the caret end, as if typed, and expand it. */
  const insert = (key: string) => {
    touched.current = true;
    stop();
    const base = valueRef.current + (valueRef.current && !/\s$/.test(valueRef.current) ? " " : "");
    typeOut(base, `;${key} `, 1, () => tryExpand(base + `;${key} `));
    ref.current?.focus();
  };

  const replay = () => {
    touched.current = false;
    playIntro();
  };

  return { value, onChange, insert, replay, ref, lastExpanded, setValue: (v: string) => ((touched.current = true), stop(), set(v)) };
}
