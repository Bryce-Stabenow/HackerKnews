<template>
  <div v-if="!isDeleted" class="text-sm">
    <!-- Comment header -->
    <div class="flex items-center gap-2 flex-wrap">
      <span class="font-medium text-[#ff6600]">{{ comment.author ?? '[deleted]' }}</span>
      <span class="text-xs text-stone-400 dark:text-stone-500">{{ timeAgo }}</span>
      <button
        @click="collapsed = !collapsed"
        class="ml-auto text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors font-mono"
      >
        {{ collapsed ? '[+]' : '[–]' }}
      </button>
    </div>

    <!-- Comment body -->
    <div v-if="!collapsed">
      <div
        v-if="comment.text"
        class="mt-1.5 text-stone-700 dark:text-stone-300 leading-relaxed hn-comment-text"
        v-html="comment.text"
      />

      <!-- Nested replies -->
      <div
        v-if="comment.children?.length"
        class="mt-3 pl-3 sm:pl-4 border-l-2 space-y-4"
        :class="borderClass"
      >
        <HNComment
          v-for="child in comment.children"
          :key="child.id"
          :comment="child"
          :depth="depth + 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlgoliaComment } from '~/types/hackerNews'
import { formatTimeAgo } from '~/utils/formatTime'

const props = withDefaults(defineProps<{
  comment: AlgoliaComment
  depth?: number
}>(), {
  depth: 0,
})

const collapsed = ref(false)

const isDeleted = computed(() =>
  !props.comment.author && !props.comment.text
)

const timeAgo = computed(() =>
  props.comment.created_at_i ? formatTimeAgo(props.comment.created_at_i) : ''
)

// Cycle through border colors by depth for visual nesting cues
const borderColors = [
  'border-[#ff6600]/40',
  'border-stone-300 dark:border-stone-700',
  'border-stone-200 dark:border-stone-800',
  'border-stone-200 dark:border-stone-800',
]
const borderClass = computed(() =>
  borderColors[props.depth % borderColors.length]
)
</script>

<style>
/* Style raw HTML from HN comment text */
.hn-comment-text a {
  color: #ff6600;
  text-decoration: underline;
  word-break: break-word;
}
.hn-comment-text a:hover {
  opacity: 0.8;
}
.hn-comment-text p {
  margin-top: 0.5rem;
}
.hn-comment-text p:first-child {
  margin-top: 0;
}
.hn-comment-text pre {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgb(245 245 244); /* stone-100 */
  border-radius: 0.375rem;
  overflow-x: auto;
  font-size: 0.75rem;
  line-height: 1.5;
}
@media (prefers-color-scheme: dark) {
  .hn-comment-text pre {
    background: rgb(28 25 23); /* stone-900 */
  }
}
.hn-comment-text code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.hn-comment-text i {
  font-style: italic;
}
</style>
