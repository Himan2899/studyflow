"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, Coffee, BookOpen, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ActiveSessionProps {
  session: {
    title: string
    subject: string
    duration: number
    notes?: string
  }
  onComplete: (completedMinutes: number) => void
  onStop: () => void
}

export function ActiveSession({ session, onComplete, onStop }: ActiveSessionProps) {
  const [timeLeft, setTimeLeft] = useState(session.duration * 60) // Convert to seconds
  const [isActive, setIsActive] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const { toast } = useToast()

  const totalSeconds = session.duration * 60
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            // Session completed
            const completedMinutes = Math.ceil((totalSeconds - time) / 60)
            onComplete(completedMinutes)
            toast({
              title: "🎉 Session Completed!",
              description: `Great job! You studied ${session.subject} for ${session.duration} minutes.`,
            })
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isPaused, timeLeft, session, onComplete, totalSeconds, toast])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
    toast({
      title: isPaused ? "▶️ Session Resumed" : "⏸️ Session Paused",
      description: isPaused ? "Keep up the great work!" : "Take a moment to recharge.",
    })
  }

  const handleStop = () => {
    const studiedMinutes = Math.ceil((totalSeconds - timeLeft) / 60)
    onStop()
    if (studiedMinutes > 0) {
      onComplete(studiedMinutes)
      toast({
        title: "📚 Session Ended",
        description: `You studied for ${studiedMinutes} minutes. Every minute counts!`,
      })
    }
  }

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      mathematics: "bg-blue-500",
      science: "bg-green-500",
      english: "bg-purple-500",
      history: "bg-orange-500",
      programming: "bg-cyan-500",
      art: "bg-pink-500",
      music: "bg-yellow-500",
      other: "bg-gray-500",
    }
    return colors[subject.toLowerCase()] || "bg-gray-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold">{session.title}</div>
              <div className="text-sm opacity-90">Active Study Session</div>
            </div>
            <Badge className={`${getSubjectColor(session.subject)} text-white`}>{session.subject}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <motion.div className="relative w-48 h-48 mx-auto" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-blue-500 transition-all duration-1000"
                style={{
                  background: `conic-gradient(#3b82f6 ${progress * 3.6}deg, transparent 0deg)`,
                  borderRadius: "50%",
                }}
              ></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-gray-900"
                    key={timeLeft}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                  <div className="text-sm text-gray-600 mt-1">{isPaused ? "Paused" : "Studying"}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Progress Info */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Progress</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Started: {session.duration} min</span>
              <span>Remaining: {Math.ceil(timeLeft / 60)} min</span>
            </div>
          </div>

          {/* Session Notes */}
          {session.notes && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Session Focus</span>
              </div>
              <p className="text-sm text-blue-800">{session.notes}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            <Button
              onClick={togglePause}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
            <Button
              onClick={handleStop}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              <Square className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>

          {/* Quick Break Button */}
          <Button
            variant="outline"
            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
            onClick={() => {
              setIsPaused(true)
              toast({
                title: "☕ Break Time!",
                description: "Take 5 minutes to rest. Your session will resume when you're ready.",
              })
            }}
          >
            <Coffee className="h-4 w-4 mr-2" />
            Take a 5-min Break
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
