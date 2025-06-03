"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Sparkles, Clock, Zap } from "lucide-react"

interface EnhancedScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateSchedule: (schedule: any) => void
}

export function EnhancedScheduleModal({ open, onOpenChange, onCreateSchedule }: EnhancedScheduleModalProps) {
  const [title, setTitle] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [dailyHours, setDailyHours] = useState("2")
  const [subjects, setSubjects] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateSchedule({
      title,
      startDate,
      endDate,
      dailyHours: Number.parseInt(dailyHours),
      subjects,
    })
    onOpenChange(false)
    // Reset form
    setTitle("")
    setStartDate("")
    setEndDate("")
    setDailyHours("2")
    setSubjects([])
  }

  const toggleSubject = (subject: string) => {
    setSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  const availableSubjects = [
    { name: "Mathematics", color: "bg-blue-500", emoji: "🔢" },
    { name: "Science", color: "bg-green-500", emoji: "🧪" },
    { name: "English", color: "bg-purple-500", emoji: "📚" },
    { name: "History", color: "bg-orange-500", emoji: "🏛️" },
    { name: "Programming", color: "bg-cyan-500", emoji: "💻" },
    { name: "Art", color: "bg-pink-500", emoji: "🎨" },
    { name: "Music", color: "bg-yellow-500", emoji: "🎵" },
    { name: "Physics", color: "bg-red-500", emoji: "⚡" },
  ]

  const hourOptions = [
    { value: "1", label: "1 hour", color: "text-green-600", desc: "Light study" },
    { value: "2", label: "2 hours", color: "text-blue-600", desc: "Recommended" },
    { value: "3", label: "3 hours", color: "text-purple-600", desc: "Intensive" },
    { value: "4", label: "4 hours", color: "text-orange-600", desc: "Heavy load" },
    { value: "6", label: "6 hours", color: "text-red-600", desc: "Exam prep" },
    { value: "8", label: "8 hours", color: "text-pink-600", desc: "Full day" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
            Plan Study Schedule
            <Sparkles className="h-5 w-5 ml-auto" />
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6 p-2"
        >
          <div className="space-y-3">
            <Label htmlFor="title" className="text-gray-800 font-semibold text-sm">
              Schedule Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Final Exam Preparation Schedule"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2 border-gray-200 focus:border-purple-400 bg-purple-50/50 text-gray-800 placeholder:text-gray-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="startDate" className="text-gray-800 font-semibold text-sm">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-2 border-gray-200 focus:border-green-400 bg-green-50/50 text-gray-800"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="endDate" className="text-gray-800 font-semibold text-sm">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-2 border-gray-200 focus:border-blue-400 bg-blue-50/50 text-gray-800"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="dailyHours" className="text-gray-800 font-semibold text-sm">
              Daily Study Hours
            </Label>
            <Select value={dailyHours} onValueChange={setDailyHours}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-orange-400 bg-orange-50/50 text-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200">
                {hourOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-gray-800 hover:bg-gray-100">
                    <div className="flex items-center gap-3 py-1">
                      <Clock className={`h-4 w-4 ${option.color}`} />
                      <div>
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-800 font-semibold text-sm">Subjects to Include</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSubjects.map((subject) => (
                <Button
                  key={subject.name}
                  type="button"
                  variant={subjects.includes(subject.name) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSubject(subject.name)}
                  className={`h-auto p-3 flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                    subjects.includes(subject.name)
                      ? `${subject.color} text-white shadow-lg scale-105`
                      : "border-2 border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <span className="text-lg">{subject.emoji}</span>
                  <span className="font-semibold">{subject.name}</span>
                </Button>
              ))}
            </div>
            {subjects.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">
                  Selected: {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {subjects.map((subject) => {
                    const subjectData = availableSubjects.find((s) => s.name === subject)
                    return (
                      <span key={subject} className={`px-2 py-1 rounded-full text-xs text-white ${subjectData?.color}`}>
                        {subjectData?.emoji} {subject}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-2 border-gray-400 bg-white text-gray-800 hover:bg-gray-100 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg"
              disabled={subjects.length === 0}
            >
              <Zap className="h-4 w-4 mr-2" />
              Generate Schedule
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
