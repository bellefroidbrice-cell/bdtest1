import { Clock, MapPin, Navigation } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { CONTACT, OPENING_HOURS } from "@/lib/nav";

const GARAGE_PHOTO_URL =
  "https://res.cloudinary.com/q3h3kvk6/image/upload/q_auto,f_auto/v1785098039/IMG_7734_lxmwqu.webp";

export function OurGarage() {
  return (
    <section className="py-24">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-card border border-line">
          <Image
            src={GARAGE_PHOTO_URL}
            alt="Le garage BD Automobile à Eghezée, avec son parc de véhicules"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal index={1} className="flex flex-col gap-5">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Notre garage
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Un garage à taille humaine, en plein cœur d&apos;Eghezée
          </h2>
          <p className="text-base leading-relaxed text-anthracite-light/80">
            Venez découvrir notre parc de véhicules sur place, échanger avec
            nous et essayer le véhicule qui vous intéresse. Pas de rendez-vous
            obligatoire pour venir jeter un œil.
          </p>

          <div className="flex flex-col gap-3 border-t border-line pt-5">
            <span className="flex items-start gap-3 text-sm text-ink">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {CONTACT.address}
            </span>
            {OPENING_HOURS.map((slot) => (
              <span key={slot.label} className="flex items-start gap-3 text-sm text-ink">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {slot.label}
                <span className="text-anthracite-light/70">{slot.hours}</span>
              </span>
            ))}
          </div>

          <Button
            href={CONTACT.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            className="mt-2 self-start"
          >
            <Navigation className="h-4 w-4" />
            Itinéraire
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
