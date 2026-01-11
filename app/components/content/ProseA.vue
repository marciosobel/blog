<script lang="ts" setup>
defineProps<{ href: string; target?: string }>();
</script>

<template>
  <NuxtLink :to="href" :target="target" class="md-link">
    <slot />
  </NuxtLink>
</template>

<style scoped>
.md-link {
  text-decoration: none;
  box-shadow: inset 0 -2px 0 0 var(--color-accent1);
}
</style>
