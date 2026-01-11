<script lang="ts" setup>
const regex = /[^\/]+\/(.+)\/[^\/]+/;
const { locale } = useI18n();
const { data: posts } = await useAsyncData("all-posts", () => {
  return queryCollection(`content_${locale.value}`).all();
});
</script>

<template>
  <h1>My blog!</h1>
  <ul>
    <li v-for="post in posts" class="post">
      <NuxtLink :to="post.stem.match(regex)?.[1]">
        <div class="post-title">
          <h2>{{ post.title }}</h2>
          <p>{{ post.meta.date }}</p>
        </div>
        <p>{{ post.description }}</p>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.post-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

a {
  text-decoration: none;
}
</style>
