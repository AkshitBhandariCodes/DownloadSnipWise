"use client";

import { useRef, useState, useEffect } from "react";
import { WindowsLogo, ArrowUpRight, ShieldWarning, FolderSimple } from "@phosphor-icons/react";
import { site, releasesUrl as staticReleasesUrl, downloadUrl as staticDownloadUrl } from "@/content/site";
import { fetchLatestRelease, installerAsset, versionFromTag } from "@/lib/releases";
import { gsap, Draggable, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { palSay } from "@/lib/palBus";
import { Container, Tape } from "./ui";
import { PalDock } from "./pal/PalGuide";

const staticRelease = site.release;

  const [live, setLive] = useState<{
    version: string;
    asset: string;
    sha256: string;
    downloadUrl: string;
    releasesUrl: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    fetchLatestRelease()
      .then(async (r) => {
        const asset = installerAsset(r);
        if (!asset || !active) return;
        let sha256 = "";
        try {
          const shaRes = await fetch(
            `https://github.com/${site.release.repo}/releases/download/${r.tag_name}/${asset.name}.sha256`,
          );
          if (shaRes.ok) {
            const text = await shaRes.text();
            sha256 = text.trim().split(/\s+/)[0] ?? "";
          }
        } catch {
          // ignore; fall back to empty
        }
        if (!active) return;
        setLive({
          version: versionFromTag(r.tag_name),
          asset: asset.name,
          sha256,
          downloadUrl: asset.browser_download_url,
          releasesUrl: r.html_url,
        });
      })
      .catch(() => {
        // keep static fallback
      });
    return () => {
      active = false;
    };
  }, []);

  const release = live
    ? {
        version: live.version,
        asset: live.asset,
        sha256: live.sha256,
        requirements: staticRelease.requirements,
        signed: staticRelease.signed,
      }
    : staticRelease;
  const downloadUrl = live?.downloadUrl ?? staticDownloadUrl;
  const releasesUrl = live?.releasesUrl ?? staticReleasesUrl;

/**
 * Download card. The installer is a file sticker you can drag into the
 * Downloads folder (which starts the download), or just use the button.
 */
export function Download() {
  const root = useRef<HTMLElement>(null);
  const [dropped, setDropped] = useState(false);

  const start = () => {
    setDropped(true);
    palSay("take me home!", "excited");
    gsap.fromTo("[data-folder]", { scale: 1.25 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.2, 0.4)" });
    gsap.utils.toArray<HTMLElement>("[data-confetti]").forEach((c) => {
      gsap.fromTo(
        c,
        { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 },
        {
          x: gsap.utils.random(-140, 140),
          y: gsap.utils.random(-160, -40),
          rotate: gsap.utils.random(-260, 260),
          opacity: 0,
          scale: 0.6,
          duration: 1.1,
          ease: "power2.out",
        },
      );
    });
    setTimeout(() => window.open(downloadUrl, "_blank"), 700);
  };

  useGSAP(
    () => {
      const folder = root.current?.querySelector("[data-folder]");
      const [d] = Draggable.create("[data-installer]", {
        bounds: root.current?.querySelector("[data-download-card]") ?? undefined,
        onDrag() {
          folder?.toggleAttribute("data-hot", this.hitTest(folder, "40%"));
        },
        onDragEnd() {
          const hit = folder && this.hitTest(folder, "40%");
          folder?.removeAttribute("data-hot");
          if (hit) {
            gsap.to(this.target, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(2)" });
            start();
          } else {
            gsap.to(this.target, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
          }
        },
      });
      if (!prefersReducedMotion()) {
        gsap.to("[data-installer] > div:first-child", { y: -8, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }
      return () => d?.kill();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="download" className="py-24 md:py-32">
      <Container>
        <div data-reveal="window" className="relative mx-auto max-w-[1080px]">
          <div aria-hidden className="absolute inset-0 translate-x-3.5 translate-y-3.5 rotate-[1deg] rounded-[28px] border-2 border-ink bg-coral" />
          <div data-download-card className="sticker relative grid grid-cols-1 gap-10 overflow-hidden !rounded-[28px] p-7 md:grid-cols-[1.1fr_1fr] md:p-12">
            <PalDock name="download" pose="sit" mood="excited" className="left-[30%] top-0" say={["take me home!", "drag it in!", "it's free!"]} />
            <div>
              <Tape color="lime" tilt={-3}>
                Free while in beta
              </Tape>
              <h2 className="display mt-6 text-[48px] md:text-[68px]">
                Take SnipWise
                <br />
                home.
              </h2>
              <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-ink-2">
                Install it, press Win+V, and your clipboard starts remembering. Everything stays on your PC.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary !h-[56px] !px-6 !text-[16px]"
                >
                  <WindowsLogo size={19} weight="fill" />
                  Download for Windows
                </a>
                <a
                  href={releasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-paper !h-[56px]"
                >
                  Release notes
                  <ArrowUpRight size={16} weight="bold" />
                </a>
              </div>
              <dl className="mt-8 flex flex-wrap gap-2.5">
                {[
                  ["Version", `${release.version} beta`],
                  ["Needs", release.requirements],
                  ["Price", "Free"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-[12px] border-2 border-ink bg-paper px-3 py-1.5">
                    <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">{k}</dt>
                    <dd className="text-[14px] font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
              {release.sha256 && (
                <div className="mt-4 flex flex-col gap-1 rounded-[12px] border border-ink/20 bg-paper/50 p-2.5 font-mono text-[11.5px] text-ink-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-semibold text-ink">Asset: {release.asset}</span>
                    <a
                      href={releasesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-coral-ink underline underline-offset-2 hover:opacity-85"
                    >
                      v{release.version} notes
                    </a>
                  </div>
                  <p className="break-all text-[11px] text-ink-3">
                    <span className="font-semibold text-ink-2">SHA-256:</span> {release.sha256}
                  </p>
                </div>
              )}
              {!release.signed && (
                <p className="mt-5 flex max-w-[52ch] items-start gap-2 text-[13px] leading-relaxed text-ink-3">
                  <ShieldWarning size={17} weight="duotone" className="mt-px shrink-0" />
                  The beta isn’t code-signed yet, so Windows SmartScreen may warn you. Choose More info, then Run anyway.
                </p>
              )}
            </div>

            {/* Drag-to-download desk. */}
            <div className="dots relative min-h-[320px] rounded-[20px] border-2 border-ink bg-chrome">
              <span className="absolute left-4 top-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                drag the file into downloads
              </span>
              <div
                data-installer
                className="absolute left-[12%] top-[26%] z-10 flex w-[150px] cursor-grab touch-none flex-col items-center gap-2 active:cursor-grabbing"
              >
                <div className="relative grid h-[96px] w-[80px] place-items-center rounded-[10px] border-2 border-ink bg-paper shadow-[4px_4px_0_var(--ink)]">
                  <span className="absolute right-0 top-0 h-5 w-5 rounded-bl-[8px] border-b-2 border-l-2 border-ink bg-chrome" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/pal.png" alt="" width={40} height={48} className="pixelated" draggable={false} />
                </div>
                <span className="rounded-[6px] bg-ink px-1.5 py-0.5 font-mono text-[11px] font-semibold text-paper">{release.asset}</span>
              </div>
              <div
                data-folder
                className="group/f absolute bottom-[12%] right-[10%] flex flex-col items-center gap-1 transition-transform data-[hot]:scale-110"
              >
                <span className="relative">
                  <FolderSimple size={110} weight="duotone" className="text-ink transition-colors group-data-[hot]/f:text-coral-ink" />
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span
                      key={i}
                      data-confetti
                      aria-hidden
                      className={`absolute left-1/2 top-1/2 h-2.5 w-2 rounded-[2px] opacity-0 ${["bg-coral", "bg-lime", "bg-sky", "bg-butter", "bg-lilac"][i % 5]}`}
                    />
                  ))}
                </span>
                <span className="font-mono text-[12px] font-bold">{dropped ? "Downloading…" : "Downloads"}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
