<template>
  <article class="relative isolate flex gap-4 p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors">
    <!-- Full-card overlay link → internal story page (z-[1] so it's above normal flow) -->
    <NuxtLink :to="`/story/${story.id}`" class="absolute inset-0 rounded-xl z-[1]" :aria-label="story.title" />

    <!-- Preview image: z-[2] so it's above overlay; links to original article if URL exists -->
    <component
      :is="story.url ? 'a' : 'div'"
      v-bind="story.url ? { href: story.url, target: '_blank', rel: 'noopener noreferrer' } : {}"
      class="relative z-[2] shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex items-center justify-center"
    >
      <img
        v-if="previewImage"
        :src="previewImage"
        :alt="story.title"
        class="w-full h-full object-cover"
        loading="lazy"
        @error="previewImage = null"
      />
      <div v-else class="w-full h-full flex items-center justify-center" :style="{ backgroundColor: fallbackColor }">
        <span class="text-white font-bold text-lg uppercase">{{ fallbackLetter }}</span>
      </div>
    </component>

    <!-- Content: no z-index → sits below overlay, so clicks on spans navigate to story page -->
    <div class="flex-1 min-w-0 flex flex-col justify-between">
      <div>
        <a
          :href="story.url || hnLink"
          target="_blank"
          rel="noopener noreferrer"
          class="relative z-[2] text-stone-900 dark:text-stone-100 font-medium leading-snug hover:text-[#ff6600] transition-colors line-clamp-2"
        >
          {{ story.title }}
        </a>
        <div v-if="domain" class="mt-0.5 text-xs text-stone-400 dark:text-stone-500 truncate">
          {{ domain }}
        </div>
      </div>

      <div class="flex items-center gap-3 mt-2 text-xs text-stone-500 dark:text-stone-400">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12.2 3.8 14.5l.8-4.7L1.2 6.5l4.7-.7z"/></svg>
          {{ story.score }}
        </span>
        <span>{{ story.by }}</span>
        <span>{{ timeAgo }}</span>
        <span class="flex items-center gap-1 ml-auto">
          <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 2.5h13a1 1 0 011 1v9a1 1 0 01-1 1h-13a1 1 0 01-1-1v-9a1 1 0 011-1zm.5 2v7h12v-7h-12zm2 1h8v1h-8zm0 2h6v1h-6z"/></svg>
          {{ story.descendants ?? 0 }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { HNStory } from '~/composables/useHackerNews'
import { formatTimeAgo, extractDomain } from '~/utils/formatTime'

const props = defineProps<{
  story: HNStory
}>()

const domain = computed(() => extractDomain(props.story.url))
const timeAgo = computed(() => formatTimeAgo(props.story.time))
const hnLink = computed(() => `https://news.ycombinator.com/item?id=${props.story.id}`)

// Preview image fetching
const previewImage = ref<string | null>(null)

const fallbackLetter = computed(() => {
  return domain.value ? domain.value[0] : props.story.title[0] || '?'
})

// Generate a consistent color from domain string
const fallbackColor = computed(() => {
  const str = domain.value || props.story.title
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 45%, 55%)`
})

onMounted(async () => {
  if (!props.story.url) return
  try {
    const data = await $fetch<{ image: string | null }>('/api/preview', {
      query: { url: props.story.url },
    })
    if (data?.image) {
      previewImage.value = data.image
    }
  } catch {
    // Preview fetch failed silently — fallback is fine
  }
})
</script>
