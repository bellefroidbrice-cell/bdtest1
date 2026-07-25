import { ShieldCheck } from "lucide-react";

import { DotGrid } from "@/components/decor/dot-grid";
import { Glow } from "@/components/decor/glow";
import { ParallaxLayer } from "@/components/decor/parallax-layer";
import { TechLines } from "@/components/decor/tech-lines";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink py-28">
      <ParallaxLayer>
        <Glow tone="dark" />
        <DotGrid tone="dark" />
      </ParallaxLayer>
      <TechLines className="absolute inset-0 h-full w-full text-accent/70" />

      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            Garage indépendant à Eghezée
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Votre prochain véhicule d&apos;occasion,
            <br className="hidden sm:block" /> choisi avec soin.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="max-w-xl text-base text-white/60 sm:text-lg">
            Vente de véhicules récents et d&apos;occasion, contrôlés et
            présentés en toute transparence. Peugeot, Renault, Volkswagen,
            Kia et bien d&apos;autres marques généralistes.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button href="/vehicules" variant="primary" size="lg">
            Voir les véhicules
          </Button>
          <Button
            href="/contact"
            variant="outline"
            size="lg"
            className="border-white/15 text-white hover:border-white/30 hover:bg-white/5"
          >
            Nous contacter
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
