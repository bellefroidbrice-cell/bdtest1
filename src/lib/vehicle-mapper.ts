import type { Vehicle } from "@/generated/prisma/client";
import type {
  FuelType,
  Transmission,
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

export function toVehiclePreview(vehicle: Vehicle): VehiclePreview {
  return {
    id: vehicle.id,
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
  };
}
