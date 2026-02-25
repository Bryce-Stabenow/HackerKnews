<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading" class="flex flex-col gap-3">
      <StoryCardSkeleton v-for="i in 10" :key="i" />
    </div>

    <!-- Story list -->
    <div v-else class="flex flex-col gap-3">
      <StoryCard
        v-for="story in stories"
        :key="story.id"
        :story="story"
      />

      <button
        v-if="hasMore"
        @click="loadMore"
        :disabled="loadingMore"
        class="mt-4 w-full py-3 rounded-xl text-sm font-medium transition-colors
               bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300
               hover:bg-stone-200 dark:hover:bg-stone-700
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loadingMore ? 'Loading...' : 'Load more stories' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  section: string
}>()

const sectionRef = toRef(props, 'section')
const { stories, loading, loadingMore, hasMore, loadMore } = useHackerNews(sectionRef)
</script>
