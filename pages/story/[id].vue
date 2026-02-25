<template>
  <div>
    <!-- Back button -->
    <button
      @click="goBack"
      class="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-[#ff6600] dark:hover:text-[#ff6600] transition-colors mb-6"
    >
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z"/>
      </svg>
      Back
    </button>

    <!-- Loading state -->
    <div v-if="pending" class="space-y-4">
      <div class="h-8 bg-stone-200 dark:bg-stone-800 rounded-lg animate-pulse w-3/4" />
      <div class="h-4 bg-stone-200 dark:bg-stone-800 rounded animate-pulse w-1/4" />
      <div class="h-4 bg-stone-200 dark:bg-stone-800 rounded animate-pulse w-1/3" />
      <div class="mt-8 space-y-3">
        <div v-for="i in 6" :key="i" class="h-16 bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse" />
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-stone-500 dark:text-stone-400">Could not load story.</p>
      <NuxtLink to="/" class="mt-4 inline-block text-sm text-[#ff6600] hover:underline">Go home</NuxtLink>
    </div>

    <!-- Story content -->
    <div v-else-if="story">
      <!-- Story header card -->
      <div class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        <!-- Preview image banner -->
        <a
          v-if="previewImage && story.url"
          :href="story.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block"
        >
          <img
            :src="previewImage"
            :alt="story.title"
            class="w-full h-44 sm:h-56 object-cover"
            @error="previewImage = null"
          />
        </a>

        <div class="p-5 sm:p-6">
        <!-- Title -->
        <h1 class="text-lg sm:text-xl font-semibold text-stone-900 dark:text-stone-100 leading-snug">
          <a
            v-if="story.url"
            :href="story.url"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-[#ff6600] transition-colors"
          >
            {{ story.title }}
            <svg class="inline-block w-3.5 h-3.5 ml-1 mb-0.5 text-stone-400" viewBox="0 0 16 16" fill="currentColor">
              <path fill-rule="evenodd" d="M8.914 6.025a.75.75 0 011.06 0 3.5 3.5 0 000 4.95l.256.256a3.5 3.5 0 004.95-4.95L13.9 5.088a.75.75 0 011.06-1.06l1.28 1.292a5 5 0 01-7.07 7.07L8.915 12.1a.75.75 0 010-1.06l-.001-.001zM7.086 9.975a.75.75 0 01-1.06 0 3.5 3.5 0 000-4.95L5.77 4.77a3.5 3.5 0 00-4.95 4.95l1.281 1.28A.75.75 0 011.04 12.06L-.24 10.78a5 5 0 017.07-7.07l.255.256a.75.75 0 010 1.06l.001-.001z"/>
            </svg>
          </a>
          <span v-else>{{ story.title }}</span>
        </h1>

        <!-- Domain -->
        <div v-if="domain" class="mt-1 text-xs text-stone-400 dark:text-stone-500">
          {{ domain }}
        </div>

        <!-- Metadata -->
        <div class="flex flex-wrap items-center gap-3 mt-3 text-xs text-stone-500 dark:text-stone-400">
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12.2 3.8 14.5l.8-4.7L1.2 6.5l4.7-.7z"/>
            </svg>
            {{ story.points ?? 0 }} points
          </span>
          <span>by <span class="font-medium text-stone-700 dark:text-stone-300">{{ story.author }}</span></span>
          <span>{{ timeAgo }}</span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.5 2.5h13a1 1 0 011 1v9a1 1 0 01-1 1h-13a1 1 0 01-1-1v-9a1 1 0 011-1zm.5 2v7h12v-7h-12zm2 1h8v1h-8zm0 2h6v1h-6z"/>
            </svg>
            {{ story.totalComments }} comments
          </span>
          <a
            :href="`https://news.ycombinator.com/item?id=${story.id}`"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-[#ff6600] transition-colors ml-auto"
          >
            View on HN →
          </a>
        </div>

        <!-- Story text (Ask HN, Show HN, text posts) -->
        <div
          v-if="story.text"
          class="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-sm text-stone-700 dark:text-stone-300 leading-relaxed hn-comment-text"
          v-html="story.text"
        />
        </div><!-- /inner padding -->
      </div>

      <!-- Comments section -->
      <div class="mt-6">
        <h2 class="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">
          Comments ({{ story.totalComments }})
        </h2>

        <div v-if="loadedComments.length" class="space-y-5">
          <div
            v-for="comment in loadedComments"
            :key="comment.id"
            class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5"
          >
            <HNComment :comment="comment" :depth="0" />
          </div>
        </div>

        <div v-else class="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">
          No comments yet.
        </div>

        <!-- Load more button -->
        <div v-if="hasMore" class="mt-5 text-center">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 hover:text-stone-900 dark:hover:text-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loadingMore" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            {{ loadingMore ? 'Loading…' : `Load more comments (${story.totalTopLevel - loadedComments.length} remaining)` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlgoliaStory, AlgoliaComment } from '~/types/hackerNews'
import { formatTimeAgo, extractDomain } from '~/utils/formatTime'

type StoryResponse = AlgoliaStory & {
  totalTopLevel: number
  totalComments: number
}

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data: story, pending, error } = await useAsyncData<StoryResponse>(
  `story-${id}`,
  () => $fetch(`/api/story/${id}`, { query: { offset: 0, limit: PAGE_SIZE } }),
)

const domain = computed(() => extractDomain(story.value?.url ?? undefined))
const timeAgo = computed(() => story.value?.created_at_i ? formatTimeAgo(story.value.created_at_i) : '')

// Accumulates comments as pages are loaded
const loadedComments = ref<AlgoliaComment[]>([])

watch(
  () => story.value?.children,
  (serverComments) => {
    if (serverComments) loadedComments.value = [...serverComments]
  },
  { immediate: true },
)

const hasMore = computed(() =>
  !!story.value && loadedComments.value.length < story.value.totalTopLevel
)

const loadingMore = ref(false)

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const data = await $fetch<StoryResponse>(`/api/story/${id}`, {
      query: { offset: loadedComments.value.length, limit: PAGE_SIZE },
    })
    loadedComments.value.push(...(data.children ?? []))
  } finally {
    loadingMore.value = false
  }
}

// Preview image — reuses server in-process cache + browser HTTP cache (max-age=3600)
// so if the user came from an index page the image is already cached
const previewImage = ref<string | null>(null)

onMounted(async () => {
  if (!story.value?.url) return
  try {
    const data = await $fetch<{ image: string | null }>('/api/preview', {
      query: { url: story.value.url },
    })
    if (data?.image) previewImage.value = data.image
  } catch {
    // silent fail — page works fine without image
  }
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

useHead({
  title: computed(() => story.value?.title ?? 'Story'),
})
</script>
