import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { Vehicle } from "@/generated/prisma/client";

import { VehicleRow } from "./vehicle-row";

export default async function AdminVehiclesPage() {
  let vehicles: Vehicle[] = [];
  let dbError = false;

  try {
    vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Failed to load vehicles", error);
    dbError = true;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Véhicules</h1>
        <Button href="/admin/vehicules/nouveau" variant="primary">
          <Plus className="h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </div>

      {dbError && (
        <div className="rounded-xl border border-accent/30 bg-accent-soft p-4 text-sm text-accent-dark">
          Impossible de charger les véhicules : la base de données n&apos;est
          pas encore connectée. Une fois Neon configuré, vos véhicules
          apparaîtront ici.
        </div>
      )}

      {!dbError && vehicles.length === 0 && (
        <div className="rounded-card border border-dashed border-line p-12 text-center text-sm text-anthracite-light/70">
          Aucun véhicule pour l&apos;instant. Ajoutez-en un pour commencer.
        </div>
      )}

      {!dbError && vehicles.length > 0 && (
        <div className="overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-anthracite-light/60">
              <tr>
                <th className="px-4 py-3">Véhicule</th>
                <th className="px-4 py-3">Année</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {vehicles.map((vehicle) => (
                <VehicleRow key={vehicle.id} vehicle={vehicle} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
