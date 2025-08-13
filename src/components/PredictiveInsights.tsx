'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Brain, Target } from 'lucide-react'

interface PredictionData {
  burnoutRisk: {
    level: 'low' | 'medium' | 'high'
    percentage: number
    affectedMembers: string[]
    recommendation: string
  }
  productivityForecast: {
    trend: 'increasing' | 'stable' | 'decreasing'
    percentage: number
    factors: string[]
  }
  conflictRisk: {
    risk: boolean
    indicators: string[]
    preventionTips: string[]
  }
  teamWellness: {
    score: number
    trend: string
    nextWeekPrediction: number
  }
}

export default function PredictiveInsights() {
  const [predictions, setPredictions] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI prediction analysis
    setTimeout(() => {
      setPredictions({
        burnoutRisk: {
          level: 'low',
          percentage: 15,
          affectedMembers: ['Dev Team Lead', 'UI Designer'],
          recommendation: 'Monitor late-night commits and ensure adequate rest before demo week'
        },
        productivityForecast: {
          trend: 'increasing',
          percentage: 18,
          factors: ['Contest motivation high', 'Clear project milestones', 'Strong team collaboration', 'Demo week excitement']
        },
        conflictRisk: {
          risk: false,
          indicators: ['Positive code review comments', 'Supportive pair programming', 'Shared excitement for demo'],
          preventionTips: ['Maintain current collaboration style', 'Keep daily standups positive']
        },
        teamWellness: {
          score: 82,
          trend: 'improving',
          nextWeekPrediction: 86
        }
      })
      setLoading(false)
    }, 1500)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg bg-black font-semibold">AI Predictive Insights</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-black-200 rounded w-3/4"></div>
          <div className="h-4 bg-black-200 rounded w-1/2"></div>
          <div className="h-4 bg-black-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-black">AI Predictive Insights</h3>
        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
          Beta
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Burnout Risk */}
        <motion.div 
          className={`p-4 rounded-lg border-l-4 ${
            predictions?.burnoutRisk.level === 'high' 
              ? 'border-red-500 bg-red-50' 
              : predictions?.burnoutRisk.level === 'medium'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-green-500 bg-green-50'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className={`h-4 w-4 ${
              predictions?.burnoutRisk.level === 'high' 
                ? 'text-red-600' 
                : predictions?.burnoutRisk.level === 'medium'
                ? 'text-yellow-600'
                : 'text-green-600'
            }`} />
            <span className="font-medium text-black">Burnout Risk</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-black">
            {predictions?.burnoutRisk.percentage}%
          </div>
          <div className="text-sm text-black mb-2">
            {predictions?.burnoutRisk.affectedMembers.length} team members at risk
          </div>
          <div className="text-xs text-gray-900">
            {predictions?.burnoutRisk.recommendation}
          </div>
        </motion.div>

        {/* Productivity Forecast */}
        <motion.div 
          className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-black">Productivity Forecast</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-black">
            +{predictions?.productivityForecast.percentage}%
          </div>
          <div className="text-sm text-black mb-2">
            Expected improvement next week
          </div>
          <div className="text-xs text-gray-900">
            Factors: {predictions?.productivityForecast.factors.slice(0, 2).join(', ')}
          </div>
        </motion.div>

        {/* Team Wellness Score */}
        <motion.div 
          className="p-4 rounded-lg border-l-4 border-indigo-500 bg-indigo-50"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-indigo-600" />
            <span className="font-medium text-black">Wellness Score</span>
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="text-2xl font-bold text-black">
              {predictions?.teamWellness.score}/100
            </div>
            <div className="text-sm text-black">
              → {predictions?.teamWellness.nextWeekPrediction}
            </div>
          </div>
          <div className="text-sm text-black">
            {predictions?.teamWellness.trend} trend
          </div>
        </motion.div>

        {/* Conflict Risk */}
        <motion.div 
          className={`p-4 rounded-lg border-l-4 ${
            predictions?.conflictRisk.risk 
              ? 'border-red-500 bg-red-50' 
              : 'border-green-500 bg-green-50'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className={`h-4 w-4 ${
              predictions?.conflictRisk.risk ? 'text-red-600' : 'text-green-600'
            }`} />
            <span className="font-medium text-black">Conflict Risk</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-black">
            {predictions?.conflictRisk.risk ? 'High' : 'Low'}
          </div>
          <div className="text-sm text-black mb-2">
            Communication patterns healthy
          </div>
          <div className="text-xs text-gray-900">
            {predictions?.conflictRisk.preventionTips[0]}
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-medium text-purple-900 mb-2">🎯 Project-Specific AI Recommendations</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Team energy is optimal for the final sprint - maintain current momentum</li>
          <li>• Schedule demo practice sessions to build confidence</li>
          <li>• Consider celebratory team lunch after contest submission</li>
          <li>• Monitor for late-night coding sessions as deadline approaches</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}
