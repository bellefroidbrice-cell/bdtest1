export type FuelType = "Essence" | "Diesel" | "Hybride" | "Électrique";
export type Transmission = "Manuelle" | "Automatique";
export type VehicleStatus = "available" | "reserved" | "sold";

/**
 * Forme des données véhicule utilisée par les composants d'affichage,
 * dérivée du modèle Prisma via src/lib/vehicle-mapper.ts.
 */
export interface VehiclePreview {
  id: string;
  slug: string;
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

/**
 * Fiche véhicule complète, utilisée par la page de détail /vehicules/[slug].
 */
export interface VehicleDetail extends VehiclePreview {
  doors?: number;
  seats?: number;
  co2EmissionsGKm?: number;
  consumptionL100km?: number;
  description?: string;
  warranty?: string;
  previousOwners?: number;
  interiorCondition?: string;
  exteriorCondition?: string;
  importantNotes?: string;
  photos: string[];
}
