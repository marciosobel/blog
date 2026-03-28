<script lang="ts" setup>
const { locale, t } = useI18n();
const route = useRoute();

const { data: posts, pending } = await useAsyncData(
  `posts-${locale.value}`,
  () => {
    return queryCollection(`content_${locale.value}`)
      .order("meta", "DESC")
      .all();
  },
);

const title = () => "Márcio Sobel";
const description = () => t("seo-description");

useSeoMeta({
  title,
  description,

  // Open Graph
  ogTitle: title,
  ogDescription: description,
  ogType: "website",
  ogUrl: `https://blog.marciosobel.dev${route.path}`,
  ogImage: "https://blog.marciosobel.dev/og_image.png",

  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://blog.marciosobel.dev/og_image.png",
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

const search = ref("");
const results = computed(() => {
  if (!search.value || !posts.value) return posts.value;

  const searchTerm = search.value.toLowerCase();
  return posts.value.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm),
  );
});
</script>

<template v-if="!pending">
  <header>
    <h1>Márcio Sobel - Blog</h1>

    <div class="header-buttons">
      <LocaleButton />
      <ThemeSwitcher />
    </div>
  </header>

  <main>
    <div class="search-bar">
      <input :placeholder="t('search-posts-placeholder')" v-model="search" />
      <LucideSearch />
    </div>

    <ul class="posts">
      <li class="post" v-for="post in results">
        <div class="title">
          <NuxtLink
            :to="generatePostUrl(post.stem, locale)"
            class="underline-link"
          >
            <h2>{{ post.title }}</h2>
          </NuxtLink>
          <div class="dates">
            <span>
              <LucideCalendar class="icon" />
              {{ formatDate(post.meta.date, locale) }}
            </span>
            <span>
              <template v-if="post.meta.updated">
                <span class="date-divider">&nbsp;· </span
                ><LucideClock3 class="icon" />
                {{ formatDate(post.meta.date, locale) }}
              </template>
            </span>
          </div>
        </div>
        <p>{{ post.description }}</p>
      </li>
    </ul>
  </main>

  <Footer />
</template>

<style scoped>
* {
  margin: 0;
}

ul {
  list-style-type: none;
}

header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  margin-inline: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

header h1 {
  grid-column-start: 2;
  text-align: center;
}

.header-buttons {
  justify-self: end;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  width: fit-content;
  height: fit-content;
}

main {
  flex-grow: 1;
}

.posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(100dvw, 120ch);
  padding: 0 1rem;
  margin-inline: auto;

  gap: 10px;
}

.post {
  background: var(--color-bg-weak);
  border-radius: var(--round-base);
  border: 2px var(--border) solid;
  padding: 1rem;
  width: 100%;
}

.post a {
  text-decoration: none;
}

.post .title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.post .dates {
  display: flex;
  align-items: center;
  opacity: 75%;
  font-size: 0.9rem;
}

.post .dates span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.post .dates .icon {
  width: 1rem;
  height: 1rem;
}

.search-bar {
  position: relative;
  width: min(100dvw, 50ch);
  margin-bottom: 1rem;
  margin-inline: auto;
  padding-inline: 1rem;
}

.search-bar input {
  width: 100%;
  font-size: 1rem;
  padding-left: 2.75rem;
}

.lucide-search-icon {
  position: absolute;
  width: 2rem;
  aspect-ratio: 1 / 1;

  top: 50%;
  left: 1.5rem;
  transform: translateY(-50%);
  z-index: 1;
  color: var(--color-text);
  opacity: 0.5;
}

@media only screen and (max-width: 560px) {
  header {
    grid-template-rows: auto auto;
    grid-template-columns: 1fr;
  }

  header h1 {
    grid-column-start: 1;
    grid-row-start: 2;
    text-align: center;
  }

  .header-buttons {
    grid-row-start: 1;
    margin-inline: auto;
    justify-content: space-between;
    width: 100%;
  }

  .post .title {
    text-align: left;
    justify-content: start;
  }

  .post .dates {
    justify-content: space-between;
  }
}
</style>
