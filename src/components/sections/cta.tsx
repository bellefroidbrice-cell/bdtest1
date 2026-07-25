import { Phone } from "lucide-react";

import { Glow } from "@/components/decor/glow";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/nav";

export function Cta() {
  return (
    <section className="relative overflow-hidden bg-ink py-20">
      <Glow tone="dark" className="opacity-70" />

      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Une question ? Contactez-nous dès aujourd&apos;hui.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-md text-base text-white/60">
            Notre équipe vous répond rapidement pour toute demande
            d&apos;information ou de rendez-vous.
          </p>
        </Reveal>
        <Reveal delay={0.16} className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary" size="lg">
            Nous contacter
          </Button>
          <Button
            href={CONTACT.phoneHref}
            variant="outline"
            size="lg"
            className="border-white/15 text-white hover:border-white/30 hover:bg-white/5"
          >
            <Phone className="h-4 w-4" />
            {CONTACT.phone}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
