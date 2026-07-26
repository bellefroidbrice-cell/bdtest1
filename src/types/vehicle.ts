export type FuelType = "Essence" | "Diesel" | "Hybride" | "Électrique";
export type Transmission = "Manuelle" | "Automatique";
export type VehicleStatus = "available" | "reserved" | "sold";

/**
 * Forme des données véhicule utilisée par les composants d'affichage,
 * dérivée du modèle Prisma via src/lib/vehicle-mapper.ts.
 */
export interface VehiclePreview {
  id: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  mileageKm: number;
  fuel: FuelType;
  transmission: Transmission;
  powerHp?: number;
  color?: string;
  price: number;
  status: VehicleStatus;
  isNew?: boolean;
  /** Date d'ajout à l'inventaire (ISO), utilisée pour le tri "plus récent". */
  createdAt: string;
  /** URL de la première photo, si au moins une a été ajoutée. */
  photoUrl?: string;
}
