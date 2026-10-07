"use client";

import React from "react";
import { GraduationCap, Briefcase, Sparkles, Code2, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { portfolioConfig } from "@/data/portfolioData";
import { GlowButton } from "./GlowButton";
import { motion } from "framer-motion";

export function AboutSection() {
  const { t } = usePortfolio();

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="about"
      className="relative py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-[#1F302D]/80 overflow-hidden"
    >
      {/* Background ambient decorative light */}
      <div
        className="absolute top-1/3 -left-32 w-96 h-96 bg-[#0F5B4A]/10 dark:bg-[#24C097]/10 rounded-full blur-3xl pointer-events-none -z-10"
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
            <span>{t("about.badge")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            {t("about.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="mt-4 text-base sm:text-[1.05rem] font-medium text-slate-700 dark:text-slate-200 leading-relaxed"
          >
            {t("about.lead")}
          </motion.p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Detailed Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base"
          >
            <div className="bg-white dark:bg-[#131E1C] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-[#1F302D] shadow-sm space-y-5">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>

              {/* Callout Box: AI-to-Humanize & Research Support */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#162320] border-l-4 border-[#0F5B4A] dark:border-[#24C097] space-y-2">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
                  <Sparkles className="w-4 h-4 text-[#0F5B4A] dark:text-[#24C097]" />
                  <span>AI-to-Humanize & Research Writing</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Helping researchers and students polish AI-assisted drafts into natural, engaging, and human-readable writing while keeping citations and research ideas fully intact.
                </p>
              </div>

              {/* CTA with Glow Button */}
              <div className="pt-2">
                <GlowButton
                  onClick={handleScrollToContact}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F5B4A] hover:bg-[#0c473a] text-white font-medium text-sm shadow-md shadow-[#0F5B4A]/20 transform active:translate-y-0"
                >
                  <span>{t("hero.contactMe")}</span>
                  <ArrowRight className="w-4 h-4" />
                </GlowButton>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Highlights & Education/Experience */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 space-y-5"
          >
            {/* Quick Highlights Card */}
            <div className="bg-white dark:bg-[#131E1C] rounded-2xl p-6 border border-slate-200/90 dark:border-[#1F302D] shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#0F5B4A] dark:text-[#24C097]" />
                <span>{t("about.highlightsTitle")}</span>
              </h3>

              <ul className="space-y-3">
                {portfolioConfig.translations.en.about.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F5B4A] dark:bg-[#24C097] mt-2 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Credential summary cards */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-white dark:bg-[#131E1C] border border-slate-200/80 dark:border-[#1F302D] shadow-2xs">
                <GraduationCap className="w-5 h-5 text-[#0F5B4A] dark:text-[#24C097] mb-2" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">BS Software Eng.</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Final Year • PMAS AAUR</div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#131E1C] border border-slate-200/80 dark:border-[#1F302D] shadow-2xs">
                <Briefcase className="w-5 h-5 text-[#0F5B4A] dark:text-[#24C097] mb-2" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Freelancer</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Web, Mobile & AI</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
