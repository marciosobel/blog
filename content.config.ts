import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content_en: defineCollection({
      type: "page",
      source: "blog/**/en.md",
      schema: z.object({ rawbody: z.string() }),
    }),
    content_pt: defineCollection({
      type: "page",
      source: "blog/**/pt.md",
      schema: z.object({ rawbody: z.string() }),
    }),
  },
});
