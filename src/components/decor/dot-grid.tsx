import { cn } from "@/lib/utils";

/**
 * Motif de points très discret, pour donner un peu de texture à un fond
 * sans jamais surcharger l'interface. S'estompe vers les bords (mask).
 */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        backgroundImage:
          "radial-gradient(var(--color-line) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 78%)",
      }}
    />
  );
}
