const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

type CacheEntry = {
  verified: boolean | null
  raw?: string
  ts: number
}

const map: Map<string, CacheEntry> = new Map()

export function getCached(cedula: string): CacheEntry | null {
  const entry = map.get(cedula)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    map.delete(cedula)
    return null
  }
  return entry
}

export function setCached(cedula: string, verified: boolean | null, raw?: string) {
  map.set(cedula, { verified, raw, ts: Date.now() })
}

export function clearCache() {
  map.clear()
}

export default { getCached, setCached, clearCache }
