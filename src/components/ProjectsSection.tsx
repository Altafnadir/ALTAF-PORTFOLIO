"use client";

import React, { useState } from "react";
import { Sparkles, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolio } from "@/context/PortfolioContext";
import { projects, Project } from "@/data/projects";
import projectImagesMap from "@/data/project-images.json";
import { ProjectCard } from "./ProjectCard";
import { ProjectGalleryModal } from "./ProjectGalleryModal";

export function ProjectsSection() {
  const { t } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Cast imported json map to record of slug -> string[]
  const imagesRecord = projectImagesMap as Record<string, string[]>;

  return (
    <section
      id="projects"
      className="relative py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-[#1F302D]/80 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-emerald-500/5 dark:bg-[#24C097]/5 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5F1] dark:bg-[#142E28] border border-[#C2E4D9] dark:border-[#1F453B] text-[#0F5B4A] dark:text-[#24C097] text-xs font-semibold tracking-wide mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("projectsSection.badge") || "Featured Work"}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            {t("projectsSection.title") || "Selected Engineering Projects"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="mt-4 text-base sm:text-[0.98rem] text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {t("projectsSection.subtitle") ||
              "Real-world web apps, machine learning systems, and interactive tools built with clean architecture and modern stacks."}
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const projectImages = imagesRecord[project.slug] || [];

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <ProjectCard
                  project={project}
                  images={projectImages}
                  onOpenGallery={(proj) => setSelectedProject(proj)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Gallery Modal (Active when project selected) */}
      <ProjectGalleryModal
        project={selectedProject}
        images={selectedProject ? imagesRecord[selectedProject.slug] || [] : []}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
