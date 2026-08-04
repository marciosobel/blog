<script lang="ts" setup>
const { locale, defaultLocale, t } = useI18n();
const rssLink = computed(() =>
  locale.value === defaultLocale ? "/feed" : `/${locale.value}/feed`,
);

const ICON_SIZE = 20;
</script>

<template>
  <footer>
    <NuxtLink
      to="https://marciosobel.dev"
      class="link"
      :aria-label="t('main-website')"
    >
      <LucideGlobe :size="ICON_SIZE" />
    </NuxtLink>

    <NuxtLink
      to="https://github.com/marciosobel"
      class="link"
      :aria-label="t('github-label')"
    >
      <LucideGithub :size="ICON_SIZE" />
    </NuxtLink>

    <NuxtLink class="link" :aria-label="t('rss-label')" :to="rssLink" external>
      <LucideRss :size="ICON_SIZE" />
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
  padding-bottom: 0;
  background: transparent;
  transition: background 150ms ease;
  border-radius: var(--round-base);
}

.link:hover {
  background: var(--color-bg-weak);
}
</style>
