import type { AlgoliaStory } from '~/types/hackerNews'

const ALGOLIA_API = 'https://hn.algolia.com/api/v1'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(parseInt(id))) {
    throw createError({ statusCode: 400, message: 'Invalid story ID' })
  }

  try {
    const data = await $fetch<AlgoliaStory>(`${ALGOLIA_API}/items/${id}`)
    return data
  } catch {
    throw createError({ statusCode: 404, message: 'Story not found' })
  }
})
