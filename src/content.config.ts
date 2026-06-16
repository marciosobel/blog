import { defineCollection } from "astro/content/runtime";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defaultLanguage, type Language } from "@/i18n";

const defineBlogCollection = (language: Language = defaultLanguage) => {
  return defineCollection({
    loader: glob({ base: `posts/${language}`, pattern: "**/*.{md,mdx}" }),
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
