const HN_API = 'https://hacker-news.firebaseio.com/v0'

export interface HNStory {
  id: number
  title: string
  url?: string
  text?: string
  by: string
  time: number
  score: number
  descendants: number
  type: string
  kids?: number[]
  previewImage?: string | null
}

const sectionEndpoints: Record<string, string> = {
  top: 'topstories',
  new: 'newstories',
  best: 'beststories',
}

async function fetchStoryIds(section: string): Promise<number[]> {
  const endpoint = sectionEndpoints[section] || 'topstories'
  return await $fetch<number[]>(`${HN_API}/${endpoint}.json`)
}

async function fetchItem(id: number): Promise<HNStory> {
  return await $fetch<HNStory>(`${HN_API}/item/${id}.json`)
}

export function useHackerNews(section: Ref<string> | string) {
  const PAGE_SIZE = 30
  const stories = ref<HNStory[]>([])
  const storyIds = ref<number[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const page = ref(0)

  const hasMore = computed(() => {
    return (page.value + 1) * PAGE_SIZE < storyIds.value.length
  })

  async function loadStories() {
    loading.value = true
    stories.value = []
    page.value = 0

    try {
      const sec = typeof section === 'string' ? section : section.value
      storyIds.value = await fetchStoryIds(sec)
      await loadPage()
    } finally {
      loading.value = false
    }
  }

  async function loadPage() {
    const start = page.value * PAGE_SIZE
    const end = start + PAGE_SIZE
    const ids = storyIds.value.slice(start, end)

    const items = await Promise.all(ids.map(id => fetchItem(id)))
    stories.value.push(...items.filter(Boolean))
  }

  async function loadMore() {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    try {
      page.value++
      await loadPage()
    } finally {
      loadingMore.value = false
    }
  }

  // Watch for section changes
  if (typeof section !== 'string') {
    watch(section, () => {
      loadStories()
    })
  }

  // Initial load
  loadStories()

  return {
    stories,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refresh: loadStories,
  }
}
