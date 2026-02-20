<script lang="ts" setup>
import { formatDate } from "#imports";
const route = useRoute();
const { locale, defaultLocale } = useI18n();

const { data: post } = await useAsyncData(
  `${route.params.slug}-${locale.value}`,
  () => {
    return queryCollection(`content_${locale.value}`)
      .path(`/blog/${route.params.slug}/${locale.value}`)
      .first();
  },
  {
    watch: [locale],
    transform: (data) => {
      if (!data) return data;
      const dates: Record<
        "createdAt" | "updatedAt",
        Record<"iso" | "formatted", string | undefined>
      > = {
        createdAt: {
          iso: undefined,
          formatted: undefined,
        },
        updatedAt: {
          iso: undefined,
          formatted: undefined,
        },
      };

      dates.createdAt.iso = new Date(data.meta.date as string).toISOString();
      dates.createdAt.formatted = formatDate(data.meta.date, locale.value);

      if (data.meta.updated) {
        const updatedDate = new Date(data.meta.updated as string);
        dates.updatedAt.iso = updatedDate.toISOString();
        dates.updatedAt.formatted = formatDate(data.meta.updated, locale.value);
      }

      return {
        ...data,
        ...dates,
      };
    },
  },
);
const title = () => post.value?.title;
const description = () => post.value?.description;
const createdISO = () => post.value?.createdAt.iso;
const updatedISO = () => post.value?.updatedAt.iso;
const createdFormatted = () => post.value?.createdAt.formatted;
const updatedFormatted = () => post.value?.updatedAt.formatted;

const href = locale.value === defaultLocale ? "/" : `/${locale.value}`;

useSeoMeta({
  title,
  titleTemplate: (s) => `${s || "Blog"} - Márcio Sobel`,
  description: description,

  // Open Graph (Facebook/LinkedIn)
  ogTitle: title,
  ogDescription: description,
  ogType: "article",
  ogUrl: `https://blog.marciosobel.dev${route.path}`,
  ogImage: "https://blog.marciosobel.dev/og_image.png",

  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://blog.marciosobel.dev/og_image.png",

  // Article Specifics
  articleAuthor: ["Márcio Sobel"],
  author: "Márcio Sobel",
  articlePublishedTime: createdISO,
  articleModifiedTime: updatedISO,
});

useHead({
  htmlAttrs: { lang: locale.value },
  link: [
    {
      rel: "canonical",
      href: `https://blog.marciosobel.dev${route.path}`,
    },
  ],
});
</script>

<template>
  <template v-if="post">
    <header>
      <div class="header-buttons">
        <NuxtLink :to="href" class="go-back">
          <LucideArrowLeft class="back-icon" />
          <p class="underline-link">{{ $t("all-posts") }}</p>
        </NuxtLink>
        <ThemeSwitcher />
      </div>

      <div class="title">
        <h1>{{ post.title }}</h1>
        <aside class="metadata">
          <span>
            <LucideCalendar class="icon" />{{ $t("created-in") }}
            {{ post.createdAt.formatted }}</span
          >
          <span v-if="post.updatedAt.formatted">
            <span class="date-divider" aria-hidden>&nbsp; · </span>
            <LucideClock3 class="icon" />{{ $t("last-updated") }}
            {{ post.updatedAt.formatted }}
          </span>
        </aside>
      </div>
    </header>

    <main>
      <ContentRenderer :value="post" tag="article" class="content" />
    </main>
  </template>

  <template v-else>
    <header>
      <div class="header-buttons">
        <NuxtLink :to="href" class="go-back">
          <LucideArrowLeft class="back-icon" />
          <p class="underline-link">{{ $t("all-posts") }}</p>
        </NuxtLink>
        <ThemeSwitcher />
      </div>

      <div class="title">
        <h1>Márcio Sobel - Blog</h1>
      </div>
    </header>

    <main class="not-found">
      <p style="margin-top: 2rem; margin-bottom: 0.5rem">Post not found.</p>
      <NuxtLink to="/" class="underline-link"
        ><b>Go to post listing</b></NuxtLink
      >
    </main>
  </template>

  <Footer />
</template>

<style scoped>
.not-found {
  text-align: center;
  margin: auto;
}

.header-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.title h1 {
  margin: 0;
  text-align: center;
  overflow-wrap: break-word;
}

.metadata {
  display: flex;
  align-items: center;
  justify-content: center;
  text-wrap: nowrap;
}

.metadata span {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 75%;

  font-size: 0.9rem;
}

span .icon {
  width: 0.75rem;
}

header .go-back {
  display: flex;
  align-items: center;
  justify-content: start;

  gap: 10px;
}

.go-back p {
  margin: 0;
  transform: translateY(1px);
}

.go-back .back-icon {
  user-select: none;
  transition: transform 100ms ease;
}

.go-back:hover .back-icon {
  transform: translateX(-20%);
}

main {
  padding-inline: 30px;
  margin-inline: auto;
  max-width: 75ch;
  line-height: 1.45;
  font-size: 1.125rem;
  overflow-wrap: break-word;
}

header {
  margin: 2rem 1.5rem;
}

:deep(article > * + *) {
  margin-top: 1.25em;
}

:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  line-height: 1.2;
}

:deep(blockquote) {
  position: relative;
}

:deep(blockquote p) {
  opacity: 75%;
}

:deep(blockquote::after) {
  content: "";
  position: absolute;
  height: 100%;
  width: 4px;
  left: -20px;
  top: 0;
  background: var(--color-text);
  opacity: 15%;
  border-radius: var(--round-base);
}

:deep(code) {
  background: var(--color-bg-weak);
  padding-inline: 6px;
  border-radius: var(--round-base);
  font-size: 0.975rem;
}

:deep(pre) {
  background: var(--color-bg-weak);
  padding: 10px;
  border-radius: var(--round-base);
  overflow-x: auto;
  scrollbar-width: thin;
}

:deep(pre code) {
  padding: 0;
}

@media only screen and (max-width: 800px) {
  main {
    max-width: 90dvw;
    padding: 0;
    font-size: 1.05rem;
  }

  .metadata {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  span .date-divider {
    display: none;
  }
}
</style>
