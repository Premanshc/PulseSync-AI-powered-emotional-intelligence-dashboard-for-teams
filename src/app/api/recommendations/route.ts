import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { generateWellnessNudge, generateMotivationalContent } from '@/lib/openai'
import { getMoodBasedPlaylists, getSpotifyAccessToken } from '@/lib/spotify'
import { getCachedUserRecommendations, cacheUserRecommendations } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    // Demo mode - return mock recommendations
    const isDemoMode = process.env.NODE_ENV === 'development' || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('demo')
    
    if (isDemoMode) {
      return NextResponse.json({
        wellnessNudge: "Your team is showing great energy today! 🚀 Consider a 15-minute team meditation session to maintain this positive momentum.",
        motivationalContent: "Today's team collaboration is inspiring! Keep building on this strong foundation of trust and communication.",
        musicRecommendations: [
          { name: "Focus Flow", genre: "Ambient", mood: "concentrated" },
          { name: "Team Energy", genre: "Upbeat", mood: "collaborative" },
          { name: "Calm Productivity", genre: "Lo-fi", mood: "relaxed" }
        ]
      })
    }

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
