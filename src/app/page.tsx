import { ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { DotGrid } from "@/components/decor/dot-grid";
import { Glow } from "@/components/decor/glow";
import { ParallaxLayer } from "@/components/decor/parallax-layer";
import { TechLines } from "@/components/decor/tech-lines";
import { Reveal } from "@/components/motion/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STATS = [
  { value: 12, suffix: " ans", label: "d'expérience" },
  { value: 800, suffix: "+", label: "véhicules vendus" },
  { value: 98, suffix: "%", label: "clients satisfaits" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-24 pt-24">
      <section className="relative overflow-hidden bg-ink py-16">
        <ParallaxLayer>
          <Glow tone="dark" />
          <DotGrid tone="dark" />
        </ParallaxLayer>
        <TechLines className="absolute inset-0 h-full w-full text-accent/70" />

        <Container className="relative flex flex-col items-center gap-4 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Garage indépendant de confiance
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Le design system est en place.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-md text-base text-white/60">
              Prochaine étape : la vraie page d&apos;accueil, dès votre
              validation.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="flex flex-col items-center gap-6">
        <Reveal className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Voir les véhicules</Button>
          <Button variant="dark">Nous contacter</Button>
          <Button variant="outline">En savoir plus</Button>
          <Button variant="ghost">Annuler</Button>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="available">Disponible</Badge>
          <Badge variant="reserved">Réservé</Badge>
          <Badge variant="sold">Vendu</Badge>
          <Badge variant="new">Nouveau</Badge>
        </Reveal>
      </Container>

      <Container className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Reveal key={i} index={i - 1}>
            <Card
              interactive
              className="group relative flex flex-col gap-3 overflow-hidden p-6"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">
                  Exemple de carte véhicule
                </span>
                <Badge variant="available">Disponible</Badge>
              </div>
              <div className="h-40 overflow-hidden rounded-lg bg-mist">
                <div className="h-full w-full scale-100 bg-mist transition-transform duration-500 ease-out group-hover:scale-105" />
              </div>
              <p className="text-sm text-anthracite-light/80">
                Photo, badge et carte s&apos;animent au survol — c&apos;est la
                base des futures fiches véhicules.
              </p>
            </Card>
          </Reveal>
        ))}
      </Container>

      <section className="relative overflow-hidden bg-anthracite py-16">
        <Glow tone="dark" className="opacity-60" />
        <DotGrid tone="dark" />
        <Container className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} index={i}>
              <div className="flex flex-col items-center gap-1">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-mono text-4xl font-semibold tracking-tight text-white"
                />
                <span className="text-sm text-white/60">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>
    </main>
  );
}
