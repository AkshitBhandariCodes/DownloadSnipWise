"use client";

import { SunIcon } from "mochi-icons/SunIcon";
import { CloudMoonIcon } from "mochi-icons/CloudMoonIcon";
import { prefersReducedMotion } from "@/lib/gsap";
import { palSay } from "@/lib/palBus";

/**
 * Day / night switch. The theme lives on <html class="dark">, set before paint
 * by the inline script in the layout, so this renders the same markup on the
 * server and client and lets CSS pick the knob position.
 */
export function ThemeToggle() {
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const html = document.documentElement;
    const next = !html.classList.contains("dark");
    const apply = () => {
      html.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {}
    };

    if (!document.startViewTransition || prefersReducedMotion()) {
      apply();
    } else {
      // The new theme grows out of the switch as a circle.
      const r = e.currentTarget.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const t = document.startViewTransition(apply);
      t.ready.then(() =>
        html.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(.7,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
        ),
      );
    }
    palSay(next ? "lights off!" : "good morning!", next ? "shy" : "happy");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      title="Day / night"
      className="relative h-10 w-[66px] shrink-0 rounded-full border-2 border-ink bg-sky transition-colors duration-300 dark:bg-lilac"
    >
      {/* Tiny stars that only come out at night. */}
      <span aria-hidden className="absolute left-2.5 top-2 h-1 w-1 rounded-full bg-ink opacity-0 transition-opacity dark:opacity-100" />
      <span aria-hidden className="absolute left-4 top-[22px] h-[3px] w-[3px] rounded-full bg-ink opacity-0 transition-opacity delay-100 dark:opacity-100" />
      <span
        aria-hidden
        className="absolute left-[3px] top-[3px] grid h-[30px] w-[30px] place-items-center rounded-full border-2 border-ink bg-paper transition-transform duration-500 ease-[cubic-bezier(.3,1.5,.5,1)] dark:translate-x-[26px] dark:rotate-[360deg]"
      >
        <span className="dark:hidden">
          <SunIcon size={22} aria-hidden />
        </span>
        <span className="hidden dark:block">
          <CloudMoonIcon size={22} aria-hidden />
        </span>
      </span>
    </button>
  );
}
