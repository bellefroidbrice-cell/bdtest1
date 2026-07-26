import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { OurGarage } from "@/components/sections/our-garage";
import { Reviews } from "@/components/sections/reviews";
import { Services } from "@/components/sections/services";
import { VehiclesPreview } from "@/components/sections/vehicles-preview";
import { WhyUs } from "@/components/sections/why-us";
import { prisma } from "@/lib/prisma";
import { toVehiclePreview } from "@/lib/vehicle-mapper";
import type { VehiclePreview } from "@/types/vehicle";

export const revalidate = 60;

async function getPreviewVehicles(): Promise<VehiclePreview[]> {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: { not: "SOLD" } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 3,
      include: { photos: { orderBy: { position: "asc" }, take: 1 } },
    });
    return vehicles.map(toVehiclePreview);
  } catch (error) {
    console.error("Failed to load preview vehicles", error);
    return [];
  }
}

export default async function Home() {
  const vehicles = await getPreviewVehicles();

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <WhyUs />
      <OurGarage />
      <Services />
      <VehiclesPreview vehicles={vehicles} />
      <Reviews />
      <Faq />
      <Cta />
    </main>
  );
}
