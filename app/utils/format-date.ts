import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

const localeMap = {
  en: enUS,
  pt: ptBR,
};

export function formatDate(
  str: unknown,
  currentLocale: string = "en",
): string | undefined {
  if (!str) {
    return;
  }

  const [year, month, day] = String(str).split("-").map(Number);
  if (!year || !month || !day) {
    return;
  }

  const locale = localeMap[currentLocale as keyof typeof localeMap];

  const parsedDate = new Date(year, month - 1, day);
  return format(parsedDate, "PPP", { locale });
}
