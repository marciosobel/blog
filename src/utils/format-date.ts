import { format } from "date-fns";
import { ptBR, enUS, type Locale } from "date-fns/locale";
import { type Language } from "@/i18n";

const localeMap: Record<Language, Locale> = {
  en: enUS,
  pt: ptBR,
};

export const formatDate = (
  date: Date,
  currentLocale: Language = "en",
): string | undefined => {
  const locale = localeMap[currentLocale];
  return format(date, "PPP", { locale });
};
