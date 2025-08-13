'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, AlertTriangle, Heart, TrendingUp, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'celebration'
  title: string
  message: string
  timestamp: Date
  actionable?: boolean
  action?: () => void
}

export default function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Simulate real-time notifications
    const intervals = [
      setTimeout(() => addNotification({
        type: 'info',
        title: 'New Sentiment Analysis',
        message: 'Team mood has improved by 15% this morning! Great energy in the development channel.',
      }), 3000),
      
      setTimeout(() => addNotification({
        type: 'warning',
        title: 'Wellness Alert',
        message: 'Sarah M. might be feeling overwhelmed. Consider checking in.',
        actionable: true,
      }), 8000),
      
      setTimeout(() => addNotification({
        type: 'celebration',
        title: 'Team Achievement! 🎉',
        message: 'Your team just hit a 7-day positivity streak! Amazing work.',
      }), 15000),
      
      setTimeout(() => addNotification({
        type: 'success',
        title: 'Productivity Boost',
        message: 'AI predicts 23% productivity increase based on current team sentiment.',
      }), 22000),
    ]

    return () => intervals.forEach(clearTimeout)
  }, [])

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 5)) // Keep only latest 5
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'success':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'celebration':
        return <Heart className="h-5 w-5 text-pink-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 bg-orange-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'celebration':
        return 'border-pink-200 bg-pink-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Notification Bell */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative bg-white rounded-full p-3 shadow-lg border hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {notifications.length > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {notifications.length}
          </motion.div>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute top-16 right-0 w-96 bg-white rounded-lg shadow-xl border max-h-96 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Live Notifications</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} relative`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <div className="flex items-start space-x-3 pr-6">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleTimeString()}
                            </span>
                            {notification.actionable && (
                              <motion.button
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Take Action
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 space-y-2 z-40">
        <AnimatePresence>
          {notifications.slice(0, 1).map((notification) => (
            !isExpanded && (
              <motion.div
                key={notification.id + '_toast'}
                className={`p-4 rounded-lg shadow-lg border ${getNotificationColor(notification.type)} max-w-sm`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
