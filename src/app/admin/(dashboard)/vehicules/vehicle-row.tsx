"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

import type { Vehicle } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/format";
import { STATUS_OPTIONS } from "@/lib/validations/vehicle";

import { deleteVehicle, updateVehicleStatus } from "./actions";

export function VehicleRow({ vehicle }: { vehicle: Vehicle }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: string) => {
    startTransition(() => {
      updateVehicleStatus(vehicle.id, status as "AVAILABLE" | "RESERVED" | "SOLD");
    });
  };

  const handleDelete = () => {
    if (!window.confirm(`Supprimer ${vehicle.brand} ${vehicle.model} ?`)) return;
    startTransition(() => {
      deleteVehicle(vehicle.id);
    });
  };

  return (
    <tr className="text-ink">
      <td className="px-4 py-3">
        <span className="font-medium">
          {vehicle.brand} {vehicle.model}
        </span>
        {vehicle.version && (
          <span className="block text-xs text-anthracite-light/60">
            {vehicle.version}
          </span>
        )}
      </td>
      <td className="px-4 py-3">{vehicle.year}</td>
      <td className="px-4 py-3 font-mono">{formatPrice(vehicle.price)}</td>
      <td className="px-4 py-3">
        <select
          value={vehicle.status}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink focus:border-ink focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/vehicules/${vehicle.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-anthracite-light hover:bg-mist hover:text-ink"
            aria-label="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex h-8 w-8 items-center justify-center rounded-full text-anthracite-light hover:bg-accent-soft hover:text-accent"
            aria-label="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
