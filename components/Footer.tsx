"use client";

import { GithubIcon } from "mochi-icons/GithubIcon";
import { XIcon } from "mochi-icons/XIcon";
import { site, releasesUrl } from "@/content/site";
import { scrollToTarget } from "./motion/SmoothScroll";
import { Container, Logo } from "./ui";
import { PalDock } from "./pal/PalGuide";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Use cases", href: "#use-cases" },
      { label: "Features", href: "#features" },
      { label: "Compare", href: "#compare" },
      { label: "Download", href: "#download" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Release notes", href: releasesUrl },
      { label: "Request a feature", href: `https://github.com/${site.links.feedbackRepo}/issues/new` },
      { label: "Sponsor", href: site.links.sponsorMonthly },
      { label: "Product Hunt", href: site.links.productHunt },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t-2 border-ink bg-paper">
      <Container className="grid grid-cols-1 gap-10 pt-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink-2">
            {site.tagline} A local-first clipboard for Windows, with a pal.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="grid h-11 w-11 place-items-center rounded-[12px] border-2 border-ink bg-paper transition-transform hover:-translate-y-0.5"
            >
              <GithubIcon size={26} aria-hidden />
            </a>
            <a
              href={site.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="grid h-11 w-11 place-items-center rounded-[12px] border-2 border-ink bg-paper transition-transform hover:-translate-y-0.5"
            >
              <XIcon size={26} aria-hidden />
            </a>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => {
                const isHash = l.href.startsWith("#");
                return (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={
                        isHash
                          ? (e) => {
                              e.preventDefault();
                              scrollToTarget(l.href);
                            }
                          : undefined
                      }
                      target={isHash ? undefined : "_blank"}
                      rel={isHash ? undefined : "noopener noreferrer"}
                      className="text-[15px] font-semibold text-ink-2 underline-offset-4 hover:text-ink hover:underline"
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Container>

      {/* Giant wordmark. The pal ends its trip asleep on top of it. */}
      <div className="relative mt-14 select-none">
        <div className="relative mx-auto w-fit">
          <PalDock name="footer" pose="sleep" mood="sleep" className="left-[72%] top-[21%]" say={["zzz", "five more minutes", "see you on Win+V"]} />
          <p aria-hidden className="display translate-y-[18%] whitespace-nowrap text-center text-[25vw] leading-[0.8] tracking-[-0.06em] text-ink">
            SnipWise
          </p>
        </div>
      </div>
      <div className="relative border-t-2 border-ink bg-butter">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-3 text-[12.5px] font-semibold">
          <span>
            Built by{" "}
            <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-[3px] hover:text-coral-ink">
              Akshit Bhandari
            </a>
          </span>
          <span>&copy; 2026 SnipWise</span>
        </Container>
      </div>
    </footer>
  );
}
