import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { VehiclePreviewCard } from "@/components/vehicles/vehicle-preview-card";
import { PLACEHOLDER_VEHICLES } from "@/lib/vehicles-placeholder";

export function VehiclesPreview() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Notre sélection
          </span>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Véhicules disponibles
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_VEHICLES.map((vehicle, i) => (
            <Reveal key={vehicle.id} index={i}>
              <VehiclePreviewCard vehicle={vehicle} />
            </Reveal>
          ))}
        </div>

        <Reveal className="flex justify-center">
          <Button href="/vehicules" variant="dark" size="lg">
            Voir tous les véhicules
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
