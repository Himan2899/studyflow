"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Coffee, BookOpen } from "lucide-react"

interface PomodoroTimerProps {
  onSessionComplete?: (duration: number, type: "work" | "break") => void
}

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [sessionType, setSessionType] = useState<"work" | "break">("work")
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Session completed
      onSessionComplete?.(sessionType === "work" ? workDuration : breakDuration, sessionType)

      // Auto-switch to break/work
      const nextType = sessionType === "work" ? "break" : "work"
      setSessionType(nextType)
      setTimeLeft((nextType === "work" ? workDuration : breakDuration) * 60)
      setIsActive(false)
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
  }, [isActive, timeLeft, sessionType, workDuration, breakDuration, onSessionComplete])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft((sessionType === "work" ? workDuration : breakDuration) * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = 1 - timeLeft / ((sessionType === "work" ? workDuration : breakDuration) * 60)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          {sessionType === "work" ? (
            <>
              <BookOpen className="h-5 w-5" />
              Focus Time
            </>
          ) : (
            <>
              <Coffee className="h-5 w-5" />
              Break Time
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="relative">
          <motion.div
            className="w-48 h-48 mx-auto rounded-full border-8 border-gray-200 dark:border-gray-700 relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={`absolute inset-0 rounded-full border-8 ${
                sessionType === "work" ? "border-blue-500" : "border-green-500"
              }`}
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * progress - Math.PI / 2)}% ${
                  50 + 50 * Math.sin(2 * Math.PI * progress - Math.PI / 2)
                }%, 50% 50%)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-4xl font-bold text-center"
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                {formatTime(timeLeft)}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className={`${
              sessionType === "work" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Work Duration</label>
            <Select
              value={workDuration.toString()}
              onValueChange={(value) => {
                setWorkDuration(Number.parseInt(value))
                if (sessionType === "work" && !isActive) {
                  setTimeLeft(Number.parseInt(value) * 60)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="25">25 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Break Duration</label>
            <Select
              value={breakDuration.toString()}
              onValueChange={(value) => {
                setBreakDuration(Number.parseInt(value))
                if (sessionType === "break" && !isActive) {
                  setTimeLeft(Number.parseInt(value) * 60)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 min</SelectItem>
                <SelectItem value="10">10 min</SelectItem>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="20">20 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
