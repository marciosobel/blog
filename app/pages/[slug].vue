<script lang="ts" setup>
import { formatDate } from "#imports";
const route = useRoute();
const { locale, defaultLocale } = useI18n();

const { data: post } = await useAsyncData(
  `${route.params.slug}-${locale.value}`,
  () => {
    return queryCollection(`content_${locale.value}`)
      .path(`/blog/${route.params.slug}/${locale.value}`)
      .first();
  },
);

const href = locale.value === defaultLocale ? "/" : `/${locale.value}`;

useSeoMeta({
  articleAuthor: ["Márcio Sobel"],
  author: "Márcio Sobel",
});

useHead({
  title: post.value?.title,
  titleTemplate: (s) => `${s || "Blog"} - Márcio Sobel`,
});
</script>

<template>
  <main>
    <template v-if="post">
      <header>
        <div class="header-buttons">
          <NuxtLink :to="href" class="go-back">
            <LucideArrowLeft class="back-icon" />
            <p class="underline-link">{{ $t("all-posts") }}</p>
          </NuxtLink>
          <ThemeSwitcher />
        </div>

        <div class="title">
          <h1>{{ post.title }}</h1>
          <aside class="metadata">
            <span
              ><LucideCalendar class="icon" />{{ $t("created-in") }}
              {{ formatDate(post.meta.date, locale) }}</span
            >
            <span v-if="post.meta.updated">
              <span class="date-divider" aria-hidden>&nbsp; · </span
              ><LucideClock3 class="icon" />{{ $t("last-updated") }}
              {{ formatDate(post.meta.updated, locale) }}
            </span>
          </aside>
        </div>
      </header>

      <ContentRenderer :value="post" tag="article" class="content" />
    </template>
    <template v-else>
      <p style="margin-top: 2rem; margin-bottom: 0.5rem">Post not found.</p>
      <NuxtLink to="/" class="underline-link"
        ><b>Go to post listing</b></NuxtLink
      >
    </template>
  </main>
</template>

<style scoped>
.header-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.title h1 {
  margin: 0;
  text-align: center;
}

.metadata {
  display: flex;
  align-items: center;
  justify-content: center;
  text-wrap: nowrap;
}

.metadata span {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 75%;

  font-size: 0.9rem;
}

span .icon {
  width: 0.75rem;
  transform: translateY(-2px);
}

header .go-back {
  display: flex;
  align-items: center;
  justify-content: start;

  gap: 10px;
}

.go-back p {
  margin: 0;
  transform: translateY(1px);
}

.go-back .back-icon {
  user-select: none;
  transition: transform 100ms ease;
}

.go-back:hover .back-icon {
  transform: translateX(-20%);
}

main {
  margin: 40px auto;
  max-width: 80ch;
  line-height: 1.4;
  font-size: 1.125rem;
}

:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  line-height: 1.2;
}

@media only screen and (max-width: 768px) {
  .metadata {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  span .date-divider {
    display: none;
  }
}
</style>
