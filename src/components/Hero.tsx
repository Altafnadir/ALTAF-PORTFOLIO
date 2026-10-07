"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, GraduationCap, Briefcase, Award } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { GlowButton } from "./GlowButton";
import { motion } from "framer-motion";

export function Hero() {
  const { t } = usePortfolio();

  return (
    <section
      id="home"
      className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Intro, Headline, Bio, CTAs & Info Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start space-y-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5F1] dark:bg-[#142E28] border border-[#C2E4D9] dark:border-[#1F453B] text-[#0F5B4A] dark:text-[#24C097] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#0F5B4A] dark:bg-[#24C097] animate-pulse" />
              <span>{t("hero.badge")}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[2.85rem] xl:text-[3.1rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18] whitespace-pre-line">
              {t("hero.headlinePrefix")}
              <span className="relative inline-block text-[#0F5B4A] dark:text-[#24C097]">
                {t("hero.headlineHighlight")}
                {/* Hand-drawn curved SVG underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 overflow-visible text-[#0F5B4A] dark:text-[#24C097]"
                  viewBox="0 0 120 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                    d="M3 8.5C35 2 85 2 117 7.5C90 10.5 50 11.5 15 9.5"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Paragraph Bio */}
            <p className="text-base sm:text-[0.98rem] text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
              {t("hero.bio")}
            </p>

            {/* CTA Buttons with Click Glow Effect */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <GlowButton
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F5B4A] hover:bg-[#0c473a] text-white font-medium text-sm transition-all duration-200 shadow-md shadow-[#0F5B4A]/20 hover:shadow-lg hover:shadow-[#0F5B4A]/30 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{t("hero.viewProjects")}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </GlowButton>

              <GlowButton
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("contact");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-300 dark:border-[#2A3E39] hover:border-[#0F5B4A] dark:hover:border-[#24C097] text-slate-700 dark:text-slate-200 hover:text-[#0F5B4A] dark:hover:text-[#24C097] bg-white dark:bg-[#131E1C] font-medium text-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t("hero.contactMe")}
              </GlowButton>
            </div>

            {/* Info Panel: Education, Internships, Certifications */}
            <div className="w-full pt-3">
              <div className="bg-white dark:bg-[#131E1C] rounded-2xl p-5 border border-slate-200/90 dark:border-[#1F302D] shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-[#1C2C28]">
                  {/* Education */}
                  <div className="sm:pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0F5B4A] dark:bg-[#199573] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        Education
                      </h2>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      BS Software Engineering
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      PMAS Arid Agri. University
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] font-medium text-[#0F5B4A] dark:text-[#24C097] bg-[#E8F5F1] dark:bg-[#142E28] px-2 py-0.5 rounded-md">
                      Final Year
                    </span>
                  </div>

                  {/* Internships */}
                  <div className="pt-3 sm:pt-0 sm:px-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0F5B4A] dark:bg-[#199573] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        Internships
                      </h2>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F5B4A] dark:bg-[#24C097] shrink-0" />
                        <span>Frontend Dev (DevelopersHub)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F5B4A] dark:bg-[#24C097] shrink-0" />
                        <span>Full Stack Dev (IT Software House)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Certifications */}
                  <div className="pt-3 sm:pt-0 sm:pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0F5B4A] dark:bg-[#199573] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Award className="w-4 h-4" />
                      </div>
                      <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        Certifications
                      </h2>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F5B4A] dark:bg-[#24C097] shrink-0" />
                        <span>Frontend Dev (Zynex Solutions)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F5B4A] dark:bg-[#24C097] shrink-0" />
                        <span>Cybersecurity (Zynex Solutions)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Photo & Handwritten Note */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-center justify-center"
          >
            <div className="relative group w-full flex flex-col items-center">
              {/* Subtle green ambient back-glow */}
              <div className="absolute -inset-2.5 sm:-inset-3 bg-gradient-to-tr from-[#0F5B4A]/25 via-emerald-500/20 to-[#34D399]/25 rounded-[28px] blur-2xl opacity-60 dark:opacity-40 group-hover:opacity-85 transition duration-500 pointer-events-none" />
              
              {/* Profile Image Container */}
              <div className="relative w-full sm:w-[400px] lg:w-[480px] xl:w-[520px] h-[380px] sm:h-[500px] lg:h-[580px] xl:h-[620px] aspect-[4/5] rounded-[20px] overflow-hidden bg-slate-100 dark:bg-[#162320] border-2 border-emerald-500/30 dark:border-[#24C097]/40 shadow-2xl shadow-slate-900/10 dark:shadow-black/50">
                <Image
                  src="/images/altaf.jpg"
                  alt="Altaf - Software Engineering Student and Full Stack Developer"
                  fill
                  priority
                  style={{ objectPosition: "center top" }}
                  className="object-cover transform transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 400px, 520px"
                />
              </div>

              {/* Handwritten Note with Arrow */}
              <div className="relative flex items-center justify-center pt-3.5 select-none">
                <span className="font-['Caveat',cursive] text-2xl text-slate-700 dark:text-slate-200 transform -rotate-2">
                  {t("hero.note")}
                </span>
                <svg
                  className="w-10 h-8 text-slate-600 dark:text-slate-300 ml-2 overflow-visible"
                  viewBox="0 0 60 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 28 C 24 35, 42 32, 50 14"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M42 12 L 51 13 L 53 22"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
