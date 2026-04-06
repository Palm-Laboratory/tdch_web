"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

type RevealOrigin = "up" | "left" | "right" | "scale";

const revealVariants: Record<RevealOrigin, Variants> = {
  up: {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
};

export default function Reveal({
  children,
  className,
  origin = "up",
  delay = 0,
  amount = 0.25,
  duration = 0.8,
}: {
  children: React.ReactNode;
  className?: string;
  origin?: RevealOrigin;
  delay?: number;
  amount?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={revealVariants[origin]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
