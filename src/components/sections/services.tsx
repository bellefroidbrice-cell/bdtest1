import { ArrowLeftRight, Car, FileText, MessageCircle, Search } from "lucide-react";
import type { ComponentType } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";

interface Service {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    Icon: Car,
    title: "Vente de véhicules",
    description:
      "Un large choix de véhicules d'occasion et récents, de marques généralistes.",
  },
  {
    Icon: ArrowLeftRight,
    title: "Reprise de véhicule",
    description:
      "Nous reprenons votre ancien véhicule lors de l'achat d'une nouvelle voiture.",
  },
  {
    Icon: Search,
    title: "Recherche personnalisée",
    description:
      "Vous cherchez un modèle précis ? Nous le trouvons pour vous selon vos critères.",
  },
  {
    Icon: MessageCircle,
    title: "Conseils & accompagnement",
    description:
      "Des conseils honnêtes pour vous aider à choisir le véhicule qui vous correspond.",
  },
  {
    Icon: FileText,
    title: "Accompagnement administratif",
    description:
      "Immatriculation et formalités : nous simplifions les démarches liées à votre achat.",
  },
];

export function Services() {
  return (
    <section className="bg-mist py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Nos services
          </span>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Un accompagnement complet
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} index={i}>
              <Card interactive className="flex h-full flex-col gap-4 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
                  <service.Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-ink">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-anthracite-light/80">
                  {service.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
