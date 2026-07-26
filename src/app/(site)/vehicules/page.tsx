import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { VehiclesExplorer } from "@/components/vehicles/vehicles-explorer";
import { prisma } from "@/lib/prisma";
import { toVehiclePreview } from "@/lib/vehicle-mapper";
import type { VehiclePreview } from "@/types/vehicle";

export const metadata: Metadata = {
  title: "Véhicules disponibles",
  description:
    "Découvrez tous les véhicules d'occasion et récents disponibles chez BD Automobile à Eghezée : Peugeot, Renault, Volkswagen, Kia et bien d'autres marques.",
};

export const revalidate = 60;

async function getVehicles(): Promise<VehiclePreview[]> {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: { not: "SOLD" } },
      orderBy: { createdAt: "desc" },
      include: { photos: { orderBy: { position: "asc" }, take: 1 } },
    });
    return vehicles.map(toVehiclePreview);
  } catch (error) {
    console.error("Failed to load vehicles", error);
    return [];
  }
}

export default async function VehiculesPage() {
  const vehicles = await getVehicles();

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

        <VehiclesExplorer vehicles={vehicles} />
      </Container>
    </main>
  );
}
