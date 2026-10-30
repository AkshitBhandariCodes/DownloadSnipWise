import { Plus } from "@phosphor-icons/react/ssr";
import { faqs } from "@/content/copy";
import { Container, SectionHeading } from "./ui";
import { PalDock } from "./pal/PalGuide";

export function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <Container>
        <SectionHeading tape="FAQ" tapeColor="butter" title="Questions, answered." />
        <div data-reveal="stagger" className="relative mx-auto mt-14 grid max-w-[800px] gap-3">
          <PalDock name="faq" pose="sit" mood="think" className="right-10 top-0" say={["ask me anything", "hmm, good one", "it's free, yes"]} />
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-[16px] border-2 border-ink bg-paper shadow-[3px_3px_0_var(--ink)] transition-[box-shadow,transform] open:shadow-[5px_5px_0_var(--ink)] hover:-translate-y-0.5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[17px] font-bold md:px-6 md:py-5 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border-2 border-ink bg-butter transition-transform duration-300 group-open:rotate-45 group-open:bg-lime">
                  <Plus size={15} weight="bold" />
                </span>
              </summary>
              <p className="max-w-[64ch] px-5 pb-5 text-[15.5px] leading-relaxed text-ink-2 md:px-6">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
