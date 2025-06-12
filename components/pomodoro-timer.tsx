"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Timer, Coffee, Target } from "lucide-react"

interface PomodoroSession {
  id: string
  type: "work" | "shortBreak" | "longBreak"
  duration: number
  completed: boolean
  timestamp: Date
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
  const [isRunning, setIsRunning] = useState(false)
  const [currentSession, setCurrentSession] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [settings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSessionComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleSessionComplete = () => {
    setIsRunning(false)

    // Add completed session to history
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      type: currentSession,
      duration: getDurationForSession(currentSession),
      completed: true,
      timestamp: new Date(),
    }
    setSessions((prev) => [newSession, ...prev.slice(0, 9)]) // Keep last 10 sessions

    if (currentSession === "work") {
      setSessionsCompleted((prev) => prev + 1)
      // Determine next session type
      if ((sessionsCompleted + 1) % settings.sessionsUntilLongBreak === 0) {
        setCurrentSession("longBreak")
        setTimeLeft(settings.longBreakDuration * 60)
      } else {
        setCurrentSession("shortBreak")
        setTimeLeft(settings.shortBreakDuration * 60)
      }
    } else {
      setCurrentSession("work")
      setTimeLeft(settings.workDuration * 60)
    }
  }

  const getDurationForSession = (type: "work" | "shortBreak" | "longBreak") => {
    switch (type) {
      case "work":
        return settings.workDuration
      case "shortBreak":
        return settings.shortBreakDuration
      case "longBreak":
        return settings.longBreakDuration
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getDurationForSession(currentSession) * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getSessionColor = () => {
    switch (currentSession) {
      case "work":
        return "from-red-500 to-pink-500"
      case "shortBreak":
        return "from-green-500 to-emerald-500"
      case "longBreak":
        return "from-blue-500 to-cyan-500"
    }
  }

  const totalDuration = getDurationForSession(currentSession) * 60
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <motion.h2
        className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        Pomodoro Timer 🍅
      </motion.h2>

      {/* Main Timer */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Session Type Badge */}
              <motion.div
                key={currentSession}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex justify-center"
              >
                <Badge className={`px-4 py-2 text-lg bg-gradient-to-r ${getSessionColor()} text-white border-0`}>
                  {currentSession === "work"
                    ? "Focus Time"
                    : currentSession === "shortBreak"
                      ? "Short Break"
                      : "Long Break"}
                </Badge>
              </motion.div>

              {/* Timer Display */}
              <motion.div
                className="relative"
                animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 1, repeat: isRunning ? Number.POSITIVE_INFINITY : 0 }}
              >
                <div className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-r ${getSessionColor()} p-2 shadow-2xl`}>
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <motion.p
                        className="text-5xl font-bold text-gray-800 dark:text-white"
                        key={timeLeft}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {formatTime(timeLeft)}
                      </motion.p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {currentSession === "work" ? "Stay focused!" : "Take a break!"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Ring */}
                <svg className="absolute inset-0 w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100),
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={toggleTimer}
                    size="lg"
                    className={`bg-gradient-to-r ${getSessionColor()} hover:opacity-90 text-white shadow-lg px-8`}
                  >
                    {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {isRunning ? "Pause" : "Start"}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={resetTimer} variant="outline" size="lg" className="px-8">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{sessionsCompleted}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sessions Today</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Timer className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{Math.round(((sessionsCompleted * 25) / 60) * 10) / 10}h</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Focus Time</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{sessions.filter((s) => s.type !== "work").length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Breaks Taken</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-purple-500" />
              <span>Recent Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.slice(0, 5).map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                          session.type === "work"
                            ? "from-red-500 to-pink-500"
                            : session.type === "shortBreak"
                              ? "from-green-500 to-emerald-500"
                              : "from-blue-500 to-cyan-500"
                        }`}
                      />
                      <span className="font-medium capitalize">
                        {session.type === "work"
                          ? "Focus Session"
                          : session.type === "shortBreak"
                            ? "Short Break"
                            : "Long Break"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{session.duration}min</p>
                      <p className="text-xs text-gray-500">{session.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sessions completed yet</p>
                <p className="text-sm">Start your first Pomodoro session!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
