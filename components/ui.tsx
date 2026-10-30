import { Code, LinkSimple, Palette, TextT } from "@phosphor-icons/react/ssr";
import type { ClipKind } from "@/lib/clipStore";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 md:px-8 ${className}`}>{children}</div>;
}

/**
 * The SnipWise app icon: a clipboard on a rounded square. Drawn inline (same
 * geometry as the app's icon) so it stays crisp and follows the theme.
 */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect width="24" height="24" rx="5.5" fill="var(--ink)" />
      <g transform="translate(4.8 4.2) scale(0.6)" stroke="var(--bg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect
          x="8"
          y="2"
          width="8"
          height="4"
          rx="1"
          className="transition-transform duration-300 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover/logo:-translate-y-[2.5px]"
        />
      </g>
    </svg>
  );
}

/** Brand lockup: the app icon and the SnipWise wordmark. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="group/logo inline-flex items-center gap-2.5">
      <span className="block shrink-0 -rotate-6 rounded-[11px] shadow-[2px_2px_0_var(--coral)] transition-transform duration-300 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover/logo:rotate-3 group-hover/logo:scale-110">
        <LogoMark size={38} className="block" />
      </span>
      {!compact && (
        <span className="font-display text-[23px] font-[800] leading-none tracking-[-0.045em]">
          Snip<span className="text-coral-ink">Wise</span>
        </span>
      )}
    </span>
  );
}

const tapeColors = {
  coral: "bg-coral",
  lime: "bg-lime",
  lilac: "bg-lilac",
  sky: "bg-sky",
  butter: "bg-butter",
  pink: "bg-pink",
  mint: "bg-mint",
} as const;
export type TapeColor = keyof typeof tapeColors;

export function Tape({
  children,
  color = "butter",
  className = "",
  tilt = -2,
}: {
  children: React.ReactNode;
  color?: TapeColor;
  className?: string;
  tilt?: number;
}) {
  return (
    <span className={`tape ${tapeColors[color]} ${className}`} style={{ rotate: `${tilt}deg` }}>
      {children}
    </span>
  );
}

export function SectionHeading({
  tape,
  tapeColor = "butter",
  title,
  sub,
  align = "center",
  className = "",
}: {
  tape?: string;
  tapeColor?: TapeColor;
  title: React.ReactNode;
  sub?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-[820px] ${className}`}>
      {tape && (
        <div data-reveal="pop" className={`mb-5 ${center ? "flex justify-center" : ""}`}>
          <Tape color={tapeColor}>{tape}</Tape>
        </div>
      )}
      <h2 data-reveal="up" className="display text-balance text-[44px] md:text-[68px]">
        {title}
      </h2>
      {sub && (
        <p
          data-reveal="up"
          data-reveal-delay="0.08"
          className={`mt-5 text-pretty text-[17px] leading-relaxed text-ink-2 md:text-[19px] ${center ? "mx-auto" : ""} max-w-[60ch]`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function Kbd({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <kbd
      className={`inline-flex h-7 min-w-7 items-center justify-center rounded-[8px] border-2 px-2 font-mono text-[12px] font-semibold ${
        dark ? "border-snow/30 bg-snow/10 text-snow" : "border-ink bg-paper text-ink shadow-[0_2px_0_var(--ink)]"
      }`}
    >
      {children}
    </kbd>
  );
}

/** Pixel-font accent word inside a heading. */
export function Pixel({ children }: { children: React.ReactNode }) {
  return <span className="font-pixel font-bold tracking-normal text-coral-ink">{children}</span>;
}

export const kindMeta: Record<ClipKind, { label: string; bg: string; Icon: typeof TextT }> = {
  text: { label: "Text", bg: "bg-butter", Icon: TextT },
  code: { label: "Code", bg: "bg-lime", Icon: Code },
  link: { label: "Link", bg: "bg-sky", Icon: LinkSimple },
  color: { label: "Color", bg: "bg-pink", Icon: Palette },
};

export function KindTag({ kind }: { kind: ClipKind }) {
  const { label, bg, Icon } = kindMeta[kind];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border-[1.5px] border-ink ${bg} px-2 py-[1px] text-[11px] font-semibold text-ink`}>
      <Icon size={11} weight="bold" />
      {label}
    </span>
  );
}

/** A Windows 11 style app window with an ink outline. */
export function AppWindow({
  title,
  children,
  className = "",
  bodyClassName = "",
  dark = false,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  dark?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-window)] border-2 border-ink shadow-[6px_6px_0_var(--ink)] ${
        dark ? "bg-[#1d1826] text-snow [color-scheme:dark]" : "bg-paper"
      } ${className}`}
    >
      <div className={`flex h-10 items-center justify-between border-b-2 border-ink pl-3.5 ${dark ? "bg-[#2a2335]" : "bg-chrome"}`}>
        <span className="flex items-center gap-2 truncate text-[12.5px] font-semibold">
          {icon}
          {title}
        </span>
        <span aria-hidden className={`flex h-full items-center font-mono text-[12px] ${dark ? "text-snow/50" : "text-ink-3"}`}>
          <span className="grid h-full w-10 place-items-center">&#8212;</span>
          <span className="grid h-full w-10 place-items-center">&#9633;</span>
          <span className="grid h-full w-10 place-items-center">&#10005;</span>
        </span>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
