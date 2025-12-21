"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import styles from "./Header.module.css";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  cta?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "https://arxiv.org/abs/2012.10378",
    label: "The YouNiverse Dataset",
    external: true,
    cta: true,
  },
  { href: "#grouping", label: "Youtube's Communities" },
  { href: "#pageviews", label: "Trends and Polarization" },
  { href: "#opinions", label: "Digital vs Reality" },
  { href: "#conclusion", label: "Conclusion" },
];

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  return elements.filter((el) => !el.hasAttribute("disabled"));
}

export default function Header() {
  const reduceMotion = useReducedMotion();
  const transition: Transition = useMemo(
    () =>
      reduceMotion
        ? { duration: 0 }
        : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    [reduceMotion],
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  useEffect(() => {
    if (!menuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      const container = mobilePanelRef.current;
      if (!container) return;
      const focusable = getFocusableElements(container);
      focusable[0]?.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  const onMobilePanelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== "Tab") return;

    const container = mobilePanelRef.current;
    if (!container) return;
    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const heroContainerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: reduceMotion ? undefined : { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition },
  };

  const orbTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 10, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const };

  return (
    <header className={styles.header}>
      <div className={styles.background} aria-hidden="true">
        {!reduceMotion && (
          <>
            <motion.div
              className={styles.orbOne}
              animate={{ x: [0, 36], y: [0, 22] }}
              transition={orbTransition}
            />
            <motion.div
              className={styles.orbTwo}
              animate={{ x: [0, -28], y: [0, 18] }}
              transition={orbTransition}
            />
          </>
        )}
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.hero}
          variants={heroContainerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
        >
          <motion.div variants={fadeUpVariants}>
            <Image
              className={`${styles.logo} plot--img`}
              src="/assets/img/youtube_logo.webp"
              alt="YouTube Logo"
              width={1500}
              height={750}
              priority
              sizes="(max-width: 860px) 90vw, 520px"
            />
          </motion.div>
          <motion.h1 className={styles.title} variants={fadeUpVariants}>
            Views as Votes, a Datastory of Political Polarization
          </motion.h1>
          <motion.p className={`${styles.subtitle} subtitle`} variants={fadeUpVariants}>
            {" Is YouTube a mirror or a distortion of American politics?"}
          </motion.p>
        </motion.div>

        <nav className={styles.nav} aria-label="Primary">
          <div className={styles.navRow}>
            <motion.ul
              className={styles.navList}
              variants={heroContainerVariants}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
            >
              {NAV_ITEMS.map((item) => {
                const linkProps = item.external
                  ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
                  : {};

                return (
                  <motion.li key={item.href} className={item.cta ? styles.ctaItem : styles.navItem} variants={fadeUpVariants}>
                    {item.cta ? (
                      <ButtonLink
                        href={item.href}
                        variant="primary"
                        onClick={() => setMenuOpen(false)}
                        {...linkProps}
                      >
                        {item.label}
                      </ButtonLink>
                    ) : (
                      <motion.a
                        className={styles.navLink}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                        transition={{ duration: 0.15 }}
                        {...linkProps}
                      >
                        {item.label}
                      </motion.a>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>

            <button
              ref={menuButtonRef}
              type="button"
              className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.15 }}
                onClick={closeMenu}
              >
                <motion.div
                  id="mobile-nav"
                  role="dialog"
                  aria-modal="true"
                  ref={mobilePanelRef}
                  className={styles.mobilePanel}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={transition}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={onMobilePanelKeyDown}
                >
                  <ul className={styles.mobileList}>
                    {NAV_ITEMS.map((item) => {
                      const linkProps = item.external
                        ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
                        : {};

                      return (
                        <li key={item.href} className={item.cta ? styles.ctaItem : undefined}>
                          {item.cta ? (
                            <ButtonLink
                              href={item.href}
                              variant="primary"
                              onClick={() => setMenuOpen(false)}
                              {...linkProps}
                            >
                              {item.label}
                            </ButtonLink>
                          ) : (
                            <a
                              className={styles.navLink}
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              {...linkProps}
                            >
                              {item.label}
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
}
