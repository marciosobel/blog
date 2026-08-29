<script lang="ts" setup>
import type { TocLink } from "@nuxt/content";

const props = defineProps<{
  links?: TocLink[];
}>();

const nav = useTemplateRef("nav");
const activeId = ref(props.links?.[0]?.id);
const indicatorTop = ref(0);
const indicatorHeight = ref(0);
const indicatorReady = ref(false);

const flatLinks = computed(() =>
  (props.links ?? []).flatMap((link) => [link, ...(link.children ?? [])]),
);

let animationFrame: number | undefined;

function updateIndicator() {
  if (!nav.value || !activeId.value) return;

  const activeLink = [
    ...nav.value.querySelectorAll<HTMLElement>("[data-topic-id]"),
  ].find((link) => link.dataset.topicId === activeId.value);

  if (!activeLink) return;

  const navBounds = nav.value.getBoundingClientRect();
  const linkBounds = activeLink.getBoundingClientRect();
  indicatorTop.value = linkBounds.top - navBounds.top;
  indicatorHeight.value = linkBounds.height;
  indicatorReady.value = true;
}

function updateActiveHeading() {
  const headings = flatLinks.value
    .map((link) => document.getElementById(link.id))
    .filter((heading): heading is HTMLElement => Boolean(heading));

  const firstHeading = headings[0];
  if (!firstHeading) return;

  const readingLine = Math.min(window.innerHeight * 0.25, 160);
  let currentHeading = firstHeading;

  for (const heading of headings) {
    if (heading.getBoundingClientRect().top > readingLine) break;
    currentHeading = heading;
  }

  const pageBottom = window.scrollY + window.innerHeight;
  const lastHeading = headings.at(-1);
  if (lastHeading && pageBottom >= document.documentElement.scrollHeight - 2) {
    currentHeading = lastHeading;
  }

  activeId.value = currentHeading.id;
  nextTick(updateIndicator);
}

function scheduleUpdate() {
  if (animationFrame !== undefined) return;

  animationFrame = window.requestAnimationFrame(() => {
    animationFrame = undefined;
    updateActiveHeading();
  });
}

function scrollToTopic(event: MouseEvent, id: string) {
  if (
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const heading = document.getElementById(id);
  if (!heading) return;

  event.preventDefault();

  const url = new URL(window.location.href);
  url.hash = id;
  window.history.pushState(null, "", url);

  const temporaryTabIndex = !heading.hasAttribute("tabindex");
  if (temporaryTabIndex) heading.tabIndex = -1;

  heading.focus({ preventScroll: true });
  heading.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });

  if (temporaryTabIndex) {
    heading.addEventListener(
      "blur",
      () => heading.removeAttribute("tabindex"),
      {
        once: true,
      },
    );
  }
}

onMounted(() => {
  updateActiveHeading();
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", scheduleUpdate);
  window.removeEventListener("resize", scheduleUpdate);

  if (animationFrame !== undefined) {
    window.cancelAnimationFrame(animationFrame);
  }
});

watch(
  () => props.links,
  () => {
    activeId.value = props.links?.[0]?.id;
    indicatorReady.value = false;
    nextTick(scheduleUpdate);
  },
  { deep: true },
);
</script>

<template>
  <aside v-if="links?.length" class="post-index">
    <nav ref="nav" :aria-label="$t('post-index')">
      <span
        v-show="indicatorReady"
        class="topic-indicator"
        aria-hidden="true"
        :style="{
          height: `${indicatorHeight}px`,
          transform: `translateY(${indicatorTop}px)`,
        }"
      />
      <ul>
        <li v-for="link in links" :key="link.id">
          <a
            :href="`#${link.id}`"
            :data-topic-id="link.id"
            :aria-current="activeId === link.id ? 'location' : undefined"
            @click="scrollToTopic($event, link.id)"
          >
            {{ link.text }}
          </a>
          <ul v-if="link.children?.length">
            <li v-for="child in link.children" :key="child.id">
              <a
                :href="`#${child.id}`"
                :data-topic-id="child.id"
                :aria-current="activeId === child.id ? 'location' : undefined"
                @click="scrollToTopic($event, child.id)"
              >
                {{ child.text }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.post-index {
  position: sticky;
  top: 1.5rem;
  align-self: start;
  width: min(16rem, calc(100% - 2rem));
  max-height: calc(100dvh - 3rem);
  margin-left: 2rem;
  overflow-y: auto;
  font-size: 0.9rem;
  line-height: 1.3;
}

nav {
  position: relative;
}

.topic-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  background: var(--color-accent1);
  border-radius: var(--round-base);
  transition:
    transform 180ms ease,
    height 180ms ease;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0 0 0 0.75rem;
  list-style: none;
}

ul ul {
  gap: 0.35rem;
  margin-top: 0.35rem;
  padding-left: 1rem;
}

a {
  display: block;
  color: var(--color-text);
  opacity: 0.65;
  transition: opacity 125ms ease;
}

a:hover,
a:focus-visible,
a[aria-current="location"] {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .topic-indicator {
    transition: none;
  }
}
</style>
