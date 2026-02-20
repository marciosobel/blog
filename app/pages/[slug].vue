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
);
const title = post.value?.title;
const description = post.value?.description;
const date = post.value?.meta.date as string | undefined;
const updated = post.value?.meta.updated as string | undefined;

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
  articlePublishedTime: date,
  articleModifiedTime: updated,
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
            {{ formatDate(post.meta.date, locale) }}</span
          >
          <span v-if="post.meta.updated">
            <span class="date-divider" aria-hidden>&nbsp; · </span>
            <LucideClock3 class="icon" />{{ $t("last-updated") }}
            {{ formatDate(post.meta.updated, locale) }}
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
  max-width: 80ch;
  line-height: 1.4;
  font-size: 1.125rem;
}

header {
  margin: 20px;
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
  overflow-x: scroll;
}

:deep(pre code) {
  padding: 0;
}

@media only screen and (max-width: 800px) {
  main {
    max-width: 90dvw;
    padding: 0;
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
