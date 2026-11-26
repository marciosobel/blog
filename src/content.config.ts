import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defaultLanguage, type Language } from "@/i18n";

// Posts live at `content/blog/<slug>/<language>.md`, so the entry id is the folder name.
const defineBlogCollection = (language: Language = defaultLanguage) => {
  return defineCollection({
    loader: glob({
      base: "content/blog",
      pattern: `*/${language}.md`,
      generateId: ({ entry }) => entry.split("/")[0],
    }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
    }),
  });
};

export const collections = {
  "blog-en": defineBlogCollection("en"),
  "blog-pt": defineBlogCollection("pt"),
};
