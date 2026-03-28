<script setup lang="ts">
import type { NuxtError } from "#app";

const { locale, defaultLocale } = useI18n();

const props = defineProps<{
  error: NuxtError;
}>();

const title = () => `${$t("post-not-found")} - Márcio Sobel`;
const description = () => $t("not-found-message");

useSeoMeta({
  title,
  description,

  // Open Graph (Facebook/LinedIn)
  ogTitle: title,
  ogDescription: description,
  ogType: "website",
  ogImage: "https://blog.marciosobel.dev/og_image_not_found.png",

  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://blog.marciosobel.dev/og_image_not_found.png",

  // Crucial: Tell search engines not to index this page
  robots: "noindex, nofollow",
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

  <main class="not-found">
    <p style="">{{ $t("post-not-found") }}</p>
    <button @click="navigateTo($localePath('/'))">
      {{ $t("back-to-homepage") }}
    </button>
  </main>
</template>

<style scoped>
header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin: 2rem 1.5rem;
}

header h1 {
  grid-column-start: 2;
}

.header-buttons {
  display: flex;
  gap: 1rem;
  justify-self: end;
}

main {
  margin: auto;
  text-align: center;
}

main p {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 2rem;
}

main button {
  font-size: 1.1rem;
  margin-inline: auto;
}

@media screen and (max-width: 700px) {
  header {
    display: flex;
    flex-direction: column-reverse;
    text-align: center;
  }

  .header-buttons {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
