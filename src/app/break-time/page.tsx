'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Clock, RefreshCw, Home, Eye, Smile, Zap, Heart } from 'lucide-react'
import Link from 'next/link'

interface BreakActivity {
  id: string
  name: string
  icon: string
  duration: number
  description: string
  instructions: string[]
  category: 'stretch' | 'eyes' | 'mental' | 'hydration' | 'breathing'
}

export default function BreakTimePage() {
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes default
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<BreakActivity | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [motivationalQuote, setMotivationalQuote] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Break activities
  const breakActivities: BreakActivity[] = [
    {
      id: 'stretch',
      name: 'Desk Stretches',
      icon: '🤸‍♀️',
      duration: 300,
      description: 'Release tension with simple stretches',
      category: 'stretch',
      instructions: [
        'Sit up straight and roll your shoulders backward 5 times',
        'Gently turn your head left and right, hold for 5 seconds each',
        'Raise your arms above your head and stretch to each side',
        'Stand up and do 10 gentle back bends',
        'Shake out your hands and wrists'
      ]
    },
    {
      id: 'eyes',
      name: 'Eye Care',
      icon: '👁️',
      duration: 180,
      description: 'Rest your eyes from screen strain',
      category: 'eyes',
      instructions: [
        'Look away from your screen at something 20 feet away',
        'Blink slowly 10 times to moisturize your eyes',
        'Close your eyes and gently massage your temples',
        'Look up, down, left, right - 5 times each direction',
        'Palm your eyes (cover with palms) for 30 seconds'
      ]
    },
    {
      id: 'hydration',
      name: 'Hydration Break',
      icon: '💧',
      duration: 120,
      description: 'Refresh with water and movement',
      category: 'hydration',
      instructions: [
        'Drink a full glass of water slowly',
        'Walk to the kitchen or water cooler',
        'Do 5 deep breaths while drinking',
        'Notice how the water tastes and feels',
        'Appreciate this moment of self-care'
      ]
    },
    {
      id: 'mental',
      name: 'Mental Reset',
      icon: '🧠',
      duration: 240,
      description: 'Clear your mind and reset focus',
      category: 'mental',
      instructions: [
        'Close your eyes and take 5 deep breaths',
        'Think of 3 things you\'re grateful for today',
        'Visualize your next task completed successfully',
        'Set a positive intention for the rest of your work',
        'Smile and remind yourself you\'re doing great!'
      ]
    },
    {
      id: 'breathing',
      name: 'Power Breathing',
      icon: '🌬️',
      duration: 180,
      description: 'Energize with breathing exercises',
      category: 'breathing',
      instructions: [
        'Sit comfortably with your back straight',
        'Inhale for 4 counts through your nose',
        'Hold your breath for 4 counts',
        'Exhale for 6 counts through your mouth',
        'Repeat this cycle 5 times'
      ]
    }
  ]

  // Motivational quotes
  const quotes = [
    "Take time to make your soul happy! 🌟",
    "A break is not a sign of weakness, it's a sign of wisdom. 💡",
    "Rest when you're weary. Refresh and renew yourself. ✨",
    "Taking breaks increases productivity and creativity! 🚀",
    "Your well-being is the foundation of your success. 💪",
    "Small breaks lead to big breakthroughs! 🎯",
    "Pause, breathe, and come back stronger. 💖"
  ]

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false)
            setIsCompleted(true)
            return 0
          }
          return timeLeft - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft])

  // Get random quote on start
  useEffect(() => {
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [selectedActivity])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startBreak = (activity: BreakActivity) => {
    setSelectedActivity(activity)
    setTimeLeft(activity.duration)
    setCurrentStep(0)
    setIsActive(true)
    setIsCompleted(false)
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
    if (isCompleted) {
      setIsCompleted(false)
      setCurrentStep(0)
      if (selectedActivity) {
        setTimeLeft(selectedActivity.duration)
      }
    }
  }

  const resetBreak = () => {
    setIsActive(false)
    setIsCompleted(false)
    setCurrentStep(0)
    if (selectedActivity) {
      setTimeLeft(selectedActivity.duration)
    }
  }

  const nextStep = () => {
    if (selectedActivity && currentStep < selectedActivity.instructions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = selectedActivity ? 
    ((selectedActivity.duration - timeLeft) / selectedActivity.duration) * 100 : 0

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stretch': return 'from-green-500 to-emerald-500'
      case 'eyes': return 'from-blue-500 to-cyan-500'
      case 'mental': return 'from-purple-500 to-pink-500'
      case 'hydration': return 'from-cyan-500 to-blue-500'
      case 'breathing': return 'from-orange-500 to-red-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors mb-4">
            <Home className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <Coffee className="h-10 w-10 mr-3 text-orange-500" />
              Break Time!
            </h1>
            <p className="text-gray-600">Take a refreshing break to boost your productivity</p>
          </motion.div>
        </div>

        {!selectedActivity ? (
          /* Activity Selection */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Choose Your Break Activity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {breakActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startBreak(activity)}
                  className="cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${getCategoryColor(activity.category)} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all`}>
                    <div className="text-4xl mb-3 text-center">{activity.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-center">{activity.name}</h3>
                    <p className="text-white/90 text-sm text-center mb-3">{activity.description}</p>
                    <div className="flex items-center justify-center text-white/80 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {Math.floor(activity.duration / 60)} min
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Break Time Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Reduces eye strain and fatigue</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Improves focus and concentration</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Prevents repetitive strain injuries</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Boosts creativity and problem-solving</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Active Break Session */
          <div className="max-w-2xl mx-auto">
            {/* Progress and Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-gradient-to-br ${getCategoryColor(selectedActivity.category)} rounded-3xl p-8 text-white text-center mb-6 shadow-2xl`}
            >
              <div className="text-6xl mb-4">{selectedActivity.icon}</div>
              <h2 className="text-3xl font-bold mb-2">{selectedActivity.name}</h2>
              <p className="text-white/90 mb-6">{selectedActivity.description}</p>
              
              {/* Timer Circle */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress / 100)}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - progress / 100) }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetBreak}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <RefreshCw className="h-6 w-6" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTimer}
                  className="p-4 bg-white text-gray-800 hover:bg-gray-100 rounded-full transition-colors shadow-lg"
                >
                  {isActive ? '⏸️' : '▶️'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedActivity(null)}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <Home className="h-6 w-6" />
                </motion.button>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Step {currentStep + 1} of {selectedActivity.instructions.length}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg text-sm transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={currentStep === selectedActivity.instructions.length - 1}
                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-gray-700 text-lg leading-relaxed"
                >
                  {selectedActivity.instructions[currentStep]}
                </motion.div>
              </AnimatePresence>

              {/* Progress bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-orange-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / selectedActivity.instructions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Motivational Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 text-white"
            >
              <Heart className="h-5 w-5 inline mr-2" />
              <span className="font-medium">{motivationalQuote}</span>
            </motion.div>
          </div>
        )}

        {/* Completion Modal */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl">
                <div className="text-7xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Break Complete!</h2>
                <p className="text-gray-600 mb-6">
                  Great job taking care of yourself! You&apos;re now refreshed and ready to tackle your next task with renewed energy.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsCompleted(false)
                      setSelectedActivity(null)
                    }}
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    Take Another Break
                  </button>
                  <Link 
                    href="/"
                    className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back to Work Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
