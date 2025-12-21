"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export default function Card({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  const reduceMotion = useReducedMotion();
  const classes = ["ui-card", className].filter(Boolean).join(" ");

  return (
    <motion.div
      className={classes}
      whileHover={reduceMotion ? undefined : { scale: 1.01, y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.995 }}
      transition={{ duration: 0.16 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
