'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Award, Zap, Users, ThumbsUp } from 'lucide-react'

interface TeamEngagementData {
  currentMood: string
  moodEmoji: string
  lastUpdate: string
  teamScore: number
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    date: string
  }>
  livePolls: Array<{
    id: string
    question: string
    options: Array<{
      id: string
      text: string
      votes: number
      emoji: string
    }>
    totalVotes: number
    trending: boolean
    timeLeft: number
    createdBy: string
  }>
  gratitudeWall: Array<{
    id: string
    message: string
    from: string
    to: string
    emoji: string
  }>
}

export default function TeamEngagement() {
  const [activeTab, setActiveTab] = useState<'pulse' | 'achievements' | 'gratitude'>('gratitude')
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>({}) // pollId -> optionId
  const [showNewPollForm, setShowNewPollForm] = useState(false)
  const [newPollQuestion, setNewPollQuestion] = useState('')
  const [animatingVotes, setAnimatingVotes] = useState<Record<string, boolean>>({})
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [showGratitudeForm, setShowGratitudeForm] = useState(false)
  const [gratitudeMessage, setGratitudeMessage] = useState('')
  const [gratitudeRecipient, setGratitudeRecipient] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🙏')
  const [gratitudeWall, setGratitudeWall] = useState([])

  // Update timer every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Initialize gratitude wall with demo data
  useEffect(() => {
    setGratitudeWall(engagementData.gratitudeWall as any)
  }, [])
  
  const engagementData: TeamEngagementData = {
    currentMood: 'Motivated & Collaborative',
    moodEmoji: '🚀',
    lastUpdate: '2 minutes ago',
    teamScore: 85,
    achievements: [
      {
        id: '1',
        title: 'Positivity Streak',
        description: '7 days of positive team sentiment',
        icon: '✨',
        date: 'Today'
      },
      {
        id: '2',
        title: 'Communication Champion',
        description: 'Most supportive messages this week',
        icon: '🏆',
        date: 'Yesterday'
      },
      {
        id: '3',
        title: 'Wellness Warrior',
        description: 'Completed team wellness challenge',
        icon: '💪',
        date: '2 days ago'
      }
    ],
    livePolls: [
      {
        id: '1',
        question: 'How are you feeling about this week\'s workload?',
        options: [
          { id: 'a', text: 'Perfectly balanced', votes: 5, emoji: '⚖️' },
          { id: 'b', text: 'Manageable', votes: 4, emoji: '👍' },
          { id: 'c', text: 'A bit overwhelming', votes: 2, emoji: '😅' },
          { id: 'd', text: 'Need help!', votes: 1, emoji: '🆘' }
        ],
        totalVotes: 12,
        trending: true,
        timeLeft: 3600, // 1 hour in seconds
        createdBy: 'Team Lead'
      },
      {
        id: '2',
        question: 'What should we focus on in tomorrow\'s team meeting?',
        options: [
          { id: 'a', text: 'Sprint planning', votes: 3, emoji: '📋' },
          { id: 'b', text: 'Code review', votes: 2, emoji: '🔍' },
          { id: 'c', text: 'Team building', votes: 2, emoji: '🤝' },
          { id: 'd', text: 'Project demo', votes: 1, emoji: '🎯' }
        ],
        totalVotes: 8,
        trending: false,
        timeLeft: 1800, // 30 minutes
        createdBy: 'Sarah'
      },
      {
        id: '3',
        question: 'Friday afternoon team activity?',
        options: [
          { id: 'a', text: 'Virtual coffee chat', votes: 6, emoji: '☕' },
          { id: 'b', text: 'Online games', votes: 4, emoji: '🎮' },
          { id: 'c', text: 'Show & tell', votes: 2, emoji: '🎪' },
          { id: 'd', text: 'Early wrap-up', votes: 3, emoji: '🏃‍♂️' }
        ],
        totalVotes: 15,
        trending: true,
        timeLeft: 7200, // 2 hours
        createdBy: 'Alex'
      }
    ],
    gratitudeWall: [
      {
        id: '1',
        message: 'Thanks for helping me debug that tricky issue!',
        from: 'Sarah',
        to: 'Alex',
        emoji: '🙏'
      },
      {
        id: '2',
        message: 'Your presentation was amazing today!',
        from: 'Mike',
        to: 'Team',
        emoji: '👏'
      },
      {
        id: '3',
        message: 'Love the positive energy you bring to our standups',
        from: 'Jessica',
        to: 'David',
        emoji: '⚡'
      }
    ]
  }

  const handleQuickMoodUpdate = (mood: string, emoji: string) => {
    // In real app, this would update the user's current mood
    console.log(`Mood updated to: ${mood} ${emoji}`)
  }

  const handleVote = (pollId: string, optionId: string) => {
    if (votedPolls[pollId]) return // Already voted
    
    setVotedPolls(prev => ({ ...prev, [pollId]: optionId }))
    setAnimatingVotes(prev => ({ ...prev, [pollId]: true }))
    
    // Remove animation after delay
    setTimeout(() => {
      setAnimatingVotes(prev => ({ ...prev, [pollId]: false }))
    }, 1000)
  }

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) return `${hours}h ${minutes}m left`
    if (minutes > 0) return `${minutes}m left`
    return 'Ending soon!'
  }

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0
  }

  const createQuickPoll = () => {
    if (!newPollQuestion.trim()) return
    
    // In real app, this would create a new poll via API
    console.log('Creating poll:', newPollQuestion)
    setNewPollQuestion('')
    setShowNewPollForm(false)
    
    // Show success animation
    // This would update the engagementData with the new poll
  }

  const sendGratitudeMessage = () => {
    if (!gratitudeMessage.trim() || !gratitudeRecipient.trim()) return
    
    const newMessage = {
      id: `gratitude-${Date.now()}`,
      message: gratitudeMessage,
      from: 'You', // In real app, this would be the current user's name
      to: gratitudeRecipient,
      emoji: selectedEmoji
    }
    
    // Add to gratitude wall
    setGratitudeWall(prev => [newMessage, ...prev] as any)
    
    // Reset form
    setGratitudeMessage('')
    setGratitudeRecipient('')
    setSelectedEmoji('🙏')
    setShowGratitudeForm(false)
    
    // Show success message
    console.log('Gratitude message sent:', newMessage)
  }

  const teamMembers = [
    'Alex', 'Sarah', 'Mike', 'Jessica', 'David', 'Emma', 'Team', 'Everyone'
  ]

  const gratitudeEmojis = ['🙏', '👏', '⚡', '🌟', '💪', '🎉', '❤️', '🚀', '✨', '🔥']

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <Heart className="h-6 w-6" />
              <span>Team Pulse</span>
            </h3>
            <p className="text-pink-100 mt-1">Real-time team engagement</p>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">{engagementData.moodEmoji}</div>
            <div className="text-sm text-pink-100">Updated {engagementData.lastUpdate}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b">
        {[
          { id: 'pulse', label: 'Live Pulse', icon: Zap },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'gratitude', label: 'Gratitude Wall', icon: ThumbsUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 transition-colors ${
              activeTab === id
                ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'pulse' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Current Team Mood */}
            <div className="text-center">
              <div className="text-6xl mb-2">{engagementData.moodEmoji}</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-1">
                {engagementData.currentMood}
              </h4>
              <div className="flex items-center justify-center space-x-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Team Score: {engagementData.teamScore}/100
                </div>
              </div>
            </div>

            {/* Quick Mood Check-in */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-3">Quick Mood Check-in</h5>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { mood: 'Excited', emoji: '🤩' },
                  { mood: 'Happy', emoji: '😊' },
                  { mood: 'Neutral', emoji: '😐' },
                  { mood: 'Tired', emoji: '😴' },
                  { mood: 'Stressed', emoji: '😰' }
                ].map(({ mood, emoji }) => (
                  <motion.button
                    key={mood}
                    onClick={() => handleQuickMoodUpdate(mood, emoji)}
                    className="p-3 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-1">{emoji}</div>
                    <div className="text-xs text-gray-600">{mood}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Live Polls */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-800 flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Live Team Polls</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {engagementData.livePolls.length} Active
                  </span>
                </h5>
                <motion.button
                  onClick={() => setShowNewPollForm(!showNewPollForm)}
                  className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + New Poll
                </motion.button>
              </div>

              {/* Quick Poll Creation */}
              {showNewPollForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4"
                >
                  <h6 className="font-medium text-purple-800 mb-2">Create Quick Poll</h6>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="What's your question?"
                      value={newPollQuestion}
                      onChange={(e) => setNewPollQuestion(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={createQuickPoll}
                        disabled={!newPollQuestion.trim()}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Create Poll
                      </button>
                      <button
                        onClick={() => setShowNewPollForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Poll List */}
              <div className="space-y-4">
                {engagementData.livePolls.map((poll) => {
                  const hasVoted = votedPolls[poll.id]
                  const isAnimating = animatingVotes[poll.id]
                  
                  return (
                    <motion.div
                      key={poll.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Poll Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h6 className="font-medium text-gray-800 mb-1">{poll.question}</h6>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>by {poll.createdBy}</span>
                            <span>•</span>
                            <span>{poll.totalVotes} votes</span>
                            <span>•</span>
                            <span className={poll.timeLeft < 3600 ? 'text-orange-600 font-medium' : ''}>
                              {formatTimeLeft(poll.timeLeft)}
                            </span>
                          </div>
                        </div>
                        {poll.trending && (
                          <motion.span
                            className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            🔥 Trending
                          </motion.span>
                        )}
                      </div>

                      {/* Poll Options */}
                      <div className="space-y-2">
                        {poll.options.map((option) => {
                          const percentage = getVotePercentage(option.votes, poll.totalVotes)
                          const isSelected = hasVoted === option.id
                          
                          return (
                            <motion.button
                              key={option.id}
                              onClick={() => handleVote(poll.id, option.id)}
                              disabled={!!hasVoted}
                              className={`w-full text-left p-3 rounded-lg border-2 transition-all relative overflow-hidden ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-50'
                                  : hasVoted
                                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
                              }`}
                              whileHover={!hasVoted ? { scale: 1.02 } : {}}
                              whileTap={!hasVoted ? { scale: 0.98 } : {}}
                            >
                              {/* Vote percentage background */}
                              {hasVoted && (
                                <motion.div
                                  className="absolute inset-0 bg-purple-100 opacity-30"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              )}
                              
                              <div className="relative flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg">{option.emoji}</span>
                                  <span className="font-medium text-gray-800">{option.text}</span>
                                  {isSelected && (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="text-purple-600"
                                    >
                                      ✓
                                    </motion.span>
                                  )}
                                </div>
                                
                                {hasVoted && (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-600">
                                      {option.votes}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      ({percentage}%)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>

                      {/* Vote confirmation animation */}
                      {isAnimating && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-3 text-center"
                        >
                          <motion.span
                            className="inline-block text-green-600 font-medium"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                          >
                            🎉 Vote recorded! Thanks for participating
                          </motion.span>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Quick Poll Suggestions */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h6 className="font-medium text-gray-700 mb-2 text-sm">Quick Poll Ideas:</h6>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Team lunch preference? 🍕",
                    "Best meeting time? ⏰",
                    "Sprint retrospective format? 📝",
                    "Coffee break timing? ☕"
                  ].map((suggestion, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setNewPollQuestion(suggestion)}
                      className="bg-white text-gray-600 px-3 py-1 rounded-full text-xs hover:bg-purple-100 hover:text-purple-700 transition-colors border"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Team Achievements</h4>
              <p className="text-gray-600">Celebrating our wins together! 🎉</p>
            </div>
            
            {engagementData.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h6 className="font-semibold text-gray-800">{achievement.title}</h6>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {achievement.date}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'gratitude' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Gratitude Wall</h4>
              <p className="text-gray-600">Spreading positivity across the team ✨</p>
            </div>

            {/* Gratitude Form */}
            {showGratitudeForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-lg p-6 mb-6"
              >
                <h5 className="font-medium text-pink-800 mb-4 flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Send a Gratitude Message</span>
                </h5>
                
                <div className="space-y-4">
                  {/* Emoji Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose an emoji
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {gratitudeEmojis.map((emoji) => (
                        <motion.button
                          key={emoji}
                          onClick={() => setSelectedEmoji(emoji)}
                          className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                            selectedEmoji === emoji
                              ? 'border-pink-400 bg-pink-100'
                              : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To whom?
                    </label>
                    <select
                      value={gratitudeRecipient}
                      onChange={(e) => setGratitudeRecipient(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                    >
                      <option value="" className="text-gray-500">Select a team member</option>
                      {teamMembers.map((member) => (
                        <option key={member} value={member} className="text-gray-900">
                          {member}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your message
                    </label>
                    <textarea
                      value={gratitudeMessage}
                      onChange={(e) => setGratitudeMessage(e.target.value)}
                      placeholder="Express your gratitude..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none text-gray-900 placeholder-gray-500"
                      maxLength={200}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {gratitudeMessage.length}/200 characters
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={sendGratitudeMessage}
                      disabled={!gratitudeMessage.trim() || !gratitudeRecipient.trim()}
                      className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Send Gratitude 💖
                    </motion.button>
                    <motion.button
                      onClick={() => setShowGratitudeForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Gratitude Messages */}
            <div className="space-y-3">
              {gratitudeWall.map((note: any, index: number) => (
                <motion.div
                  key={note.id}
                  className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border-l-4 border-pink-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-start space-x-3">
                    <motion.div 
                      className="text-2xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      {note.emoji}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-2 italic">"{note.message}"</p>
                      <div className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium text-pink-600">{note.from}</span>
                        <motion.span 
                          className="mx-2 text-pink-400"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        >
                          →
                        </motion.span>
                        <span className="font-medium text-purple-600">{note.to}</span>
                        {note.from === 'You' && (
                          <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            ✨ Just sent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Send Message Button */}
            <motion.button
              onClick={() => setShowGratitudeForm(!showGratitudeForm)}
              className="w-full p-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5" />
                <span className="font-medium">
                  {showGratitudeForm ? 'Cancel' : 'Send a gratitude message'}
                </span>
              </div>
            </motion.button>

            {/* Gratitude Stats */}
            <motion.div
              className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <h6 className="font-medium text-yellow-800 mb-2">Team Gratitude Impact</h6>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-2xl mb-1">💌</div>
                    <div className="font-medium text-yellow-700">{gratitudeWall.length}</div>
                    <div className="text-yellow-600">Messages</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="font-medium text-yellow-700">98%</div>
                    <div className="text-yellow-600">Positivity</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🚀</div>
                    <div className="font-medium text-yellow-700">+15%</div>
                    <div className="text-yellow-600">Team Morale</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
