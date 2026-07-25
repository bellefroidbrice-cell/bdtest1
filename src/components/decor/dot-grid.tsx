import { cn } from "@/lib/utils";

interface DotGridProps {
  className?: string;
  /** "light" pour un fond clair, "dark" pour un fond anthracite/noir. */
  tone?: "light" | "dark";
}

/**
 * Motif de points très discret, pour donner un peu de texture à un fond
 * sans jamais surcharger l'interface. S'estompe vers les bords (mask).
 */
export function DotGrid({ className, tone = "light" }: DotGridProps) {
  const dotColor = tone === "dark" ? "rgba(255,255,255,0.14)" : "var(--color-line)";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        maskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 78%)",
      }}
    />
  );
}
