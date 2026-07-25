import type { VehiclePreview } from "@/types/vehicle";

/**
 * Véhicules d'exemple, en attendant le vrai inventaire (modèle Prisma +
 * saisie via l'administration). À remplacer par une requête à la base
 * de données une fois le modèle Vehicle en place.
 */
export const PLACEHOLDER_VEHICLES: VehiclePreview[] = [
  {
    id: "1",
    brand: "Peugeot",
    model: "208",
    version: "1.2 PureTech Active",
    year: 2021,
    mileageKm: 42000,
    fuel: "Essence",
    transmission: "Manuelle",
    price: 14990,
    status: "available",
    isNew: true,
  },
  {
    id: "2",
    brand: "Volkswagen",
    model: "Golf",
    version: "1.6 TDI Comfortline",
    year: 2019,
    mileageKm: 78000,
    fuel: "Diesel",
    transmission: "Manuelle",
    price: 15490,
    status: "available",
  },
  {
    id: "3",
    brand: "Kia",
    model: "Sportage",
    version: "1.6 CRDi Drive",
    year: 2020,
    mileageKm: 63000,
    fuel: "Diesel",
    transmission: "Automatique",
    price: 19990,
    status: "reserved",
  },
];
