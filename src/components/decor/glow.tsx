import { cn } from "@/lib/utils";

/**
 * Halos de couleur très doux, flous, purement décoratifs.
 * À poser en fond d'une section positionnée en `relative` avec `overflow-hidden`.
 */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute left-1/2 top-[-120px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute right-[-80px] bottom-[-100px] h-[320px] w-[320px] rounded-full bg-ink/5 blur-[100px]" />
    </div>
  );
}
