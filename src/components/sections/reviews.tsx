import { Star } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ReviewCard } from "@/components/reviews/review-card";
import type { ReviewPreview } from "@/types/review";

export function Reviews({ reviews = [] }: { reviews?: ReviewPreview[] }) {
  return (
    <section className="bg-mist py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Avis clients
          </span>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Ce que disent nos clients
          </h2>
        </Reveal>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} index={i}>
                <ReviewCard review={review} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line py-16 text-center">
            <Star className="h-6 w-6 text-anthracite-light/40" />
            <p className="text-base font-medium text-ink">
              Les premiers avis de nos clients arrivent bientôt
            </p>
            <p className="max-w-sm text-sm text-anthracite-light/70">
              Cette section s&apos;affichera dès que nos premiers avis clients
              seront disponibles.
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
