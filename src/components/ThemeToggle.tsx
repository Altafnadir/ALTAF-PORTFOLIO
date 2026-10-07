"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = usePortfolio();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="relative flex items-center justify-between w-14 h-7 p-1 rounded-full bg-slate-200 dark:bg-[#1F302D] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0F5B4A]"
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white dark:bg-[#24C097] shadow-sm transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
          theme === "dark" ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="w-3.2 h-3.2 text-[#0C1211]" />
        ) : (
          <Sun className="w-3.2 h-3.2 text-amber-500" />
        )}
      </div>
      <Sun className="w-3.5 h-3.5 ml-1 text-amber-500/80" />
      <Moon className="w-3.5 h-3.5 mr-1 text-slate-400" />
    </button>
  );
}
