import type { Metadata } from "next";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { routing, Locale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    return {};
  }

  const titles: Record<Locale, string> = {
    en: "Altaf | Full Stack & Mobile Developer | Portfolio",
    es: "Altaf | Desarrollador Full Stack y Móvil | Portafolio",
    de: "Altaf | Full-Stack- & Mobile-Entwickler | Portfolio",
  };

  const descriptions: Record<Locale, string> = {
    en: "Altaf is a final-year Software Engineering student, Full Stack & Mobile Developer, and programming tutor building fast, scalable digital solutions.",
    es: "Altaf es un estudiante de último año de Ingeniería de Software, desarrollador Full Stack y Móvil, y tutor de programación que crea soluciones digitales escalables.",
    de: "Altaf ist ein Software-Engineering-Student im Abschlussjahr, Full-Stack- & Mobile-Entwickler sowie Programmier-Tutor für skalierbare digitale Lösungen.",
  };

  return {
    title: titles[locale as Locale] || titles.en,
    description: descriptions[locale as Locale] || descriptions.en,
    keywords: [
      "Altaf",
      "Software Engineer",
      "Portfolio",
      "Full Stack Developer",
      "Next.js",
      "React",
      "Mobile Apps",
      "Programming Tutor",
      "Pakistan",
    ],
    authors: [{ name: "Altaf" }],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
        de: "/de",
        "x-default": "/en",
      },
    },
    openGraph: {
      title: titles[locale as Locale] || titles.en,
      description: descriptions[locale as Locale] || descriptions.en,
      type: "website",
      locale: locale === "es" ? "es_ES" : locale === "de" ? "de_DE" : "en_US",
      alternateLocale:
        locale === "en"
          ? ["es_ES", "de_DE"]
          : locale === "es"
          ? ["en_US", "de_DE"]
          : ["en_US", "es_ES"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering for next-intl
  setRequestLocale(locale);

  // Load localized messages
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PortfolioProvider initialLocale={locale as Locale}>
        {children}
      </PortfolioProvider>
    </NextIntlClientProvider>
  );
}
