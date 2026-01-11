import { defineCollection, defineContentConfig } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content_en: defineCollection({
      type: "page",
      source: "blog/**/en.md",
    }),
    content_pt: defineCollection({
      type: "page",
      source: "blog/**/pt.md",
    }),
  },
});
