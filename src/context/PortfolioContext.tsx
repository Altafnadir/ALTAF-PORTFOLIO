"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { portfolioConfig } from "@/data/portfolioData";
import { usePathname, useRouter } from "@/i18n/routing";
import enMessages from "../../messages/en.json";
import esMessages from "../../messages/es.json";
import deMessages from "../../messages/de.json";

export type Language = "en" | "es" | "de";
export type Theme = "light" | "dark";

const messagesMap: Record<Language, any> = {
  en: enMessages,
  es: esMessages,
  de: deMessages,
};

interface PortfolioContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

interface PortfolioProviderProps {
  children: React.ReactNode;
  initialLocale?: Language;
}

export function PortfolioProvider({
  children,
  initialLocale = "en",
}: PortfolioProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLocale);
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Next-intl navigation helpers
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialLocale && ["en", "es", "de"].includes(initialLocale)) {
      setLanguageState(initialLocale);
    }
  }, [initialLocale]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("altaf_theme") as Theme | null;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("altaf_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSetLanguage = (lang: Language) => {
    if (lang === language) return;

    setLanguageState(lang);

    // Save choice in localStorage & 1-year cookies for both altaf_lang & NEXT_LOCALE
    try {
      localStorage.setItem("altaf_lang", lang);
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `altaf_lang=${lang}; path=/; max-age=${oneYear}; SameSite=Lax`;
      document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=${oneYear}; SameSite=Lax`;
    } catch {
      // ignore in restricted environments
    }

    // Preserve current hash if any
    const currentHash = typeof window !== "undefined" ? window.location.hash : "";

    // Switch route in-place without full page reload
    router.replace(
      {
        pathname: pathname || "/",
      },
      { locale: lang }
    );

    if (currentHash && typeof window !== "undefined") {
      setTimeout(() => {
        const elem = document.querySelector(currentHash);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    }
  };

  const t = (pathStr: string, values?: Record<string, string | number>): string => {
    const keys = pathStr.split(".");

    // 1. Search in current locale messages
    let current: any = messagesMap[language];
    let found = true;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        found = false;
        break;
      }
    }

    // 2. Fallback to English messages if not found
    if (!found) {
      current = messagesMap.en;
      found = true;
      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = current[key];
        } else {
          found = false;
          break;
        }
      }
    }

    // 3. Fallback to portfolioConfig.translations if needed
    if (!found) {
      const trans = (portfolioConfig as any).translations;
      current = trans?.[language] || trans?.en;
      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = current[key];
        } else {
          return pathStr;
        }
      }
    }

    if (typeof current !== "string") {
      return pathStr;
    }

    // Handle template interpolation like {count}
    if (values) {
      let result = current;
      for (const [vKey, vVal] of Object.entries(values)) {
        result = result.replace(new RegExp(`\\{${vKey}\\}`, "g"), String(vVal));
      }
      return result;
    }

    return current;
  };

  return (
    <PortfolioContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        theme,
        toggleTheme: handleToggleTheme,
        t,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
