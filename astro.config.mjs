// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: "gruvbox-light-soft",
        dark: "gruvbox-dark-soft",
      },
    },
  },
});
