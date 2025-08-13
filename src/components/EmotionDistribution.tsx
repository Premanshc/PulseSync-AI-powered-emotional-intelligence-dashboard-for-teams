'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { motion } from 'framer-motion'

interface EmotionData {
  emotion: string
  count: number
}

interface EmotionDistributionProps {
  data: EmotionData[]
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
]

const emotionEmojis: Record<string, string> = {
  'excited': '🎉',
  'happy': '😊',
  'calm': '😌',
  'focused': '🎯',
  'motivated': '💪',
  'frustrated': '😤',
  'stressed': '😰',
  'tired': '😴',
  'confused': '🤔',
  'satisfied': '😌',
  'energetic': '⚡',
  'relaxed': '😊'
}

export default function EmotionDistribution({ data }: EmotionDistributionProps) {
  const processedData = data.map((item, index) => ({
    ...item,
    emoji: emotionEmojis[item.emotion] || '😐',
    color: COLORS[index % COLORS.length]
  }))

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Emotion Distribution
        </h2>
        <p className="text-gray-600 text-sm">
          Breakdown of emotions detected in team communications
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center">
        <div className="h-80 w-full lg:w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: any, props: any) => [
                  `${value} messages`,
                  `${props.payload.emoji} ${name}`
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/3 lg:pl-6">
          <div className="space-y-3">
            {processedData.map((item, index) => (
              <motion.div
                key={item.emotion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {item.emotion}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600 font-medium">{item.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {data.length === 0 && (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-4">🎭</div>
            <p>No emotion data available yet</p>
            <p className="text-sm mt-2">Analyze team messages to see emotion patterns</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
