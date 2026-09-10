interface SeoOptions {
  title?: string | (() => string | undefined);
  description: string | (() => string | undefined);
  type?: "website" | "article";
  slug?: string;
  image?: string;
  noindex?: boolean;
  createdAt?: string | (() => string | undefined);
  updatedAt?: string | (() => string | undefined);
  tags?: string[] | (() => string[] | undefined);
}

const BASE_URL = "https://blog.marciosobel.dev";

export default function (options: SeoOptions) {
  const { locale, defaultLocale } = useI18n();

  const slugPath = options.slug ? `/${options.slug}` : "";
  const url = computed(() => {
    const localePath = locale.value === defaultLocale ? "" : `/${locale.value}`;
    return `${BASE_URL}${localePath}${slugPath}`;
  });

  const articleOptions =
    options.type === "article"
      ? {
          articleAuthor: ["Márcio Sobel"],
          author: "Márcio Sobel",
          articlePublishedTime: options.createdAt,
          articleModifiedTime: options.updatedAt,
          articleTag: options.tags,
        }
      : {};
  useSeoMeta({
    title: options.title,
    titleTemplate: (s) => `${s || "Blog"} - Márcio Sobel`,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: options.type || "website",
    ogUrl: () => url.value,
    ogImage: options.image || `${BASE_URL}/og_image.png`,
    twitterCard: "summary_large_image",
    robots: options.noindex ? "noindex, nofollow" : "index, follow",
    ...articleOptions,
  });

  if (!options.noindex) {
    useHead(() => ({
      htmlAttrs: { lang: locale.value },
      link: [
        { rel: "canonical", href: url.value },
        {
          rel: "alternate",
          hreflang: "x-default",
          href: `${BASE_URL}${slugPath}`,
        },
        {
          rel: "alternate",
          hreflang: "en",
          href: `${BASE_URL}${slugPath}`,
        },
        {
          rel: "alternate",
          hreflang: "pt",
          href: `${BASE_URL}/pt${slugPath}`,
        },
      ],
    }));
  }
}
