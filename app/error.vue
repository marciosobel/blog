<script setup lang="ts">
import type { NuxtError } from "#app";

const { locale, defaultLocale, t } = useI18n();

const props = defineProps<{
  error: NuxtError;
}>();

useAppSeo({
  title: () => `${t("post-not-found")} - Márcio Sobel`,
  description: () => t("not-found-message"),
  noindex: true,
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
