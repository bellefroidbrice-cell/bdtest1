import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { GoogleRatingStars } from "@/components/reviews/google-rating-stars";
import { ReviewCard } from "@/components/reviews/review-card";
import { Button } from "@/components/ui/button";
import { GOOGLE_RATING } from "@/lib/google-rating";
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

        <Reveal className="flex flex-col items-center gap-3 text-center">
          <GoogleRatingStars average={GOOGLE_RATING.average} />
          <p className="text-lg font-semibold text-ink">
            {GOOGLE_RATING.average.toLocaleString("fr-BE")} / 5
          </p>
          <p className="text-sm text-anthracite-light/70">
            Basé sur {GOOGLE_RATING.count} avis Google
          </p>
          <Button
            href={GOOGLE_RATING.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="mt-2"
          >
            Voir tous les avis sur Google
          </Button>
        </Reveal>

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} index={i}>
                <ReviewCard review={review} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
