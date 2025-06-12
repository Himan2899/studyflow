"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, Calendar, CheckCircle2, Clock, Trash2 } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly"
  target: number
  current: number
  unit: string
  deadline: string
  completed: boolean
}

export default function GoalsManager() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Daily Study Hours",
      description: "Study for 8 hours today",
      type: "daily",
      target: 8,
      current: 6,
      unit: "hours",
      deadline: "2024-01-15",
      completed: false,
    },
    {
      id: "2",
      title: "Weekly Math Practice",
      description: "Complete 35 hours of math this week",
      type: "weekly",
      target: 35,
      current: 28,
      unit: "hours",
      deadline: "2024-01-21",
      completed: false,
    },
    {
      id: "3",
      title: "Monthly Reading Goal",
      description: "Read 4 textbooks this month",
      type: "monthly",
      target: 4,
      current: 4,
      unit: "books",
      deadline: "2024-01-31",
      completed: true,
    },
  ])

  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    type: "daily" as "daily" | "weekly" | "monthly",
    target: 0,
    unit: "",
    deadline: "",
  })

  const addGoal = () => {
    if (newGoal.title && newGoal.description && newGoal.target > 0) {
      const goal: Goal = {
        id: Date.now().toString(),
        ...newGoal,
        current: 0,
        completed: false,
      }
      setGoals([...goals, goal])
      setNewGoal({
        title: "",
        description: "",
        type: "daily",
        target: 0,
        unit: "",
        deadline: "",
      })
      setIsAddingGoal(false)
    }
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id))
  }

  const updateProgress = (id: string, newCurrent: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, current: newCurrent, completed: newCurrent >= goal.target } : goal,
      ),
    )
  }

  const getGoalsByType = (type: "daily" | "weekly" | "monthly") => {
    return goals.filter((goal) => goal.type === type)
  }

  const getTypeColor = (type: "daily" | "weekly" | "monthly") => {
    switch (type) {
      case "daily":
        return "from-blue-500 to-cyan-500"
      case "weekly":
        return "from-green-500 to-emerald-500"
      case "monthly":
        return "from-purple-500 to-pink-500"
    }
  }

  const getTypeIcon = (type: "daily" | "weekly" | "monthly") => {
    switch (type) {
      case "daily":
        return Clock
      case "weekly":
        return Calendar
      case "monthly":
        return Target
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Goals Manager 🎯
        </motion.h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsAddingGoal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </motion.div>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {isAddingGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsAddingGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">Add New Goal</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Goal Title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as "daily" | "weekly" | "monthly" })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Target"
                    value={newGoal.target || ""}
                    onChange={(e) => setNewGoal({ ...newGoal, target: Number.parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    placeholder="Unit (hours, books, etc.)"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  />
                </div>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
                <div className="flex space-x-3">
                  <Button onClick={addGoal} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                    Add Goal
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingGoal(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals by Type */}
      {["daily", "weekly", "monthly"].map((type, typeIndex) => {
        const typeGoals = getGoalsByType(type as "daily" | "weekly" | "monthly")
        const TypeIcon = getTypeIcon(type as "daily" | "weekly" | "monthly")

        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: typeIndex * 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 capitalize">
                  <TypeIcon className="w-5 h-5 text-purple-500" />
                  <span>{type} Goals</span>
                  <Badge variant="secondary" className="ml-auto">
                    {typeGoals.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {typeGoals.length > 0 ? (
                  typeGoals.map((goal, goalIndex) => (
                    <motion.div
                      key={goal.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: goalIndex * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        goal.completed
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700"
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{goal.title}</h4>
                            {goal.completed && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                              >
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{goal.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                            <Badge className={`bg-gradient-to-r ${getTypeColor(goal.type)} text-white border-0`}>
                              {goal.type}
                            </Badge>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteGoal(goal.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {goal.current} / {goal.target} {goal.unit}
                          </span>
                        </div>
                        <div className="relative">
                          <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                          <motion.div
                            className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${getTypeColor(goal.type)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: goalIndex * 0.2 }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((goal.current / goal.target) * 100)}% complete
                        </div>

                        {!goal.completed && (
                          <div className="flex items-center space-x-2 mt-3">
                            <Input
                              type="number"
                              placeholder="Update progress"
                              className="flex-1 h-8 text-xs"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  const value = Number.parseInt((e.target as HTMLInputElement).value)
                                  if (value >= 0) {
                                    updateProgress(goal.id, value)
                                    ;(e.target as HTMLInputElement).value = ""
                                  }
                                }
                              }}
                            />
                            <span className="text-xs text-gray-500">{goal.unit}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-400 dark:text-gray-600"
                  >
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No {type} goals yet</p>
                    <p className="text-sm">Add your first {type} goal to get started!</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}

      {/* Goal Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{goals.filter((g) => g.completed).length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed Goals</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{goals.filter((g) => !g.completed).length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Goals</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">
              {Math.round((goals.filter((g) => g.completed).length / goals.length) * 100) || 0}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
