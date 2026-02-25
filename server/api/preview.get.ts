import * as cheerio from 'cheerio'
import { getCached, setCache } from '~/server/utils/ogCache'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw createError({ statusCode: 400, message: 'Missing url parameter' })
  }

  // Validate URL
  try {
    new URL(url)
  } catch {
    throw createError({ statusCode: 400, message: 'Invalid URL' })
  }

  // Check cache
  const cached = getCached(url)
  if (cached) {
    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')
    return cached
  }

  let image: string | null = null

  try {
    const html = await $fetch<string>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HackerKnews/1.0; +https://hackerknews.app)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 5000,
      responseType: 'text',
    })

    const $ = cheerio.load(html)

    // Try OG image first
    image = $('meta[property="og:image"]').attr('content')
      || $('meta[name="og:image"]').attr('content')
      || null

    // Try Twitter image
    if (!image) {
      image = $('meta[name="twitter:image"]').attr('content')
        || $('meta[name="twitter:image:src"]').attr('content')
        || $('meta[property="twitter:image"]').attr('content')
        || null
    }

    // Resolve relative URLs
    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, url).href
      } catch {
        image = null
      }
    }
  } catch {
    // Fetch or parse failed — return null image
  }

  const result = { image }
  setCache(url, result)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')
  return result
})
