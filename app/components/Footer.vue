<script lang="ts" setup>
const { locale, defaultLocale } = useI18n();
const rssLink = computed(() =>
  locale.value === defaultLocale ? "/feed" : `/${locale.value}/feed`,
);

const year = new Date().getFullYear();
const ICON_SIZE = 20;
</script>

<template>
  <footer>
    <NuxtLink to="https://marciosobel.dev">
      <button class="link">
        <LucideGlobe :size="ICON_SIZE" />
      </button>
    </NuxtLink>

    <NuxtLink to="https://github.com/marciosobel">
      <button class="link">
        <LucideGithub :size="ICON_SIZE" />
      </button>
    </NuxtLink>

    <NuxtLink :to="rssLink" external>
      <button class="link">
        <LucideRss :size="ICON_SIZE" />
      </button>
    </NuxtLink>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-block: 10px;
}

.link {
  aspect-ratio: 1 / 1;
  padding: 8px;
  background: transparent;
  transition: background 150ms ease;
}

.link:hover {
  background: var(--color-bg-weak);
}
</style>
