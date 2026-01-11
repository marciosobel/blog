<script lang="ts" setup>
import { formatDate } from "#imports";

const regex = /[^\/]+\/(.+)\/[^\/]+/;
const { locale, locales, setLocale } = useI18n();

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

const postUrl = (post: string) => {
  const name = post.match(regex)?.[1];
  if (locale.value == "en") {
    return `/${name}`;
  }

  return `/${locale.value}/${name}`;
};
</script>

<template>
  <header>
    <h1>Blog</h1>
    <div class="header-buttons">
      <button @click="toggleLanguage">
        <LucideLanguages :size="14" />{{ $t("locale") }}: {{ locale }}
      </button>

      <ThemeSwitcher />
    </div>
  </header>

  <ul class="posts">
    <li class="post" v-for="post in posts">
      <div class="title">
        <NuxtLink :to="postUrl(post.stem)" class="underline-link">
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

  margin: 1rem;
}

.header-buttons {
  position: absolute;
  right: 0;
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
  border: 2px #ffffff10 solid;
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
}
</style>
