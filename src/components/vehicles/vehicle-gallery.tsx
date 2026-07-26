"use client";

import { Car, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function VehicleGallery({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-card border border-line bg-mist sm:h-[420px]">
        <Car className="h-16 w-16 text-anthracite-light/30" />
      </div>
    );
  }

  const showPrevious = () =>
    setActiveIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const showNext = () =>
    setActiveIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-72 w-full overflow-hidden rounded-card border border-line bg-mist sm:h-[420px]">
        <Image
          key={photos[activeIndex]}
          src={photos[activeIndex]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover"
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-white">
              {activeIndex + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Voir la photo ${index + 1}`}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                index === activeIndex ? "border-accent" : "border-transparent",
              )}
            >
              <Image src={photo} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
