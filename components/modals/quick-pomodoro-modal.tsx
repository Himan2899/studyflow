"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Timer, Play, Pause, RotateCcw, Coffee, CheckCircle } from "lucide-react"

interface QuickPomodoroModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSessionComplete: (sessionData: any) => void
}

export function QuickPomodoroModal({ open, onOpenChange, onSessionComplete }: QuickPomodoroModalProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const totalDuration = 25 * 60

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      if (!isBreak) {
        onSessionComplete({
          title: "Quick Pomodoro Session",
          duration: 25,
          subject: "general",
        })
        setSessionCount((prev) => prev + 1)
        setIsBreak(true)
        setTimeLeft(5 * 60)
        setIsActive(false)
      } else {
        setIsBreak(false)
        setTimeLeft(25 * 60)
        setIsActive(false)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, isBreak, onSessionComplete])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setTimeLeft(25 * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = isBreak ? ((5 * 60 - timeLeft) / (5 * 60)) * 100 : ((totalDuration - timeLeft) / totalDuration) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Timer className="h-6 w-6" />
            </div>
            {isBreak ? "Break Time" : "Focus Time"}
            <span className="text-xl ml-auto">⏲️</span>
          </DialogTitle>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-2">
          <div className="text-center">
            <motion.div
              className="relative w-48 h-48 mx-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
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
                  <div className="text-sm text-gray-600 mt-1">{isBreak ? "Break" : "Focus"}</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-800 font-medium">Sessions Completed: {sessionCount}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleTimer}
              size="lg"
              className={`${
                isBreak
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              } text-white font-semibold shadow-lg`}
            >
              {isActive ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg" className="border-gray-300 text-gray-700">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              {isBreak ? <Coffee className="h-4 w-4" /> : <Timer className="h-4 w-4" />}
              {isBreak ? "Break Tips" : "Focus Tips"}
            </h4>
            <p className="text-sm text-blue-800">
              {isBreak
                ? "Take a walk, stretch, or grab some water. Avoid screens to rest your eyes."
                : "Eliminate distractions, focus on one task, and avoid checking your phone."}
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
