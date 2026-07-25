"use client";

import { motion } from "framer-motion";

const LINES = [
  "M0,60 C150,20 250,140 400,90 C550,40 650,160 800,110",
  "M0,220 C180,260 300,180 460,230 C600,270 700,190 800,240",
  "M0,340 C120,320 260,360 400,330 C500,305 620,330 800,300",
];

const NODES = [
  { cx: 400, cy: 90, delay: 1 },
  { cx: 460, cy: 230, delay: 1.3 },
];

/**
 * Lignes fines façon circuit/trajectoire qui se dessinent au chargement,
 * avec quelques nœuds lumineux. Purement décoratif, `currentColor` hérite
 * la couleur du parent (ex: text-accent).
 */
export function TechLines({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 400"
      preserveAspectRatio="none"
      className={className}
    >
      {LINES.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 1.6, delay: i * 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {NODES.map((node) => (
        <g key={`${node.cx}-${node.cy}`}>
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r={3}
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: node.delay, ease: "easeOut" }}
            className="origin-center animate-pulse"
          />
        </g>
      ))}
    </svg>
  );
}
