<script lang="ts" setup>
const { locale, setLocale } = useI18n();

const toggleLanguage = () => {
  const languages: Array<typeof locale.value> = ["pt", "en"];
  const currentIndex = languages.indexOf(locale.value);
  if (currentIndex === -1) return;

  const language = languages[(currentIndex + 1) % languages.length];
  if (!language) return;

  setLocale(language);
};
</script>

<template>
  <button style="text-wrap: nowrap" @click="toggleLanguage">
    <LucideLanguages :size="14" />{{ $t("locale") }}: {{ locale }}
  </button>
</template>
