<script lang="ts" setup>
defineProps<{
  tags?: string[];
}>();
</script>

<template>
  <ul v-if="tags?.length" class="post-tags" :aria-label="$t('tags')">
    <li v-for="tag in tags" :key="tag">
      <NuxtLinkLocale :to="{ path: '/', query: { search: tag } }">
        #{{ tag }}
      </NuxtLinkLocale>
    </li>
  </ul>
</template>

<style scoped>
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
}

.post-tags a {
  display: block;
  padding: 0.15rem 0.5rem;
  color: var(--color-text);
  background: var(--color-bg-weak);
  border: 2px solid var(--border);
  border-radius: var(--round-base);
  text-decoration: none;
  transition: border-color 125ms ease;
}

.post-tags a:hover,
.post-tags a:focus-visible {
  border-color: var(--color-accent1);
}
</style>
