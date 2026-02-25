<template>
  <StoryList :section="section" />
</template>

<script setup lang="ts">
const route = useRoute()

const validSections = ['top', 'new', 'best'] as const
const section = computed(() => {
  const s = route.params.section as string
  return validSections.includes(s as any) ? s : 'top'
})
</script>
