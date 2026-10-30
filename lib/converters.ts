// A subset of the desktop app's converters (Snipwise-Desktop/packages/converters),
// ported as-is so the playground produces the same output the app does.
import { dump, load } from "js-yaml";

export type Converter = {
  id: string;
  label: string;
  run: (input: string) => string;
};

function tokenize(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function base64Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64Decode(input: string): string {
  const binary = atob(input.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

type Rgb = { r: number; g: number; b: number };

function parseHex(input: string): Rgb {
  const m = input.trim().toLowerCase().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (!m) throw new Error("Expected a hex color like #F2552C");
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHsl({ r, g, b }: Rgb) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === rn) h = 60 * (((gn - bn) / d) % 6);
    else if (max === gn) h = 60 * ((bn - rn) / d + 2);
    else h = 60 * ((rn - gn) / d + 4);
  }
  if (h < 0) h += 360;
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) };
}

const toHex = ({ r, g, b }: Rgb) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();

export const converterGroups: { name: string; sample: string; items: Converter[] }[] = [
  {
    name: "JSON",
    sample: '{"name":"SnipWise","platform":"windows","features":["search","convert","pal"],"offline":true}',
    items: [
      { id: "json-yaml", label: "JSON to YAML", run: (s) => dump(JSON.parse(s), { indent: 2, lineWidth: 100 }) },
      { id: "json-pretty", label: "Beautify", run: (s) => JSON.stringify(JSON.parse(s), null, 2) },
      { id: "json-min", label: "Minify", run: (s) => JSON.stringify(JSON.parse(s)) },
      { id: "yaml-json", label: "YAML to JSON", run: (s) => JSON.stringify(load(s), null, 2) },
    ],
  },
  {
    name: "Text",
    sample: "copy once find it forever",
    items: [
      {
        id: "camel",
        label: "camelCase",
        run: (s) => tokenize(s).map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join(""),
      },
      { id: "snake", label: "snake_case", run: (s) => tokenize(s).map((w) => w.toLowerCase()).join("_") },
      { id: "kebab", label: "kebab-case", run: (s) => tokenize(s).map((w) => w.toLowerCase()).join("-") },
      { id: "title", label: "Title Case", run: (s) => s.replace(/\b\w/g, (c) => c.toUpperCase()) },
      { id: "b64", label: "Base64", run: base64Encode },
      { id: "b64d", label: "From Base64", run: base64Decode },
    ],
  },
  {
    name: "Color",
    sample: "#F2552C",
    items: [
      {
        id: "rgb",
        label: "HEX to RGB",
        run: (s) => {
          const c = parseHex(s);
          return `rgb(${c.r}, ${c.g}, ${c.b})`;
        },
      },
      {
        id: "hsl",
        label: "HEX to HSL",
        run: (s) => {
          const { h, s: sat, l } = rgbToHsl(parseHex(s));
          return `hsl(${Math.round(h)}, ${Math.round(sat * 100)}%, ${Math.round(l * 100)}%)`;
        },
      },
      {
        id: "comp",
        label: "Complementary",
        run: (s) => {
          const { h, s: sat, l } = rgbToHsl(parseHex(s));
          return toHex(hslToRgb((h + 180) % 360, sat, l));
        },
      },
      {
        id: "analog",
        label: "Analogous",
        run: (s) => {
          const { h, s: sat, l } = rgbToHsl(parseHex(s));
          return `${toHex(hslToRgb((h + 330) % 360, sat, l))}, ${toHex(hslToRgb((h + 30) % 360, sat, l))}`;
        },
      },
    ],
  },
];

// Shared colour helpers for the designer desk.
export { parseHex, rgbToHsl, hslToRgb, toHex };

function srgbToLinear(v: number) {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** sRGB to OKLCH (Björn Ottosson's OKLab matrices). */
function toOklch({ r, g, b }: Rgb) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

/** Every format a designer usually needs for one hex colour. */
export function colorFormats(hex: string): { label: string; value: string }[] {
  const rgb = parseHex(hex);
  const { h, s, l } = rgbToHsl(rgb);
  const ok = toOklch(rgb);
  const H = toHex(rgb);
  return [
    { label: "HEX", value: H },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` },
    { label: "OKLCH", value: `oklch(${(ok.L * 100).toFixed(1)}% ${ok.C.toFixed(3)} ${ok.C < 0.002 ? 0 : ok.H.toFixed(1)})` },
    { label: "Tailwind", value: `bg-[${H}]` },
  ];
}

/** Two analogous colours and the complement, for the palette strip. */
export function colorFriends(hex: string): string[] {
  const { h, s, l } = rgbToHsl(parseHex(hex));
  return [(h + 330) % 360, (h + 30) % 360, (h + 180) % 360].map((x) => toHex(hslToRgb(x, s, l)));
}
