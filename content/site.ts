// Launch configuration. Everything here is a value the owner is expected to
// edit before going live: links, release details, and which features are
// marked "coming soon".

export const site = {
  name: "SnipWise",
  url: "https://snipwise.akshitbhandari.codes",
  tagline: "Your clipboard, with a memory.",
  description:
    "SnipWise keeps everything you copy on Windows, so you can search it, convert it and paste it back in a keystroke. Local-first, with a pixel pal.",

  release: {
    // Public GitHub repo that hosts the Windows releases. The desktop source
    // repo is private, so point this at a public repo that only holds release
    // assets (or make the desktop repo public).
    repo: "AkshitBhandariCodes/snipwise-releases",
    // File name of the installer attached to every release. GitHub serves
    // `/releases/latest/download/<asset>` from whichever release is newest.
    asset: "SnipWise-Setup-x64.exe",
    version: "0.2.0",
    // SHA-256 of the current installer, shown under the download button.
    // Leave null until the release is published.
    sha256: null as string | null,
    requirements: "Windows 10 or 11, 64-bit",
    signed: false,
  },

  links: {
    github: "https://github.com/AkshitBhandariCodes",
    // Feature requests open a prefilled GitHub issue in this public repo.
    feedbackRepo: "AkshitBhandariCodes/snipwise-releases",
    sponsorMonthly: "https://github.com/sponsors/AkshitBhandariCodes",
    sponsorOnce: "https://buymeacoffee.com/",
    twitter: "https://twitter.com/SnipWiseApp",
    productHunt: "https://www.producthunt.com/products/snipwise",
  },

  // Features that exist in the app but are not open to the public yet.
  comingSoon: {
    sync: true,
  },
} as const;

export const downloadUrl = `https://github.com/${site.release.repo}/releases/latest/download/${site.release.asset}`;
export const releasesUrl = `https://github.com/${site.release.repo}/releases`;
