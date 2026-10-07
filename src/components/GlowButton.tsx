"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  showSparkles?: boolean;
  "aria-label"?: string;
  title?: string;
}

export function GlowButton({
  children,
  onClick,
  className = "",
  href,
  type = "button",
  disabled = false,
  showSparkles = true,
  "aria-label": ariaLabel,
  title,
}: GlowButtonProps) {
  const [isGlowing, setIsGlowing] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) return;

    // Trigger short glow flash
    setIsGlowing(true);
    setTimeout(() => {
      setIsGlowing(false);
    }, 550);

    if (onClick) {
      onClick(e);
    }
  };

  const content = (
    <motion.span
      className="relative z-10 inline-flex items-center justify-center gap-1.5"
      animate={isGlowing ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <AnimatePresence>
        {isGlowing && showSparkles && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
            transition={{ duration: 0.2 }}
            className="text-emerald-300 dark:text-emerald-400 select-none shrink-0"
            aria-hidden="true"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </motion.span>
        )}
      </AnimatePresence>

      <span>{children}</span>

      <AnimatePresence>
        {isGlowing && showSparkles && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: -20 }}
            transition={{ duration: 0.2 }}
            className="text-emerald-300 dark:text-emerald-400 select-none shrink-0"
            aria-hidden="true"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );

  const glowBackdrop = (
    <AnimatePresence>
      {isGlowing && (
        <>
          {/* Subtle radiant halo glow */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-r from-emerald-500/40 via-teal-400/50 to-emerald-500/40 blur-md pointer-events-none -z-10"
            aria-hidden="true"
          />
          {/* Luminous light sweep flash */}
          <motion.span
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: [0, 0.6, 0], x: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none rounded-xl"
            aria-hidden="true"
          />
        </>
      )}
    </AnimatePresence>
  );

  const baseClasses = `relative overflow-hidden transition-all duration-200 select-none ${
    isGlowing
      ? "ring-2 ring-[#24C097] dark:ring-[#34D399] shadow-[0_0_22px_rgba(36,192,151,0.5)] brightness-105"
      : ""
  } ${className}`;

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={baseClasses}
        aria-label={ariaLabel}
        title={title}
      >
        {glowBackdrop}
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={baseClasses}
      aria-label={ariaLabel}
      title={title}
    >
      {glowBackdrop}
      {content}
    </button>
  );
}
