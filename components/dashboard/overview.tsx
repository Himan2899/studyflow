"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { StudySessionModal } from "@/components/modals/study-session-modal"
import { GoalModal } from "@/components/modals/goal-modal"
import { ScheduleModal } from "@/components/modals/schedule-modal"
import { AnimatedBackground } from "@/components/ui/animated-background"
import {
  Calendar,
  Clock,
  Target,
  Trophy,
  TrendingUp,
  Flame,
  Star,
  Play,
  Zap,
  Brain,
  Coffee,
  Timer,
  Award,
  Rocket,
  ChevronRight,
  Activity,
  BarChart3,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Stats {
  studyStreak: number
  totalStudyHours: number
  level: number
  experiencePoints: number
  todayStudyTime: number
  weeklyGoalProgress: number
  completedSessions: number
  achievements: number
}

export function Overview() {
  const [stats, setStats] = useState<Stats>({
    studyStreak: 0,
    totalStudyHours: 0,
    level: 1,
    experiencePoints: 0,
    todayStudyTime: 0,
    weeklyGoalProgress: 0,
    completedSessions: 0,
    achievements: 0,
  })
  const [loading, setLoading] = useState(true)
  const [studySessionModalOpen, setStudySessionModalOpen] = useState(false)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      if (!user?.id) {
        console.error("No user ID available")
        return
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setStats((prev) => ({
          ...prev,
          studyStreak: Number(profile.study_streak) || 0,
          totalStudyHours: Number(profile.total_study_hours) || 0,
          level: Number(profile.level) || 1,
          experiencePoints: Number(profile.experience_points) || 0,
        }))
      }

      // Fetch today's study sessions
      const today = new Date().toISOString().split("T")[0]
      const { data: todaySessions } = await supabase
        .from("study_sessions")
        .select("duration_minutes")
        .eq("user_id", user.id)
        .gte("actual_start", `${today}T00:00:00`)
        .lt("actual_start", `${today}T23:59:59`)
        .eq("status", "completed")

      const todayMinutes = todaySessions?.reduce((sum, session) => sum + (Number(session.duration_minutes) || 0), 0) || 0

      // Fetch achievements count
      const { count: achievementsCount } = await supabase
        .from("achievements")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)

      setStats((prev) => ({
        ...prev,
        todayStudyTime: Math.round((todayMinutes / 60) * 10) / 10,
        completedSessions: todaySessions?.length || 0,
        achievements: Number(achievementsCount) || 0,
        weeklyGoalProgress: Math.min((todayMinutes / 60 / 2) * 100, 100),
      }))
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartSession = async (sessionData: any) => {
    try {
      const { error } = await supabase.from("study_sessions").insert({
        user_id: user?.id,
        title: sessionData.title,
        scheduled_start: new Date().toISOString(),
        scheduled_end: new Date(Date.now() + sessionData.duration * 60000).toISOString(),
        status: "in_progress",
        notes: sessionData.notes,
      })

      if (error) throw error

      toast({
        title: "Study Session Started! 🎯",
        description: `${sessionData.title} - ${sessionData.duration} minutes`,
      })

      fetchStats()
    } catch (error) {
      console.error("Error starting session:", error)
      toast({
        title: "Error",
        description: "Failed to start study session",
        variant: "destructive",
      })
    }
  }

  const handleCreateGoal = async (goalData: any) => {
    try {
      const { error } = await supabase.from("goals").insert({
        user_id: user?.id,
        title: goalData.title,
        description: goalData.description,
        goal_type: goalData.goalType,
        target_value: goalData.targetValue,
        deadline: goalData.deadline,
      })

      if (error) throw error

      toast({
        title: "Goal Created! 🎯",
        description: `${goalData.title} - ${goalData.goalType}`,
      })

      fetchStats()
    } catch (error) {
      console.error("Error creating goal:", error)
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      })
    }
  }

  const handleCreateSchedule = async (scheduleData: any) => {
    try {
      const { error } = await supabase.from("study_plans").insert({
        user_id: user?.id,
        title: scheduleData.title,
        start_date: scheduleData.startDate,
        end_date: scheduleData.endDate,
        description: `Daily study hours: ${scheduleData.dailyHours}, Subjects: ${scheduleData.subjects.join(", ")}`,
      })

      if (error) throw error

      toast({
        title: "Schedule Created! 📅",
        description: `${scheduleData.title} - ${scheduleData.dailyHours}h daily`,
      })

      fetchStats()
    } catch (error) {
      console.error("Error creating schedule:", error)
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive",
      })
    }
  }

  const statCards = [
    {
      title: "Study Streak",
      value: `${stats.studyStreak} days`,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      change: "+2 from yesterday",
    },
    {
      title: "Total Study Hours",
      value: `${stats.totalStudyHours}h`,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      change: "+1.5h this week",
    },
    {
      title: "Current Level",
      value: `Level ${stats.level}`,
      icon: Star,
      color: "text-purple-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      change: "75% to next level",
    },
    {
      title: "Experience Points",
      value: `${stats.experiencePoints} XP`,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      change: "+50 XP today",
    },
  ]

  const quickActions = [
    {
      title: "Start Study Session",
      description: "Begin a focused study session",
      icon: Play,
      color: "from-blue-500 to-blue-600",
      onClick: () => setStudySessionModalOpen(true),
    },
    {
      title: "Set New Goal",
      description: "Create a new study goal",
      icon: Target,
      color: "from-green-500 to-green-600",
      onClick: () => setGoalModalOpen(true),
    },
    {
      title: "Plan Schedule",
      description: "Create your study timetable",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      onClick: () => setScheduleModalOpen(true),
    },
    {
      title: "AI Study Assistant",
      description: "Get personalized study recommendations",
      icon: Brain,
      color: "from-pink-500 to-pink-600",
      onClick: () => toast({ title: "Coming Soon! 🤖", description: "AI Assistant will be available soon" }),
    },
    {
      title: "Quick Pomodoro",
      description: "Start a 25-minute focus session",
      icon: Timer,
      color: "from-orange-500 to-orange-600",
      onClick: () => toast({ title: "Pomodoro Started! ⏰", description: "25 minutes of focused study time" }),
    },
    {
      title: "Study Analytics",
      description: "View detailed progress insights",
      icon: BarChart3,
      color: "from-indigo-500 to-indigo-600",
      onClick: () => toast({ title: "Analytics! 📊", description: "Detailed insights coming soon" }),
    },
  ]

  if (loading) {
    return (
      <div className="relative">
        <AnimatedBackground />
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="relative z-10 space-y-8">
        {/* Welcome Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.user_metadata?.full_name || "Student"}! 🎓
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                {"Let's make today productive and achieve your study goals."}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Rocket className="h-4 w-4 mr-2" />
              Level {stats.level}
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className={`hover:shadow-xl transition-all duration-300 ${stat.bgColor} border-0`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-4 rounded-full bg-white/50 dark:bg-gray-800/50`}>
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Today's Progress & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  {"Today's Progress"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Study Time</span>
                    <span className="font-semibold">{stats.todayStudyTime}h / 2h</span>
                  </div>
                  <Progress value={(stats.todayStudyTime / 2) * 100} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sessions Completed</span>
                    <span className="font-semibold">{stats.completedSessions}/4</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-3 flex-1 rounded-full ${
                          i < stats.completedSessions ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <Button size="sm" className="w-full">
                    <Coffee className="h-4 w-4 mr-2" />
                    Take a Break
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.achievements > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-medium">First Steps!</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Completed your first session</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Achievements
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Trophy className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 mb-3">
                        Complete your first study session to earn achievements!
                      </p>
                      <Button size="sm" onClick={() => setStudySessionModalOpen(true)}>
                        Start First Session
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="h-auto p-6 flex flex-col items-start space-y-2 w-full hover:shadow-lg transition-all duration-300 group"
                        onClick={action.onClick}
                      >
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                        </div>
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Modals */}
        <StudySessionModal
          open={studySessionModalOpen}
          onOpenChange={setStudySessionModalOpen}
          onStartSession={handleStartSession}
        />
        <GoalModal open={goalModalOpen} onOpenChange={setGoalModalOpen} onCreateGoal={handleCreateGoal} />
        <ScheduleModal
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
          onCreateSchedule={handleCreateSchedule}
        />
      </div>
    </div>
  )
}
