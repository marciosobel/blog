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

/* If the link contains a code tag, remove the shadow from the link... */
.md-link:has(code) {
  box-shadow: none;
}

/* ...and apply it to the code tag instead, so it hugs the background */
.md-link :deep(code) {
  box-shadow: inset 0 -2px 0 0 var(--color-accent1);
  border-radius: var(--round-base) var(--round-base) 0px 0px;
}
</style>
