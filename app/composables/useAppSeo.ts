interface SeoOptions {
  title: string | (() => string | undefined);
  description: string | (() => string | undefined);
  type?: "website" | "article";
  slug?: string;
  image?: string;
  noindex?: boolean;
  createdAt?: string | (() => string | undefined);
  updatedAt?: string | (() => string | undefined);
}

export default function (options: SeoOptions) {
  const { locale, defaultLocale } = useI18n();
  const baseUrl = "https://blog.marciosobel.dev";

  const path = locale.value === defaultLocale ? "" : `/${locale.value}`;
  const slugPath = options.slug ? `/${options.slug}` : "";
  const url = `${baseUrl}${path}${slugPath}`;

  const articleOptions =
    options.type === "article"
      ? {
          articleAuthor: ["Márcio Sobel"],
          author: "Márcio Sobel",
          articlePublishedTime: options.createdAt,
          articleModifiedTime: options.updatedAt,
        }
      : {};
  useSeoMeta({
    title: options.title,
    titleTemplate: (s) => `${s || "Blog"} - Márcio Sobel`,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: options.type || "website",
    ogUrl: url,
    ogImage: options.image || `${baseUrl}/og_image.png`,
    twitterCard: "summary_large_image",
    robots: options.noindex ? "noindex, nofollow" : "index, follow",
    ...articleOptions,
  });

  if (!options.noindex) {
    useHead({
      htmlAttrs: { lang: locale.value },
      link: [
        { rel: "canonical", href: url },
        {
          rel: "alternate",
          hreflang: "x-default",
          href: `${baseUrl}${slugPath}`,
        },
        {
          rel: "alternate",
          hreflang: "en",
          href: `${baseUrl}${slugPath}`,
        },
        {
          rel: "alternate",
          hreflang: "pt",
          href: `${baseUrl}/pt${slugPath}`,
        },
      ],
    });
  }
}
