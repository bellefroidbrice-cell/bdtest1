import type { Vehicle, VehiclePhoto } from "@/generated/prisma/client";
import type {
  FuelType,
  Transmission,
  VehicleDetail,
  VehiclePreview,
  VehicleStatus,
} from "@/types/vehicle";

const FUEL_LABELS: Record<string, FuelType> = {
  ESSENCE: "Essence",
  DIESEL: "Diesel",
  HYBRIDE: "Hybride",
  ELECTRIQUE: "Électrique",
};

const TRANSMISSION_LABELS: Record<string, Transmission> = {
  MANUELLE: "Manuelle",
  AUTOMATIQUE: "Automatique",
};

const STATUS_MAP: Record<string, VehicleStatus> = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  SOLD: "sold",
};

const NEW_THRESHOLD_DAYS = 14;

function isRecentlyAdded(createdAt: Date) {
  const daysSinceAdded =
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceAdded <= NEW_THRESHOLD_DAYS;
}

export function toVehiclePreview(
  vehicle: Vehicle & { photos?: Pick<VehiclePhoto, "url">[] },
): VehiclePreview {
  return {
    id: vehicle.id,
    slug: vehicle.slug,
    brand: vehicle.brand,
    model: vehicle.model,
    version: vehicle.version ?? undefined,
    year: vehicle.year,
    mileageKm: vehicle.mileageKm,
    fuel: FUEL_LABELS[vehicle.fuel] ?? "Essence",
    transmission: TRANSMISSION_LABELS[vehicle.transmission] ?? "Manuelle",
    powerHp: vehicle.powerHp ?? undefined,
    color: vehicle.color ?? undefined,
    price: vehicle.price,
    status: STATUS_MAP[vehicle.status] ?? "available",
    isNew: isRecentlyAdded(vehicle.createdAt),
    createdAt: vehicle.createdAt.toISOString(),
    photoUrl: vehicle.photos?.[0]?.url,
  };
}

export function toVehicleDetail(
  vehicle: Vehicle & { photos: Pick<VehiclePhoto, "url">[] },
): VehicleDetail {
  return {
    ...toVehiclePreview(vehicle),
    doors: vehicle.doors ?? undefined,
    seats: vehicle.seats ?? undefined,
    co2EmissionsGKm: vehicle.co2EmissionsGKm ?? undefined,
    consumptionL100km: vehicle.consumptionL100km ?? undefined,
    description: vehicle.description ?? undefined,
    warranty: vehicle.warranty ?? undefined,
    previousOwners: vehicle.previousOwners ?? undefined,
    interiorCondition: vehicle.interiorCondition ?? undefined,
    exteriorCondition: vehicle.exteriorCondition ?? undefined,
    importantNotes: vehicle.importantNotes ?? undefined,
    photos: vehicle.photos.map((p) => p.url),
  };
}
