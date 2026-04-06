"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

export default function useScrollReveal<T extends HTMLElement = HTMLElement>(amount = 0.25) {
  const ref = useRef<T | null>(null);
  const isInView = useInView(ref, { once: true, amount });

  return { ref, isInView };
}
