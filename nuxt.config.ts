// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: true,
  devtools: { enabled: true },
  modules: ["@nuxtjs/color-mode", "@nuxt/content", "@nuxtjs/i18n"],
  css: ["~/assets/css/globals.css"],
  i18n: {
    locales: [
      { code: "en", name: "English", language: "en-US" },
      { code: "pt", name: "Português", language: "pt-BR" },
    ],
    strategy: "prefix_except_default",
    defaultLocale: "en",
  },
  content: {
    experimental: { sqliteConnector: "native" },
    build: {
      pathMeta: { slugifyOptions: { trim: true } },
      markdown: {
        highlight: {
          langs: [],
          theme: {
            default: "gruvbox-light-soft",
            dark: "gruvbox-dark-soft",
          },
        },
      },
    },
  },
});
