import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { analyzeSentiment } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Demo mode - return mock data
    const isDemoMode = process.env.NODE_ENV === 'development' || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('demo')
    
    if (isDemoMode) {
      return NextResponse.json({
        sentiments: [
          { emotion: 'optimistic', confidence: 0.85, timestamp: new Date().toISOString() },
          { emotion: 'focused', confidence: 0.92, timestamp: new Date().toISOString() },
          { emotion: 'collaborative', confidence: 0.78, timestamp: new Date().toISOString() }
        ],
        summary: {
          averageSentiment: 4.2,
          dominantEmotion: 'optimistic',
          teamMorale: 'high'
        }
      })
    }

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await request.json()
    
    // For demo purposes, we'll analyze provided messages
    // In production, this would fetch from Microsoft Graph
    const sentimentResults = []
    
    // Analyze sentiment for each message
    for (const message of messages.slice(0, 10)) { // Limit to 10 messages for demo
      if (message.content) {
        const sentiment = await analyzeSentiment(message.content)
        
        // Store in database
        const { data, error } = await supabase
          .from('sentiment_data')
          .insert({
            user_id: session.user?.email || 'unknown',
            message: message.content,
            sentiment: sentiment.sentiment,
            emotion: sentiment.emotion,
            confidence: sentiment.confidence,
            timestamp: new Date().toISOString(),
            team_id: message.teamId || 'demo-team'
          })
        
        if (!error) {
          sentimentResults.push({
            messageId: message.id || Math.random().toString(),
            sentiment: sentiment.sentiment,
            emotion: sentiment.emotion,
            confidence: sentiment.confidence
          })
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      analyzed: sentimentResults.length,
      results: sentimentResults 
    })
    
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' }, 
      { status: 500 }
    )
  }
}
