"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ArrowUpRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/projects";
import { shimmerBlurDataUrl } from "@/lib/imageUtils";
import { usePortfolio } from "@/context/PortfolioContext";

interface ProjectGalleryModalProps {
  project: Project | null;
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectGalleryModal({
  project,
  images,
  isOpen,
  onClose,
}: ProjectGalleryModalProps) {
  const { t } = usePortfolio();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const totalImages = images ? images.length : 0;
  const currentImage = totalImages > 0 ? images[currentIndex] : null;

  // Reset index & zoom when opening or changing project
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsZoomed(false);
    }
  }, [isOpen, project]);

  // Focus management & scroll lock
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      const originalOverflow = document.body.style.overflow;
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      // Focus close button on open
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = "";
        previousActiveElementRef.current?.focus();
      };
    }
  }, [isOpen]);

  // Preload next & previous images for instant, flicker-free transitions
  useEffect(() => {
    if (totalImages > 1 && typeof window !== "undefined") {
      const nextIdx = (currentIndex + 1) % totalImages;
      const prevIdx = (currentIndex - 1 + totalImages) % totalImages;

      const imgNext = new window.Image();
      imgNext.src = images[nextIdx];

      const imgPrev = new window.Image();
      imgPrev.src = images[prevIdx];
    }
  }, [currentIndex, images, totalImages]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[
        currentIndex
      ] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (totalImages <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const handlePrev = useCallback(() => {
    if (totalImages <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  // Keyboard Navigation & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Tab") {
        // Focus trap inside modal
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElem = focusableElements[0];
        const lastElem = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElem) {
            e.preventDefault();
            lastElem?.focus();
          }
        } else {
          if (document.activeElement === lastElem) {
            e.preventDefault();
            firstElem?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || isZoomed) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || isZoomed) return;
    const swipeThreshold = 50;
    if (touchDeltaX < -swipeThreshold) {
      handleNext();
    } else if (touchDeltaX > swipeThreshold) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-modal-title"
        className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-slate-950/90 dark:bg-black/95 backdrop-blur-2xl"
      >
        {/* Backdrop Click to Close (Outside Click) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 -z-10 cursor-pointer"
          aria-hidden="true"
        />

        {/* 1. TOP HEADER BAR */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative z-20 w-full px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950/60 dark:bg-black/60 backdrop-blur-md"
        >
          {/* Left: Project Title & Stack */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2
                id="gallery-modal-title"
                className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight truncate"
              >
                {project.title}
              </h2>

              {/* Counter Badge */}
              {totalImages > 0 && (
                <div
                  aria-live="polite"
                  aria-atomic="true"
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-white/90 border border-white/20 whitespace-nowrap"
                >
                  <span className="sr-only">Viewing screenshot </span>
                  {currentIndex + 1} / {totalImages}
                </div>
              )}
            </div>

            {/* Stack Pills on Desktop */}
            <div className="hidden sm:flex items-center gap-1.5 mt-1.5 flex-wrap">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#142E28] text-[#24C097] border border-[#1F453B]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Quick Links & Close Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t("projectsSection.liveDemo") || "Live Demo"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              >
                <span>{t("projectsSection.liveDemo") || "Live Demo"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t("projectsSection.github") || "Source Code"}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="View source code on GitHub"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
            )}

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close project gallery"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* 2. CENTER STAGE: LARGE IMAGE & NAVIGATION */}
        <div
          className="relative flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Arrow Button */}
          {totalImages > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label={`Previous screenshot, currently showing ${currentIndex + 1} of ${totalImages}`}
              className="absolute left-3 sm:left-6 z-30 min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/15 hover:border-emerald-400 shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Large Image Container with Scale and Fade */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative max-w-5xl w-full h-[58vh] sm:h-[65vh] md:h-[68vh] flex items-center justify-center transition-transform duration-300 ${
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
            title={isZoomed ? "Click to zoom out" : "Click to zoom in"}
          >
            {currentImage ? (
              <div
                className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out ${
                  isZoomed ? "scale-[1.65] sm:scale-[1.8]" : "scale-100"
                }`}
              >
                <Image
                  src={currentImage}
                  alt={`${project.title} screenshot ${currentIndex + 1} of ${totalImages}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  placeholder="blur"
                  blurDataURL={shimmerBlurDataUrl(1200, 750)}
                  className="object-contain drop-shadow-2xl rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-white/70">
                <Layers className="w-16 h-16 mb-4 text-emerald-400/50" />
                <p className="text-sm font-medium">
                  {t("projectsSection.noImages") || "No screenshots available for this project"}
                </p>
              </div>
            )}

            {/* Zoom Floating Indicator Button */}
            {currentImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all shadow-md cursor-pointer"
              >
                {isZoomed ? (
                  <ZoomOut className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ZoomIn className="w-4 h-4 text-white" />
                )}
              </button>
            )}
          </motion.div>

          {/* Next Arrow Button */}
          {totalImages > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label={`Next screenshot, currently showing ${currentIndex + 1} of ${totalImages}`}
              className="absolute right-3 sm:right-6 z-30 min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/15 hover:border-emerald-400 shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* 3. BOTTOM THUMBNAIL STRIP */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-20 w-full px-4 sm:px-6 py-3 border-t border-white/10 bg-slate-950/70 dark:bg-black/70 backdrop-blur-md flex items-center justify-center"
        >
          {totalImages > 1 ? (
            <div
              ref={thumbnailsRef}
              role="group"
              aria-label="Screenshots thumbnail list"
              className="flex items-center gap-2.5 overflow-x-auto max-w-4xl py-1 px-2 scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {images.map((img, idx) => {
                const isSelected = idx === currentIndex;
                return (
                  <button
                    key={img}
                    type="button"
                    onClick={() => {
                      setIsZoomed(false);
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Show screenshot ${idx + 1} of ${totalImages}`}
                    aria-current={isSelected ? "true" : undefined}
                    className={`relative flex-shrink-0 w-16 h-11 sm:w-20 sm:h-13 rounded-lg overflow-hidden border-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      isSelected
                        ? "border-emerald-400 scale-105 shadow-md shadow-emerald-500/20 opacity-100"
                        : "border-transparent opacity-50 hover:opacity-85 hover:border-white/30"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-white/50 text-center py-1">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Esc</kbd> or click outside to exit
            </div>
          )}
        </motion.footer>
      </div>
    </AnimatePresence>
  );
}
