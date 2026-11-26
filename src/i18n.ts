export const entries = {
  en: {
    "all-posts": "All posts",
    "created-in": "Created in",
    "last-updated": "Last updated in",
    locale: "Locale",
    "post-not-found": "Post not found",
    "not-found-message":
      "The post you are looking for does not exist or has been removed.",
    "back-to-homepage": "Back to homepage",
    "search-posts-placeholder": "Search posts...",
    "search-posts-label": "Search posts",
    "post-index": "On this page",
    "seo-description":
      "A silly developer who loves cats, art and coding on free time.",
    "main-website": "Main website",
    "change-theme": "Change theme",
    "github-label": "Github",
  },
  pt: {
    "all-posts": "Todos os posts",
    "created-in": "Criado em",
    "last-updated": "Última atualização em",
    locale: "Idioma",
    "post-not-found": "Post não encontrado",
    "not-found-message":
      "O post que você está procurando não existe ou foi removido.",
    "back-to-homepage": "Voltar para a página inicial",
    "search-posts-placeholder": "Pesquisar posts...",
    "search-posts-label": "Pesquisar posts",
    "post-index": "Nesta página",
    "seo-description":
      "Um desenvolvedor que ama gatos, arte e programação no tempo livre.",
    "main-website": "Website principal",
    "change-theme": "Alterar tema",
    "github-label": "Github",
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

export async function getCollection(language: Language = defaultLanguage) {
  const posts = await getContentCollection(`blog-${language}`);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Prefixes a path with the language segment (none for the default language). */
export function localizePath(path: string, language: Language = defaultLanguage) {
  const prefix = language === defaultLanguage ? "" : `/${language}`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? prefix || "/" : `${prefix}${normalized}`;
}

export function getEntry(entry: string, language: Language = defaultLanguage) {
  return getContentEntry(`blog-${language}`, entry);
}
