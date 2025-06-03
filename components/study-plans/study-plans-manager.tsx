"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, Clock, BookOpen, Plus, Edit, Trash2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Goal {
  id: string
  title: string
  description: string | null
  goal_type: string
  target_value: number
  deadline: string
  is_completed: boolean
  created_at: string
}

interface StudyPlan {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  daily_hours: number
  subjects: string[]
  is_active: boolean
  created_at: string
}

export function StudyPlansManager() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      fetchStudyPlans()
    }
  }, [user])

  const fetchStudyPlans = async () => {
    try {
      if (!user?.id) {
        console.error("No user ID available")
        return
      }

      // Since we don't have a study_plans table, we'll fetch from goals with monthly type
      const { data: plans, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("goal_type", "monthly")
        .ilike("title", "Schedule:%")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching study plans:", error)
        throw error
      }

      // Transform goals data to study plans format
      const transformedPlans: StudyPlan[] = ((plans || []) as unknown as Goal[]).map((plan) => ({
        id: plan.id,
        title: plan.title.replace("Schedule: ", ""),
        description: plan.description || "",
        start_date: plan.created_at.split("T")[0],
        end_date: plan.deadline,
        daily_hours: Math.floor(plan.target_value / 7), // Reverse calculate daily hours
        subjects: (plan.description || "").match(/Subjects: ([^.]+)/)?.[1]?.split(", ") || [],
        is_active: !plan.is_completed,
        created_at: plan.created_at,
      }))

      setStudyPlans(transformedPlans)
    } catch (error) {
      console.error("Error fetching study plans:", error)
      toast({
        title: "❌ Error",
        description: "Failed to load study plans",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("goals").update({ is_completed: currentStatus }).eq("id", planId)

      if (error) throw error

      toast({
        title: currentStatus ? "📅 Plan Completed!" : "🔄 Plan Reactivated!",
        description: currentStatus ? "Great job finishing your study plan!" : "Plan is now active again",
      })

      await fetchStudyPlans()
    } catch (error) {
      console.error("Error updating plan status:", error)
      toast({
        title: "❌ Error",
        description: "Failed to update plan status",
        variant: "destructive",
      })
    }
  }

  const deletePlan = async (planId: string) => {
    try {
      const { error } = await supabase.from("goals").delete().eq("id", planId)

      if (error) throw error

      toast({
        title: "🗑️ Plan Deleted",
        description: "Study plan has been removed",
      })

      await fetchStudyPlans()
    } catch (error) {
      console.error("Error deleting plan:", error)
      toast({
        title: "❌ Error",
        description: "Failed to delete plan",
        variant: "destructive",
      })
    }
  }

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()

    if (now < start) return 0
    if (now > end) return 100

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Plans 📚</h1>
          <p className="text-gray-600 mt-1">Manage your study schedules and track progress</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {studyPlans.length === 0 ? (
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Study Plans Yet</h3>
            <p className="text-gray-600 mb-6">Create your first study plan to organize your learning schedule</p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {studyPlans.map((plan, index) => {
            const progress = calculateProgress(plan.start_date, plan.end_date)
            const isActive = plan.is_active && progress < 100

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`bg-white border-2 ${isActive ? "border-blue-200" : "border-gray-200"} hover:shadow-lg transition-all duration-300`}
                >
                  <CardHeader
                    className={`${isActive ? "bg-gradient-to-r from-blue-50 to-purple-50" : "bg-gray-50"} rounded-t-lg`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3 text-gray-900">
                          <Calendar className={`h-5 w-5 ${isActive ? "text-blue-500" : "text-gray-500"}`} />
                          {plan.title}
                          {isActive && <Badge className="bg-green-500 text-white">Active</Badge>}
                          {!plan.is_active && <Badge variant="secondary">Completed</Badge>}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{plan.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePlan(plan.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{plan.daily_hours}h daily</p>
                          <p className="text-xs text-gray-600">Study time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                          </p>
                          <p className="text-xs text-gray-600">Duration</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{plan.subjects.length} subjects</p>
                          <p className="text-xs text-gray-600">Focus areas</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Progress</span>
                        <span className="font-bold text-gray-900">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {plan.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="bg-blue-100 text-blue-800">
                          {subject}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => togglePlanStatus(plan.id, !plan.is_active)}
                        className={`flex-1 ${
                          plan.is_active
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        } text-white`}
                      >
                        {plan.is_active ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 mr-2" />
                            Reactivate
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
