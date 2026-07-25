import type { Metadata } from "next";

import { Cta } from "@/components/sections/cta";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SERVICES } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Découvrez les services de BD Automobile à Eghezée : vente, reprise, recherche personnalisée, mécanique générale et accompagnement administratif.",
};

export default function ServicesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="py-16">
        <Container className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium uppercase tracking-widest text-accent">
              Nos services
            </span>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Un accompagnement complet, à chaque étape
            </h1>
          </div>

          <div className="flex flex-col gap-6">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} index={i}>
                <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                    <service.Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-ink">
                      {service.title}
                    </h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-anthracite-light/80">
                      {service.details}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Cta />
    </main>
  );
}
