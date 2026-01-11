<script lang="ts" setup>
const colorMode = useColorMode();

const toggleTheme = () => {
  const isDark = colorMode.value === "dark";
  colorMode.preference = isDark ? "light" : "dark";
};
</script>

<template>
  <button class="theme-switcher" @click="toggleTheme">
    <ClientOnly>
      <LucideSun v-if="colorMode.value == 'dark'" />
      <LucideMoon v-else-if="colorMode.value == 'light'" />
    </ClientOnly>
  </button>
</template>

<style scoped>
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
  color: var(--color-text);
}
</style>
