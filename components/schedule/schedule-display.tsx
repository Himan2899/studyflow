"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen, X } from "lucide-react"

interface Subject {
  name: string
  emoji: string
  color: string
}

interface Schedule {
  title: string
  subjects: string[]
  dailyHours: number
  startDate: string
  endDate: string
  schedule?: {
    day: string
    time: string
    subject: string
  }[]
}

interface ScheduleDisplayProps {
  open: boolean
  onClose: () => void
  scheduleData: Schedule | null
}

const availableSubjects: Subject[] = [
  { name: "Mathematics", emoji: "🔢", color: "bg-blue-500" },
  { name: "Science", emoji: "🧪", color: "bg-green-500" },
  { name: "English", emoji: "📚", color: "bg-purple-500" },
  { name: "History", emoji: "🏛️", color: "bg-orange-500" },
  { name: "Programming", emoji: "💻", color: "bg-cyan-500" },
  { name: "Art", emoji: "🎨", color: "bg-pink-500" },
  { name: "Music", emoji: "🎵", color: "bg-yellow-500" },
  { name: "Physics", emoji: "⚡", color: "bg-red-500" },
]

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ open, onClose, scheduleData }) => {
  if (!open || !scheduleData) return null

  // Generate a simple weekly schedule based on the subjects and daily hours
  const generateWeeklySchedule = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const timeSlots = ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00", "19:00", "20:00"]
    const schedule: { day: string; time: string; subject: string }[] = []

    const sessionsPerDay = Math.min(scheduleData.dailyHours, 4) // Max 4 sessions per day
    const subjectsToUse = scheduleData.subjects.slice(0, 6) // Use up to 6 subjects

    days.forEach((day, dayIndex) => {
      for (let i = 0; i < sessionsPerDay; i++) {
        const subject = subjectsToUse[i % subjectsToUse.length]
        const time = timeSlots[i % timeSlots.length]
        schedule.push({ day, time, subject })
      }
    })

    return schedule
  }

  const weeklySchedule = scheduleData.schedule || generateWeeklySchedule()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{scheduleData.title}</h2>
                  <p className="text-white/90">Your personalized study schedule</p>
                </div>
              </div>
              <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Schedule Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{scheduleData.dailyHours}h</div>
                    <div className="text-sm text-blue-700">Daily Study Time</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{scheduleData.subjects.length}</div>
                    <div className="text-sm text-green-700">Subjects</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-purple-600">
                      {Math.ceil(
                        (new Date(scheduleData.endDate).getTime() - new Date(scheduleData.startDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </div>
                    <div className="text-sm text-purple-700">Duration</div>
                  </CardContent>
                </Card>
              </div>

              {/* Date Range */}
              <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Period</h3>
                    <p className="text-gray-700">
                      <span className="font-medium">{formatDate(scheduleData.startDate)}</span>
                      {" → "}
                      <span className="font-medium">{formatDate(scheduleData.endDate)}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Subjects */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Subjects in This Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {scheduleData.subjects.map((subject) => {
                      const subjectData = availableSubjects.find((s) => s.name === subject)
                      return (
                        <Badge
                          key={subject}
                          className={`px-4 py-2 text-white font-medium ${subjectData?.color || "bg-gray-500"}`}
                        >
                          <span className="mr-2">{subjectData?.emoji || "📖"}</span>
                          {subject}
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Schedule */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Weekly Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-7 gap-2 min-w-[600px]">
                      {/* Header */}
                      <div className="font-semibold text-gray-700 p-2">Time</div>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="font-semibold text-gray-700 p-2 text-center">
                          {day}
                        </div>
                      ))}

                      {/* Time slots */}
                      {["9:00", "10:00", "11:00", "14:00", "15:00", "16:00", "19:00", "20:00"].map((time) => (
                        <React.Fragment key={time}>
                          <div className="p-2 text-sm text-gray-600 font-medium">{time}</div>
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                            const scheduledItem = weeklySchedule.find((item) => item.day === day && item.time === time)
                            const subjectData = availableSubjects.find((s) => s.name === scheduledItem?.subject)

                            return (
                              <div key={`${day}-${time}`} className="p-2">
                                {scheduledItem ? (
                                  <div
                                    className={`p-2 rounded-lg text-white text-xs font-medium text-center ${
                                      subjectData?.color || "bg-gray-500"
                                    }`}
                                  >
                                    <div>{subjectData?.emoji || "📖"}</div>
                                    <div className="mt-1">{scheduledItem.subject}</div>
                                  </div>
                                ) : (
                                  <div className="p-2 text-center text-gray-400 text-xs">-</div>
                                )}
                              </div>
                            )
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">📝 Study Tips</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Take 10-15 minute breaks between sessions</li>
                    <li>• Stay hydrated and maintain good posture</li>
                    <li>• Review previous day's material before starting new topics</li>
                    <li>• Adjust the schedule as needed based on your progress</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export { ScheduleDisplay }
export default ScheduleDisplay
