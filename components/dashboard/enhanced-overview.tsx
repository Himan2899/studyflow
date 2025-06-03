"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { EnhancedStudySessionModal } from "@/components/modals/enhanced-study-session-modal"
import { EnhancedGoalModal } from "@/components/modals/enhanced-goal-modal"
import { EnhancedScheduleModal } from "@/components/modals/enhanced-schedule-modal"
import { EnhancedAnimatedBackground } from "@/components/ui/enhanced-animated-background"
import { ActiveSession } from "@/components/study-session/active-session"
import { GoalDisplay } from "@/components/goals/goal-display"
import { ScheduleDisplay } from "@/components/schedule/schedule-display"
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
  Sparkles,
  Users,
  Headphones,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AIAssistantModal } from "@/components/modals/ai-assistant-modal"
import { QuickPomodoroModal } from "@/components/modals/quick-pomodoro-modal"
import { StudyGroupsModal } from "@/components/modals/study-groups-modal"
import { FocusMusicModal } from "@/components/modals/focus-music-modal"
import { StudyAnalyticsModal } from "@/components/modals/study-analytics-modal"
import { AboutCreator } from "@/components/about/about-creator"

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

interface ActiveSessionData {
  title: string
  subject: string
  duration: number
  notes?: string
}

export function EnhancedOverview() {
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
  const [aiAssistantModalOpen, setAiAssistantModalOpen] = useState(false)
  const [quickPomodoroModalOpen, setQuickPomodoroModalOpen] = useState(false)
  const [studyGroupsModalOpen, setStudyGroupsModalOpen] = useState(false)
  const [focusMusicModalOpen, setFocusMusicModalOpen] = useState(false)
  const [studyAnalyticsModalOpen, setStudyAnalyticsModalOpen] = useState(false)
  const [goalDisplayOpen, setGoalDisplayOpen] = useState(false)
  const [scheduleDisplayOpen, setScheduleDisplayOpen] = useState(false)
  const [scheduleDisplayData, setScheduleDisplayData] = useState(null)
  const [activeSession, setActiveSession] = useState<ActiveSessionData | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      fetchRealTimeStats()
      // Set up real-time updates
      const interval = setInterval(fetchRealTimeStats, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [user])

  const ensureUserProfile = async () => {
    if (!user) return false

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single()

      if (profileError) {
        // If profile doesn't exist, create it
        if (profileError.code === "PGRST116" || profileError.code === 'PGRST100' || !profile) {
          console.log("Creating user profile...")
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
            study_streak: 0,
            total_study_hours: 0,
            level: 1,
            experience_points: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error creating profile:", JSON.stringify(insertError, null, 2))
            // Don't re-throw here, allow the function to return false
          } else {
            console.log("Profile created successfully")
            return true // Profile created successfully
          }
        } else {
          // Log other profile fetching errors
          console.error("Error checking profile:", JSON.stringify(profileError, null, 2))
        }
        return false // Return false if there was an error and no profile was created
      }

      // If profile exists, return true
      return true
    } catch (error) {
      console.error("Unexpected error ensuring user profile:", JSON.stringify(error, null, 2))
      return false
    }
  }

  const fetchRealTimeStats = async () => {
    if (!user || !user.id) {
      setLoading(false) // Stop loading if no user
      return
    }

    try {
      // Ensure user profile exists before fetching stats
      const profileExists = await ensureUserProfile();
      if (!profileExists) {
        console.error("Failed to ensure user profile exists");
        setLoading(false);
        return;
      }

      // Fetch real-time profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", JSON.stringify(profileError, null, 2))
      } else if (profile) {
        setStats((prev) => ({
          ...prev,
          studyStreak: Number(profile.study_streak) || 0,
          totalStudyHours: Number(profile.total_study_hours) || 0,
          level: Number(profile.level) || 1,
          experiencePoints: Number(profile.experience_points) || 0,
        }))
      }

      // Fetch real-time session data
      const today = new Date().toISOString().split("T")[0]
      const { data: todaySessions, error: sessionsError } = await supabase
        .from("pomodoro_sessions")
        .select("duration_minutes")
        .eq("user_id", user.id)
        .gte("completed_at", `${today}T00:00:00`)
        .lt("completed_at", `${today}T23:59:59`)

      if (sessionsError) {
        console.error("Error fetching sessions:", JSON.stringify(sessionsError, null, 2))
      } else {
        const todayMinutes = todaySessions?.reduce((sum, session) => sum + (Number(session.duration_minutes) || 0), 0) || 0
        const todayHours = Math.round((todayMinutes / 60) * 10) / 10

        setStats((prev) => ({
          ...prev,
          todayStudyTime: todayHours,
          completedSessions: todaySessions?.length || 0,
          weeklyGoalProgress: Math.min((todayHours / 2) * 100, 100), // 2h daily goal
        }))
      }

      // Fetch real-time achievements
      const { count: achievementsCount, error: achievementsError } = await supabase
        .from("achievements")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)

      if (achievementsError) {
        console.error("Error fetching achievements:", JSON.stringify(achievementsError, null, 2))
      } else {
        setStats((prev) => ({
          ...prev,
          achievements: Number(achievementsCount) || 0,
        }))
      }
    } catch (error) {
      console.error("Error fetching real-time stats:", JSON.stringify(error, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const updateUserStats = async (studyMinutes: number) => {
    if (!user || !user.id) {
      console.error("No user or user ID available for updating stats");
      return;
    }
    try {
      const { data: currentProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("total_study_hours, experience_points, level, study_streak")
        .eq("id", user.id)
        .single()

      if (fetchError) {
        console.error("Error fetching current profile:", JSON.stringify(fetchError, null, 2))
        return
      }

      const additionalHours = Math.round((studyMinutes / 60) * 100) / 100
      const newTotalHours = (Number(currentProfile.total_study_hours) || 0) + additionalHours
      const newExperiencePoints = (Number(currentProfile.experience_points) || 0) + studyMinutes
      const newLevel = Math.floor(newExperiencePoints / 100) + 1

      // Update streak logic
      const today = new Date().toISOString().split("T")[0]
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

      const { data: yesterdaySessions } = await supabase
        .from("pomodoro_sessions")
        .select("id")
        .eq("user_id", user.id)
        .gte("completed_at", `${yesterday}T00:00:00`)
        .lt("completed_at", `${yesterday}T23:59:59`)
        .limit(1)

      const newStreak = yesterdaySessions && yesterdaySessions.length > 0 ? (Number(currentProfile.study_streak) || 0) + 1 : 1

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          total_study_hours: Math.round(newTotalHours),
          experience_points: newExperiencePoints,
          level: newLevel,
          study_streak: newStreak,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        console.error("Error updating profile:", JSON.stringify(updateError, null, 2))
      } else {
        console.log("Profile updated successfully")
        // Immediately update local state
        setStats((prev) => ({
          ...prev,
          totalStudyHours: Math.round(newTotalHours),
          experiencePoints: newExperiencePoints,
          level: newLevel,
          studyStreak: newStreak,
        }))
      }
    } catch (error) {
      console.error("Error updating user stats:", JSON.stringify(error, null, 2))
    }
  }

  const handleStartSession = async (sessionData: any) => {
    if (!user || !user.id) {
      throw new Error("No user or user ID available to start session");
    }
    try {
      const profileExists = await ensureUserProfile()
      if (!profileExists) {
        throw new Error("Failed to verify user profile")
      }

      // Start the active session
      setActiveSession({
        title: sessionData.title,
        subject: sessionData.subject,
        duration: sessionData.duration,
        notes: sessionData.notes,
      })

      toast({
        title: "🎯 Study Session Started!",
        description: `${sessionData.title} - ${sessionData.duration} minutes. Stay focused!`,
      })
    } catch (error: any) {
      console.error("Error starting session:", error)
      toast({
        title: "❌ Error",
        description: error.message || "Failed to start study session",
        variant: "destructive",
      })
    }
  }

  const handleSessionComplete = async (completedMinutes: number) => {
    try {
      console.log("Creating pomodoro session for user:", user?.id)

      const sessionRecord = {
        user_id: user?.id,
        duration_minutes: completedMinutes,
        break_duration: Math.floor(completedMinutes / 5),
        subject_id: null,
        completed_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("pomodoro_sessions").insert(sessionRecord).select().single()

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      console.log("Pomodoro session created:", data)

      await updateUserStats(completedMinutes)

      if (stats.completedSessions === 0) {
        await awardAchievement("First Session", "Completed your first study session!", "🎯")
      }

      setActiveSession(null)
      await fetchRealTimeStats() // Refresh stats immediately
    } catch (error: any) {
      console.error("Error completing session:", error)
      toast({
        title: "❌ Error",
        description: error.message || "Failed to save session",
        variant: "destructive",
      })
    }
  }

  const handleSessionStop = () => {
    setActiveSession(null)
  }

  const awardAchievement = async (title: string, description: string, badgeIcon: string) => {
    try {
      if (!user || !user.id) {
        console.error("No user or user ID available for awarding achievement");
        return;
      }
      const { data: existingAchievement } = await supabase
        .from("achievements")
        .select("id")
        .eq("user_id", user?.id)
        .eq("title", title)
        .single()

      if (!existingAchievement) {
        const { error } = await supabase.from("achievements").insert({
          user_id: user?.id,
          title,
          description,
          badge_icon: badgeIcon,
          earned_at: new Date().toISOString(),
        })

        if (error) {
          console.error("Error awarding achievement:", error)
        } else {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${title}: ${description}`,
          })
        }
      }
    } catch (error) {
      console.error("Error awarding achievement:", error)
    }
  }

  const handleCreateGoal = async (goalData: any) => {
    try {
      if (!user || !user.id) {
        console.error("No user or user ID available to create goal");
        return;
      }
      const profileExists = await ensureUserProfile()
      if (!profileExists) {
        throw new Error("Failed to verify user profile")
      }

      console.log("Creating goal for user:", user?.id)
      const goalRecord = {
        user_id: user?.id,
        title: goalData.title,
        description: goalData.description || null,
        goal_type: goalData.goalType,
        target_value: goalData.targetValue,
        current_value: 0,
        deadline: goalData.deadline,
        is_completed: false,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("goals").insert(goalRecord).select().single()

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      console.log("Goal created:", data)

      toast({
        title: "🎯 Goal Created!",
        description: `${goalData.title} - ${goalData.goalType}`,
      })

      // Show goal display
      setGoalDisplayOpen(true)
      await fetchRealTimeStats()
    } catch (error: any) {
      console.error("Error creating goal:", error)
      toast({
        title: "❌ Error",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      })
    }
  }

  const handleCreateSchedule = async (scheduleData: any) => {
    try {
      if (!user || !user.id) {
        console.error("No user or user ID available to create schedule");
        return;
      }
      const profileExists = await ensureUserProfile()
      if (!profileExists) {
        throw new Error("Failed to verify user profile")
      }

      console.log("Creating schedule as a goal for user:", user?.id)
      const goalRecord = {
        user_id: user?.id,
        title: `Schedule: ${scheduleData.title}`,
        description: `Daily study hours: ${scheduleData.dailyHours}, Subjects: ${scheduleData.subjects.join(", ")}. From ${scheduleData.startDate} to ${scheduleData.endDate}`,
        goal_type: "monthly",
        target_value: scheduleData.dailyHours * 7,
        current_value: 0,
        deadline: scheduleData.endDate,
        is_completed: false,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("goals").insert(goalRecord).select().single()

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      console.log("Schedule created as goal:", data)

      toast({
        title: "📅 Schedule Created!",
        description: `${scheduleData.title} - ${scheduleData.dailyHours}h daily`,
      })

      // Show schedule display
      setScheduleDisplayData(scheduleData)
      setScheduleDisplayOpen(true)
      await fetchRealTimeStats()
    } catch (error: any) {
      console.error("Error creating schedule:", error)
      toast({
        title: "❌ Error",
        description: error.message || "Failed to create schedule",
        variant: "destructive",
      })
    }
  }

  // Real-time stat cards with actual data
  const statCards = [
    {
      title: "Study Streak",
      value: `${stats.studyStreak} days`,
      icon: Flame,
      gradient: "from-orange-400 to-red-500",
      textColor: "text-white",
      change: stats.studyStreak > 0 ? `+${Math.min(stats.studyStreak, 2)} from yesterday` : "Start your streak today!",
      emoji: "🔥",
    },
    {
      title: "Total Study Hours",
      value: `${stats.totalStudyHours}h`,
      icon: Clock,
      gradient: "from-blue-400 to-cyan-500",
      textColor: "text-white",
      change: stats.todayStudyTime > 0 ? `+${stats.todayStudyTime}h today` : "No study time today",
      emoji: "⏰",
    },
    {
      title: "Current Level",
      value: `Level ${stats.level}`,
      icon: Star,
      gradient: "from-purple-400 to-pink-500",
      textColor: "text-white",
      change: `${stats.experiencePoints % 100}/100 XP to next level`,
      emoji: "⭐",
    },
    {
      title: "Experience Points",
      value: `${stats.experiencePoints} XP`,
      icon: TrendingUp,
      gradient: "from-green-400 to-emerald-500",
      textColor: "text-white",
      change:
        stats.completedSessions > 0 ? `+${stats.completedSessions * 25} XP today` : "Complete sessions to earn XP",
      emoji: "💎",
    },
  ]

  const quickActions = [
    {
      title: "Start Study Session",
      description: "Begin a focused study session",
      icon: Play,
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      emoji: "📚",
      onClick: () => setStudySessionModalOpen(true),
    },
    {
      title: "Set New Goal",
      description: "Create a new study goal",
      icon: Target,
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
      emoji: "🎯",
      onClick: () => setGoalModalOpen(true),
    },
    {
      title: "Plan Schedule",
      description: "Create your study timetable",
      icon: Calendar,
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700",
      emoji: "📅",
      onClick: () => setScheduleModalOpen(true),
    },
    {
      title: "AI Study Assistant",
      description: "Get personalized study recommendations",
      icon: Brain,
      gradient: "from-pink-500 to-pink-600",
      hoverGradient: "from-pink-600 to-pink-700",
      emoji: "🤖",
      onClick: () => setAiAssistantModalOpen(true),
    },
    {
      title: "Quick Pomodoro",
      description: "Start a 25-minute focus session",
      icon: Timer,
      gradient: "from-orange-500 to-orange-600",
      hoverGradient: "from-orange-600 to-orange-700",
      emoji: "⏲️",
      onClick: () => setQuickPomodoroModalOpen(true),
    },
    {
      title: "Study Analytics",
      description: "View detailed progress insights",
      icon: BarChart3,
      gradient: "from-indigo-500 to-indigo-600",
      hoverGradient: "from-indigo-600 to-indigo-700",
      emoji: "📊",
      onClick: () => setStudyAnalyticsModalOpen(true),
    },
    {
      title: "Study Groups",
      description: "Join or create study groups",
      icon: Users,
      gradient: "from-cyan-500 to-cyan-600",
      hoverGradient: "from-cyan-600 to-cyan-700",
      emoji: "👥",
      onClick: () => setStudyGroupsModalOpen(true),
    },
    {
      title: "Focus Music",
      description: "Play concentration music",
      icon: Headphones,
      gradient: "from-teal-500 to-teal-600",
      hoverGradient: "from-teal-600 to-teal-700",
      emoji: "🎵",
      onClick: () => setFocusMusicModalOpen(true),
    },
  ]

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <EnhancedAnimatedBackground />
        <div className="relative z-10 space-y-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <EnhancedAnimatedBackground />
      <div className="relative z-10 space-y-8 p-4">
        {/* Welcome Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome back, {user?.user_metadata?.full_name || "Student"}! 🎓
              </h1>
              <p className="text-gray-700 mt-2 text-lg md:text-xl">
                {"Let's make today productive and achieve your study goals! ✨"}
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Badge className="text-lg px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                <Rocket className="h-5 w-5 mr-2" />
                Level {stats.level}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card
                  className={`bg-gradient-to-br ${stat.gradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                >
                  <CardContent className="p-4 md:p-6 relative">
                    <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
                      {stat.emoji}
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${stat.textColor} opacity-90`}>{stat.title}</p>
                        <p className={`text-2xl md:text-3xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
                        <p className={`text-xs ${stat.textColor} opacity-75 mt-2`}>{stat.change}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.textColor}`} />
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
            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Activity className="h-5 w-5" />
                  </div>
                  {"Today's Progress"}
                  <span className="text-xl ml-auto">📈</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <div className="flex justify-between text-sm mb-3 text-gray-700 font-medium">
                    <span>Study Time</span>
                    <span className="font-bold text-blue-600">{stats.todayStudyTime}h / 2h</span>
                  </div>
                  <Progress value={(stats.todayStudyTime / 2) * 100} className="h-4 bg-gray-200">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500" />
                  </Progress>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3 text-gray-700 font-medium">
                    <span>Sessions Completed</span>
                    <span className="font-bold text-green-600">{stats.completedSessions}/4</span>
                  </div>
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-4 flex-1 rounded-full transition-all duration-300 ${
                          i < stats.completedSessions
                            ? "bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-semibold shadow-lg"
                    onClick={() => {
                      handleStartSession({
                        title: "Quick Break",
                        duration: 5,
                        subject: "break",
                      })
                    }}
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Take a Break ☕
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
            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  Recent Achievements
                  <span className="text-xl ml-auto">🏆</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {stats.achievements > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">First Steps! 🎉</p>
                          <p className="text-sm text-gray-600">Completed your first session</p>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg">
                        View All Achievements
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🏆</div>
                      <p className="text-gray-600 mb-4 font-medium">
                        Complete your first study session to earn achievements!
                      </p>
                      <Button
                        onClick={() => setStudySessionModalOpen(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
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
          <Card className="bg-white border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
                Quick Actions
                <span className="text-xl ml-auto">⚡</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="h-auto p-6 flex flex-col items-center space-y-3 w-full border-2 border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 group bg-white"
                        onClick={action.onClick}
                      >
                        <div className="relative">
                          <div
                            className={`p-4 rounded-xl bg-gradient-to-r ${action.gradient} group-hover:${action.hoverGradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          >
                            <Icon className="h-8 w-8" />
                          </div>
                          <div className="absolute -top-1 -right-1 text-lg">{action.emoji}</div>
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-gray-800 text-sm">{action.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                        </div>
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Session Overlay */}
        {activeSession && (
          <ActiveSession session={activeSession} onComplete={handleSessionComplete} onStop={handleSessionStop} />
        )}

        {/* Modals */}
        <EnhancedStudySessionModal
          open={studySessionModalOpen}
          onOpenChange={setStudySessionModalOpen}
          onStartSession={handleStartSession}
        />
        <EnhancedGoalModal open={goalModalOpen} onOpenChange={setGoalModalOpen} onCreateGoal={handleCreateGoal} />
        <EnhancedScheduleModal
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
          onCreateSchedule={handleCreateSchedule}
        />
        <AIAssistantModal open={aiAssistantModalOpen} onOpenChange={setAiAssistantModalOpen} userStats={stats} />
        <QuickPomodoroModal
          open={quickPomodoroModalOpen}
          onOpenChange={setQuickPomodoroModalOpen}
          onSessionComplete={handleStartSession}
        />
        <StudyGroupsModal open={studyGroupsModalOpen} onOpenChange={setStudyGroupsModalOpen} />
        <FocusMusicModal open={focusMusicModalOpen} onOpenChange={setFocusMusicModalOpen} />
        <StudyAnalyticsModal open={studyAnalyticsModalOpen} onOpenChange={setStudyAnalyticsModalOpen} />

        {/* About Creator Section */}
        <AboutCreator />

        {/* New Functional Displays */}
        <GoalDisplay open={goalDisplayOpen} onClose={() => setGoalDisplayOpen(false)} />
        {scheduleDisplayData && (
          <ScheduleDisplay
            open={scheduleDisplayOpen}
            onClose={() => setScheduleDisplayOpen(false)}
            scheduleData={scheduleDisplayData}
          />
        )}
      </div>
    </div>
  )
}
