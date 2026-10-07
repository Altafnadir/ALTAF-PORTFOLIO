import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Altaf | Full Stack & Mobile Developer | Portfolio",
  description:
    "Altaf is a final-year Software Engineering student, Full Stack & Mobile Developer, and programming tutor building fast, scalable digital solutions.",
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
  openGraph: {
    title: "Altaf | Full Stack & Mobile Developer",
    description:
      "Modern web apps, mobile apps, and tutoring by Altaf, final-year Software Engineering student.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${caveat.variable} h-full scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-[#FBFBFB] text-[#141A19] dark:bg-[#0C1211] dark:text-[#F3F7F6] selection:bg-[#0F5B4A] selection:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
