'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function WellnessPanel() {
  const { data: session } = useSession()
  const [recommendations, setRecommendations] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodSubmitted, setMoodSubmitted] = useState(false)
  const [moodHistory, setMoodHistory] = useState<number[]>([])
  const [refreshCount, setRefreshCount] = useState(0)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date())

  // Mood descriptions
  const moodOptions = [
    { emoji: '😄', label: 'Excellent', color: 'text-green-500', value: 5 },
    { emoji: '😊', label: 'Good', color: 'text-blue-500', value: 4 },
    { emoji: '😐', label: 'Neutral', color: 'text-yellow-500', value: 3 },
    { emoji: '😔', label: 'Low', color: 'text-orange-500', value: 2 },
    { emoji: '😫', label: 'Stressed', color: 'text-red-500', value: 1 }
  ]

  const fetchRecommendations = async () => {
    setLoading(true)
    setRefreshCount(prev => prev + 1)
    setLastRefreshTime(new Date())
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate dynamic wellness tips based on context
      const dynamicTips = generateDynamicWellnessTips()
      const dynamicMotivation = generateDynamicMotivation()
      
      setRecommendations({
        wellnessNudge: dynamicTips,
        motivationalContent: dynamicMotivation,
        musicRecommendations: generateMusicRecommendations()
      })
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDynamicWellnessTips = () => {
    const currentHour = new Date().getHours()
    const dayOfWeek = new Date().getDay()
    const averageMood = getMoodAverage()
    const moodTrend = getMoodTrend()
    
    const timeBasedTips = {
      morning: [
        "🌅 Start your day with 3 deep breaths and set a positive intention for the team!",
        "☀️ Morning energy is perfect for tackling challenging tasks. Use this momentum!",
        "🧘‍♀️ Begin with a 2-minute mindfulness moment to center yourself before diving in.",
        "💪 Morning is brain-prime time! Schedule your most important work now."
      ],
      midday: [
        "🍽️ Fuel your team's success - take that lunch break you've been postponing!",
        "🚶‍♂️ Midday slump? A 10-minute walk can boost creativity by 60%!",
        "💧 Hydration check! Your brain is 75% water - keep it happy and focused.",
        "🤝 Perfect time for collaborative work when energy levels align across the team."
      ],
      evening: [
        "🌅 As the day winds down, celebrate what your team accomplished together!",
        "📝 End-of-day reflection: What made you proud today? Share it with the team!",
        "🧘‍♀️ Transition ritual: Take 5 minutes to mentally close work and be present.",
        "🎯 Tomorrow's success starts with today's closure. Wrap up mindfully!"
      ]
    }
    
    const moodBasedTips = {
      high: [
        `✨ Your team energy is soaring (${averageMood}/5)! Channel this into mentoring others.`,
        `🚀 High team morale detected! Perfect time for ambitious goal-setting.`,
        `🌟 Your positive energy is contagious - keep spreading those good vibes!`
      ],
      medium: [
        `⚖️ Steady team mood (${averageMood}/5) - ideal for consistent, focused work.`,
        `🎯 Balanced energy is perfect for methodical problem-solving.`,
        `🔄 Consistent team mood provides stability for complex projects.`
      ],
      low: [
        `💚 Team energy feels lower today (${averageMood}/5) - extra kindness all around!`,
        `🤗 Low energy days call for shorter meetings and more supportive check-ins.`,
        `🌱 Remember: even the strongest teams have rebuilding days. Be gentle with yourselves.`
      ]
    }
    
    const trendBasedTips = {
      improving: [
        "📈 Love seeing your team mood trending upward! Keep building on this momentum!",
        "🎉 Your team's emotional trajectory is inspiring - whatever you're doing, keep it up!",
        "⬆️ Rising team spirits = rising productivity. You're on the right track!"
      ],
      declining: [
        "💪 Noticing some team fatigue? Time for a reset - maybe a fun team activity?",
        "🔄 Every team has ups and downs. This is temporary - focus on small wins today.",
        "🤝 When energy dips, connection matters more. Prioritize team bonding over tasks."
      ],
      stable: [
        "🎯 Consistent team mood shows good emotional regulation - solid foundation!",
        "⚖️ Steady emotional state is perfect for maintaining long-term productivity.",
        "🌊 Calm, consistent team energy creates the best environment for deep work."
      ]
    }
    
    // Select appropriate tip category
    let timeCategory = 'midday'
    if (currentHour < 12) timeCategory = 'morning'
    else if (currentHour > 17) timeCategory = 'evening'
    
    let moodCategory = 'medium'
    if (averageMood > 4) moodCategory = 'high'
    else if (averageMood < 3) moodCategory = 'low'
    
    // Rotate through different tip types based on refresh count
    const tipType = refreshCount % 3
    if (tipType === 0) {
      return timeBasedTips[timeCategory][Math.floor(Math.random() * timeBasedTips[timeCategory].length)]
    } else if (tipType === 1 && moodHistory.length > 0) {
      return moodBasedTips[moodCategory][Math.floor(Math.random() * moodBasedTips[moodCategory].length)]
    } else if (tipType === 2 && moodHistory.length > 1) {
      return trendBasedTips[moodTrend][Math.floor(Math.random() * trendBasedTips[moodTrend].length)]
    }
    
    // Fallback to time-based tips
    return timeBasedTips[timeCategory][Math.floor(Math.random() * timeBasedTips[timeCategory].length)]
  }

  const generateDynamicMotivation = () => {
    const motivationalMessages = [
      "🏆 Your team's collaboration is the secret sauce to this project's success! Keep building on each other's strengths.",
      "🚀 The PulseSync project showcases what happens when talented minds unite. You're creating something amazing!",
      "💡 Every line of code, every idea shared, every supportive message - it all adds up to team excellence!",
      "🌟 The way this team handles challenges with creativity and support is truly inspiring to watch!",
      "⚡ High-performing teams aren't born, they're built through moments like these. You're building something special!",
      "🎯 Your team's emotional intelligence and technical skills make for an unstoppable combination!",
      "🌈 The diversity of perspectives and unified commitment in this team is your competitive advantage!",
      "🔥 When teams communicate this openly and support each other this genuinely, innovation follows naturally!",
      "💪 The resilience and positivity this team shows through challenges is what separates good teams from great ones!",
      "✨ Watching this team problem-solve together is like seeing a well-orchestrated symphony - each person adding their unique voice!"
    ]
    
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  }

  const generateMusicRecommendations = () => {
    const currentHour = new Date().getHours()
    
    const musicCollections = {
      morning: [
        {
          name: "Morning Energy Boost",
          genre: "Upbeat Instrumental", 
          mood: "energized",
          url: "https://music.youtube.com/playlist?list=PLrAD5CwY7J-morning-energy"
        },
        {
          name: "Focus Flow - Dawn Edition",
          genre: "Ambient Electronic",
          mood: "focused", 
          url: "https://music.youtube.com/playlist?list=PLrAD5CwY7J-dawn-focus"
        }
      ],
      midday: [
        {
          name: "Productive Vibes",
          genre: "Lo-fi Hip Hop",
          mood: "concentrated",
          url: "https://music.youtube.com/playlist?list=PLrAD5CwY7J-productive-vibes"
        },
        {
          name: "Collaboration Soundtrack",
          genre: "Modern Instrumental",
          mood: "collaborative",
          url: "https://music.youtube.com/playlist?list=PLrAD5CwY7J-collab-music"
        }
      ],
      evening: [
        {
          name: "Wind Down Melodies",
          genre: "Chill Ambient",
          mood: "relaxed",
          url: "https://music.youtube.com/playlist?list=PLrAD5CwY7J-wind-down"
        },
        {
          name: "Reflection & Planning",
          genre: "Neo-Classical",
          mood: "contemplative",
          url: "https://music.youtube.com/playlist?list=PLrAD5CwY7J-reflection"
        }
      ]
    }
    
    let timeCategory = 'midday'
    if (currentHour < 12) timeCategory = 'morning'
    else if (currentHour > 17) timeCategory = 'evening'
    
    return musicCollections[timeCategory]
  }

  useEffect(() => {
    // Demo mode - show project-specific wellness tips instead of API call
    setRecommendations({
      wellnessNudge: "Your team is in high-energy mode for the final sprint! 🚀 Consider scheduling 15-minute breaks every 2 hours to maintain focus and prevent burnout during these intense coding sessions.",
      motivationalContent: "The PulseSync project is 75% complete - you're crushing it! 💪 The excitement in team communications shows everyone is aligned and motivated. Keep this momentum through demo week!",
      musicRecommendations: [
        {
          name: "Focus Flow - Deep Work Playlist",
          genre: "Ambient Electronic", 
          mood: "focused",
          url: "https://music.youtube.com/playlist?list=PLrAD5CwY7J-coding-focus"
        },
        {
          name: "Victory Vibes - Achievement Mix",
          genre: "Upbeat Instrumental",
          mood: "motivated", 
          url: "https://music.youtube.com/playlist?list=PLrAD5CwY7J-victory-music"
        }
      ]
    })
    
    // Load mood history from localStorage
    const savedMoodHistory = localStorage.getItem('pulsesync-mood-history')
    if (savedMoodHistory) {
      setMoodHistory(JSON.parse(savedMoodHistory))
    }
  }, [])

  const handleMoodSelection = (moodValue: number) => {
    setSelectedMood(moodValue)
    setMoodSubmitted(true)
    
    // Save to mood history
    const today = new Date().toDateString()
    const newMoodEntry = { date: today, mood: moodValue, timestamp: Date.now() }
    
    // Update mood history (keep last 7 days)
    const updatedHistory = [...moodHistory, moodValue].slice(-7)
    setMoodHistory(updatedHistory)
    localStorage.setItem('pulsesync-mood-history', JSON.stringify(updatedHistory))
    
    // Show success message temporarily
    setTimeout(() => {
      setMoodSubmitted(false)
    }, 3000)
    
    // Update recommendations based on mood
    updateRecommendationsBasedOnMood(moodValue)
  }

  const updateRecommendationsBasedOnMood = (mood: number) => {
    let moodBasedTip = ""
    let moodBasedMotivation = ""
    
    switch (mood) {
      case 5: // Excellent
        moodBasedTip = "You're feeling great! 🌟 Channel this positive energy into your most challenging tasks. Consider helping teammates who might need support."
        moodBasedMotivation = "Your excellent mood is contagious! Keep spreading those good vibes to the team. You're a productivity powerhouse today! 🚀"
        break
      case 4: // Good
        moodBasedTip = "Good vibes! 😊 This is perfect energy for collaborative work. Maybe schedule some pair programming or team brainstorming."
        moodBasedMotivation = "You're in a great headspace for tackling complex problems. Your positive attitude is an asset to the team! 💪"
        break
      case 3: // Neutral
        moodBasedTip = "Feeling steady? 😐 This is great for focused, methodical work. Try breaking larger tasks into smaller, manageable chunks."
        moodBasedMotivation = "Sometimes neutral is exactly what you need for deep work. Trust the process and take it one step at a time. 🎯"
        break
      case 2: // Low
        moodBasedTip = "Having a rough day? 😔 Be extra kind to yourself. Take more breaks, hydrate well, and tackle easier tasks first to build momentum."
        moodBasedMotivation = "Low energy days are part of the journey. Remember: you don't have to be 100% every day. Progress over perfection! 💖"
        break
      case 1: // Stressed
        moodBasedTip = "Feeling overwhelmed? 😫 Take a 10-minute break right now. Try deep breathing or a short walk. Your wellbeing comes first."
        moodBasedMotivation = "Stress is temporary, but taking care of yourself is forever. You've overcome challenges before - you've got this! 🌟"
        break
    }
    
    setRecommendations((prev: any) => ({
      ...prev,
      wellnessNudge: moodBasedTip,
      motivationalContent: moodBasedMotivation
    }))
  }

  const getMoodAverage = () => {
    if (moodHistory.length === 0) return 0
    return (moodHistory.reduce((sum, mood) => sum + mood, 0) / moodHistory.length).toFixed(1)
  }

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'stable'
    const recent = moodHistory.slice(-3).reduce((sum, mood) => sum + mood, 0) / Math.min(3, moodHistory.length)
    const earlier = moodHistory.slice(0, -3).reduce((sum, mood) => sum + mood, 0) / Math.max(1, moodHistory.length - 3)
    
    if (recent > earlier + 0.5) return 'improving'
    if (recent < earlier - 0.5) return 'declining'
    return 'stable'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-green-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="text-2xl mr-2">🌱</span>
          Wellness Corner
        </h2>
        <div className="flex items-center space-x-2">
          {refreshCount > 0 && (
            <div className="text-xs text-gray-500">
              Updated {Math.floor((Date.now() - lastRefreshTime.getTime()) / 60000)}m ago
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchRecommendations}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              loading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <motion.span
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              className="text-sm"
            >
              {loading ? '🔄' : '✨'}
            </motion.span>
            <span>{loading ? 'Refreshing...' : 'Refresh Tips'}</span>
          </motion.button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Wellness Nudge */}
        <motion.div
          key={`wellness-${refreshCount}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm p-4 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Daily Wellness Tip</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {recommendations?.wellnessNudge || 
                 "Take regular breaks throughout your day. A 5-minute walk can boost creativity and reduce stress."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Motivational Content */}
        <motion.div
          key={`motivation-${refreshCount}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm p-4 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Team Motivation</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {recommendations?.motivationalContent || 
                 "Great teams communicate openly and support each other. Your collaboration makes all the difference!"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link href="/meditation">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-500 text-white p-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <span className="block">🧘‍♀️</span>
              <span>Mindfulness</span>
            </motion.button>
          </Link>
          <Link href="/break-time">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-purple-500 text-white p-3 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
            >
              <span className="block">☕</span>
              <span>Break Time</span>
            </motion.button>
          </Link>
        </div>

        {/* Mood Check-in */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">How are you feeling?</h3>
            {moodHistory.length > 0 && (
              <div className="text-xs text-gray-600">
                Avg: {getMoodAverage()}/5 • Trend: 
                <span className={`ml-1 ${
                  getMoodTrend() === 'improving' ? 'text-green-600' : 
                  getMoodTrend() === 'declining' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {getMoodTrend() === 'improving' ? '↗️' : 
                   getMoodTrend() === 'declining' ? '↘️' : '→'}
                  {getMoodTrend()}
                </span>
              </div>
            )}
          </div>
          
          {moodSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <span className="text-2xl">✨</span>
              <p className="text-green-600 font-medium mt-2">Thanks for sharing! Your mood has been recorded.</p>
            </motion.div>
          ) : (
            <div className="flex justify-between gap-2">
              {moodOptions.map((mood, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMoodSelection(mood.value)}
                  className={`text-2xl p-2 rounded-full hover:bg-gray-100 transition-colors flex flex-col items-center ${
                    selectedMood === mood.value ? 'bg-blue-100 ring-2 ring-blue-300' : ''
                  }`}
                  title={mood.label}
                >
                  <span>{mood.emoji}</span>
                  <span className="text-xs mt-1 text-gray-600">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
