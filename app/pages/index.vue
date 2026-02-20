<script lang="ts" setup>
const { locale, setLocale } = useI18n();
const route = useRoute();

const { data: posts } = await useAsyncData(`posts-${locale.value}`, () => {
  return queryCollection(`content_${locale.value}`).order("meta", "DESC").all();
});

const title = "Márcio Sobel";
const description =
  "A silly developer who loves cats, art and coding on free time.";

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
</script>

<template>
  <header>
    <h1>Márcio Sobel - Blog</h1>

    <div class="header-buttons">
      <LocaleButton />
      <ThemeSwitcher />
    </div>
  </header>

  <main>
    <ul class="posts">
      <li class="post" v-for="post in posts">
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

header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  margin: 2rem 1.5rem;
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
