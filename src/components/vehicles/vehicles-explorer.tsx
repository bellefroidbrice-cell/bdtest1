"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { VehiclePreviewCard } from "@/components/vehicles/vehicle-preview-card";
import type { VehiclePreview } from "@/types/vehicle";

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc" | "mileage-asc";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Plus récent",
  oldest: "Plus ancien",
  "price-asc": "Prix croissant",
  "price-desc": "Prix décroissant",
  "mileage-asc": "Kilométrage",
};

const ALL = "all";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function VehiclesExplorer({ vehicles }: { vehicles: VehiclePreview[] }) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState(ALL);
  const [fuel, setFuel] = useState(ALL);
  const [transmission, setTransmission] = useState(ALL);
  const [color, setColor] = useState(ALL);
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  // Les véhicules vendus ont leur propre section ailleurs, pas dans le catalogue.
  const catalog = useMemo(
    () => vehicles.filter((v) => v.status !== "sold"),
    [vehicles],
  );

  const brands = useMemo(
    () => Array.from(new Set(catalog.map((v) => v.brand))).sort(),
    [catalog],
  );
  const colors = useMemo(
    () =>
      Array.from(new Set(catalog.map((v) => v.color).filter((c): c is string => Boolean(c)))).sort(),
    [catalog],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = catalog.filter((v) => {
      if (
        query &&
        !`${v.brand} ${v.model} ${v.version ?? ""}`.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (brand !== ALL && v.brand !== brand) return false;
      if (fuel !== ALL && v.fuel !== fuel) return false;
      if (transmission !== ALL && v.transmission !== transmission) return false;
      if (color !== ALL && v.color !== color) return false;
      if (maxPrice && v.price > Number(maxPrice)) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "mileage-asc":
          return a.mileageKm - b.mileageKm;
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [catalog, search, brand, fuel, transmission, color, maxPrice, sort]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-card border border-line bg-white p-5 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-anthracite-light/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une marque, un modèle..."
            className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-anthracite-light/50 focus:border-ink focus:outline-none"
          />
        </div>

        <SelectField
          label="Marque"
          value={brand}
          onChange={setBrand}
          options={[
            { value: ALL, label: "Toutes les marques" },
            ...brands.map((b) => ({ value: b, label: b })),
          ]}
        />
        <SelectField
          label="Carburant"
          value={fuel}
          onChange={setFuel}
          options={[
            { value: ALL, label: "Tous carburants" },
            { value: "Essence", label: "Essence" },
            { value: "Diesel", label: "Diesel" },
            { value: "Hybride", label: "Hybride" },
            { value: "Électrique", label: "Électrique" },
          ]}
        />
        <SelectField
          label="Transmission"
          value={transmission}
          onChange={setTransmission}
          options={[
            { value: ALL, label: "Toutes transmissions" },
            { value: "Manuelle", label: "Manuelle" },
            { value: "Automatique", label: "Automatique" },
          ]}
        />
        <SelectField
          label="Couleur"
          value={color}
          onChange={setColor}
          options={[
            { value: ALL, label: "Toutes couleurs" },
            ...colors.map((c) => ({ value: c, label: c })),
          ]}
        />
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Prix max (€)"
          className="w-32 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-anthracite-light/50 focus:border-ink focus:outline-none"
        />
        <SelectField
          label="Trier par"
          value={sort}
          onChange={(v) => setSort(v as SortOption)}
          options={(Object.keys(SORT_LABELS) as SortOption[]).map((key) => ({
            value: key,
            label: SORT_LABELS[key],
          }))}
        />
      </div>

      <p className="text-sm text-anthracite-light/70">
        {filtered.length} véhicule{filtered.length > 1 ? "s" : ""} trouvé
        {filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vehicle) => (
            <VehiclePreviewCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-line py-16 text-center">
          <p className="text-base font-medium text-ink">
            Aucun véhicule ne correspond à ces critères
          </p>
          <p className="text-sm text-anthracite-light/70">
            Essayez d&apos;élargir votre recherche.
          </p>
        </div>
      )}
    </div>
  );
}
