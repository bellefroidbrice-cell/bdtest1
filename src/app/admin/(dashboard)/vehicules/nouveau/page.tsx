import { createVehicle } from "../actions";
import { VehicleForm } from "../vehicle-form";

export default function NewVehiclePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-ink">Ajouter un véhicule</h1>
      <VehicleForm action={createVehicle} submitLabel="Créer le véhicule" />
    </div>
  );
}
