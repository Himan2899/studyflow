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
import { Target, Trophy, Zap } from "lucide-react"

interface EnhancedGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateGoal: (goal: any) => void
}

export function EnhancedGoalModal({ open, onOpenChange, onCreateGoal }: EnhancedGoalModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [goalType, setGoalType] = useState("")
  const [targetValue, setTargetValue] = useState("")
  const [deadline, setDeadline] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateGoal({
      title,
      description,
      goalType,
      targetValue: Number.parseInt(targetValue),
      deadline,
    })
    onOpenChange(false)
    // Reset form
    setTitle("")
    setDescription("")
    setGoalType("")
    setTargetValue("")
    setDeadline("")
  }

  const goalTypes = [
    { value: "daily", label: "Daily Goal", color: "bg-green-500", emoji: "🌅", desc: "Complete every day" },
    { value: "weekly", label: "Weekly Goal", color: "bg-blue-500", emoji: "📅", desc: "Achieve within a week" },
    { value: "monthly", label: "Monthly Goal", color: "bg-purple-500", emoji: "🗓️", desc: "Long-term monthly target" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white border-0 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
            Set New Goal
            <Trophy className="h-5 w-5 ml-auto" />
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
              Goal Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Study 2 hours daily"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2 border-gray-200 focus:border-green-400 bg-green-50/50 text-gray-800 placeholder:text-gray-500"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="goalType" className="text-gray-800 font-semibold text-sm">
              Goal Type
            </Label>
            <Select value={goalType} onValueChange={setGoalType} required>
              <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400 bg-blue-50/50 text-gray-800">
                <SelectValue placeholder="Select goal type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200">
                {goalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-gray-800 hover:bg-gray-100">
                    <div className="flex items-center gap-3 py-2">
                      <span className="text-lg">{type.emoji}</span>
                      <div>
                        <div className="font-semibold">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.desc}</div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${type.color} ml-auto`} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="targetValue" className="text-gray-800 font-semibold text-sm">
                Target Value
              </Label>
              <Input
                id="targetValue"
                type="number"
                placeholder="e.g., 2"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="border-2 border-gray-200 focus:border-purple-400 bg-purple-50/50 text-gray-800 placeholder:text-gray-500"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="deadline" className="text-gray-800 font-semibold text-sm">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="border-2 border-gray-200 focus:border-orange-400 bg-orange-50/50 text-gray-800"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-gray-800 font-semibold text-sm">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your goal in detail. What motivates you to achieve this?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border-2 border-gray-200 focus:border-pink-400 bg-pink-50/50 text-gray-800 placeholder:text-gray-500 resize-none"
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
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
