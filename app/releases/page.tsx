"use client";

import { useEffect, useState } from "react";
import { fetchReleases, installerAsset, versionFromTag } from "@/lib/releases";
import { Container } from "@/components/ui";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Awaited<ReturnType<typeof fetchReleases>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchReleases()
      .then((data) => {
        if (active) setReleases(data);
      })
      .catch(() => {
        if (active) setError("Could not load releases.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Nav />
      <main className="overflow-x-clip py-24">
        <Container>
          <h1 className="display text-[48px] md:text-[68px]">Releases</h1>
          <p className="mt-4 max-w-[60ch] text-[17px] text-ink-2">
            Every published Windows release of SnipWise. Each installer is paired with a signed update manifest.
          </p>
          {loading && <p className="mt-8 font-mono text-[13px] text-ink-3">Loading releases…</p>}
          {error && <p className="mt-8 font-mono text-[13px] text-coral-ink">{error}</p>}
          <ul className="mt-10 space-y-4">
            {releases.map((r) => {
              const asset = installerAsset(r);
              return (
                <li
                  key={r.tag_name}
                  className="rounded-[20px] border-2 border-ink bg-paper p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-[20px] font-bold">{r.name || r.tag_name}</h2>
                    <span className="font-mono text-[12px] text-ink-3">
                      {new Date(r.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[12px] text-ink-3">
                    {versionFromTag(r.tag_name)} · {r.tag_name}
                  </p>
                  {asset && (
                    <a
                      href={asset.browser_download_url}
                      className="mt-4 inline-flex items-center gap-2 rounded-[12px] border-2 border-ink bg-ink px-4 py-2 text-[14px] font-bold text-paper"
                    >
                      Download {asset.name}
                    </a>
                  )}
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 mt-4 inline-flex items-center gap-1 text-[14px] text-coral-ink underline underline-offset-2"
                  >
                    Release notes
                  </a>
                </li>
              );
            })}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  );
}
