'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMoodBasedMusic, musicStreamingLinks } from '@/lib/music-database'

interface Track {
  id: string
  name: string
  artists: { name: string }[]
  external_urls: { spotify: string }
  preview_url?: string
  mood?: string
}

export default function MusicRecommendations() {
  const [musicData, setMusicData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [currentMood, setCurrentMood] = useState('positive')

  const fetchRecommendations = async (mood?: string) => {
    setLoading(true)
    try {
      // Simulate team emotions based on current mood
      const teamEmotions = mood === 'focused' ? ['focused', 'calm', 'motivated'] 
                         : mood === 'energetic' ? ['excited', 'energetic', 'happy']
                         : mood === 'relaxed' ? ['calm', 'relaxed', 'happy']
                         : ['happy', 'motivated', 'positive']
      
      const data = await getMoodBasedMusic(mood || currentMood, teamEmotions)
      setMusicData(data)
      if (mood) setCurrentMood(mood)
    } catch (error) {
      console.error('Error fetching music:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const openMusicService = (track: Track, service: 'spotify' | 'youtube' | 'apple') => {
    const query = `${track.name} ${track.artists[0]?.name}`
    let url = ''
    
    switch (service) {
      case 'spotify':
        url = track.external_urls.spotify // Keep original Spotify links
        break
      case 'youtube':
        url = `${musicStreamingLinks.youtube}${encodeURIComponent(query)}` // Regular YouTube search
        break
      case 'apple':
        url = `${musicStreamingLinks.apple}${encodeURIComponent(query)}`
        break
    }
    
    window.open(url, '_blank')
  }

  const tracks = musicData?.tracks || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl shadow-lg border border-purple-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="text-2xl mr-2">🎵</span>
          Mood Music
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchRecommendations()}
          disabled={loading}
          className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Refresh'}
        </motion.button>
      </div>

      {musicData && (
        <div className="mb-4 p-3 bg-white/60 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Current mood:</span> {musicData.mood} 
            <br />
            <span className="text-xs text-gray-600">{musicData.reasoning}</span>
          </p>
        </div>
      )}

      <div className="space-y-3">
        {tracks.map((track: Track, index: number) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm p-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{track.name}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
              
              <div className="flex items-center space-x-1 ml-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openMusicService(track, 'spotify')}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                  title="Open in Spotify"
                >
                  🎧
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openMusicService(track, 'youtube')}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Search on YouTube"
                >
                  📺
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mood-based playlists */}
      <div className="mt-6">
        <h3 className="font-medium text-gray-900 mb-3">Change Mood</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Focus Mode', emoji: '🎯', mood: 'focused' },
            { name: 'Team Energy', emoji: '⚡', mood: 'energetic' },
            { name: 'Calm Vibes', emoji: '🌊', mood: 'relaxed' },
            { name: 'Motivation', emoji: '🚀', mood: 'motivated' }
          ].map((playlist, index) => (
            <motion.button
              key={playlist.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchRecommendations(playlist.mood)}
              className={`p-3 rounded-lg text-center transition-colors ${
                currentMood === playlist.mood 
                  ? 'bg-purple-200 border-2 border-purple-400' 
                  : 'bg-white/80 backdrop-blur-sm hover:bg-white/90'
              }`}
            >
              <div className="text-xl mb-1">{playlist.emoji}</div>
              <div className="text-xs font-medium text-gray-700">{playlist.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Music service links */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <p className="text-xs text-gray-600 mb-2">Listen on your favorite platform:</p>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.open('https://open.spotify.com/', '_blank')}
            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
          >
            Spotify
          </button>
          <button 
            onClick={() => window.open('https://www.youtube.com/', '_blank')}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
          >
            YouTube
          </button>
          <button 
            onClick={() => window.open('https://music.apple.com/', '_blank')}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
          >
            Apple Music
          </button>
        </div>
      </div>
    </motion.div>
  )
}
