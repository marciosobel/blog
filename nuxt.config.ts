// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: true,
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/color-mode",
    "@nuxt/content",
    "@nuxtjs/i18n",
    "nuxt-lucide-icons",
  ],
  css: ["~/assets/css/globals.css"],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/png", href: "/favicon.png" },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: ["/feed", "/pt/feed"],
    },
  },
  i18n: {
    locales: [
      { code: "en", name: "English", language: "en-US", file: "en.json" },
      { code: "pt", name: "Português", language: "pt-BR", file: "pt.json" },
    ],
    strategy: "prefix_except_default",
    defaultLocale: "en",
    baseUrl: "https://blog.marciosobel.dev",
  },
  content: {
    experimental: { sqliteConnector: "native" },
    build: {
      pathMeta: { slugifyOptions: { trim: true } },
      markdown: {
        highlight: {
          langs: ["rust", "nix", "typescript", "astro"],
          theme: {
            default: "gruvbox-light-soft",
            dark: "gruvbox-dark-soft",
          },
        },
      },
    },
  },
});
