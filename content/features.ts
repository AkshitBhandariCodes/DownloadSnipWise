// Feature gallery. Each card shows a tiny live preview until a video exists.
// To add a recording: drop the file in /public/media and set `video` (and
// optionally `poster`). `shot` is the brief for recording that clip.

import type { TapeColor } from "@/components/ui";

export type Feature = {
  id: string;
  no: string;
  verb: string;
  name: string;
  body: string;
  tags: string[];
  color: TapeColor;
  corner: string;
  strip: string;
  soon?: boolean;
  video: string | null;
  poster?: string;
  shot: string;
};

export const features: Feature[] = [
  {
    id: "dock",
    no: "01",
    verb: "summon",
    name: "Quick Dock",
    body: "Press Ctrl+Shift+V over any app and your whole history slides up. Arrow keys, Enter, done.",
    tags: ["Ctrl+Shift+V", "keyboard first", "any app"],
    color: "sky",
    corner: "press Ctrl+Shift+V",
    strip: "Ctrl + Shift + V",
    video: null,
    shot: "In a real app (VS Code or Notepad), copy three different things. Press Ctrl+Shift+V, arrow down to the second clip, press Enter so it pastes. 6 to 8 seconds, no mouse.",
  },
  {
    id: "search",
    no: "02",
    verb: "find",
    name: "Search everything",
    body: "Full-text search across every clip you have ever copied, filtered by type or the app it came from.",
    tags: ["full text", "type filters", "by app"],
    color: "lilac",
    corner: "type to find",
    strip: "deploy",
    video: null,
    shot: "Open the dock with lots of history. Type a word like \"deploy\", then click the Code filter, then clear it and filter by an app. 8 seconds.",
  },
  {
    id: "shortcuts",
    no: "03",
    verb: "expand",
    name: "Inline shortcuts",
    body: "Give a clip a name. Type ;name and a space in any app and SnipWise swaps it for the clip.",
    tags: ["any app", ";triggers", "opt in"],
    color: "butter",
    corner: "type ;sig",
    strip: ";sig",
    video: null,
    shot: "Show a clip being given the trigger ;sig in SnipWise. Then switch to Gmail or Outlook, type ;sig and a space, and let the signature appear. 8 to 10 seconds.",
  },
  {
    id: "convert",
    no: "04",
    verb: "convert",
    name: "31 converters",
    body: "JSON to YAML, Markdown to HTML, camelCase, Base64 and every colour format. All offline, right in the dock.",
    tags: ["JSON", "Markdown", "colours"],
    color: "lime",
    corner: "json to yaml",
    strip: '{"ship": true}',
    video: null,
    shot: "Copy a messy one-line JSON. Open the dock, pick JSON to YAML, paste the result into an editor. Then copy a hex code and show the colour formats. 10 seconds.",
  },
  {
    id: "drag",
    no: "05",
    verb: "drag",
    name: "Drag it out",
    body: "Pull any clip out of the dock and drop it straight into Slack, Figma or a browser field.",
    tags: ["drag and drop", "any window"],
    color: "pink",
    corner: "drag + drop",
    strip: "drag, then drop",
    video: null,
    shot: "With Slack or a browser form open, drag a clip from the dock and drop it into the message box. Do it twice with two different clips. 6 seconds.",
  },
  {
    id: "types",
    no: "06",
    verb: "sort",
    name: "Knows what you copied",
    body: "Code, links, colours and text are tagged the moment you copy them, so filters just work.",
    tags: ["auto tags", "no setup"],
    color: "mint",
    corner: "auto tagged",
    strip: "#FF5A36",
    video: null,
    shot: "Copy a code line, a URL, a hex colour and a sentence one after another. Open the dock and slowly hover the four new rows so the tags are readable. 6 seconds.",
  },
  {
    id: "folders",
    no: "07",
    verb: "keep",
    name: "Folders and pins",
    body: "Pin what you use every day and file the rest into folders like Client A or Launch ideas.",
    tags: ["pins", "folders", "favourites"],
    color: "sky",
    corner: "pin it",
    strip: "Client A / Launch",
    video: null,
    shot: "Pin a clip so it jumps to the top. Then move two clips into a folder called Client A and open the folder. 8 seconds.",
  },
  {
    id: "passwords",
    no: "08",
    verb: "guard",
    name: "Skips your passwords",
    body: "Copies that password managers mark as sensitive are skipped before SnipWise ever reads them.",
    tags: ["password managers", "never stored"],
    color: "pink",
    corner: "not saved",
    strip: "sensitive: skipped",
    video: null,
    shot: "Copy a password from Bitwarden, 1Password or KeePass. Open the dock and show that it is not in the list, then copy normal text and show that one is. Use a fake demo password. 8 seconds.",
  },
  {
    id: "offline",
    no: "09",
    verb: "stay",
    name: "Works offline",
    body: "Every clip lives in a local database on your PC. No account, no server, no waiting on Wi-Fi.",
    tags: ["local first", "no account"],
    color: "butter",
    corner: "wifi off",
    strip: "airplane mode: fine",
    video: null,
    shot: "Turn on airplane mode from the Windows quick settings so the icon is visible. Copy two things and open the dock to show they were saved. 6 seconds.",
  },
  {
    id: "pal",
    no: "10",
    verb: "vibe",
    name: "Snip pal",
    body: "An optional snip that lives on your taskbar and cheers when a copy is saved. Hide it from the tray whenever you like.",
    tags: ["optional", "never reads clips", "draggable"],
    color: "lilac",
    corner: "poke it",
    strip: "saved!",
    video: null,
    shot: "Show the snip sitting on the taskbar. Copy something so it reacts, drag it to the top corner so it hangs, then hide it from the tray menu. 10 seconds.",
  },
  {
    id: "tray",
    no: "12",
    verb: "rest",
    name: "Quiet in the tray",
    body: "SnipWise waits in the tray and opens on a shortcut. Its notifications never show what you copied.",
    tags: ["tray app", "private toasts"],
    color: "lime",
    corner: "shh",
    strip: "Saved a clip",
    video: null,
    shot: "Show the SnipWise icon in the tray, right-click it to open the menu, then copy something and capture the notification that appears without the clip's content. 6 seconds.",
  },
  {
    id: "mac",
    no: "13",
    verb: "island",
    name: "Mac Island",
    body: "A macOS-style island notch and tray experience for SnipWise. Coming soon to macOS and Linux.",
    tags: ["mac", "island", "tray"],
    color: "sky",
    corner: "ctrl + shift + v",
    strip: "Ctrl + Shift + V",
    video: null,
    shot: "Show the SnipWise island notch on the macOS menubar. Copy something and see it appear in the notch. Ctrl+Shift+V to paste. 8 seconds.",
  },
];
