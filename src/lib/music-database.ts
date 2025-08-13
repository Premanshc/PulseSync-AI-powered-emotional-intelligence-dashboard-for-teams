// Free music API service using Last.fm (no API key required for basic features)
// Alternative: We'll use a curated list of mood-based music

const moodMusicDatabase = {
  positive: [
    {
      id: '1',
      name: 'Good as Hell',
      artists: [{ name: 'Lizzo' }],
      external_urls: { spotify: 'https://open.spotify.com/track/1LLXZFeAHlqnjewtT2Cf7x' },
      preview_url: null,
      mood: 'positive',
      energy: 'high'
    },
    {
      id: '2', 
      name: 'Happy',
      artists: [{ name: 'Pharrell Williams' }],
      external_urls: { spotify: 'https://open.spotify.com/track/5b88tNINg4Q4nrRbrCXUmg' },
      preview_url: null,
      mood: 'positive'
    },
    {
      id: '3',
      name: 'Uptown Funk',
      artists: [{ name: 'Mark Ronson ft. Bruno Mars' }],
      external_urls: { spotify: 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS' },
      preview_url: null,
      mood: 'positive'
    },
    {
      id: '4',
      name: 'Can\'t Stop the Feeling!',
      artists: [{ name: 'Justin Timberlake' }],
      external_urls: { spotify: 'https://open.spotify.com/track/6KuQTIu1KoTTkLXKrUkpin' },
      preview_url: null,
      mood: 'positive'
    }
  ],
  focused: [
    {
      id: '11',
      name: 'Weightless',
      artists: [{ name: 'Marconi Union' }],
      external_urls: { spotify: 'https://open.spotify.com/track/7Lfe3WnWE9eSDlKHYzh5lp' },
      preview_url: null,
      mood: 'focused'
    },
    {
      id: '12',
      name: 'Study Music Alpha Waves',
      artists: [{ name: 'Focus Music' }],
      external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6' },
      preview_url: null,
      mood: 'focused'
    },
    {
      id: '13',
      name: 'Rain on Leaves',
      artists: [{ name: 'Nature Sounds' }],
      external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DWZ7eKyOZrY0i' },
      preview_url: null,
      mood: 'focused'
    },
    {
      id: '14',
      name: 'Deep Focus',
      artists: [{ name: 'Ludovico Einaudi' }],
      external_urls: { spotify: 'https://open.spotify.com/track/7aVNjfbYaPVIzabGGSp8rt' },
      preview_url: null,
      mood: 'focused'
    }
  ],
  motivated: [
    {
      id: '21',
      name: 'Eye of the Tiger',
      artists: [{ name: 'Survivor' }],
      external_urls: { spotify: 'https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2' },
      preview_url: null,
      mood: 'motivated'
    },
    {
      id: '22',
      name: 'Stronger',
      artists: [{ name: 'Kelly Clarkson' }],
      external_urls: { spotify: 'https://open.spotify.com/track/1YQWosTIljIvxAgHWTp7KP' },
      preview_url: null,
      mood: 'motivated'
    },
    {
      id: '23',
      name: 'Thunder',
      artists: [{ name: 'Imagine Dragons' }],
      external_urls: { spotify: 'https://open.spotify.com/track/1zB4vmk8tFRmM9UULNzbLB' },
      preview_url: null,
      mood: 'motivated'
    },
    {
      id: '24',
      name: 'Believer',
      artists: [{ name: 'Imagine Dragons' }],
      external_urls: { spotify: 'https://open.spotify.com/track/7aHOcuaOu4X9U32w4TyqtE' },
      preview_url: null,
      mood: 'motivated'
    }
  ],
  relaxed: [
    {
      id: '31',
      name: 'Clair de Lune',
      artists: [{ name: 'Claude Debussy' }],
      external_urls: { spotify: 'https://open.spotify.com/track/72X6FX1EXPUoAnMa8YhSaG' },
      preview_url: null,
      mood: 'relaxed'
    },
    {
      id: '32',
      name: 'Breathe Me',
      artists: [{ name: 'Sia' }],
      external_urls: { spotify: 'https://open.spotify.com/track/7Lf7oSEVdzZqTA0kEDSlS5' },
      preview_url: null,
      mood: 'relaxed'
    },
    {
      id: '33',
      name: 'River',
      artists: [{ name: 'Eminem ft. Ed Sheeran' }],
      external_urls: { spotify: 'https://open.spotify.com/track/6h4iguXpmXuKU5Z0bgvjxm' },
      preview_url: null,
      mood: 'relaxed'
    },
    {
      id: '34',
      name: 'Mad World',
      artists: [{ name: 'Gary Jules' }],
      external_urls: { spotify: 'https://open.spotify.com/track/5R7RERq1J9lJHj0yGxZRFg' },
      preview_url: null,
      mood: 'relaxed'
    }
  ],
  energetic: [
    {
      id: '41',
      name: 'Pumped Up Kicks',
      artists: [{ name: 'Foster the People' }],
      external_urls: { spotify: 'https://open.spotify.com/track/7w9bgPAmPTtrkt2v16QNfp' },
      preview_url: null,
      mood: 'energetic'
    },
    {
      id: '42',
      name: 'Electricity',
      artists: [{ name: 'The Avalanches' }],
      external_urls: { spotify: 'https://open.spotify.com/track/1kwK2YOmXKJhCCIGdOlq2F' },
      preview_url: null,
      mood: 'energetic'
    },
    {
      id: '43',
      name: 'Levitating',
      artists: [{ name: 'Dua Lipa' }],
      external_urls: { spotify: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9' },
      preview_url: null,
      mood: 'energetic'
    },
    {
      id: '44',
      name: 'Blinding Lights',
      artists: [{ name: 'The Weeknd' }],
      external_urls: { spotify: 'https://open.spotify.com/track/0VjIjW4GlUla8HI0UhpYJJ' },
      preview_url: null,
      mood: 'energetic'
    }
  ]
}

export async function getMoodBasedMusic(mood: string, teamEmotions: string[] = []) {
  // Normalize mood
  const normalizedMood = mood.toLowerCase()
  
  // Map emotions to moods
  const emotionToMood: Record<string, string> = {
    'excited': 'energetic',
    'happy': 'positive', 
    'calm': 'relaxed',
    'focused': 'focused',
    'motivated': 'motivated',
    'stressed': 'focused', // Calming music for stress
    'tired': 'energetic', // Energizing music for tiredness
    'frustrated': 'relaxed', // Calming music for frustration
    'energetic': 'energetic',
    'relaxed': 'relaxed',
    'positive': 'positive'
  }

  // Determine the best mood category
  let targetMood = emotionToMood[normalizedMood] || 'positive'
  
  // If we have team emotions, consider the dominant emotion
  if (teamEmotions.length > 0) {
    const emotionCounts = teamEmotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    targetMood = emotionToMood[dominantEmotion] || targetMood
  }

  // Get music for the target mood
  const musicList = moodMusicDatabase[targetMood as keyof typeof moodMusicDatabase] || moodMusicDatabase.positive
  
  // Add some randomization
  const shuffled = [...musicList].sort(() => Math.random() - 0.5)
  
  return {
    tracks: shuffled.slice(0, 4),
    mood: targetMood,
    reasoning: `Based on ${teamEmotions.length > 0 ? 'team emotions' : 'current mood'}: ${normalizedMood}`
  }
}

export async function getPlaylistForActivity(activity: string) {
  const activityPlaylists = {
    'focus': moodMusicDatabase.focused,
    'energy': moodMusicDatabase.energetic,
    'relaxation': moodMusicDatabase.relaxed,
    'motivation': moodMusicDatabase.motivated
  }
  
  return activityPlaylists[activity as keyof typeof activityPlaylists] || moodMusicDatabase.positive
}

// Free music streaming services (updated for company laptops)
export const musicStreamingLinks = {
  youtube: 'https://www.youtube.com/results?search_query=', // Regular YouTube instead of YouTube Music
  spotify: 'https://open.spotify.com/search/',
  apple: 'https://music.apple.com/search?term=',
  soundcloud: 'https://soundcloud.com/search?q='
}

export async function searchFreeMusic(query: string) {
  // Company-friendly music access via regular YouTube
  return {
    query,
    youtube: `${musicStreamingLinks.youtube}${encodeURIComponent(query)}`, // Regular YouTube search
    spotify: `${musicStreamingLinks.spotify}${encodeURIComponent(query)}`, // Keep Spotify links as requested
    apple: `${musicStreamingLinks.apple}${encodeURIComponent(query)}`,
    soundcloud: `${musicStreamingLinks.soundcloud}${encodeURIComponent(query)}`
  }
}
