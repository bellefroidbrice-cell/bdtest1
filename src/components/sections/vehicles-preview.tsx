import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { VehiclePreviewCard } from "@/components/vehicles/vehicle-preview-card";
import type { VehiclePreview } from "@/types/vehicle";

export function VehiclesPreview({ vehicles }: { vehicles: VehiclePreview[] }) {
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

        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle, i) => (
              <Reveal key={vehicle.id} index={i}>
                <VehiclePreviewCard vehicle={vehicle} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="rounded-card border border-dashed border-line py-16 text-center text-sm text-anthracite-light/70">
            De nouveaux véhicules arrivent bientôt sur notre parc.
          </Reveal>
        )}

        <Reveal className="flex justify-center">
          <Button href="/vehicules" variant="dark" size="lg">
            Voir tous les véhicules
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
