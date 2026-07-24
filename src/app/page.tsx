import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-16 py-24">
      <Container className="flex flex-col items-center gap-4 text-center">
        <span className="text-sm font-medium uppercase tracking-widest text-accent">
          BD Automobile
        </span>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Le design system est en place.
        </h1>
        <p className="max-w-md text-base text-anthracite-light/80">
          Prochaine étape : la vraie page d&apos;accueil, dès votre validation.
        </p>
      </Container>

      <Container className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Voir les véhicules</Button>
          <Button variant="dark">Nous contacter</Button>
          <Button variant="outline">En savoir plus</Button>
          <Button variant="ghost">Annuler</Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="available">Disponible</Badge>
          <Badge variant="reserved">Réservé</Badge>
          <Badge variant="sold">Vendu</Badge>
          <Badge variant="new">Nouveau</Badge>
        </div>
      </Container>

      <Container className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} interactive className="flex flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">
                Exemple de carte véhicule
              </span>
              <Badge variant="available">Disponible</Badge>
            </div>
            <div className="h-40 rounded-lg bg-mist" />
            <p className="text-sm text-anthracite-light/80">
              Cette carte s&apos;anime légèrement au survol — c&apos;est la base
              des futures fiches véhicules.
            </p>
          </Card>
        ))}
      </Container>
    </main>
  );
}
