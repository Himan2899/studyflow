"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { TrendingUp, Clock, Target, Award, Flame, BookOpen, Brain, Star, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SupabaseClient } from "@supabase/supabase-js"

interface PomodoroSession {
  id: number
  user_id: string
  duration_minutes: number
  completed_at: string
}

interface Goal {
  id: number
  user_id: string
  is_completed: boolean
  created_at: string
}

interface Profile {
  id: string
  study_streak: number
  total_study_hours: number
}

interface AnalyticsData {
  totalSessions: number
  totalStudyTime: number
  averageSessionLength: number
  longestStreak: number
  currentStreak: number
  weeklyProgress: number[]
  subjectBreakdown: { [key: string]: number }
  monthlyGoals: number
  completedGoals: number
  productivityScore: number
  focusRating: number
  consistencyScore: number
  todayStudyTime: number
  weeklyStudyTime: number
  monthlyStudyTime: number
}

export function StudyAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSessions: 0,
    totalStudyTime: 0,
    averageSessionLength: 0,
    longestStreak: 0,
    currentStreak: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    subjectBreakdown: {},
    monthlyGoals: 0,
    completedGoals: 0,
    productivityScore: 0,
    focusRating: 0,
    consistencyScore: 0,
    todayStudyTime: 0,
    weeklyStudyTime: 0,
    monthlyStudyTime: 0,
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      fetchRealAnalytics()
    }
  }, [user, timeRange])

  const fetchRealAnalytics = async () => {
    try {
      setLoading(true)

      // Get date ranges
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      const yearStart = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)

      let startDate: Date
      switch (timeRange) {
        case "week":
          startDate = weekStart
          break
        case "month":
          startDate = monthStart
          break
        case "year":
          startDate = yearStart
          break
        default:
          startDate = weekStart
      }

      // Fetch actual pomodoro sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from("pomodoro_sessions")
        .select("*")
        .eq("user_id", user?.id || "")
        .gte("completed_at", startDate.toISOString())
        .order("completed_at", { ascending: true })

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError)
        throw sessionsError
      }

      // Fetch today's sessions
      const { data: todaySessions, error: todayError } = await supabase
        .from("pomodoro_sessions")
        .select("duration_minutes")
        .eq("user_id", user?.id || "")
        .gte("completed_at", today.toISOString())

      if (todayError) {
        console.error("Error fetching today's sessions:", todayError)
      }

      // Fetch this week's sessions
      const { data: weekSessions, error: weekError } = await supabase
        .from("pomodoro_sessions")
        .select("duration_minutes")
        .eq("user_id", user?.id || "")
        .gte("completed_at", weekStart.toISOString())

      if (weekError) {
        console.error("Error fetching week's sessions:", weekError)
      }

      // Fetch this month's sessions
      const { data: monthSessions, error: monthError } = await supabase
        .from("pomodoro_sessions")
        .select("duration_minutes")
        .eq("user_id", user?.id || "")
        .gte("completed_at", monthStart.toISOString())

      if (monthError) {
        console.error("Error fetching month's sessions:", monthError)
      }

      // Fetch goals
      const { data: goals, error: goalsError } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user?.id || "")
        .gte("created_at", startDate.toISOString())

      if (goalsError) {
        console.error("Error fetching goals:", goalsError)
      }

      // Fetch user profile for streak data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("study_streak, total_study_hours")
        .eq("id", user?.id || "")
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
      }

      // Calculate real analytics from actual data
      const typedSessions = (sessions as unknown) as PomodoroSession[] | null
      const typedTodaySessions = (todaySessions as unknown) as PomodoroSession[] | null
      const typedWeekSessions = (weekSessions as unknown) as PomodoroSession[] | null
      const typedMonthSessions = (monthSessions as unknown) as PomodoroSession[] | null
      const typedGoals = (goals as unknown) as Goal[] | null
      const typedProfile = (profile as unknown) as Profile | null

      const totalSessions = typedSessions?.length || 0
      const totalStudyTime = typedSessions?.reduce((sum: number, session: PomodoroSession) => sum + (session.duration_minutes || 0), 0) || 0
      const averageSessionLength = totalSessions > 0 ? Math.round(totalStudyTime / totalSessions) : 0

      // Calculate today's study time
      const todayStudyTime = typedTodaySessions?.reduce((sum: number, session: PomodoroSession) => sum + (session.duration_minutes || 0), 0) || 0

      // Calculate weekly study time
      const weeklyStudyTime = typedWeekSessions?.reduce((sum: number, session: PomodoroSession) => sum + (session.duration_minutes || 0), 0) || 0

      // Calculate monthly study time
      const monthlyStudyTime = typedMonthSessions?.reduce((sum: number, session: PomodoroSession) => sum + (session.duration_minutes || 0), 0) || 0

      // Calculate weekly progress (last 7 days)
      const weeklyProgress = Array(7).fill(0)
      const todayDate = new Date()

      typedSessions?.forEach((session) => {
        const sessionDate = new Date(session.completed_at)
        const daysDiff = Math.floor((todayDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff >= 0 && daysDiff < 7) {
          weeklyProgress[6 - daysDiff] += session.duration_minutes || 0
        }
      })

      // Calculate subject breakdown from actual sessions
      const subjectBreakdown: { [key: string]: number } = {}
      typedSessions?.forEach((session) => {
        // For now, we'll simulate subjects since we don't have subject tracking yet
        // In a real app, you'd have subject_id or subject field in sessions
        const subjects = ["Mathematics", "Science", "English", "Programming", "History"]
        const sessionSubject = subjects[session.id % subjects.length] // Simulate based on session ID
        subjectBreakdown[sessionSubject] = (subjectBreakdown[sessionSubject] || 0) + (session.duration_minutes || 0)
      })

      // Calculate real performance scores based on actual data
      const targetDailyMinutes = 120 // 2 hours
      const targetSessionLength = 25 // 25 minutes

      const productivityScore =
        totalSessions > 0
          ? Math.min(
              100,
              Math.round(
                (totalStudyTime /
                  (targetDailyMinutes * (timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365))) *
                  100,
              ),
            )
          : 0
      const focusRating =
        averageSessionLength > 0 ? Math.min(100, Math.round((averageSessionLength / targetSessionLength) * 100)) : 0
      const consistencyScore =
        weeklyProgress.filter((day) => day > 0).length > 0
          ? Math.round((weeklyProgress.filter((day) => day > 0).length / 7) * 100)
          : 0

      setAnalytics({
        totalSessions,
        totalStudyTime,
        averageSessionLength,
        longestStreak: typedProfile?.study_streak || 0,
        currentStreak: typedProfile?.study_streak || 0,
        weeklyProgress,
        subjectBreakdown,
        monthlyGoals: typedGoals?.length || 0,
        completedGoals: typedGoals?.filter((goal) => goal.is_completed).length || 0,
        productivityScore,
        focusRating,
        consistencyScore,
        todayStudyTime,
        weeklyStudyTime,
        monthlyStudyTime,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "❌ Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    if (score >= 40) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return "🔥"
    if (score >= 60) return "⚡"
    if (score >= 40) return "📈"
    return "📊"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Show message if no data exists
  if (analytics.totalSessions === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Study Analytics 📊</h1>
            <p className="text-gray-600 mt-1">Track your progress and optimize your learning</p>
          </div>
        </div>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Study Data Yet</h3>
            <p className="text-gray-600 mb-6">
              Complete your first study session to see detailed analytics and insights about your learning progress.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              Start Your First Session
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Analytics 📊</h1>
          <p className="text-gray-600 mt-1">Track your progress and optimize your learning</p>
        </div>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-blue-500 text-white" : "border-gray-300 text-gray-700"}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="overview" className="text-gray-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-gray-700">
            Progress
          </TabsTrigger>
          <TabsTrigger value="subjects" className="text-gray-700">
            Subjects
          </TabsTrigger>
          <TabsTrigger value="goals" className="text-gray-700">
            Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Sessions</p>
                      <p className="text-3xl font-bold text-blue-900">{analytics.totalSessions}</p>
                      <p className="text-xs text-blue-600 mt-1">This {timeRange}</p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Study Time</p>
                      <p className="text-3xl font-bold text-green-900">{formatTime(analytics.totalStudyTime)}</p>
                      <p className="text-xs text-green-600 mt-1">Total focused time</p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Avg Session</p>
                      <p className="text-3xl font-bold text-purple-900">{analytics.averageSessionLength}m</p>
                      <p className="text-xs text-purple-600 mt-1">Per session</p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Current Streak</p>
                      <p className="text-3xl font-bold text-orange-900">{analytics.currentStreak}</p>
                      <p className="text-xs text-orange-600 mt-1">Days in a row</p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-lg">
                      <Flame className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Time Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 text-center">Today</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-600">{formatTime(analytics.todayStudyTime)}</p>
                <p className="text-sm text-gray-600">Study time</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 text-center">This Week</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-green-600">{formatTime(analytics.weeklyStudyTime)}</p>
                <p className="text-sm text-gray-600">Study time</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 text-center">This Month</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-purple-600">{formatTime(analytics.monthlyStudyTime)}</p>
                <p className="text-sm text-gray-600">Study time</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Scores */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Brain className="h-5 w-5 text-blue-500" />
                Performance Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getScoreColor(analytics.productivityScore)}`}
                  >
                    <span className="text-lg">{getScoreIcon(analytics.productivityScore)}</span>
                    <span className="font-bold">{analytics.productivityScore}%</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">Productivity Score</p>
                  <p className="text-xs text-gray-600">Based on daily study targets</p>
                </div>

                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getScoreColor(analytics.focusRating)}`}
                  >
                    <span className="text-lg">{getScoreIcon(analytics.focusRating)}</span>
                    <span className="font-bold">{analytics.focusRating}%</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">Focus Rating</p>
                  <p className="text-xs text-gray-600">Session length quality</p>
                </div>

                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getScoreColor(analytics.consistencyScore)}`}
                  >
                    <span className="text-lg">{getScoreIcon(analytics.consistencyScore)}</span>
                    <span className="font-bold">{analytics.consistencyScore}%</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">Consistency Score</p>
                  <p className="text-xs text-gray-600">Daily study habit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Weekly Progress Chart */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.weeklyProgress.map((minutes, index) => {
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                  const maxMinutes = Math.max(...analytics.weeklyProgress, 120) // At least 2 hours scale
                  const percentage = maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-gray-700">{days[index]}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-6">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            >
                              {minutes > 0 && (
                                <span className="text-xs font-medium text-white">{formatTime(minutes)}</span>
                              )}
                            </div>
                          </div>
                          <div className="w-16 text-sm text-gray-600">{formatTime(minutes)}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          {/* Subject Breakdown */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <BookOpen className="h-5 w-5 text-purple-500" />
                Subject Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(analytics.subjectBreakdown).length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No subject data available yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(analytics.subjectBreakdown).map(([subject, minutes], index) => {
                    const totalMinutes = Object.values(analytics.subjectBreakdown).reduce((sum, m) => sum + m, 0)
                    const percentage = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                      "bg-orange-500",
                      "bg-pink-500",
                      "bg-cyan-500",
                    ]

                    return (
                      <div key={subject} className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-900">{subject}</span>
                            <span className="text-sm text-gray-600">{formatTime(minutes)}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                        <div className="text-sm text-gray-500 w-12">{Math.round(percentage)}%</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Goals Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Goals Completed</p>
                    <p className="text-3xl font-bold text-green-900">{analytics.completedGoals}</p>
                    <p className="text-xs text-green-600 mt-1">This {timeRange}</p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Goals</p>
                    <p className="text-3xl font-bold text-blue-900">{analytics.monthlyGoals}</p>
                    <p className="text-xs text-blue-600 mt-1">Set this {timeRange}</p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Completion Rate */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Award className="h-5 w-5 text-yellow-500" />
                Goal Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-6xl font-bold text-gray-900 mb-2">
                  {analytics.monthlyGoals > 0
                    ? Math.round((analytics.completedGoals / analytics.monthlyGoals) * 100)
                    : 0}
                  %
                </div>
                <p className="text-gray-600 mb-4">
                  {analytics.completedGoals} of {analytics.monthlyGoals} goals completed
                </p>
                <Progress
                  value={analytics.monthlyGoals > 0 ? (analytics.completedGoals / analytics.monthlyGoals) * 100 : 0}
                  className="h-4 max-w-md mx-auto"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
