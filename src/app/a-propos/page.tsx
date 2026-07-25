import { BadgeCheck, Car, Heart, MapPin, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import type { ComponentType } from "react";

import { Cta } from "@/components/sections/cta";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez BD Automobile, garage automobile indépendant à Eghezée : notre vision, nos valeurs et notre approche du métier.",
};

interface Value {
  Icon: ComponentType<{ className?: string }>;
  label: string;
}

const VALUES: Value[] = [
  { Icon: ShieldCheck, label: "Transparence" },
  { Icon: MapPin, label: "Proximité" },
  { Icon: Heart, label: "Passion automobile" },
  { Icon: BadgeCheck, label: "Qualité" },
];

export default function AProposPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="py-16">
        <Container className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium uppercase tracking-widest text-accent">
              À propos
            </span>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Un garage à taille humaine, à Eghezée
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal className="flex flex-col gap-5 text-base leading-relaxed text-anthracite-light/80">
              <p>
                BD Automobile est un garage automobile indépendant, fondé et
                dirigé par Didier, avec une conviction simple : acheter un
                véhicule d&apos;occasion devrait être une expérience sereine,
                pas un pari.
              </p>
              <p>
                Chaque véhicule qui entre sur notre parc est choisi et
                présenté avec le même soin, pour que nos clients puissent
                acheter en toute confiance — sans mauvaise surprise, sans
                jargon inutile, avec des réponses claires à chaque question.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex h-64 items-center justify-center rounded-card bg-mist sm:h-80">
                <Car className="h-12 w-12 text-anthracite-light/30" />
              </div>
            </Reveal>
          </div>

          <Reveal className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Notre vision
            </h2>
            <p className="text-base leading-relaxed text-anthracite-light/80">
              Nous croyons qu&apos;un garage indépendant peut offrir un
              service aussi sérieux et transparent qu&apos;une grande
              enseigne — sans en avoir la froideur. C&apos;est cette
              proximité, faite d&apos;écoute et de disponibilité, qui nous
              anime au quotidien.
            </p>
          </Reveal>

          <Reveal className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {VALUES.map((value) => (
              <Card
                key={value.label}
                className="flex flex-col items-center gap-3 p-6 text-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <value.Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-ink">
                  {value.label}
                </span>
              </Card>
            ))}
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex h-48 items-center justify-center rounded-card bg-mist"
              >
                <Car className="h-8 w-8 text-anthracite-light/30" />
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <Cta />
    </main>
  );
}
