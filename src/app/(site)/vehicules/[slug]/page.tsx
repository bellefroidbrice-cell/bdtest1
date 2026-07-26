import {
  Calendar,
  Car,
  CheckCircle2,
  Cog,
  DoorOpen,
  Droplets,
  Fuel,
  Gauge,
  Leaf,
  Palette,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Badge, vehicleStatusLabels } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehiclePreviewCard } from "@/components/vehicles/vehicle-preview-card";
import { formatMileage, formatPrice } from "@/lib/format";
import { CONTACT } from "@/lib/nav";
import { prisma } from "@/lib/prisma";
import { toVehicleDetail, toVehiclePreview } from "@/lib/vehicle-mapper";

export const revalidate = 60;

async function getVehicle(slug: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
    include: { photos: { orderBy: { position: "asc" } } },
  });
  return vehicle ? toVehicleDetail(vehicle) : null;
}

async function getSimilarVehicles(brand: string, excludeId: string) {
  const vehicles = await prisma.vehicle.findMany({
    where: { brand, id: { not: excludeId }, status: { not: "SOLD" } },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { photos: { orderBy: { position: "asc" }, take: 1 } },
  });
  return vehicles.map(toVehiclePreview);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const vehicle = await getVehicle(slug);
    if (!vehicle) return {};

    const title = `${vehicle.brand} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ""}`;
    return {
      title,
      description: `${title} (${vehicle.year}) — ${formatMileage(vehicle.mileageKm)}, ${vehicle.fuel}, ${formatPrice(vehicle.price)}. Disponible chez BD Automobile à Eghezée.`,
    };
  } catch {
    return {};
  }
}

const SPEC_ITEMS = [
  { key: "year", icon: Calendar, label: "Année" },
  { key: "mileage", icon: Gauge, label: "Kilométrage" },
  { key: "fuel", icon: Fuel, label: "Carburant" },
  { key: "transmission", icon: Cog, label: "Transmission" },
] as const;

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let vehicle;
  try {
    vehicle = await getVehicle(slug);
  } catch (error) {
    console.error("Failed to load vehicle detail", error);
    return (
      <main className="flex flex-1 items-center justify-center py-24">
        <p className="text-sm text-anthracite-light/70">
          Impossible de charger ce véhicule pour le moment.
        </p>
      </main>
    );
  }

  if (!vehicle) {
    notFound();
  }

  const similarVehicles = await getSimilarVehicles(vehicle.brand, vehicle.id);

  const title = `${vehicle.brand} ${vehicle.model}`;
  const contactHref = `/contact?vehicule=${vehicle.id}&titre=${encodeURIComponent(`${title}${vehicle.version ? ` ${vehicle.version}` : ""} (${vehicle.year})`)}`;

  const specValues: Record<(typeof SPEC_ITEMS)[number]["key"], string> = {
    year: String(vehicle.year),
    mileage: formatMileage(vehicle.mileageKm),
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
  };

  return (
    <main className="flex flex-1 flex-col py-16">
      <Container className="flex flex-col gap-10">
        <nav className="flex items-center gap-2 text-sm text-anthracite-light/70">
          <Link href="/" className="hover:text-ink">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/vehicules" className="hover:text-ink">
            Véhicules
          </Link>
          <span>/</span>
          <span className="text-ink">{title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-3">
            <VehicleGallery photos={vehicle.photos} alt={title} />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {vehicle.isNew && <Badge variant="new">Nouveau</Badge>}
                <Badge variant={vehicle.status}>
                  {vehicleStatusLabels[vehicle.status]}
                </Badge>
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {title}
              </h1>
              {vehicle.version && (
                <p className="mt-1 text-base text-anthracite-light/70">
                  {vehicle.version}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-card border border-line bg-white p-5 sm:grid-cols-4">
              {SPEC_ITEMS.map((item) => (
                <div key={item.key} className="flex flex-col gap-1.5">
                  <item.icon className="h-4 w-4 text-accent" />
                  <span className="text-xs text-anthracite-light/60">{item.label}</span>
                  <span className="text-sm font-medium text-ink">
                    {specValues[item.key]}
                  </span>
                </div>
              ))}
            </div>

            {(vehicle.powerHp ||
              vehicle.color ||
              vehicle.doors ||
              vehicle.seats ||
              vehicle.co2EmissionsGKm ||
              vehicle.consumptionL100km) && (
              <div className="flex flex-col gap-4 rounded-card border border-line bg-white p-5">
                <h2 className="text-base font-semibold text-ink">
                  Caractéristiques complémentaires
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {vehicle.powerHp && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-anthracite-light/60">Puissance</span>
                      <span className="text-sm font-medium text-ink">
                        {vehicle.powerHp} ch
                      </span>
                    </div>
                  )}
                  {vehicle.color && (
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-xs text-anthracite-light/60">
                        <Palette className="h-3.5 w-3.5" /> Couleur
                      </span>
                      <span className="text-sm font-medium text-ink">{vehicle.color}</span>
                    </div>
                  )}
                  {vehicle.doors && (
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-xs text-anthracite-light/60">
                        <DoorOpen className="h-3.5 w-3.5" /> Portes
                      </span>
                      <span className="text-sm font-medium text-ink">{vehicle.doors}</span>
                    </div>
                  )}
                  {vehicle.seats && (
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-xs text-anthracite-light/60">
                        <Users className="h-3.5 w-3.5" /> Places
                      </span>
                      <span className="text-sm font-medium text-ink">{vehicle.seats}</span>
                    </div>
                  )}
                  {vehicle.consumptionL100km && (
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-xs text-anthracite-light/60">
                        <Droplets className="h-3.5 w-3.5" /> Consommation
                      </span>
                      <span className="text-sm font-medium text-ink">
                        {vehicle.consumptionL100km} L/100km
                      </span>
                    </div>
                  )}
                  {vehicle.co2EmissionsGKm && (
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-xs text-anthracite-light/60">
                        <Leaf className="h-3.5 w-3.5" /> Émissions CO2
                      </span>
                      <span className="text-sm font-medium text-ink">
                        {vehicle.co2EmissionsGKm} g/km
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {vehicle.description && (
              <div className="flex flex-col gap-3 rounded-card border border-line bg-white p-5">
                <h2 className="text-base font-semibold text-ink">Description</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-anthracite-light/80">
                  {vehicle.description}
                </p>
              </div>
            )}

            {(vehicle.warranty ||
              vehicle.previousOwners !== undefined ||
              vehicle.interiorCondition ||
              vehicle.exteriorCondition ||
              vehicle.importantNotes) && (
              <div className="flex flex-col gap-4 rounded-card border border-line bg-white p-5">
                <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Confiance &amp; état du véhicule
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {vehicle.warranty && (
                    <div className="flex items-start gap-2 text-sm text-anthracite-light/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      Garantie : {vehicle.warranty}
                    </div>
                  )}
                  {vehicle.previousOwners !== undefined && (
                    <div className="flex items-start gap-2 text-sm text-anthracite-light/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {vehicle.previousOwners} propriétaire
                      {vehicle.previousOwners > 1 ? "s" : ""} précédent
                      {vehicle.previousOwners > 1 ? "s" : ""}
                    </div>
                  )}
                  {vehicle.interiorCondition && (
                    <div className="flex items-start gap-2 text-sm text-anthracite-light/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      État intérieur : {vehicle.interiorCondition}
                    </div>
                  )}
                  {vehicle.exteriorCondition && (
                    <div className="flex items-start gap-2 text-sm text-anthracite-light/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      État extérieur : {vehicle.exteriorCondition}
                    </div>
                  )}
                </div>
                {vehicle.importantNotes && (
                  <p className="rounded-xl bg-mist p-4 text-sm text-anthracite-light/80">
                    {vehicle.importantNotes}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card className="sticky top-24 flex flex-col gap-5 p-6">
              <span className="font-mono text-3xl font-semibold text-ink">
                {formatPrice(vehicle.price)}
              </span>

              {vehicle.status === "sold" ? (
                <p className="rounded-xl bg-mist p-4 text-sm text-anthracite-light/70">
                  Ce véhicule a été vendu. Découvrez des modèles similaires
                  ci-dessous.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button href={contactHref} variant="primary" size="lg">
                    Contacter au sujet de ce véhicule
                  </Button>
                  <Button href={CONTACT.phoneHref} variant="outline" size="lg">
                    <Phone className="h-4 w-4" />
                    {CONTACT.phone}
                  </Button>
                </div>
              )}

              <div className="flex flex-col gap-2 border-t border-line pt-4 text-sm text-anthracite-light/70">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-accent" />
                  Véhicule contrôlé et prêt à rouler
                </div>
              </div>
            </Card>
          </div>
        </div>

        {similarVehicles.length > 0 && (
          <div className="flex flex-col gap-6 border-t border-line pt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Véhicules similaires
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarVehicles.map((v) => (
                <VehiclePreviewCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
