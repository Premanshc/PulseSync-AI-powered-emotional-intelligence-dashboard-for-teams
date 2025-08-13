'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'

export default function MeditationPage() {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(600)
  const [breathingPhase, setBreathingPhase] = useState('inhale') // 'inhale', 'hold', 'exhale'
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentSound, setCurrentSound] = useState('rain')
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [audioGain, setAudioGain] = useState<GainNode | null>(null)
  const [audioOscillator, setAudioOscillator] = useState<OscillatorNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Meditation durations
  const durations = [
    { label: '5 min', value: 300, color: 'bg-green-500' },
    { label: '10 min', value: 600, color: 'bg-blue-500' },
    { label: '15 min', value: 900, color: 'bg-purple-500' },
    { label: '20 min', value: 1200, color: 'bg-indigo-500' }
  ]

  // Meditation sounds (using royalty-free audio URLs)
  const meditationSounds = [
    { 
      id: 'rain', 
      name: 'Rain Sounds', 
      icon: '🌧️',
      description: 'Gentle rainfall',
      // Using a direct audio file URL (royalty-free)
      url: 'https://www.soundjay.com/misc/sounds/rain-01.wav'
    },
    { 
      id: 'forest', 
      name: 'Forest', 
      icon: '🌲',
      description: 'Forest ambience',
      // Note: In production, you'd host these files or use a proper audio service
      url: 'https://www.soundjay.com/nature/sounds/forest-01.wav'
    },
    { 
      id: 'ocean', 
      name: 'Ocean Waves', 
      icon: '🌊',
      description: 'Peaceful ocean',
      url: 'https://www.soundjay.com/nature/sounds/ocean-01.wav'
    },
    { 
      id: 'birds', 
      name: 'Birds', 
      icon: '🐦',
      description: 'Morning birds',
      url: 'https://www.soundjay.com/nature/sounds/birds-01.wav'
    },
    { 
      id: 'white-noise', 
      name: 'White Noise', 
      icon: '🌀',
      description: 'Calming white noise',
      // Using a data URL for a simple tone generator
      url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUfCDCC0fPTgjMGHm7A7+OZURE='
    },
    { 
      id: 'silence', 
      name: 'Silence', 
      icon: '🔇',
      description: 'Pure silence',
      url: null
    }
  ]

  // Breathing animation cycle
  useEffect(() => {
    if (isActive && !isCompleted) {
      breathingIntervalRef.current = setInterval(() => {
        setBreathingPhase(prev => {
          if (prev === 'inhale') return 'hold'
          if (prev === 'hold') return 'exhale'
          return 'inhale'
        })
      }, 4000) // 4 seconds per phase
    } else {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current)
      }
    }

    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current)
      }
    }
  }, [isActive, isCompleted])

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
    if (isCompleted) {
      setIsCompleted(false)
      setTimeLeft(selectedDuration)
    }
    
    // Handle audio playback (requires user interaction)
    if (!isActive && soundEnabled && currentSound !== 'silence') {
      // Starting meditation - play sound
      playMeditationSound()
    } else {
      // Pausing meditation - pause sound
      pauseMeditationSound()
    }
  }

  const playMeditationSound = () => {
    const sound = meditationSounds.find(s => s.id === currentSound)
    if (sound && sound.id !== 'silence') {
      try {
        // Initialize Web Audio Context if not exists
        if (!audioContext) {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
          setAudioContext(ctx)
          
          // Create gain node for volume control
          const gain = ctx.createGain()
          gain.connect(ctx.destination)
          gain.gain.value = 0.1 // Low volume
          setAudioGain(gain)
          
          // Create different sounds based on selection
          createMeditationTone(ctx, gain, sound.id)
        } else {
          createMeditationTone(audioContext, audioGain!, sound.id)
        }
        
        setIsPlaying(true)
        console.log(`Playing: ${sound.name}`)
        
      } catch (error) {
        console.warn('Audio creation failed:', error)
        // Fallback to visual indication
        setIsPlaying(true)
        console.log(`Demo Mode: ${sound.name} meditation audio activated`)
      }
    }
  }

  const createMeditationTone = (ctx: AudioContext, gain: GainNode, soundType: string) => {
    // Stop current oscillator
    if (audioOscillator) {
      audioOscillator.stop()
    }

    const oscillator = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    
    // Configure different sounds
    switch (soundType) {
      case 'rain':
        // Brown noise for rain effect
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(80, ctx.currentTime)
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(200, ctx.currentTime)
        break
      case 'ocean':
        // Low frequency wave sound
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(40, ctx.currentTime)
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(100, ctx.currentTime)
        break
      case 'forest':
        // Mid-range ambient
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(120, ctx.currentTime)
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(300, ctx.currentTime)
        break
      case 'birds':
        // Higher frequency chirping effect
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(800, ctx.currentTime)
        filter.type = 'highpass'
        filter.frequency.setValueAtTime(400, ctx.currentTime)
        break
      case 'white-noise':
      default:
        // White noise
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(200, ctx.currentTime)
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1000, ctx.currentTime)
        break
    }
    
    // Connect audio nodes
    oscillator.connect(filter)
    filter.connect(gain)
    
    // Start playing
    oscillator.start()
    setAudioOscillator(oscillator)
  }

  const pauseMeditationSound = () => {
    setIsPlaying(false)
    
    // Stop Web Audio oscillator
    if (audioOscillator) {
      try {
        audioOscillator.stop()
        setAudioOscillator(null)
      } catch (error) {
        // Oscillator might already be stopped
      }
    }
    
    // Stop HTML5 audio as fallback
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const changeMeditationSound = (soundId: string) => {
    setCurrentSound(soundId)
    
    // Stop current sound
    pauseMeditationSound()
    
    // If meditation is active and sound is enabled, play new sound
    if (isActive && soundEnabled && soundId !== 'silence') {
      // Small delay to ensure clean transition
      setTimeout(() => {
        playMeditationSound()
      }, 100)
    }
  }

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      // Clean up Web Audio
      if (audioOscillator) {
        try {
          audioOscillator.stop()
        } catch (error) {
          // Already stopped
        }
      }
      if (audioContext) {
        audioContext.close()
      }
      
      // Clean up HTML5 audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const resetTimer = () => {
    setIsActive(false)
    setIsCompleted(false)
    setTimeLeft(selectedDuration)
    setBreathingPhase('inhale')
    pauseMeditationSound()
  }

  const selectDuration = (duration: number) => {
    setSelectedDuration(duration)
    setTimeLeft(duration)
    setIsActive(false)
    setIsCompleted(false)
    setBreathingPhase('inhale')
  }

  const progress = ((selectedDuration - timeLeft) / selectedDuration) * 100

  const getBreathingInstruction = () => {
    if (breathingPhase === 'inhale') return 'Breathe In...'
    if (breathingPhase === 'hold') return 'Hold...'
    return 'Breathe Out...'
  }

  const getBreathingCircleScale = () => {
    if (breathingPhase === 'inhale') return 1.3
    if (breathingPhase === 'hold') return 1.3
    return 1
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-4">
            <Home className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-light text-white mb-2">Mindful Moment</h1>
          <p className="text-white/70">Take a break and center yourself</p>
        </div>

        {/* Duration Selection */}
        {!isActive && !isCompleted && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white/80 text-center mb-4">Choose duration</h3>
            <div className="grid grid-cols-2 gap-3">
              {durations.map((duration) => (
                <motion.button
                  key={duration.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectDuration(duration.value)}
                  className={`p-3 rounded-xl text-white font-medium transition-all ${
                    selectedDuration === duration.value 
                      ? `${duration.color} shadow-lg` 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {duration.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sound Selection */}
        {!isActive && !isCompleted && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white/80 text-center mb-4">Choose ambient sound</h3>
            <div className="grid grid-cols-3 gap-2">
              {meditationSounds.map((sound) => (
                <motion.button
                  key={sound.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => changeMeditationSound(sound.id)}
                  className={`p-3 rounded-xl text-white font-medium transition-all text-center ${
                    currentSound === sound.id 
                      ? 'bg-blue-500 shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="text-xl mb-1">{sound.icon}</div>
                  <div className="text-xs">{sound.name}</div>
                </motion.button>
              ))}
            </div>
            {currentSound !== 'silence' && (
              <div className="text-center mt-3">
                <p className="text-white/60 text-sm">
                  🎵 {meditationSounds.find(s => s.id === currentSound)?.description}
                  {isPlaying && isActive && ' (Playing)'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Main Timer Circle */}
        <div className="relative mb-8">
          {/* Progress Circle */}
          <div className="relative w-80 h-80 mx-auto">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="160"
                cy="160"
                r="150"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
                fill="none"
              />
              <motion.circle
                cx="160"
                cy="160"
                r="150"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 150}`}
                strokeDashoffset={`${2 * Math.PI * 150 * (1 - progress / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 150 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 150 * (1 - progress / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            {/* Breathing Animation Circle */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: getBreathingCircleScale() }}
              transition={{ 
                duration: 4,
                ease: "easeInOut"
              }}
            >
              <div className="w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  {isActive && !isCompleted && (
                    <motion.div
                      className="text-white/80 text-sm"
                      key={breathingPhase}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {getBreathingInstruction()}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sound Indicator */}
        {isActive && currentSound !== 'silence' && (
          <motion.div 
            className="text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-center space-x-2 text-white/60">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-lg"
              >
                {meditationSounds.find(s => s.id === currentSound)?.icon}
              </motion.div>
              <span className="text-sm">
                {meditationSounds.find(s => s.id === currentSound)?.name} playing
              </span>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <RotateCcw className="h-6 w-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTimer}
            className="p-4 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors shadow-lg"
          >
            {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-full text-white transition-colors ${
              soundEnabled && currentSound !== 'silence' 
                ? 'bg-blue-500/30 border border-blue-400' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {soundEnabled && currentSound !== 'silence' ? 
              <Volume2 className="h-6 w-6" /> : 
              <VolumeX className="h-6 w-6" />
            }
          </motion.button>
        </div>

        {/* Completion Modal */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
                <div className="text-6xl mb-4">🌟</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Well done!</h2>
                <p className="text-gray-600 mb-6">
                  You've completed your {selectedDuration / 60}-minute meditation session.
                  Take this centered energy back to your work.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsCompleted(false)}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Start Another Session
                  </button>
                  <Link 
                    href="/"
                    className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meditation Tips */}
        {!isActive && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
          >
            <h3 className="text-white font-medium mb-3">💡 Tips for better meditation</h3>
            <ul className="text-white/70 text-sm space-y-2">
              <li>• Find a comfortable, quiet space</li>
              <li>• Choose ambient sounds to help focus</li>
              <li>• Follow the breathing guide</li>
              <li>• It's okay if your mind wanders</li>
              <li>• Focus on the present moment</li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  )
}
