import { z } from "zod";

function optionalNumber<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : value),
    schema.optional(),
  );
}

function optionalString() {
  return z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : value),
    z.string().trim().optional(),
  );
}

export const vehicleFormSchema = z.object({
  brand: z.string().trim().min(1, "La marque est requise."),
  model: z.string().trim().min(1, "Le modèle est requis."),
  version: optionalString(),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
  mileageKm: z.coerce.number().int().min(0),
  fuel: z.enum(["ESSENCE", "DIESEL", "HYBRIDE", "ELECTRIQUE"]),
  transmission: z.enum(["MANUELLE", "AUTOMATIQUE"]),
  powerHp: optionalNumber(z.coerce.number().int().min(0)),
  price: z.coerce.number().int().min(0),
  color: optionalString(),
  doors: optionalNumber(z.coerce.number().int().min(0)),
  seats: optionalNumber(z.coerce.number().int().min(0)),
  co2EmissionsGKm: optionalNumber(z.coerce.number().int().min(0)),
  consumptionL100km: optionalNumber(z.coerce.number().min(0)),
  description: optionalString(),
  warranty: optionalString(),
  previousOwners: optionalNumber(z.coerce.number().int().min(0)),
  interiorCondition: optionalString(),
  exteriorCondition: optionalString(),
  importantNotes: optionalString(),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]),
  isFeatured: z.coerce.boolean().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export const FUEL_OPTIONS = [
  { value: "ESSENCE", label: "Essence" },
  { value: "DIESEL", label: "Diesel" },
  { value: "HYBRIDE", label: "Hybride" },
  { value: "ELECTRIQUE", label: "Électrique" },
] as const;

export const TRANSMISSION_OPTIONS = [
  { value: "MANUELLE", label: "Manuelle" },
  { value: "AUTOMATIQUE", label: "Automatique" },
] as const;

export const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Disponible" },
  { value: "RESERVED", label: "Réservé" },
  { value: "SOLD", label: "Vendu" },
] as const;
