"use client";

import React from "react";
import Image from "next/image";
import {
  ExternalLink,
  Images as ImageIcon,
  Layers,
  ArrowUpRight,
  Sparkles,
  Eye,
} from "lucide-react";
import { Project } from "@/data/projects";
import { shimmerBlurDataUrl } from "@/lib/imageUtils";
import { usePortfolio } from "@/context/PortfolioContext";

interface ProjectCardProps {
  project: Project;
  images: string[];
  onOpenGallery: (project: Project) => void;
}

export function ProjectCard({
  project,
  images,
  onOpenGallery,
}: ProjectCardProps) {
  const { t } = usePortfolio();
  const coverImage = images && images.length > 0 ? images[0] : null;
  const imageCount = images ? images.length : 0;

  const handleCardClick = () => {
    onOpenGallery(project);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View screenshots and details for ${project.title}`}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#131E1C] border border-slate-200/90 dark:border-[#1F302D] shadow-sm hover:shadow-xl hover:border-[#0F5B4A]/50 dark:hover:border-[#24C097]/40 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5B4A] dark:focus-visible:ring-[#24C097]"
    >
      {/* 16:10 Aspect Ratio Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#0B1311] border-b border-slate-100 dark:border-[#1F302D]/60">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${project.title} preview cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL={shimmerBlurDataUrl(800, 500)}
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          /* Graceful Elegant Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-[#0E1715] dark:via-[#131E1C] dark:to-[#0B1311]">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-[#24C097]/15 flex items-center justify-center text-[#0F5B4A] dark:text-[#24C097] mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Interactive Preview
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t("projectsSection.noImages") || "No preview images available"}
            </p>
          </div>
        )}

        {/* Top Badges (Image Count & Featured) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/70 dark:bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
            <ImageIcon className="w-3.5 h-3.5 text-[#24C097]" />
            <span>
              {imageCount} {imageCount === 1 ? "Screenshot" : "Screenshots"}
            </span>
          </div>
        </div>

        {/* Hover "View Screenshots" Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 dark:bg-[#131E1C]/95 backdrop-blur-md text-slate-900 dark:text-white font-semibold text-xs sm:text-sm shadow-xl transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 border border-white/20 dark:border-[#24C097]/40">
            <Eye className="w-4 h-4 text-[#0F5B4A] dark:text-[#24C097]" />
            <span>{t("projectsSection.viewScreenshots") || "View Screenshots"}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col p-5 sm:p-6 justify-between">
        <div>
          {/* Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] border border-[#C2E4D9]/80 dark:border-[#1F453B]/80"
              >
                {tech}
              </span>
            ))}
            {project.stack.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-[#1F302D] text-slate-600 dark:text-slate-300">
                +{project.stack.length - 4}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#0F5B4A] dark:group-hover:text-[#24C097] transition-colors mb-2.5">
            {project.title}
          </h3>

          {/* Problem & Solution Mini Snippet */}
          <div className="space-y-2 text-xs sm:text-[0.85rem] text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <p>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {t("projectsSection.problemLabel") || "Problem"}:{" "}
              </span>
              {project.problem}
            </p>
            <p>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {t("projectsSection.resultLabel") || "Result"}:{" "}
              </span>
              {project.result}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-auto border-t border-slate-100 dark:border-[#1F302D] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenGallery(project);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5B4A] dark:text-[#24C097] hover:underline cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t("projectsSection.viewScreenshots") || "View Screenshots"}</span>
          </button>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                aria-label={`Open live demo for ${project.title}`}
                title={t("projectsSection.liveDemo") || "Live Demo"}
                className="p-2 rounded-lg bg-slate-100 dark:bg-[#142E28] hover:bg-[#E8F5F1] dark:hover:bg-[#1F453B] text-slate-700 dark:text-slate-200 hover:text-[#0F5B4A] dark:hover:text-[#24C097] transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                aria-label={`View GitHub source code for ${project.title}`}
                title={t("projectsSection.github") || "Source Code"}
                className="p-2 rounded-lg bg-slate-100 dark:bg-[#142E28] hover:bg-[#E8F5F1] dark:hover:bg-[#1F453B] text-slate-700 dark:text-slate-200 hover:text-[#0F5B4A] dark:hover:text-[#24C097] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
