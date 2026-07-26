"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";

import { deleteVehiclePhoto } from "./actions";

interface ExistingPhoto {
  id: string;
  url: string;
}

export function ExistingPhotos({
  photos,
  vehicleId,
}: {
  photos: ExistingPhoto[];
  vehicleId: string;
}) {
  const [isPending, startTransition] = useTransition();

  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative h-28 overflow-hidden rounded-xl border border-line"
        >
          <Image
            src={photo.url}
            alt=""
            fill
            sizes="200px"
            className="object-cover"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                deleteVehiclePhoto(photo.id, vehicleId);
              })
            }
            aria-label="Supprimer cette photo"
            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
