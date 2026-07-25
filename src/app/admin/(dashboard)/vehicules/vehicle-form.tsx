"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  FUEL_OPTIONS,
  STATUS_OPTIONS,
  TRANSMISSION_OPTIONS,
} from "@/lib/validations/vehicle";

import type { VehicleFormState } from "./actions";

const inputClasses =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-anthracite-light/50 focus:border-ink focus:outline-none";

interface VehicleFormDefaults {
  brand?: string;
  model?: string;
  version?: string | null;
  year?: number;
  mileageKm?: number;
  fuel?: string;
  transmission?: string;
  powerHp?: number | null;
  price?: number;
  color?: string | null;
  doors?: number | null;
  seats?: number | null;
  co2EmissionsGKm?: number | null;
  consumptionL100km?: number | null;
  description?: string | null;
  warranty?: string | null;
  previousOwners?: number | null;
  interiorCondition?: string | null;
  exteriorCondition?: string | null;
  importantNotes?: string | null;
  status?: string;
  isFeatured?: boolean;
}

interface VehicleFormProps {
  action: (state: VehicleFormState, formData: FormData) => Promise<VehicleFormState>;
  defaultValues?: VehicleFormDefaults;
  submitLabel: string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">{label}</label>
      {children}
    </div>
  );
}

export function VehicleForm({ action, defaultValues, submitLabel }: VehicleFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const d = defaultValues ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <fieldset className="flex flex-col gap-5">
        <legend className="text-base font-semibold text-ink">
          Informations générales
        </legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Marque">
            <input name="brand" defaultValue={d.brand} required className={inputClasses} />
          </Field>
          <Field label="Modèle">
            <input name="model" defaultValue={d.model} required className={inputClasses} />
          </Field>
          <Field label="Version (optionnel)">
            <input name="version" defaultValue={d.version ?? ""} className={inputClasses} />
          </Field>
          <Field label="Année">
            <input
              type="number"
              name="year"
              defaultValue={d.year}
              required
              className={inputClasses}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="text-base font-semibold text-ink">
          Caractéristiques techniques
        </legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Kilométrage (km)">
            <input
              type="number"
              name="mileageKm"
              defaultValue={d.mileageKm}
              required
              className={inputClasses}
            />
          </Field>
          <Field label="Carburant">
            <select name="fuel" defaultValue={d.fuel ?? "ESSENCE"} className={inputClasses}>
              {FUEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Transmission">
            <select
              name="transmission"
              defaultValue={d.transmission ?? "MANUELLE"}
              className={inputClasses}
            >
              {TRANSMISSION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Puissance (ch, optionnel)">
            <input
              type="number"
              name="powerHp"
              defaultValue={d.powerHp ?? ""}
              className={inputClasses}
            />
          </Field>
          <Field label="Couleur (optionnel)">
            <input name="color" defaultValue={d.color ?? ""} className={inputClasses} />
          </Field>
          <Field label="Portes (optionnel)">
            <input
              type="number"
              name="doors"
              defaultValue={d.doors ?? ""}
              className={inputClasses}
            />
          </Field>
          <Field label="Places (optionnel)">
            <input
              type="number"
              name="seats"
              defaultValue={d.seats ?? ""}
              className={inputClasses}
            />
          </Field>
          <Field label="Émissions CO2 g/km (optionnel)">
            <input
              type="number"
              name="co2EmissionsGKm"
              defaultValue={d.co2EmissionsGKm ?? ""}
              className={inputClasses}
            />
          </Field>
          <Field label="Consommation L/100km (optionnel)">
            <input
              type="number"
              step="0.1"
              name="consumptionL100km"
              defaultValue={d.consumptionL100km ?? ""}
              className={inputClasses}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="text-base font-semibold text-ink">
          Prix &amp; statut
        </legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Prix (€)">
            <input
              type="number"
              name="price"
              defaultValue={d.price}
              required
              className={inputClasses}
            />
          </Field>
          <Field label="Statut">
            <select name="status" defaultValue={d.status ?? "AVAILABLE"} className={inputClasses}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mise en avant">
            <label className="flex items-center gap-2 pt-2 text-sm text-ink">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={d.isFeatured}
                className="h-4 w-4 rounded border-line"
              />
              Mettre ce véhicule en avant
            </label>
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="text-base font-semibold text-ink">
          Confiance &amp; état
        </legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Garantie (optionnel)">
            <input name="warranty" defaultValue={d.warranty ?? ""} className={inputClasses} />
          </Field>
          <Field label="Nombre de propriétaires précédents (optionnel)">
            <input
              type="number"
              name="previousOwners"
              defaultValue={d.previousOwners ?? ""}
              className={inputClasses}
            />
          </Field>
          <Field label="État intérieur (optionnel)">
            <input
              name="interiorCondition"
              defaultValue={d.interiorCondition ?? ""}
              className={inputClasses}
            />
          </Field>
          <Field label="État extérieur (optionnel)">
            <input
              name="exteriorCondition"
              defaultValue={d.exteriorCondition ?? ""}
              className={inputClasses}
            />
          </Field>
        </div>
        <Field label="Remarques importantes (optionnel)">
          <textarea
            name="importantNotes"
            rows={3}
            defaultValue={d.importantNotes ?? ""}
            className={inputClasses}
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="text-base font-semibold text-ink">Description</legend>
        <Field label="Description complète (optionnel)">
          <textarea
            name="description"
            rows={6}
            defaultValue={d.description ?? ""}
            className={inputClasses}
          />
        </Field>
      </fieldset>

      {state?.error && <p className="text-sm text-accent">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
