import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
  {
    variants: {
      variant: {
        available: "bg-success-soft text-success",
        reserved: "bg-warning-soft text-warning",
        sold: "bg-mist-dark text-anthracite-light",
        new: "bg-accent text-white",
        neutral: "bg-mist text-anthracite-light",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export const vehicleStatusLabels = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
} as const;
