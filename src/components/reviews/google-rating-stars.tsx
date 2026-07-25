import { Star } from "lucide-react";

function StarRow({ className }: { className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-current" />
      ))}
    </div>
  );
}

export function GoogleRatingStars({ average }: { average: number }) {
  const percentage = Math.max(0, Math.min(100, (average / 5) * 100));

  return (
    <div className="relative inline-flex">
      <StarRow className="flex gap-1 text-mist-dark" />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${percentage}%` }}
      >
        <StarRow className="flex gap-1 text-accent" />
      </div>
    </div>
  );
}
