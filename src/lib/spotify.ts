const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

export async function getSpotifyAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  })

  const data = await response.json()
  return data.access_token
}

export async function getMoodBasedPlaylists(mood: string, accessToken: string) {
  const moodToGenre: { [key: string]: string } = {
    'positive': 'happy',
    'excited': 'pop',
    'calm': 'chill',
    'stressed': 'ambient',
    'energetic': 'electronic',
    'focused': 'instrumental',
    'relaxed': 'jazz',
    'motivated': 'workout'
  }

  const genre = moodToGenre[mood.toLowerCase()] || 'pop'
  
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/recommendations?seed_genres=${genre}&min_valence=0.4&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    const data = await response.json()
    return data.tracks || []
  } catch (error) {
    console.error('Error fetching Spotify recommendations:', error)
    return []
  }
}

export async function searchPlaylists(query: string, accessToken: string) {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    const data = await response.json()
    return data.playlists?.items || []
  } catch (error) {
    console.error('Error searching Spotify playlists:', error)
    return []
  }
}
