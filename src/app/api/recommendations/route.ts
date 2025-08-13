import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { generateWellnessNudge, generateMotivationalContent } from '@/lib/openai'
import { getMoodBasedPlaylists, getSpotifyAccessToken } from '@/lib/spotify'
import { getCachedUserRecommendations, cacheUserRecommendations } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { emotions, teamMood, userId } = await request.json()
    
    // Check cache first
    const cached = await getCachedUserRecommendations(userId)
    if (cached) {
      return NextResponse.json(cached)
    }
    
    // Generate recommendations
    const [wellnessNudge, motivationalContent, spotifyToken] = await Promise.all([
      generateWellnessNudge(emotions, teamMood),
      generateMotivationalContent(teamMood),
      getSpotifyAccessToken()
    ])
    
    // Get mood-based music recommendations
    const musicRecommendations = await getMoodBasedPlaylists(teamMood, spotifyToken)
    
    const recommendations = {
      wellnessNudge,
      motivationalContent,
      musicRecommendations: musicRecommendations.slice(0, 5), // Top 5 tracks
      generatedAt: new Date().toISOString()
    }
    
    // Cache the recommendations
    await cacheUserRecommendations(userId, recommendations)
    
    return NextResponse.json(recommendations)
    
  } catch (error) {
    console.error('Recommendations error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' }, 
      { status: 500 }
    )
  }
}
