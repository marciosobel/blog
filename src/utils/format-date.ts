import { format } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import type { Language } from "@/i18n";

const localeMap: Record<Language, Locale> = {
  en: enUS,
  pt: ptBR,
};

/**
 * Frontmatter dates like `2026-06-17` are parsed as UTC midnight, so they're
 * read back in UTC; otherwise builds west of UTC would show the previous day.
 */
export const formatDate = (date: Date, language: Language = "en"): string => {
  const calendarDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return format(calendarDate, "PPP", { locale: localeMap[language] });
};
