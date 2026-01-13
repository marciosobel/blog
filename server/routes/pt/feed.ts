import RSS from "rss";
import { queryCollection } from "@nuxt/content/server";
import snarkdown from "snarkdown";

const FRONTMATTER_REGEX = /^---[\s\S]*?---/;

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, "content_pt")
    .order("meta", "DESC")
    .all();

  const feed = new RSS({
    title: "Márcio Sobel - Blog",
    description: "falando abobrinhas online",
    site_url: "https://blog.marciosobel.dev",
    feed_url: "https://blog.marciosobel.dev/pt/feed",
    image_url: "https://blog.marciosobel.dev/rss_icon.png",
  });

  posts.forEach((post) => {
    const withoutFrontmatter = post.rawbody
      .replace(FRONTMATTER_REGEX, "")
      .trim();
    const html = snarkdown(withoutFrontmatter);
    feed.item({
      title: post.title,
      description: post.description,
      date: parseDate(post.meta.date as string),
      author: "Márcio Sobel",
      url: `https://blog.marciosobel.dev/${generatePostUrl(post.stem, "pt")}`,
      custom_elements: [
        {
          "content:encoded": { _cdata: html },
        },
      ],
    });
  });

  setHeaders(event, { "Content-Type": "application/rss+xml" });
  return feed.xml({ indent: true });
});

function parseDate(str: string): Date {
  const [day, month, year] = str.split("-").map(Number);
  return new Date(day, month - 1, year);
}
