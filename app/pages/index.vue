<script lang="ts" setup>
const { locale, setLocale } = useI18n();
const route = useRoute();

const { data: posts } = await useAsyncData(`posts-${locale.value}`, () => {
  return queryCollection(`content_${locale.value}`).order("meta", "DESC").all();
});

const toggleLanguage = () => {
  const languages: Array<typeof locale.value> = ["pt", "en"];
  const currentIndex = languages.indexOf(locale.value);
  if (currentIndex === -1) {
    return;
  }

  const language = languages[(currentIndex + 1) % languages.length];
  if (!language) {
    return;
  }

  setLocale(language);
};

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
    <div class="header-buttons">
      <button @click="toggleLanguage">
        <LucideLanguages :size="14" />{{ $t("locale") }}: {{ locale }}
      </button>

      <ThemeSwitcher />
    </div>
    <h1>Márcio Sobel - Blog</h1>
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  margin: 1rem;
}

header h1 {
  text-align: center;
}

.header-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  margin-left: auto;

  width: fit-content;
  height: fit-content;
}

.posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;

  gap: 10px;
  padding: 1rem;
}

.post {
  background: var(--color-bg-weak);
  border-radius: var(--round-base);
  border: 2px var(--border) solid;
  width: min(120ch, 90dvw);
  padding: 1rem;
}

.post a {
  text-decoration: none;
}

.post .title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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

@media only screen and (max-width: 768px) {
  .post {
    margin-left: 0;
    max-width: 30ch;
  }

  .post a {
    margin-bottom: 0.25rem;
  }

  .post .title {
    text-align: center;
    flex-direction: column;
    gap: 0;
  }

  .post .dates {
    flex-direction: column;
    justify-content: center;
  }

  .date-divider {
    display: none !important;
  }

  .header-buttons {
    margin-right: auto;
    margin-bottom: 14px;
  }
}
</style>
