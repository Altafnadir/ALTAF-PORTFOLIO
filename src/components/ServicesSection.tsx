"use client";

import React from "react";
import {
  Code2,
  Smartphone,
  Presentation,
  GraduationCap,
  FileEdit,
  Sparkles,
  Layers,
  ArrowRight,
  Check,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { portfolioConfig, ServiceType } from "@/data/portfolioData";
import { GlowButton } from "./GlowButton";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Presentation: <Presentation className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  FileEdit: <FileEdit className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
};

export function ServicesSection() {
  const { t } = usePortfolio();

  const handleSelectServiceAndScroll = (serviceTitle: string) => {
    // Dispatch custom event to auto-select service in ContactForm
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("select-service", { detail: serviceTitle })
      );
      const contactElem = document.getElementById("contact");
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="services"
      className="relative py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-[#1F302D]/80 overflow-hidden"
    >
      {/* Background soft ambient blur */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5F1] dark:bg-[#142E28] border border-[#C2E4D9] dark:border-[#1F453B] text-[#0F5B4A] dark:text-[#24C097] text-xs font-semibold tracking-wide mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("servicesSection.badge")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            {t("servicesSection.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="mt-4 text-base sm:text-[0.98rem] text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {t("servicesSection.subtitle")}
          </motion.p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioConfig.services.map((service, index) => {
            const isSpecial =
              service.title === "AI-to-Humanize" ||
              service.title === "Assignment Writer";

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className={`relative flex flex-col justify-between rounded-2xl p-6 bg-white dark:bg-[#131E1C] border transition-all duration-300 hover:shadow-lg ${
                  isSpecial
                    ? "border-[#0F5B4A]/40 dark:border-[#24C097]/40 shadow-sm"
                    : "border-slate-200/90 dark:border-[#1F302D] shadow-xs"
                }`}
              >
                {/* Special Tag for AI-to-Humanize and Assignment Writer */}
                {isSpecial && (
                  <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0F5B4A] dark:bg-[#24C097] text-white shadow-xs">
                    Popular
                  </div>
                )}

                <div>
                  {/* Icon & Category Tag */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] flex items-center justify-center shadow-2xs">
                      {iconMap[service.iconName] || <Sparkles className="w-5 h-5" />}
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#162320] text-slate-600 dark:text-slate-300">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2 mb-6">
                    {service.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-[#0F5B4A] dark:text-[#24C097] shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action: Inquire CTA Button with Click Glow */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#1C2C28] flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {service.price}
                  </span>

                  <GlowButton
                    onClick={() => handleSelectServiceAndScroll(service.title)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] hover:bg-[#0F5B4A] hover:text-white dark:hover:bg-[#24C097] dark:hover:text-[#0C1211] transition-colors"
                  >
                    <span>{t("servicesSection.inquireBtn")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </GlowButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
