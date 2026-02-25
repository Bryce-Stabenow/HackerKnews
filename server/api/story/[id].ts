import type { AlgoliaStory, AlgoliaComment } from '~/types/hackerNews'

const ALGOLIA_API = 'https://hn.algolia.com/api/v1'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const cache = new Map<string, { data: AlgoliaStory; fetchedAt: number }>()

function countAll(children: AlgoliaComment[]): number {
  return children.reduce((sum, c) => sum + 1 + countAll(c.children ?? []), 0)
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(parseInt(id))) {
    throw createError({ statusCode: 400, message: 'Invalid story ID' })
  }

  const query = getQuery(event)
  const offset = Math.max(0, parseInt(query.offset as string) || 0)
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 10))

  try {
    let fullStory: AlgoliaStory
    const cached = cache.get(id)
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      fullStory = cached.data
    } else {
      fullStory = await $fetch<AlgoliaStory>(`${ALGOLIA_API}/items/${id}`)
      cache.set(id, { data: fullStory, fetchedAt: Date.now() })
    }

    // Filter deleted/empty top-level comments before slicing so offset is consistent
    const validTopLevel = (fullStory.children ?? []).filter(c => c.author || c.text)

    return {
      ...fullStory,
      children: validTopLevel.slice(offset, offset + limit),
      totalTopLevel: validTopLevel.length,
      totalComments: countAll(fullStory.children ?? []),
    }
  } catch {
    throw createError({ statusCode: 404, message: 'Story not found' })
  }
})
