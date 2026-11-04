// Page copy. Kept apart from layout so wording can change without touching
// components. SnipWise claims come from the desktop app's docs.

// Comparison against Win+V and the Windows tools people already use. Each
// competitor cell reflects the app's default, built-in features from its own
// docs (October 2026). "some" means partly, with the note saying how.
// Windows facts from Microsoft Support, "Using the clipboard".
export type Mark = "yes" | "some" | "no";
export type Cell = { mark: Mark; note?: string };
export type Rival = { id: string; name: string; kind: string };
export type CompareRow = { topic: string; snipwise: Cell; rivals: Record<string, Cell> };

export const rivals: Rival[] = [
  { id: "winv", name: "Win+V", kind: "Built into Windows" },
  { id: "ditto", name: "Ditto", kind: "Clipboard manager" },
  { id: "copyq", name: "CopyQ", kind: "Clipboard manager" },
  { id: "espanso", name: "Espanso", kind: "Text expander" },
];

export const compareRows: CompareRow[] = [
  {
    topic: "Keeps everything you copy",
    snipwise: { mark: "yes", note: "No limit" },
    rivals: {
      winv: { mark: "some", note: "Last 25 items" },
      ditto: { mark: "yes" },
      copyq: { mark: "yes" },
      espanso: { mark: "no", note: "No history" },
    },
  },
  {
    topic: "Survives a restart",
    snipwise: { mark: "yes" },
    rivals: {
      winv: { mark: "some", note: "Pinned only" },
      ditto: { mark: "yes" },
      copyq: { mark: "yes" },
      espanso: { mark: "no" },
    },
  },
  {
    topic: "Search and filters",
    snipwise: { mark: "yes", note: "By text, type and app" },
    rivals: {
      winv: { mark: "no", note: "Scroll the list" },
      ditto: { mark: "yes" },
      copyq: { mark: "yes" },
      espanso: { mark: "no" },
    },
  },
  {
    topic: "Folders and pins",
    snipwise: { mark: "yes" },
    rivals: {
      winv: { mark: "some", note: "Pins" },
      ditto: { mark: "yes", note: "Groups" },
      copyq: { mark: "yes", note: "Tabs" },
      espanso: { mark: "no" },
    },
  },
  {
    topic: "Type ;name to paste a clip",
    snipwise: { mark: "yes" },
    rivals: {
      winv: { mark: "no" },
      ditto: { mark: "no" },
      copyq: { mark: "no" },
      espanso: { mark: "yes", note: "Written in config files" },
    },
  },
  {
    topic: "Built-in converters",
    snipwise: { mark: "yes", note: "31: JSON, YAML, case, colours" },
    rivals: {
      winv: { mark: "no" },
      ditto: { mark: "some", note: "Text case" },
      copyq: { mark: "some", note: "With scripts" },
      espanso: { mark: "no" },
    },
  },
  {
    topic: "Drag a clip into any app",
    snipwise: { mark: "yes" },
    rivals: {
      winv: { mark: "no" },
      ditto: { mark: "yes" },
      copyq: { mark: "yes" },
      espanso: { mark: "no" },
    },
  },
  {
    topic: "Set up in a minute",
    snipwise: { mark: "yes", note: "Install and press Ctrl+Shift+V" },
    rivals: {
      winv: { mark: "yes" },
      ditto: { mark: "yes" },
      copyq: { mark: "some", note: "Many settings" },
      espanso: { mark: "some", note: "YAML config" },
    },
  },
  {
    topic: "A snip pal on your taskbar",
    snipwise: { mark: "yes" },
    rivals: {
      winv: { mark: "no" },
      ditto: { mark: "no" },
      copyq: { mark: "no" },
      espanso: { mark: "no" },
    },
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Does it replace Win+V?",
    a: "Yes. SnipWise opens on Ctrl+Shift+V, keeps all your history instead of 25 items, and you can pick your own shortcut if you like.",
  },
  {
    q: "Is it free?",
    a: "Yes, SnipWise is free while it is in beta.",
  },
  {
    q: "Where are my clips stored?",
    a: "In a local database on your PC. Capture, search and paste never touch the internet.",
  },
  {
    q: "Does it save my passwords?",
    a: "No. Copies that password managers mark as sensitive are skipped before SnipWise reads them.",
  },
  {
    q: "How will sync work?",
    a: "Sync is coming soon. It is opt-in, encrypted on your PC before upload, and stored in your own Google Drive. A 24-word recovery phrase unlocks it on a new device.",
  },
  {
    q: "Why does Windows show a SmartScreen warning?",
    a: "The beta installer is not code-signed yet, so Windows does not recognise it. Choose More info, then Run anyway. You can check the file against the SHA-256 shown on this page.",
  },
  {
    q: "Is there a Mac version?",
    a: "Not yet. SnipWise is Windows-first. Request it below so we know how many people want it.",
  },
];
