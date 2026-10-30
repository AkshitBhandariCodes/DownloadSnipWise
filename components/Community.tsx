"use client";

import { useState } from "react";
import { ArrowUpRight, HandHeart, Coffee } from "@phosphor-icons/react";
import { BulbIcon } from "mochi-icons/BulbIcon";
import { GiftIcon } from "mochi-icons/GiftIcon";
import { site } from "@/content/site";
import { palSay } from "@/lib/palBus";
import { Container, SectionHeading } from "./ui";

/**
 * Feature requests open a prefilled GitHub issue, so they need no backend.
 * Swap `openIssue` for a real endpoint (GitHub Discussions, a database) later.
 */
function openIssue(title: string, details: string) {
  const params = new URLSearchParams({
    title: `Feature request: ${title}`,
    body: `${details}\n\n_Sent from snipwise.akshitbhandari.codes_`,
    labels: "feature request",
  });
  window.open(`https://github.com/${site.links.feedbackRepo}/issues/new?${params}`, "_blank", "noopener");
}

const ideas = ["A Mac version", "Browser extension", "Snippet variables", "More pal outfits"];

export function Community() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          tape="Community"
          tapeColor="mint"
          title="Shape what comes next."
          sub="SnipWise is built by one developer, in the open. Tell me what you need, or help keep it free."
        />
        <div className="mx-auto mt-16 grid max-w-[1040px] grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr]">
          {/* Sticky note request form. */}
          <form
            data-reveal="left"
            className="relative flex flex-col gap-4 rounded-[6px] border-2 border-ink bg-butter p-6 shadow-[6px_6px_0_var(--ink)] md:rotate-[-1.2deg] md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) {
                setError("Give your idea a short title.");
                return;
              }
              setError("");
              palSay("ooh, good idea", "think");
              openIssue(title.trim(), details.trim());
            }}
          >
            <span className="tape absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 bg-paper/80 !p-0" style={{ rotate: "-2deg" }} />
            <div className="flex items-center gap-3">
              <BulbIcon size={40} aria-hidden />
              <h3 className="text-[24px] font-[760] tracking-[-0.03em]">Request a feature</h3>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="fr-title" className="text-[14px] font-bold">
                What should SnipWise do?
              </label>
              <input
                id="fr-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A Mac version"
                aria-invalid={!!error}
                aria-describedby={error ? "fr-error" : undefined}
                className="h-12 rounded-[var(--radius-field)] border-2 border-ink bg-paper px-3.5 text-[15px] font-medium outline-none placeholder:text-ink-3 focus:shadow-[3px_3px_0_var(--ink)]"
              />
              {error && (
                <p id="fr-error" className="text-[13px] font-semibold text-coral-ink">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {ideas.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTitle(i)}
                    className="rounded-full border-[1.5px] border-ink bg-paper/70 px-2.5 py-0.5 text-[12px] font-semibold hover:bg-paper"
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="fr-details" className="text-[14px] font-bold">
                How would you use it? <span className="font-medium text-ink-2">(optional)</span>
              </label>
              <textarea
                id="fr-details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="resize-none rounded-[var(--radius-field)] border-2 border-ink bg-paper p-3.5 text-[15px] outline-none focus:shadow-[3px_3px_0_var(--ink)]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="btn btn-ink">
                Send request
                <ArrowUpRight size={16} weight="bold" />
              </button>
              <p className="text-[12.5px] font-medium text-ink-2">Opens a prefilled GitHub issue you can follow.</p>
            </div>
          </form>

          <div data-reveal="right" className="sticker relative flex flex-col gap-4 !rounded-[22px] p-6 md:mt-8 md:rotate-[1deg] md:p-8">
            <div className="flex items-center gap-3">
              <GiftIcon size={40} aria-hidden />
              <h3 className="text-[24px] font-[760] tracking-[-0.03em]">Keep the pal fed</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-ink-2">
              No investors and no tracking. If SnipWise saves you time every day, you can help keep it free for everyone.
            </p>
            <div className="mt-auto grid gap-3">
              <a
                href={site.links.sponsorMonthly}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary !h-auto justify-between !py-3.5"
              >
                <span className="text-left">
                  <span className="block text-[15px] font-bold">Sponsor monthly</span>
                  <span className="block text-[12.5px] font-semibold opacity-75">A small amount, every month</span>
                </span>
                <HandHeart size={22} weight="duotone" />
              </a>
              <button
                type="button"
                onClick={() => palSay("coffee link coming soon! thank you!", "excited")}
                className="btn btn-paper !h-auto justify-between !py-3.5 text-left"
                title="Coming soon"
              >
                <span>
                  <span className="block text-[15px] font-bold">Buy a coffee</span>
                  <span className="block text-[12.5px] font-semibold text-ink-3">A one-off thank you (Coming soon)</span>
                </span>
                <Coffee size={22} weight="duotone" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
