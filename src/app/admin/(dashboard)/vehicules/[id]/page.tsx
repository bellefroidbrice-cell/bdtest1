import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { updateVehicle } from "../actions";
import { VehicleForm } from "../vehicle-form";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let vehicle;
  try {
    vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { photos: { orderBy: { position: "asc" } } },
    });
  } catch (error) {
    console.error("Failed to load vehicle", error);
    return (
      <div className="rounded-xl border border-accent/30 bg-accent-soft p-4 text-sm text-accent-dark">
        Impossible de charger ce véhicule : la base de données n&apos;est pas
        encore connectée.
      </div>
    );
  }

  if (!vehicle) {
    notFound();
  }

  const boundUpdate = updateVehicle.bind(null, vehicle.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-ink">
        Modifier {vehicle.brand} {vehicle.model}
      </h1>
      <VehicleForm
        action={boundUpdate}
        defaultValues={vehicle}
        submitLabel="Enregistrer"
        vehicleId={vehicle.id}
        existingPhotos={vehicle.photos}
      />
    </div>
  );
}
