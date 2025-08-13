import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const demoMessages = [
      { id: '1', content: 'Great job on the presentation team! Really excited about this project.', teamId: 'demo-team' },
      { id: '2', content: 'I think we need to reconsider the timeline, feeling a bit stressed about the deadline.', teamId: 'demo-team' },
      { id: '3', content: 'Thanks for the help with the bug fix. Feeling much more confident now.', teamId: 'demo-team' },
      { id: '4', content: 'Morning everyone! Ready to tackle today\'s challenges.', teamId: 'demo-team' },
      { id: '5', content: 'The client feedback was positive. I\'m really motivated to push forward.', teamId: 'demo-team' },
    ]

    // Simulate calling the sentiment analysis
    const response = await fetch(`${request.nextUrl.origin}/api/sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: demoMessages })
    })

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Demo error:', error)
    return NextResponse.json(
      { error: 'Failed to run demo' }, 
      { status: 500 }
    )
  }
}
