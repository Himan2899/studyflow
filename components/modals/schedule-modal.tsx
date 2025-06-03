"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Sparkles } from "lucide-react"

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateSchedule: (schedule: any) => void
}

export function ScheduleModal({ open, onOpenChange, onCreateSchedule }: ScheduleModalProps) {
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

  const availableSubjects = ["Mathematics", "Science", "English", "History", "Programming", "Art"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Plan Schedule
          </DialogTitle>
        </DialogHeader>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Schedule Title</Label>
            <Input
              id="title"
              placeholder="e.g., Final Exam Preparation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyHours">Daily Study Hours</Label>
            <Select value={dailyHours} onValueChange={setDailyHours}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subjects to Include</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableSubjects.map((subject) => (
                <Button
                  key={subject}
                  type="button"
                  variant={subjects.includes(subject) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSubject(subject)}
                  className="text-xs"
                >
                  {subject}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Schedule
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
