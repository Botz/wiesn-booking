import type { H3Event } from 'h3'

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 10_000

interface RateLimitOptions {
  key: string
  limit: number
  windowMs: number
}

export function rateLimit(event: H3Event, options: RateLimitOptions) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const bucketKey = `${options.key}:${ip}`
  const now = Date.now()

  let bucket = buckets.get(bucketKey)
  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + options.windowMs }
    buckets.set(bucketKey, bucket)
  }

  bucket.count++

  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) {
      if (b.resetAt < now) buckets.delete(k)
    }
  }

  if (bucket.count > options.limit) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Zu viele Anfragen. Bitte warte einen Moment.'
    })
  }
}
