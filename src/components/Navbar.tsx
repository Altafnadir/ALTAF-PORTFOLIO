"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Code2,
  Smartphone,
  Presentation,
  GraduationCap,
  FileEdit,
  Sparkles,
  Layers,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import { usePortfolio } from "@/context/PortfolioContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "home", labelKey: "nav.home", href: "#home" },
  { id: "services", labelKey: "nav.services", href: "#services" },
  { id: "projects", labelKey: "nav.projects", href: "#projects" },
  { id: "about", labelKey: "nav.about", href: "#about" },
  { id: "process", labelKey: "nav.process", href: "#process" },
  { id: "testimonials", labelKey: "nav.testimonials", href: "#testimonials" },
  { id: "faq", labelKey: "nav.faq", href: "#faq" },
  { id: "contact", labelKey: "nav.contact", href: "#contact" },
];

const servicesDropdownList = [
  {
    title: "Website Development",
    icon: Code2,
    badge: "Full Stack",
  },
  {
    title: "Mobile Application Development",
    icon: Smartphone,
    badge: "iOS & Android",
  },
  {
    title: "Presentation Design",
    icon: Presentation,
    badge: "Decks & Slides",
  },
  {
    title: "Programming Tutoring & Mentoring",
    icon: GraduationCap,
    badge: "1-on-1 Sessions",
  },
  {
    title: "Assignment Writer",
    icon: FileEdit,
    badge: "Academic Support",
  },
  {
    title: "AI-to-Humanize",
    icon: Sparkles,
    badge: "Research & Writing",
  },
  {
    title: "Other",
    icon: Layers,
    badge: "Custom Solutions",
  },
];

export function Navbar() {
  const { t } = usePortfolio();
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMouseEnterServices = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleMouseLeaveServices = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 180);
  };

  const handleServiceSelect = (serviceTitle: string) => {
    setServicesOpen(false);
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);

    // Auto-select chosen service in ContactForm and scroll
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("select-service", { detail: serviceTitle }));
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Close dropdown on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setServicesOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#0C1211]/90 backdrop-blur-md shadow-xs border-b border-slate-200/80 dark:border-[#1F302D]"
          : "bg-white/70 dark:bg-[#0C1211]/70 backdrop-blur-xs border-b border-transparent"
      }`}
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="#home"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#0F5B4A] rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0F5B4A] dark:bg-[#199573] flex items-center justify-center text-white font-bold text-xl shadow-xs transition-transform duration-200 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M12 3L4 20h4.5l1.8-4.2h3.4L15.5 20H20L12 3z" />
                <path d="M10.8 13.5h2.4" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Altaf
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              // Special handler for "Services" dropdown
              if (item.id === "services") {
                return (
                  <div
                    key={item.id}
                    className="relative py-2"
                    onMouseEnter={handleMouseEnterServices}
                    onMouseLeave={handleMouseLeaveServices}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      onClick={(e) => {
                        e.preventDefault();
                        setServicesOpen(!servicesOpen);
                      }}
                      className={`relative inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 py-1.5 focus:outline-none ${
                        isActive || servicesOpen
                          ? "text-[#0F5B4A] dark:text-[#24C097] font-semibold"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{t(item.labelKey)}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          servicesOpen ? "rotate-180 text-[#0F5B4A] dark:text-[#24C097]" : ""
                        }`}
                      />
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5B4A] dark:bg-[#24C097] rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>

                    {/* Services Dropdown Menu (Framer Motion) */}
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-80 bg-white/95 dark:bg-[#131E1C]/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-[#1F302D] shadow-xl p-2 z-50 overflow-hidden"
                          role="menu"
                          aria-label="Services dropdown menu"
                        >
                          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-[#1C2C28] mb-1">
                            Available Services
                          </div>

                          <div className="space-y-0.5">
                            {servicesDropdownList.map((service) => {
                              const IconComponent = service.icon;
                              const isSpecial =
                                service.title === "AI-to-Humanize" ||
                                service.title === "Assignment Writer";

                              return (
                                <button
                                  key={service.title}
                                  type="button"
                                  onClick={() => handleServiceSelect(service.title)}
                                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors duration-150 group ${
                                    isSpecial
                                      ? "hover:bg-[#E8F5F1] dark:hover:bg-[#142E28]"
                                      : "hover:bg-slate-100/80 dark:hover:bg-[#162320]"
                                  }`}
                                  role="menuitem"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                        isSpecial
                                          ? "bg-[#0F5B4A] dark:bg-[#24C097] text-white dark:text-[#0C1211]"
                                          : "bg-slate-100 dark:bg-[#1A2825] text-slate-700 dark:text-slate-300 group-hover:text-[#0F5B4A] dark:group-hover:text-[#24C097]"
                                      }`}
                                    >
                                      <IconComponent className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#0F5B4A] dark:group-hover:text-[#24C097]">
                                      {service.title}
                                    </span>
                                  </div>

                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                                    {service.badge}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative text-sm font-medium transition-colors duration-200 py-1.5 ${
                    isActive
                      ? "text-[#0F5B4A] dark:text-[#24C097] font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {t(item.labelKey)}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5B4A] dark:bg-[#24C097] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Controls: Language & Theme Switchers */}
          <div className="hidden sm:flex items-center gap-3">
            <LangToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LangToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1A2825] focus:outline-none focus:ring-2 focus:ring-[#0F5B4A]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 dark:bg-[#0C1211]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1F302D] px-4 pt-3 pb-6 space-y-1 overflow-hidden"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              // Mobile accordion for Services
              if (item.id === "services") {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                        isActive || mobileServicesOpen
                          ? "bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] font-semibold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#162320]"
                      }`}
                    >
                      <span>{t(item.labelKey)}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileServicesOpen ? "rotate-180 text-[#0F5B4A] dark:text-[#24C097]" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile Services Sub-list */}
                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-4 pr-1 py-1 space-y-1 overflow-hidden"
                        >
                          {servicesDropdownList.map((service) => {
                            const IconComponent = service.icon;
                            return (
                              <button
                                key={service.title}
                                type="button"
                                onClick={() => handleServiceSelect(service.title)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162320] hover:text-[#0F5B4A] dark:hover:text-[#24C097] text-left transition-colors"
                              >
                                <IconComponent className="w-3.5 h-3.5 shrink-0 text-[#0F5B4A] dark:text-[#24C097]" />
                                <span>{service.title}</span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#162320]"
                  }`}
                >
                  {t(item.labelKey)}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
