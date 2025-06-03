"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Clock, Play, Sparkles } from "lucide-react"

interface EnhancedStudySessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartSession: (session: any) => void
}

export function EnhancedStudySessionModal({ open, onOpenChange, onStartSession }: EnhancedStudySessionModalProps) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [duration, setDuration] = useState("25")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStartSession({
      title,
      subject,
      duration: Number.parseInt(duration),
      notes,
    })
    onOpenChange(false)
    // Reset form
    setTitle("")
    setSubject("")
    setDuration("25")
    setNotes("")
  }

  const subjects = [
    { value: "mathematics", label: "Mathematics", color: "bg-blue-500", emoji: "🔢" },
    { value: "science", label: "Science", color: "bg-green-500", emoji: "🧪" },
    { value: "english", label: "English", color: "bg-purple-500", emoji: "📚" },
    { value: "history", label: "History", color: "bg-orange-500", emoji: "🏛️" },
    { value: "programming", label: "Programming", color: "bg-cyan-500", emoji: "💻" },
    { value: "art", label: "Art", color: "bg-pink-500", emoji: "🎨" },
    { value: "music", label: "Music", color: "bg-yellow-500", emoji: "🎵" },
    { value: "other", label: "Other", color: "bg-gray-500", emoji: "📖" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white border-0 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            Start Study Session
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
              Session Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Mathematics - Calculus Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2 border-gray-200 focus:border-blue-400 bg-blue-50/50 text-gray-800 placeholder:text-gray-500"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="subject" className="text-gray-800 font-semibold text-sm">
              Subject
            </Label>
            <Select value={subject} onValueChange={setSubject} required>
              <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 bg-purple-50/50 text-gray-800">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200">
                {subjects.map((subj) => (
                  <SelectItem key={subj.value} value={subj.value} className="text-gray-800 hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{subj.emoji}</span>
                      <span>{subj.label}</span>
                      <div className={`w-3 h-3 rounded-full ${subj.color} ml-auto`} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="duration" className="text-gray-800 font-semibold text-sm">
              Duration
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-green-400 bg-green-50/50 text-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200">
                <SelectItem value="15" className="text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    15 minutes
                  </div>
                </SelectItem>
                <SelectItem value="25" className="text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    25 minutes (Pomodoro)
                  </div>
                </SelectItem>
                <SelectItem value="30" className="text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    30 minutes
                  </div>
                </SelectItem>
                <SelectItem value="45" className="text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    45 minutes
                  </div>
                </SelectItem>
                <SelectItem value="60" className="text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    60 minutes
                  </div>
                </SelectItem>
                <SelectItem value="90" className="text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-pink-500" />
                    90 minutes
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="notes" className="text-gray-800 font-semibold text-sm">
              Study Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="What do you want to focus on? Any specific topics or goals for this session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="border-2 border-gray-200 focus:border-yellow-400 bg-yellow-50/50 text-gray-800 placeholder:text-gray-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
