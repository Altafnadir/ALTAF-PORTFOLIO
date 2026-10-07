"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, Clock, Sparkles, Send } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { portfolioConfig } from "@/data/portfolioData";
import { ContactForm } from "./ContactForm";
import { motion, AnimatePresence } from "framer-motion";

export function ContactSection() {
  const { t } = usePortfolio();
  const [copied, setCopied] = useState(false);

  const email = portfolioConfig.contact.email;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden border-t border-slate-200/80 dark:border-[#1F302D]/80"
    >
      {/* Background decorative glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-[#0F5B4A]/10 to-[#34D399]/10 rounded-full blur-3xl pointer-events-none -z-10"
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
            <span>{t("contact.badge")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            {t("contact.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="mt-4 text-base sm:text-[0.98rem] text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {t("contact.subtitle")}
          </motion.p>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card (Animated) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col space-y-5"
          >
            <div className="bg-white dark:bg-[#131E1C] rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-[#1F302D] shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
              {/* Header inside card */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Contact Information
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t("contact.availability")}
                </p>
              </div>

              {/* Status / Response Time indicator */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#162320] border border-slate-200/70 dark:border-[#1F302D] text-xs font-medium text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{t("contact.responseTime")}</span>
              </div>

              {/* Email Card Item */}
              <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-[#162320]/60 border border-slate-200/70 dark:border-[#1F302D] transition-colors hover:border-[#0F5B4A]/40 dark:hover:border-[#24C097]/40 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("contact.emailLabel")}
                    </span>
                  </div>

                  {/* Copy Button with Tooltip */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label="Copy email address"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 dark:border-[#1F302D] bg-white dark:bg-[#131E1C] text-slate-700 dark:text-slate-200 hover:text-[#0F5B4A] dark:hover:text-[#24C097] hover:border-[#0F5B4A]/40 dark:hover:border-[#24C097]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#0F5B4A]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {t("contact.copied")}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          <span>{t("contact.copyEmail")}</span>
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {copied && (
                        <motion.span
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.95 }}
                          className="absolute -top-8 right-0 px-2 py-0.5 text-[11px] font-medium text-white bg-slate-900 dark:bg-slate-800 rounded shadow-md pointer-events-none whitespace-nowrap z-10"
                        >
                          {t("contact.copied")}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <a
                  href={`mailto:${email}`}
                  className="inline-block text-base sm:text-lg font-semibold text-slate-900 dark:text-white hover:text-[#0F5B4A] dark:hover:text-[#24C097] transition-colors break-all focus:outline-none focus:underline"
                  title="Send email via mail app"
                >
                  {email}
                </a>

                {/* Direct Action Button */}
                <div className="pt-1">
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-[#0F5B4A] hover:bg-[#0c473a] text-white text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F5B4A]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open in Mail App</span>
                  </a>
                </div>
              </div>

              {/* Direct Communication Note */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-[#142E28]/40 border border-emerald-100 dark:border-[#1F453B] space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Direct Communication</span>
                </div>
                <p className="leading-relaxed">
                  Send an email directly or submit the inquiry form. Every message is reviewed personally and answered within 24 hours.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            id="contact-form-container"
            className="lg:col-span-7"
          >
            <div className="bg-white dark:bg-[#131E1C] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-[#1F302D] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] flex items-center justify-center font-bold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t("contact.form.title")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("contact.form.subtitle")}
                  </p>
                </div>
              </div>

              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
