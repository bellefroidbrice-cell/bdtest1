"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Décalage vertical de départ, en pixels. */
  y?: number;
  /** Délai en secondes, utile pour un effet en cascade sur une liste. */
  delay?: number;
  /** Index dans une liste : calcule automatiquement le délai (index * stagger). */
  index?: number;
  stagger?: number;
}

export function Reveal({
  children,
  className,
  y = 24,
  delay,
  index,
  stagger = 0.08,
}: RevealProps) {
  const computedDelay = delay ?? (index ? index * stagger : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: computedDelay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
