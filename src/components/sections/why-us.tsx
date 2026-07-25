import { ClipboardCheck, Handshake, MapPin, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";

interface Value {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const VALUES: Value[] = [
  {
    Icon: ShieldCheck,
    title: "Transparence totale",
    description:
      "État, historique et caractéristiques de chaque véhicule sont présentés clairement, sans mauvaise surprise.",
  },
  {
    Icon: Handshake,
    title: "Accompagnement personnalisé",
    description:
      "Un interlocuteur unique vous guide du choix du véhicule jusqu'à la remise des clés.",
  },
  {
    Icon: ClipboardCheck,
    title: "Véhicules sélectionnés",
    description:
      "Chaque véhicule est vérifié avant sa mise en vente pour vous garantir une qualité constante.",
  },
  {
    Icon: MapPin,
    title: "Proximité",
    description:
      "Un garage indépendant à Eghezée, à taille humaine et à l'écoute de ses clients.",
  },
];

export function WhyUs() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Pourquoi BD Automobile
          </span>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Un garage qui inspire confiance
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} index={i}>
              <Card className="flex h-full flex-col gap-4 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <value.Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-ink">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-anthracite-light/80">
                  {value.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
