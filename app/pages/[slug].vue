<script lang="ts" setup>
const { locale } = useI18n();
const { data: post } = await useAsyncData("post", () => {
  return queryCollection(`content_${locale.value}`).first();
});
</script>

<template>
  <main>
    <template v-if="post">
      <h1>{{ post.title }}</h1>
      <ContentRenderer :value="post" tag="article" />
    </template>
    <template v-else>
      <p>Post not found.</p>
    </template>
  </main>
</template>
