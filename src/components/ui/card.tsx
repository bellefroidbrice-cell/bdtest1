import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-card border border-line bg-white", {
  variants: {
    interactive: {
      true: "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-transparent",
      false: "",
    },
  },
  defaultVariants: {
    interactive: false,
  },
});

export interface CardProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof cardVariants> {}

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ interactive }), className)} {...props} />
  );
}
