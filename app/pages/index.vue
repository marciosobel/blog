<script lang="ts" setup>
const regex = /[^\/]+\/(.+)\/[^\/]+/;
const { locale, setLocale } = useI18n();
const colorMode = useColorMode();

const { data: posts } = await useAsyncData(`posts-${locale.value}`, () => {
  return queryCollection(`content_${locale.value}`).all();
});

const toggleTheme = () => {
  const isDark = colorMode.value === "dark";
  colorMode.preference = isDark ? "light" : "dark";
};

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
        {{ locale }}
      </button>

      <button class="theme-switcher" @click="toggleTheme">
        <LucideSun v-if="colorMode.value == 'dark'" />
        <LucideMoon v-else-if="colorMode.value == 'light'" />
      </button>
    </div>
  </header>

  <ul class="posts">
    <li class="post" v-for="post in posts">
      <div class="title">
        <NuxtLink :to="postUrl(post.stem)" class="underline-link">
          <h2>{{ post.title }}</h2>
        </NuxtLink>
        <span class="dates">
          <LucideCalendar class="icon" /> {{ post.meta.date }}
          <template v-if="post.meta.updated">
            · <LucideClock3 class="icon" /> {{ post.meta.updated }}
          </template>
        </span>
      </div>
      <p>{{ post.description }}</p>
    </li>
  </ul>
</template>

<style scoped>
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
  gap: 10px;

  margin-left: auto;

  width: fit-content;
  height: fit-content;
}

.posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;

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

  gap: 5px;
}

.post .dates .icon {
  width: 1rem;
  height: 1rem;
}

.theme-switcher {
  aspect-ratio: 1 / 1;
  cursor: pointer;

  padding: 0;
  border-radius: 100%;
  background: transparent;

  transition:
    opacity 125ms ease,
    transform 125ms ease;
}

.theme-switcher:hover {
  transform: scale(1.1);
}

.theme-switcher:active {
  transform: scale(1.05);
}

.theme-switcher > * {
  width: 2rem;
  height: 2rem;
}

@media only screen and (max-width: 768px) {
  .post {
    margin-left: 0;
    max-width: 30ch;
  }

  .post .title {
    flex-direction: column;
    gap: 0;
  }
}
</style>
