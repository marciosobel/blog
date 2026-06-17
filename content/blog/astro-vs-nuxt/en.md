---
title: "Astro vs. Nuxt: Which one should you use for your blog?"
description: If you're looking to start a blog, you will probably come across these two very popular options. In this post, I will discuss the pros and cons of each.
date: 2026-06-17
updated:
---
Hello! Over the past few days, I took a look at [Astro](https://astro.build/), a website framework whose main focus is content; that is, it was built with articles, documentation, and blogs in mind.

Its biggest benefit is achieved through minimal Javascript. This really caught my attention. I mentioned [in my first post](https://blog.marciosobel.dev/my-first-blog-post/) that I had thought a lot about using Astro or [Hugo](https://gohugo.io/) for my blog, but I ended up choosing [Nuxt](https://nuxt.com/) because it is a framework made for building websites from scratch, which would give me more flexibility to shape the site to fit my style.

However, I decided to test Astro and see what it would be like for me. Who knows, maybe I'll use it instead of Nuxt on this blog!
## Why Astro?
Right off the bat, what caught my attention the most about Astro was its focus on static content. This means it wasn't made to have a lot of interactivity: buttons, requests, forms... It was made for things that change very little, like documentation, articles, landing pages, and blogs.

It has first-level support for Markdown, the language I use to write my posts. Also, it avoids sending Javascript code to the user as much as possible; this means the sites are always super lightweight.

Well, I decided to test Astro because I had a nagging doubt regarding `Nuxt`: it carries `Vue`'s Javascript runtime along with it. Even though it's not that big of a deal, I wanted my blog to be as simple and lightweight as possible. And so my journey began!
## Recreating my blog with Astro
Let's go, first let's see what I want to achieve here.
- Write my posts in Markdown and not worry about how they end up on the site; I just want to write, upload to the cloud, and Astro's build should update the listing and generate the links accordingly;
- Have the site in two or more languages.

Yeah, the blog is pretty simple; but, I believe that with these requirements, it will be enough to get my hands dirty with the framework.
### Starting the project
This is the easiest and most straightforward part of this whole journey. I only needed to run:
```
pnpm create astro@latest
```
And follow the step-by-step instructions from the cute little robot.

The architecture is very simple, file-based routing... Everything is super intuitive. I didn't use any template, so for me, there was only an `index.astro`, with a completely blank screen, just with an `h1` reading "Astro".

Well, let's start checking some items off the list.
### Listing all posts
I started by creating a `posts/` folder and put the blog posts in it. Since Astro was already made with handling posts in mind, it was very easy. You just need to create a `content.config.ts` file with the following code:
```typescript
const blog = defineCollection({
  loader: glob({ base: "posts", pattern: "**/*.{md,mdx}" }),
});

export const collections = { blog };
```
That was very easy. I used `zod` to create a schema for the frontmatter, the metadata, of the posts.

Then, in the `index.astro` file, the website's entrypoint, I placed the following:
```astro
---
import { getCollection } from "astro:content";
const posts = await getCollection("blog");
if (!posts) return Astro.redirect("/404");
---

<h1>Blog</h1>
<ul>
  {posts.map((post) => (
    <li>
      <a href={post.id}>{post.data.title}</a>
    </li>
  ))}
</ul>
```
Andddd that worked? That's too easy!

In Astro, any code executed inside the "fences" (`---`) runs only at build time. This means our application so far has a grand total of zero Javascript!
### Generating pages dynamically
After creating the post listing page, I wanted to create a page for each post. For this, I needed a dynamic route, meaning I would need Astro to generate the pages for me.

I would like to take this moment to say that Astro's documentation is very good! It would definitely be a lot more work to do this without it.

Anyway, I created a `[slug].astro` file. This file accepts any value as input, and I can use this value via code.
```astro
---
const { slug } = Astro.params;
---
<p>Slug: {slug}</p>
```
Then I used this to get a post's ID. Fortunately, Astro already has a specific function to get an item from a collection: `getEntry`. It receives the collection and the ID to search for. After that, I needed to know how to show the Markdown content in HTML. Then I stumbled upon the `render` function, how useful!
```astro
---
import { getEntry, render } from "astro:content";
const { slug } = Astro.params;
const post = await getEntry("blog", slug);
if (!post) return Astro.redirect("/404");
const { Content } = await render(post);
---
<Content />
```
And in theory, it was supposed to work super well... But Astro cannot know all the possible routes for `[slug].astro`, which prevented it from keeping the site clean of Javascript. To circumvent this, we have to tell Astro all the possible routes. We do this by exporting a `getStaticPaths` function, which fortunately can be async, where we return a list with all the completed variables. We can also pass props to each page, which means we can pass all the posts directly!
```astro
---
import { getCollection, render } from "astro:content"; // we now fetch the whole collection!

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post }, // we can pass the post directly to the page!
  }));
}

const { post } = Astro.props; // and the post is guaranteed to exist!
const { Content } = await render(post);
---
<Content />
```
Okay! That was pretty easy.

Testing the different posts, I noticed that one of them was rendering accents incorrectly. For example, instead of the word *água* (which means "water"), the rendered HTML returned _Ã¡gua_. I was confused about the reason, and apparently Astro no longer defines the document's charset as UTF-8 by default. I was quite confused because [I only saw this mentioned in one place in the docs](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout-property)? But that's fine, I lost a bit of time on this part.
### Dealing with different languages
In case you've never noticed, this blog is available in both Brazilian Portuguese and English. As of the writing of this post, all posts are available in both languages. I don't know if at some point they will diverge and have different content.

Anyway, having multiple languages is necessary. Like the good programmer that I am™, I wanted to keep it dynamic enough to have the least amount of headache possible if I want to write in some other language. First, I changed the `content.config.ts` file to have the posts separated:
```typescript
function createCollection(suffix: string) {
  return defineCollection({
    loader: glob({ base: `posts/${suffix}`, pattern: "**/*.{md,mdx}" });
  });
}

export const collections = {
  "blog-en": createCollection("en"),
  "blog-pt": createCollection("pt"),
};
```
And then I created an `i18n.ts` file with the following code:
```typescript
const entries = {
  en: {
    "all-posts": "All posts",
  },
  pt: {
    "all-posts": "Todos os posts",
  },
};

export type Locales = keyof typeof entries;
export const locales = Object.keys(entries) as Locale[];
export const defaultLocale: Locale = "en" as const;

import { getCollection as getContentCollection } from "astro:content";

export function getCollection(locale: Locale = defaultLocale) {
	return getContentCollection(`blog-${locale}`);
}
```
The page architecture looked like this:
```
src/
├── content.config.ts
├── i18n.ts
├── pages/
│   ├── [lang]/
│   │   ├── [slug].astro
│   │   └── index.astro
│   ├── [slug].astro
└── └── index.astro
```
And everywhere I needed the selected language, I just put `const { lang = defaultLocale } = Astro.params;`.

From then on, everything worked perfectly fine. I created a component that adds the language suffix to the URL, and that way I could switch languages. Everything worked perfectly and, so far, zero JavaScript!
## Where things started to go downhill...
In Astro, Markdown is rendered into HTML. The rendering is very basic: links become `<a>`, headings become `<h1>`, `<h2>`... Everything normal. It turns out that I wanted a small customization: if you want to test it in this post, every title is clickable. I left it like this because, in case someone wants to share just a specific topic of the post, it is possible. To do this, I created a `Prose` component in Nuxt, which allows me to *override* the tags generated by Markdown.

In Astro, however, this is not possible. Not in a simple way. I had two choices:
1. Use `MDX` to write the posts instead of markdown and call the components as needed, or;
2. Use a rehype plugin to alter the tags at rendering time.

Since I'm not really a big fan of `mdx`, I went with the second option. It turns out that this generated very ugly code, barely functional (it bugged a lot), and that I wouldn't understand a few days later. But, that's fine, I did it anyway.

And voilà, after adding the css, I had an exact replica of my blog, 100% functional.
## Verdict and comparison
Well, the entire blog didn't remain immune to JavaScript. It's possible to search for posts and there is a way to toggle between light and dark themes. I built the site and wanted to see how heavy it was.

> The metrics are in the format `<compressed_size>/<uncompressed_size>`. The site will always be downloaded compressed and is uncompressed locally. You can access the reference post [here](https://blog.marciosobel.dev/switching-to-nixos/). All caches were disabled in the measurements.

My blog, with `Nuxt`, the listing of all posts uses **228 kB / 569 kB**. Accessing a post uses **351 kB / 657 kB**.

The replica, with `Astro`, on the listing screen, uses **164 kB / 166 kB**. Accessing a post uses **257 kB / 260 kB**.

It is noticeable that Astro uses 28% less network than Nuxt in the listing, and 27% less when viewing a post, with its biggest difference being in the uncompressed data, possessing a difference of 71% in the listing and 60% when viewing a post!
## Conclusion: which framework am I staying with?
The difference in the final bundle is certainly notable. Astro delivers a much lighter site, containing only the content you choose to deliver. But, despite this, I decided to stick with Nuxt. Here is why: I like to tweak things back and forth. I found Astro for this use case of mine to be not very flexible, especially in the part of modifying the markdown output. And, although it is much lighter, it is only in the uncompressed content; on the network side, the difference isn't that shocking. Today's phones and computers barely break a sweat to compensate for this difference. So I accept making this sacrifice in exchange for a better DX.

Nonetheless, Astro definitely won me over with its charm and simplicity. I will certainly use it to generate documentation for possible libraries of mine in the future. I didn't get to explore its full potential and, if I were starting from scratch, I would probably pick a template and build from there.

That was my review of Astro, I hope you had a good read. Until next time!