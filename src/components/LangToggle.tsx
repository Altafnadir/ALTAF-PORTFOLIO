"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";

export function LangToggle() {
  const { language, setLanguage } = usePortfolio();

  return (
    <div className="flex items-center text-xs font-semibold tracking-wider bg-slate-100 dark:bg-[#162320] p-1 rounded-full border border-slate-200/80 dark:border-[#20332E]">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label="Switch to English"
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          language === "en"
            ? "bg-[#0F5B4A] text-white shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        EN
      </button>
      <span className="text-slate-300 dark:text-slate-600 mx-0.5">|</span>
      <button
        type="button"
        onClick={() => setLanguage("es")}
        aria-label="Cambiar a Español"
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          language === "es"
            ? "bg-[#0F5B4A] text-white shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        ES
      </button>
    </div>
  );
}
