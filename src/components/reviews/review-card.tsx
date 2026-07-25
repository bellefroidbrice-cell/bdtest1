import { Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReviewPreview } from "@/types/review";

export function ReviewCard({ review }: { review: ReviewPreview }) {
  return (
    <Card className="flex h-full flex-col gap-4 p-6">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < review.rating
                ? "fill-accent text-accent"
                : "fill-mist-dark text-mist-dark",
            )}
          />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-anthracite-light/80">
        &laquo;&nbsp;{review.comment}&nbsp;&raquo;
      </p>
      <span className="mt-auto text-sm font-semibold text-ink">
        {review.firstName}
      </span>
    </Card>
  );
}
