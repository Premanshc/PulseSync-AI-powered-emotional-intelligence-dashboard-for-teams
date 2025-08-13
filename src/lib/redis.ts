import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'redis://localhost:6379',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'placeholder-token',
})

export async function cacheTeamSentiment(teamId: string, sentimentData: any) {
  const key = `team:${teamId}:sentiment`
  await redis.setex(key, 3600, JSON.stringify(sentimentData)) // Cache for 1 hour
}

export async function getCachedTeamSentiment(teamId: string) {
  const key = `team:${teamId}:sentiment`
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached as string) : null
}

export async function cacheUserRecommendations(userId: string, recommendations: any) {
  const key = `user:${userId}:recommendations`
  await redis.setex(key, 1800, JSON.stringify(recommendations)) // Cache for 30 minutes
}

export async function getCachedUserRecommendations(userId: string) {
  const key = `user:${userId}:recommendations`
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached as string) : null
}

export async function storeRealtimeEvent(eventType: string, data: any) {
  const key = `events:${Date.now()}`
  await redis.setex(key, 300, JSON.stringify({ eventType, data, timestamp: Date.now() })) // Cache for 5 minutes
}

export { redis }
