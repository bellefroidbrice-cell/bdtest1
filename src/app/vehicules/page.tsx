import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { VehiclesExplorer } from "@/components/vehicles/vehicles-explorer";
import { PLACEHOLDER_VEHICLES } from "@/lib/vehicles-placeholder";

export const metadata: Metadata = {
  title: "Véhicules disponibles",
  description:
    "Découvrez tous les véhicules d'occasion et récents disponibles chez BD Automobile à Eghezée : Peugeot, Renault, Volkswagen, Kia et bien d'autres marques.",
};

export default function VehiculesPage() {
  return (
    <main className="flex flex-1 flex-col py-16">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Notre catalogue
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Véhicules disponibles
          </h1>
        </div>

        <VehiclesExplorer vehicles={PLACEHOLDER_VEHICLES} />
      </Container>
    </main>
  );
}
