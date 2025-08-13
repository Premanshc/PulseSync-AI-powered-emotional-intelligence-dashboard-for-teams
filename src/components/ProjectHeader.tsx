'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Target } from 'lucide-react'

interface ProjectData {
  name: string
  description: string
  teamSize: number
  startDate: string
  deadline: string
  status: 'active' | 'planning' | 'delayed' | 'completed'
  progress: number
}

export default function ProjectHeader() {
  // Demo project data - in production this would come from project management system
  const projectData: ProjectData = {
    name: "PulseSync Development",
    description: "AI-powered team emotional intelligence dashboard for Vibe Coding Week",
    teamSize: 8,
    startDate: "2025-07-28",
    deadline: "2025-08-15",
    status: "active",
    progress: 75
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200'
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const daysRemaining = Math.ceil((new Date(projectData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div 
      className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-xl shadow-lg p-6 text-white mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="h-6 w-6" />
            <h1 className="text-2xl font-bold text-white">{projectData.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(projectData.status)}`}>
              {projectData.status.toUpperCase()}
            </span>
          </div>
          <p className="text-blue-100 mb-4 max-w-2xl">{projectData.description}</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Team Size</div>
                <div className="font-semibold text-white">{projectData.teamSize} members</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Started</div>
                <div className="font-semibold text-white">{new Date(projectData.startDate).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Deadline</div>
                <div className="font-semibold text-white">{new Date(projectData.deadline).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Days Left</div>
                <div className="font-semibold text-white">{daysRemaining} days</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 lg:mt-0 lg:ml-6">
          <div className="bg-white/10 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm">Progress</span>
              <span className="text-white font-bold">{projectData.progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div 
                className="bg-white rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${projectData.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="text-xs text-blue-100 mt-2">
              {projectData.progress >= 75 ? 'On track for delivery' : 'Needs attention'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
