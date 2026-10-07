"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { portfolioConfig } from "@/data/portfolioData";

export function Footer() {
  const { t } = usePortfolio();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-white dark:bg-[#0C1211] border-t border-slate-200/80 dark:border-[#1F302D] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <Link
              href="#home"
              onClick={(e) => handleSmoothScroll(e, "#home")}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0F5B4A] dark:bg-[#199573] flex items-center justify-center text-white font-bold text-lg shadow-xs transition-transform duration-200 group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M12 3L4 20h4.5l1.8-4.2h3.4L15.5 20H20L12 3z" />
                  <path d="M10.8 13.5h2.4" />
                </svg>
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Altaf
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Nav & Contact Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#home"
              onClick={(e) => handleSmoothScroll(e, "#home")}
              className="hover:text-[#0F5B4A] dark:hover:text-[#24C097] transition-colors"
            >
              {t("nav.home")}
            </a>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              className="hover:text-[#0F5B4A] dark:hover:text-[#24C097] transition-colors font-semibold text-[#0F5B4A] dark:text-[#24C097]"
            >
              {t("nav.contact")}
            </a>
            <a
              href={`mailto:${portfolioConfig.contact.email}`}
              className="inline-flex items-center gap-1.5 hover:text-[#0F5B4A] dark:hover:text-[#24C097] transition-colors"
              title="Email Altaf"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
            <a
              href={portfolioConfig.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors p-1"
              aria-label="GitHub Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href={portfolioConfig.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A66C2] transition-colors p-1"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-[#1F302D]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Altaf. {t("footer.rights")}</p>
          <p className="flex items-center gap-1.5">
            <span>Built with Next.js, Tailwind CSS & Framer Motion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
