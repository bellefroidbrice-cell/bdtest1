import { Calendar, Car, Cog, Fuel, Gauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge, vehicleStatusLabels } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatMileage, formatPrice } from "@/lib/format";
import type { VehiclePreview } from "@/types/vehicle";

const STATUS_BADGE_VARIANT = {
  available: "available",
  reserved: "reserved",
  sold: "sold",
} as const;

export function VehiclePreviewCard({ vehicle }: { vehicle: VehiclePreview }) {
  return (
    <Link href={`/vehicules/${vehicle.slug}`} className="block">
      <Card
        interactive
        className="group relative flex flex-col overflow-hidden p-0"
      >
        <span className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />

        <div className="relative h-48 overflow-hidden bg-mist">
          {vehicle.photoUrl ? (
            <Image
              src={vehicle.photoUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full scale-100 items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
              <Car className="h-12 w-12 text-anthracite-light/30" />
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            {vehicle.isNew && <Badge variant="new">Nouveau</Badge>}
            <Badge variant={STATUS_BADGE_VARIANT[vehicle.status]}>
              {vehicleStatusLabels[vehicle.status]}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <div>
            <h3 className="text-base font-semibold text-ink">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.version && (
              <p className="text-sm text-anthracite-light/70">{vehicle.version}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-sm text-anthracite-light/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-anthracite-light/50" />
              {vehicle.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-anthracite-light/50" />
              {formatMileage(vehicle.mileageKm)}
            </span>
            <span className="flex items-center gap-1.5">
              <Fuel className="h-3.5 w-3.5 text-anthracite-light/50" />
              {vehicle.fuel}
            </span>
            <span className="flex items-center gap-1.5">
              <Cog className="h-3.5 w-3.5 text-anthracite-light/50" />
              {vehicle.transmission}
            </span>
          </div>

          <div className="mt-2 border-t border-line pt-3">
            <span className="font-mono text-xl font-semibold text-ink">
              {formatPrice(vehicle.price)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
