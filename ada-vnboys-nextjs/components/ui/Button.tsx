"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "default";

function getButtonClassName(variant: ButtonVariant, className?: string) {
  const classes = ["ui-button"];
  if (variant === "primary") classes.push("ui-button--primary");
  if (className) classes.push(className);
  return classes.join(" ");
}

export function Button({
  variant = "default",
  className,
  ...props
}: HTMLMotionProps<"button"> & { variant?: ButtonVariant }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      className={getButtonClassName(variant, className)}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.16 }}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "default",
  className,
  ...props
}: HTMLMotionProps<"a"> & { variant?: ButtonVariant }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      className={getButtonClassName(variant, className)}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.16 }}
      {...props}
    />
  );
}
