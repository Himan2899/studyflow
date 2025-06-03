"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Target, TrendingUp, CheckCircle, Clock, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Goal {
  id: string
  title: string
  description: string
  goal_type: "daily" | "weekly" | "monthly"
  target_value: number
  current_value: number
  deadline: string
  is_completed: boolean
  created_at: string
}

interface GoalDisplayProps {
  open: boolean
  onClose: () => void
}

export function GoalDisplay({ open, onClose }: GoalDisplayProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (open && user) {
      fetchGoals()
    }
  }, [open, user])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      if (!user?.id) {
        console.error("No user ID available")
        return
      }

      const { data: goalsData, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .neq("goal_type", "monthly") // Exclude schedules
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching goals:", error)
        throw error
      }

      // Ensure goalsData is properly typed
      const typedGoals: Goal[] = (goalsData || []).map((goal: any) => ({
        id: goal.id,
        title: goal.title,
        description: goal.description || "",
        goal_type: goal.goal_type as "daily" | "weekly" | "monthly",
        target_value: Number(goal.target_value) || 0,
        current_value: Number(goal.current_value) || 0,
        deadline: goal.deadline,
        is_completed: Boolean(goal.is_completed),
        created_at: goal.created_at,
      }))

      setGoals(typedGoals)
    } catch (error) {
      console.error("Error fetching goals:", error)
      toast({
        title: "❌ Error",
        description: "Failed to load goals",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    try {
      const goal = goals.find((g) => g.id === goalId)
      if (!goal) {
        throw new Error("Goal not found")
      }

      const { error } = await supabase
        .from("goals")
        .update({
          current_value: newValue,
          is_completed: newValue >= goal.target_value,
        })
        .eq("id", goalId)

      if (error) throw error

      toast({
        title: "📈 Progress Updated!",
        description: "Goal progress has been updated",
      })

      await fetchGoals()
    } catch (error) {
      console.error("Error updating goal:", error)
      toast({
        title: "❌ Error",
        description: "Failed to update goal progress",
        variant: "destructive",
      })
    }
  }

  const getGoalTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-green-500"
      case "weekly":
        return "bg-blue-500"
      case "monthly":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case "daily":
        return "🌅"
      case "weekly":
        return "📅"
      case "monthly":
        return "🗓️"
      default:
        return "🎯"
    }
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `${diffDays} days left`
  }

  if (!open) return null

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
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Your Goals Dashboard</h2>
                  <p className="text-white/90">Track your progress and achieve your targets</p>
                </div>
              </div>
              <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
                Close
              </Button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goals Set Yet</h3>
                <p className="text-gray-600 mb-6">Create your first goal to start tracking your progress</p>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white">Set Your First Goal</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Goals Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {goals.filter((g) => g.is_completed).length}
                      </div>
                      <div className="text-sm text-green-700">Completed Goals</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {goals.filter((g) => !g.is_completed).length}
                      </div>
                      <div className="text-sm text-blue-700">Active Goals</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((goals.filter((g) => g.is_completed).length / goals.length) * 100) || 0}%
                      </div>
                      <div className="text-sm text-purple-700">Success Rate</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Goals List */}
                <div className="space-y-4">
                  {goals.map((goal, index) => {
                    const progress = goal.target_value > 0 ? (goal.current_value / goal.target_value) * 100 : 0
                    const isOverdue = new Date(goal.deadline) < new Date() && !goal.is_completed

                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`border-2 ${goal.is_completed ? "border-green-200 bg-green-50" : isOverdue ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"} hover:shadow-lg transition-all duration-300`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="flex items-center gap-3 text-gray-900">
                                  <span className="text-2xl">{getGoalTypeIcon(goal.goal_type)}</span>
                                  {goal.title}
                                  {goal.is_completed && (
                                    <Badge className="bg-green-500 text-white">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Completed
                                    </Badge>
                                  )}
                                  {isOverdue && (
                                    <Badge className="bg-red-500 text-white">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Overdue
                                    </Badge>
                                  )}
                                </CardTitle>
                                <p className="text-gray-600 mt-1">{goal.description}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={`${getGoalTypeColor(goal.goal_type)} text-white`}>
                                  {goal.goal_type}
                                </Badge>
                                <p className="text-sm text-gray-500 mt-1">{formatDeadline(goal.deadline)}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-700">Progress</span>
                                <span className="font-bold text-gray-900">
                                  {goal.current_value} / {goal.target_value}
                                </span>
                              </div>
                              <Progress value={Math.min(progress, 100)} className="h-3" />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0</span>
                                <span className="font-medium">{Math.round(progress)}%</span>
                                <span>{goal.target_value}</span>
                              </div>
                            </div>

                            {!goal.is_completed && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateGoalProgress(goal.id, goal.current_value + 1)}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                >
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                  +1 Progress
                                </Button>
                                {goal.current_value >= goal.target_value && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateGoalProgress(goal.id, goal.target_value)}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                  >
                                    <Star className="h-4 w-4 mr-1" />
                                    Mark Complete
                                  </Button>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
