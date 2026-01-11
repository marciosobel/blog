<template>
  <h2 :id="id" class="md-link">
    <NuxtLink :to="href" class="underline-link">
      <slot />
    </NuxtLink>
    <LucideLink :size="14" class="md-link-icon" />
  </h2>
</template>

<script setup lang="ts">
const props = defineProps<{ id?: string }>();
const href = computed(() => `#${props.id}`);
</script>

<style scoped>
.md-link {
  display: flex;
  align-items: center;
  gap: 10px;
}

.md-link-icon {
  opacity: 0;
  transition: opacity 100ms ease;
}

.md-link:hover .md-link-icon {
  opacity: 1;
}
</style>
