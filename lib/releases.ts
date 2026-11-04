// Client-side helpers for reading the public GitHub release feed.
// The site keeps a static fallback in content/site.ts, but these helpers
// let the download UI and releases page follow the newest published beta
// without a manual edit on every release.

export const RELEASE_REPO = "AkshitBhandariCodes/DownloadSnipWise";

export type ReleaseAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

export type GitHubRelease = {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
  assets: ReleaseAsset[];
};

export async function fetchReleases(): Promise<GitHubRelease[]> {
  const res = await fetch(`https://api.github.com/repos/${RELEASE_REPO}/releases`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub releases request failed: ${res.status}`);
  return (await res.json()) as GitHubRelease[];
}

export async function fetchLatestRelease(): Promise<GitHubRelease> {
  const res = await fetch(`https://api.github.com/repos/${RELEASE_REPO}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub latest release request failed: ${res.status}`);
  return (await res.json()) as GitHubRelease;
}

export function installerAsset(release: GitHubRelease): ReleaseAsset | undefined {
  return release.assets.find((a) => /SnipWise-Setup-.*-x64\.exe$/i.test(a.name));
}

export function versionFromTag(tag: string): string {
  return tag.replace(/^beta-/, "");
}
