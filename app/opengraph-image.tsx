import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

// Share card: the island tray dropping from the top edge with a few clips in it,
// the headline, and Snip Pal hanging on its string.

export const alt = "SnipWise: your clipboard, with a memory. A free, local-first clipboard manager for Windows.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  bg: "#f3efe4",
  paper: "#fffdf6",
  ink: "#17121f",
  ink2: "#4b4555",
  ink3: "#6f6878",
  coral: "#ff5a36",
  coralInk: "#c0391a",
  lime: "#d6f57e",
  lilac: "#d2cbff",
  sky: "#b2defd",
  butter: "#ffe27f",
  pink: "#ffc6d4",
  mint: "#c3f0da",
  island: "#08090b",
  card: "#17181c",
  line: "#2a2b31",
  snow: "#f4f4f5",
  muted: "#8b8d94",
};

const TEXT =
  "SnipWise Your clipboard, with a memory. Ctrl Shift V + Free for Windows · Local-first · 31 converters snipwise.akshitbhandari.codes Code Color Link docker compose up -d #FF5A36 cal.com/you/20min Deploy Brand coral Booking v1.0.0 Saved!";

// Google Fonts serves TTF to clients that do not ask for woff2, which is what
// the image renderer needs. The `text` parameter keeps the download tiny.
async function googleFont(family: string, weight: number) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(TEXT)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

const logo = (size: number, fill: string, stroke: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5.5" fill="${fill}"/><g transform="translate(4.8 4.2) scale(0.6)" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></g></svg>`,
  )}`;

// The island's concave top corners, like the native window region.
const shoulder = (side: "left" | "right") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    side === "left"
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><path d="M0 0H26V26A26 26 0 0 0 0 0Z" fill="#08090b"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><path d="M26 0H0V26A26 26 0 0 1 26 0Z" fill="#08090b"/></svg>`,
  )}`;

const glow = (color: string, x: number, y: number, r: number) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      display: "flex",
      borderRadius: 9999,
      backgroundImage: `radial-gradient(circle, ${color} 0%, rgba(243,239,228,0) 70%)`,
    }}
  />
);

const clips = [
  { kind: "Code", tag: C.lime, title: "Deploy", body: "docker compose up -d" },
  { kind: "Color", tag: C.pink, title: "Brand coral", body: "#FF5A36", swatch: true },
  { kind: "Link", tag: C.sky, title: "Booking", body: "cal.com/you/20min" },
];

export default async function Image() {
  const [display, displayBold, mono, pal] = await Promise.all([
    googleFont("Bricolage+Grotesque", 600),
    googleFont("Bricolage+Grotesque", 800),
    googleFont("Geist+Mono", 500),
    readFile(join(process.cwd(), "public/brand/pal.png")),
  ]);
  const palSrc = `data:image/png;base64,${pal.toString("base64")}`;
  const fonts = [
    display && { name: "Bricolage", data: display, weight: 600 as const },
    displayBold && { name: "Bricolage", data: displayBold, weight: 800 as const },
    mono && { name: "Mono", data: mono, weight: 500 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 600 | 800 | 500 }[];

  const ISLAND_W = 760;
  const SH = 26;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: C.bg,
          fontFamily: "Bricolage",
          color: C.ink,
        }}
      >
        {/* Lit-desk glows and the cutting-mat grid. */}
        {glow(C.butter, 90, 120, 360)}
        {glow(C.pink, 160, 640, 380)}
        {glow(C.mint, 1120, 560, 380)}
        {glow(C.lilac, 1150, 60, 300)}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "linear-gradient(rgba(23,18,31,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(23,18,31,0.045) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* The island, attached to the top edge. */}
        <div style={{ position: "absolute", top: 0, left: (1200 - ISLAND_W) / 2, width: ISLAND_W, height: 196, display: "flex" }}>
          <img src={shoulder("left")} width={SH} height={SH} alt="" style={{ position: "absolute", top: 0, left: -SH }} />
          <img src={shoulder("right")} width={SH} height={SH} alt="" style={{ position: "absolute", top: 0, right: -SH }} />
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: C.island,
              borderRadius: "0 0 40px 40px",
              padding: "18px 22px 22px",
              boxShadow: "0 24px 50px rgba(8,9,11,0.28)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.snow, fontSize: 19, fontWeight: 600 }}>
              <img src={logo(24, C.island, C.snow)} width={24} height={24} alt="" />
              <span>SnipWise</span>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: "#83d5aa", marginLeft: 2 }} />
              <span style={{ marginLeft: "auto", display: "flex", gap: 6, fontFamily: "Mono", fontSize: 14, color: C.muted }}>
                <span style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "2px 7px" }}>Ctrl</span>
                <span style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "2px 7px" }}>Shift</span>
                <span style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "2px 7px" }}>V</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
              {clips.map((c, i) => (
                <div
                  key={c.title}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    background: C.card,
                    border: `2px solid ${i === 0 ? C.lime : C.line}`,
                    borderRadius: 16,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <span style={{ background: c.tag, color: C.ink, borderRadius: 99, padding: "1px 10px", fontSize: 14, fontWeight: 800 }}>{c.kind}</span>
                  </div>
                  <span style={{ color: C.snow, fontSize: 20, fontWeight: 800, marginTop: 10 }}>{c.title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontFamily: "Mono", fontSize: 15, color: c.kind === "Code" ? C.lime : c.kind === "Link" ? "#9fd3fb" : C.snow }}>
                    {c.swatch && <span style={{ width: 16, height: 16, borderRadius: 4, background: C.coral }} />}
                    <span>{c.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Snip Pal hanging on its string. */}
        <div style={{ position: "absolute", top: 0, left: 1040, width: 2, height: 196, background: C.ink, display: "flex" }} />
        <div style={{ position: "absolute", top: 184, left: 979, display: "flex", transform: "rotate(-6deg)" }}>
          <img src={palSrc} width={124} height={148} alt="" style={{ imageRendering: "pixelated" }} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 238,
            left: 846,
            display: "flex",
            background: C.lime,
            border: `3px solid ${C.ink}`,
            borderRadius: 16,
            boxShadow: `4px 4px 0 ${C.ink}`,
            padding: "4px 16px",
            fontSize: 24,
            fontWeight: 800,
            transform: "rotate(-5deg)",
          }}
        >
          Saved!
        </div>

        {/* Version sticker. */}
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 60,
            display: "flex",
            background: C.butter,
            border: `3px solid ${C.ink}`,
            borderRadius: 12,
            boxShadow: `4px 4px 0 ${C.ink}`,
            padding: "4px 14px",
            fontFamily: "Mono",
            fontSize: 20,
            transform: "rotate(-6deg)",
          }}
        >
          v{site.release.version}
        </div>

        {/* Headline. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 268, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 92, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1 }}>
            <span>Your clipboard,</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 10, fontSize: 92, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1 }}>
            <span>with a</span>
            <span
              style={{
                display: "flex",
                background: C.lime,
                border: `5px solid ${C.ink}`,
                borderRadius: 22,
                boxShadow: `7px 7px 0 ${C.ink}`,
                padding: "0 22px 10px",
                transform: "rotate(-2deg)",
              }}
            >
              memory.
            </span>
          </div>
        </div>

        {/* Footer: brand, promise, URL. */}
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", borderRadius: 12, boxShadow: `4px 4px 0 ${C.coral}`, transform: "rotate(-6deg)" }}>
              <img src={logo(46, C.ink, C.bg)} width={46} height={46} alt="" />
            </div>
            <div style={{ display: "flex", fontSize: 38, fontWeight: 800, letterSpacing: "-0.04em" }}>
              <span>Snip</span>
              <span style={{ color: C.coralInk }}>Wise</span>
            </div>
          </div>
          <div style={{ display: "flex", marginLeft: 28, fontSize: 22, fontWeight: 600, color: C.ink2 }}>Free for Windows · Local-first · 31 converters</div>
          <div style={{ display: "flex", marginLeft: "auto", fontFamily: "Mono", fontSize: 19, color: C.ink3 }}>snipwise.akshitbhandari.codes</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
