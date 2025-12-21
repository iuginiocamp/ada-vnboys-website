"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type ScrollFloatProps = {
  children: React.ReactNode;
  as?: HeadingTag;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
};

export default function ScrollFloat({
  children,
  as = "h2",
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
}: ScrollFloatProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLHeadingElement>(null);

  const plainText = useMemo(() => {
    const parts = React.Children.toArray(children).map((child) => {
      if (typeof child === "string") return child;
      if (typeof child === "number") return String(child);
      return null;
    });

    if (parts.length === 0) return null;
    if (parts.some((p) => p === null)) return null;
    return parts.join("");
  }, [children]);

  const splitText = useMemo(() => {
    if (!plainText) return null;

    return plainText.split("").map((char, index) => (
      <span className="char" key={index}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, [plainText]);

  useEffect(() => {
    if (reduceMotion) return;
    if (!plainText) return;

    const el = containerRef.current;
    if (!el) return;

    const scroller: any = scrollContainerRef?.current ?? window;

    const charElements = el.querySelectorAll(".char");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        charElements,
        {
          willChange: "opacity, transform",
          opacity: 0,
          yPercent: 120,
          scaleY: 2.3,
          scaleX: 0.7,
          transformOrigin: "50% 0%",
        },
        {
          duration: animationDuration,
          ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduceMotion, plainText, scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  const Tag = as;

  if (!plainText || reduceMotion) {
    return (
      <Tag ref={containerRef} className={`scroll-float ${containerClassName}`}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={containerRef} className={`scroll-float ${containerClassName}`} aria-label={plainText}>
      <span className={`scroll-float-text ${textClassName}`} aria-hidden="true">
        {splitText}
      </span>
    </Tag>
  );
}
