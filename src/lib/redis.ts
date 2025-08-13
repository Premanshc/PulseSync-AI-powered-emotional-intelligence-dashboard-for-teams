import { Redis } from '@upstash/redis'

// Check if we're in demo mode
const isDemoMode = !process.env.UPSTASH_REDIS_REST_URL || 
                   process.env.UPSTASH_REDIS_REST_URL.includes('demo') ||
                   process.env.NODE_ENV === 'development'

// Create Redis client only if not in demo mode
const redis = isDemoMode ? null : new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function cacheTeamSentiment(teamId: string, sentimentData: any) {
  if (isDemoMode) {
    console.log('Demo mode: Skipping Redis cache for team sentiment')
    return
  }
  
  const key = `team:${teamId}:sentiment`
  await redis!.setex(key, 3600, JSON.stringify(sentimentData)) // Cache for 1 hour
}

export async function getCachedTeamSentiment(teamId: string) {
  if (isDemoMode) {
    console.log('Demo mode: Skipping Redis cache read for team sentiment')
    return null
  }
  
  const key = `team:${teamId}:sentiment`
  const cached = await redis!.get(key)
  return cached ? JSON.parse(cached as string) : null
}

export async function cacheUserRecommendations(userId: string, recommendations: any) {
  if (isDemoMode) {
    console.log('Demo mode: Skipping Redis cache for user recommendations')
    return
  }
  
  const key = `user:${userId}:recommendations`
  await redis!.setex(key, 1800, JSON.stringify(recommendations)) // Cache for 30 minutes
}

export async function getCachedUserRecommendations(userId: string) {
  if (isDemoMode) {
    console.log('Demo mode: Skipping Redis cache read for user recommendations')
    return null
  }
  
  const key = `user:${userId}:recommendations`
  const cached = await redis!.get(key)
  return cached ? JSON.parse(cached as string) : null
}

export async function storeRealtimeEvent(eventType: string, data: any) {
  if (isDemoMode) {
    console.log('Demo mode: Skipping Redis cache for realtime event')
    return
  }
  
  const key = `events:${Date.now()}`
  await redis!.setex(key, 300, JSON.stringify({ eventType, data, timestamp: Date.now() })) // Cache for 5 minutes
}

export { redis }
