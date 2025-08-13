import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Demo mode - return mock analytics data
    const isDemoMode = process.env.NODE_ENV === 'development' || !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('demo')
    
    if (isDemoMode) {
      return NextResponse.json({
        teamMetrics: {
          averageSentiment: 4.2,
          engagementScore: 87,
          wellnessIndex: 78,
          productivityTrend: 'positive'
        },
        sentimentHistory: [
          { date: '2024-01-01', sentiment: 4.1 },
          { date: '2024-01-02', sentiment: 4.3 },
          { date: '2024-01-03', sentiment: 4.2 },
          { date: '2024-01-04', sentiment: 4.5 },
          { date: '2024-01-05', sentiment: 4.4 }
        ],
        emotionDistribution: {
          optimistic: 35,
          focused: 25,
          collaborative: 20,
          energetic: 15,
          calm: 5
        }
      })
    }

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const timeRange = searchParams.get('timeRange') || '7d'
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1)
        break
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
    }
    
    let query = supabase
      .from('sentiment_data')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .order('timestamp', { ascending: true })
    
    if (teamId) {
      query = query.eq('team_id', teamId)
    }
    
    const { data: sentimentData, error } = await query
    
    if (error) {
      throw error
    }
    
    // Process data for charts
    const dailyTrends: Record<string, any> = {}
    const emotionDistribution: Record<string, number> = {}
    let totalPositive = 0
    let totalNegative = 0
    let totalNeutral = 0
    
    sentimentData?.forEach(record => {
      const date = new Date(record.timestamp).toISOString().split('T')[0]
      
      // Daily trends
      if (!dailyTrends[date]) {
        dailyTrends[date] = { positive: 0, negative: 0, neutral: 0, date }
      }
      dailyTrends[date][record.sentiment]++
      
      // Emotion distribution
      if (!emotionDistribution[record.emotion]) {
        emotionDistribution[record.emotion] = 0
      }
      emotionDistribution[record.emotion]++
      
      // Overall sentiment count
      if (record.sentiment === 'positive') totalPositive++
      else if (record.sentiment === 'negative') totalNegative++
      else totalNeutral++
    })
    
    const chartData = {
      dailyTrends: Object.values(dailyTrends),
      emotionDistribution: Object.entries(emotionDistribution).map(([emotion, count]) => ({
        emotion,
        count
      })),
      overallSentiment: {
        positive: totalPositive,
        negative: totalNegative,
        neutral: totalNeutral
      }
    }
    
    return NextResponse.json(chartData)
    
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' }, 
      { status: 500 }
    )
  }
}
