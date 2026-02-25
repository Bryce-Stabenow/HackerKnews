<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div class="max-w-3xl mx-auto px-4 h-14 flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <div class="w-7 h-7 rounded-md bg-[#ff6600] flex items-center justify-center">
            <span class="text-white font-bold text-sm leading-none">K</span>
          </div>
          <span class="font-semibold text-stone-900 dark:text-stone-100 text-lg">HackerKnews</span>
        </NuxtLink>

        <nav class="flex items-center gap-1">
          <NuxtLink
            v-for="section in sections"
            :key="section.path"
            :to="section.path"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="isActive(section.path)
              ? 'bg-[#ff6600]/10 text-[#ff6600] dark:bg-[#ff6600]/20'
              : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'"
          >
            {{ section.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <div class="max-w-3xl mx-auto px-4 py-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const sections = [
  { label: 'Top', path: '/top' },
  { label: 'New', path: '/new' },
  { label: 'Best', path: '/best' },
]

function isActive(path: string) {
  return route.path === path || (route.path === '/' && path === '/top')
}
</script>
