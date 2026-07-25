import { cn } from "@/lib/utils";

interface GlowProps {
  className?: string;
  /** "light" pour un fond clair, "dark" pour un fond anthracite/noir. */
  tone?: "light" | "dark";
}

/**
 * Halos de couleur très doux, flous, purement décoratifs.
 * À poser en fond d'une section positionnée en `relative` avec `overflow-hidden`.
 */
export function Glow({ className, tone = "light" }: GlowProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "absolute left-1/2 top-[-120px] h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[120px]",
          tone === "dark" ? "bg-accent/25" : "bg-accent/10",
        )}
      />
      <div
        className={cn(
          "absolute right-[-80px] bottom-[-100px] h-[320px] w-[320px] rounded-full blur-[100px]",
          tone === "dark" ? "bg-white/5" : "bg-ink/5",
        )}
      />
    </div>
  );
}
