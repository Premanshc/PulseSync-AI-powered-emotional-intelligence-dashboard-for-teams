'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SentimentChart from '@/components/SentimentChart'
import EmotionDistribution from '@/components/EmotionDistribution'
import WellnessPanel from '@/components/WellnessPanel'
import MusicRecommendations from '@/components/MusicRecommendations'
import PredictiveInsights from '@/components/PredictiveInsights'
import TeamEngagement from '@/components/TeamEngagement'
import RealTimeNotifications from '@/components/RealTimeNotifications'
import ProjectHeader from '@/components/ProjectHeader'

// Demo mode - bypass authentication
const DEMO_MODE = true

const demoUser = {
  name: 'Demo User',
  email: 'demo@pulsesync.com'
}

const demoAnalyticsData = {
  dailyTrends: [
    { date: '2025-07-28', positive: 18, negative: 2, neutral: 4 }, // Project kickoff - high excitement
    { date: '2025-07-29', positive: 15, negative: 3, neutral: 6 }, // Initial planning phase
    { date: '2025-07-30', positive: 12, negative: 5, neutral: 8 }, // Technical challenges emerge
    { date: '2025-07-31', positive: 14, negative: 4, neutral: 7 }, // Problem solving mode
    { date: '2025-08-01', positive: 16, negative: 3, neutral: 5 }, // Progress improvements
    { date: '2025-08-02', positive: 13, negative: 6, neutral: 6 }, // Weekend sprint stress
    { date: '2025-08-03', positive: 17, negative: 2, neutral: 5 }, // Breakthrough achieved
    { date: '2025-08-04', positive: 19, negative: 1, neutral: 4 }, // Demo preparation excitement
  ],
  emotionDistribution: [
    { emotion: 'excited', count: 28 }, // High excitement for demo week
    { emotion: 'focused', count: 25 }, // Deep concentration on coding
    { emotion: 'motivated', count: 22 }, // Driven to win contest
    { emotion: 'happy', count: 18 }, // Enjoying the challenge
    { emotion: 'confident', count: 15 }, // Feeling good about progress
    { emotion: 'stressed', count: 8 }, // Some deadline pressure
    { emotion: 'tired', count: 4 }, // Late nights coding
  ]
}

export default function DemoDashboard() {
  const [analyticsData, setAnalyticsData] = useState(demoAnalyticsData)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const runDemo = async () => {
    setAnalyzing(true)
    
    // Simulate API call with loading animation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update with new demo data
    const newData = {
      dailyTrends: [
        ...demoAnalyticsData.dailyTrends,
        { date: '2025-02-01', positive: 22, negative: 2, neutral: 4 },
      ],
      emotionDistribution: [
        { emotion: 'excited', count: 28 },
        { emotion: 'happy', count: 35 },
        { emotion: 'focused', count: 20 },
        { emotion: 'calm', count: 17 },
        { emotion: 'motivated', count: 25 },
        { emotion: 'stressed', count: 6 },
        { emotion: 'tired', count: 3 },
      ]
    }
    
    setAnalyticsData(newData)
    setAnalyzing(false)
  }

  const handleAuthAction = () => {
    alert('🔧 Demo Mode Active!\n\nTo enable full authentication:\n1. Set up Microsoft App Registration\n2. Configure environment variables\n3. Update DEMO_MODE to false')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-blue-600 text-white p-2 text-center text-sm">
        🚀 <strong>PulseSync Project Dashboard</strong> - Monitoring team emotional intelligence for "PulseSync Development" project
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-gray-900"
              >
                PulseSync
              </motion.h1>
              <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Team Dashboard
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runDemo}
                disabled={analyzing}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {analyzing ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Analyzing...
                  </span>
                ) : (
                  '🧠 Run AI Analysis'
                )}
              </motion.button>
              <span className="text-sm text-gray-600">
                Welcome, {demoUser.name}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium"
                onClick={handleAuthAction}
              >
                Setup Auth
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <ProjectHeader />
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-green-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">😊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Positive Sentiment</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round((analyticsData.dailyTrends.reduce((acc, day) => acc + day.positive, 0) / 
                    analyticsData.dailyTrends.reduce((acc, day) => acc + day.positive + day.negative + day.neutral, 0)) * 100)}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-blue-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-purple-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages Analyzed</p>
                <p className="text-3xl font-bold text-purple-600">
                  {analyticsData.emotionDistribution.reduce((acc, emotion) => acc + emotion.count, 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SentimentChart data={analyticsData.dailyTrends} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <EmotionDistribution data={analyticsData.emotionDistribution} />
            </motion.div>

            {/* New AI Predictive Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PredictiveInsights />
            </motion.div>
          </div>

          {/* Right Column - Panels */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <WellnessPanel />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <MusicRecommendations />
            </motion.div>
          </div>
        </div>

        {/* New Team Engagement Section - Full Width */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <TeamEngagement />
          </motion.div>
        </div>

        {/* New Real-Time Notifications Section - Full Width */}
        {/* Real-time Notifications */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <RealTimeNotifications />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
