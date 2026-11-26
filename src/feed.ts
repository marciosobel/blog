import rss from "@astrojs/rss";
import { constants } from "@/constants";
import { getCollection, type Language, localizePath, useLocale } from "@/i18n";

export async function createFeed(lang: Language) {
  const t = useLocale(lang);
  const posts = await getCollection(lang);

  const response = await rss({
    title: "Márcio Sobel - Blog",
    description: t("rss-description"),
    site: constants.BASE_URL,
    xmlns: { content: "http://purl.org/rss/1.0/modules/content/" },
    customData: `<image><url>${constants.BASE_URL}/rss_icon.png</url><title>Márcio Sobel - Blog</title><link>${constants.BASE_URL}</link></image>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      author: "Márcio Sobel",
      link: localizePath(post.id, lang),
      content: post.rendered?.html,
    })),
  });

  response.headers.set("Content-Type", "application/rss+xml; charset=utf-8");
  return response;
}
