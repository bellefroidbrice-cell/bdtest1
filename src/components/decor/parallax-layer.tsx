"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /** Amplitude du déplacement en pixels — reste volontairement très léger. */
  strength?: number;
}

/**
 * Fait légèrement dériver son contenu décoratif à la verticale pendant le
 * scroll de la section parente. Effet parallaxe discret, jamais appuyé.
 */
export function ParallaxLayer({ children, className, strength = 50 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, strength]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      {children}
    </motion.div>
  );
}
