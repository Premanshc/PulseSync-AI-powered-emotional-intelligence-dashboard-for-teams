import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function analyzeSentiment(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI that analyzes the emotional sentiment of text messages. 
          Return a JSON object with the following structure:
          {
            "sentiment": "positive" | "negative" | "neutral",
            "emotion": string (specific emotion like "excited", "frustrated", "calm", etc.),
            "confidence": number (0-1),
            "reasoning": string (brief explanation)
          }
          
          Focus on workplace-appropriate emotional analysis for team communication.`
        },
        {
          role: 'user',
          content: `Analyze the sentiment of this message: "${text}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error analyzing sentiment:', error)
    return {
      sentiment: 'neutral',
      emotion: 'unknown',
      confidence: 0,
      reasoning: 'Analysis failed'
    }
  }
}

export async function generateWellnessNudge(emotions: string[], teamMood: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a workplace wellness AI assistant. Generate supportive, actionable wellness suggestions for teams based on their emotional state. Keep responses professional, empathetic, and under 100 words.`
        },
        {
          role: 'user',
          content: `The team is showing emotions: ${emotions.join(', ')}. Overall mood: ${teamMood}. Provide a wellness nudge.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    return response.choices[0]?.message?.content || 'Take a moment to breathe and connect with your team.'
  } catch (error) {
    console.error('Error generating wellness nudge:', error)
    return 'Remember to take breaks and check in with your teammates.'
  }
}

export async function generateMotivationalContent(teamSentiment: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Generate short, motivational content for teams. Include inspirational quotes, team building activities, or positive affirmations. Keep it professional and uplifting.`
        },
        {
          role: 'user',
          content: `Create motivational content for a team with ${teamSentiment} sentiment.`
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    })

    return response.choices[0]?.message?.content || 'You\'re doing great! Keep up the excellent teamwork.'
  } catch (error) {
    console.error('Error generating motivational content:', error)
    return 'Every challenge is an opportunity to grow stronger as a team!'
  }
}
