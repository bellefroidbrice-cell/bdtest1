import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-md",
        dark: "bg-ink text-white hover:bg-anthracite-light",
        outline: "border border-line text-ink hover:border-ink hover:bg-mist",
        ghost: "text-ink hover:bg-mist",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & { className?: string };

type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonAsLink = BaseProps &
  ComponentPropsWithoutRef<typeof Link> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (props.href) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return <Link href={href} className={classes} {...linkProps} />;
  }

  return <button className={classes} {...(props as ButtonAsButton)} />;
}
