import Link from "next/link";
import { Container, Logo } from "@/components/ui";

export function LegalLayout({ title, summary, children }: { title: string; summary: string; children: React.ReactNode }) {
  return (
    <>
      <header className="border-b-2 border-ink bg-paper">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
          <Link href="/" aria-label="SnipWise home"><Logo /></Link>
          <nav aria-label="Legal pages" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/privacy-policy" className="hover:underline">Privacy policy</Link>
            <Link href="/terms-of-service" className="hover:underline">Terms of service</Link>
          </nav>
        </Container>
      </header>
      <main id="main" className="bg-bg py-14 md:py-20">
        <Container>
          <article className="mx-auto max-w-[780px]">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-coral-ink">SnipWise · Legal</p>
            <h1 className="display text-balance text-[clamp(3rem,8vw,5.5rem)] leading-[0.95]">{title}</h1>
            <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-ink-2">{summary}</p>
            <p className="mt-5 font-mono text-xs text-ink-3">Effective 31 October 2026</p>
            <div className="mt-10 space-y-9 border-t-2 border-ink pt-10 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_li]:mb-2 [&_p]:mb-3 [&_p]:leading-[1.75] [&_ul]:list-disc [&_ul]:pl-6 text-[16px] text-ink-2">
              {children}
            </div>
          </article>
        </Container>
      </main>
      <footer className="border-t-2 border-ink bg-butter">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-5 text-sm font-semibold">
          <span>© 2026 SnipWise</span>
          <div className="flex gap-5"><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-service">Terms</Link><Link href="/">Home</Link></div>
        </Container>
      </footer>
    </>
  );
}
