interface CacheEntry {
  data: { image: string | null }
  expires: number
}

const cache = new Map<string, CacheEntry>()
const TTL = 1000 * 60 * 60 // 1 hour

export function getCached(url: string): { image: string | null } | null {
  const entry = cache.get(url)
  if (!entry) return null
  if (Date.now() > entry.expires) {
    cache.delete(url)
    return null
  }
  return entry.data
}

export function setCache(url: string, data: { image: string | null }) {
  // Evict old entries if cache gets large
  if (cache.size > 5000) {
    const now = Date.now()
    for (const [key, entry] of cache) {
      if (now > entry.expires) cache.delete(key)
    }
    // If still large, clear oldest half
    if (cache.size > 4000) {
      const keys = [...cache.keys()]
      for (let i = 0; i < keys.length / 2; i++) {
        cache.delete(keys[i])
      }
    }
  }

  cache.set(url, { data, expires: Date.now() + TTL })
}
