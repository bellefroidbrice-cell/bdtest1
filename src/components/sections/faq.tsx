import { Accordion } from "@/components/ui/accordion";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { FAQ_ITEMS } from "@/lib/faq-placeholder";

export function Faq() {
  return (
    <section className="py-24">
      <Container className="mx-auto flex max-w-3xl flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Questions fréquentes
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Vous avez des questions ?
          </h2>
        </Reveal>

        <Reveal>
          <Accordion items={FAQ_ITEMS} />
        </Reveal>
      </Container>
    </section>
  );
}
