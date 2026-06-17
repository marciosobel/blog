export const entries = {
  en: {
    "post-not-found": "Post not found",
    "search-posts": "Search posts...",
    "seo-description":
      "A silly developer who loves cats, art and coding on free time.",
    locale: "Locale",
    "all-posts": "All posts",
    "post-posted-at": "Posted at",
    "post-updated-at": "",
  },
  pt: {
    "post-not-found": "Post não encontrado",
    "search-posts": "Procurar posts...",
    "seo-description":
      "Um desenvolvedor que ama gatos, arte e programação no tempo livre",
    locale: "Idioma",
    "all-posts": "Todos os posts",
    "post-posted-at": "Publicado em",
    "post-updated-at": "Atualizado em",
  },
};

export type Language = keyof typeof entries;
export const languages = Object.keys(entries) as Language[];
export const defaultLanguage: Language = "en" as const;

import {
  getCollection as getContentCollection,
  getEntry as getContentEntry,
} from "astro:content";

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split("/");
  if (lang in entries) {
    return lang as Language;
  } else {
    return defaultLanguage;
  }
}

export function useLocale<L extends Language>(
  language: L = defaultLanguage as L,
) {
  return function <K extends keyof (typeof entries)[L]>(key: K) {
    if (!(language in entries) || !(key in entries[language])) {
      return key;
    }

    return entries[language][key];
  };
}

export function getCollection(language: Language = defaultLanguage) {
  return getContentCollection(`blog-${language}`);
}

export function getEntry(entry: string, language: Language = defaultLanguage) {
  return getContentEntry(`blog-${language}`, entry);
}
