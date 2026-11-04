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
    // Public GitHub repo that hosts the Windows releases.
    repo: "AkshitBhandariCodes/DownloadSnipWise",
    tag: "beta-0.3.8",
    // File name of the installer attached to every release.
    asset: "SnipWise-Setup-0.3.8-x64.exe",
    version: "0.3.8",
    name: "SnipWise 0.3.8 Beta (Windows)",
    // SHA-256 of the current installer, shown under the download button.
    sha256: "83763944e3381534b1359a2e9c68d3fede16331eb970d63ac5631fe82f52638e",
    requirements: "Windows 10 or 11, 64-bit",
    signed: false,
  },

  links: {
    github: "https://github.com/AkshitBhandariCodes",
    contactEmail: "akshitbhandaricodes@gmail.com",
    // Feature requests open a prefilled GitHub issue in this public repo.
    feedbackRepo: "AkshitBhandariCodes/DownloadSnipWise",
    sponsorMonthly: "https://github.com/sponsors/AkshitBhandariCodes",
    sponsorOnce: "#",
    twitter: "https://x.com/akshitbhandarix",
    productHunt: "https://www.producthunt.com/products/snipwise",
  },

  // Features that exist in the app but are not open to the public yet.
  comingSoon: {
    sync: true,
  },
} as const;

export const downloadUrl = `https://github.com/${site.release.repo}/releases/download/${site.release.tag}/${site.release.asset}`;
export const releasesUrl = `https://github.com/${site.release.repo}/releases/tag/${site.release.tag}`;

