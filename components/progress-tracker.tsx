"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Clock, Target, Award, BookOpen } from "lucide-react"

export default function ProgressTracker() {
  const weeklyData = [
    { day: "Mon", hours: 6, goal: 8 },
    { day: "Tue", hours: 7, goal: 8 },
    { day: "Wed", hours: 5, goal: 8 },
    { day: "Thu", hours: 8, goal: 8 },
    { day: "Fri", hours: 6, goal: 8 },
    { day: "Sat", hours: 4, goal: 6 },
    { day: "Sun", hours: 3, goal: 6 },
  ]

  const subjects = [
    { name: "Mathematics", hours: 28, goal: 35, color: "from-purple-500 to-pink-500" },
    { name: "Physics", hours: 24, goal: 30, color: "from-blue-500 to-cyan-500" },
    { name: "Chemistry", hours: 20, goal: 25, color: "from-green-500 to-emerald-500" },
    { name: "Biology", hours: 32, goal: 35, color: "from-orange-500 to-red-500" },
  ]

  const achievements = [
    { title: "7-Day Streak", description: "Studied for 7 consecutive days", icon: Award, unlocked: true },
    { title: "Early Bird", description: "Started studying before 8 AM", icon: Clock, unlocked: true },
    { title: "Night Owl", description: "Studied past 10 PM", icon: BookOpen, unlocked: false },
    { title: "Goal Crusher", description: "Exceeded weekly goal", icon: Target, unlocked: true },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <motion.h2
        className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        Progress Tracker 📊
      </motion.h2>

      {/* Weekly Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Weekly Study Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-sm text-gray-500">
                      {day.hours}h / {day.goal}h
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={(day.hours / day.goal) * 100} className="h-3" />
                    <motion.div
                      className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.hours / day.goal) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subject Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span>Subject Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${subject.color}`} />
                    <span className="font-semibold">{subject.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {subject.hours}h / {subject.goal}h
                  </span>
                </div>
                <div className="relative">
                  <Progress value={(subject.hours / subject.goal) * 100} className="h-2" />
                  <motion.div
                    className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${subject.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(subject.hours / subject.goal) * 100}%` }}
                    transition={{ duration: 1.5, delay: index * 0.3 }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {Math.round((subject.hours / subject.goal) * 100)}% complete
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">39h</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total This Week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">5.6h</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Daily Average</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Goal Achievement</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700"
                      : "bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600 opacity-60"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        achievement.unlocked
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                      }`}
                    >
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
