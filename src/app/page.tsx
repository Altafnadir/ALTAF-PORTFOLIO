import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { defaultLocale, locales } from "@/i18n/routing";

export default async function RootIndexPage() {
  const cookieStore = await cookies();
  const savedLang =
    cookieStore.get("altaf_lang")?.value ||
    cookieStore.get("NEXT_LOCALE")?.value;

  const targetLocale =
    savedLang && (locales as readonly string[]).includes(savedLang)
      ? savedLang
      : defaultLocale;

  redirect(`/${targetLocale}`);
}
