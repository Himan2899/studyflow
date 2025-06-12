"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Play,
  Sun,
  Moon,
  Plus,
  CheckCircle2,
  Timer,
  BarChart3,
  Zap,
  Pause,
  RotateCcw,
  Trash2,
  User,
  LogOut,
  Mail,
  Eye,
  EyeOff,
  Headphones,
  Brain,
  X,
  Volume2,
  SkipBack,
  SkipForward,
  ChevronDown,
  Lightbulb,
  Calculator,
  Beaker,
  Palette,
  Music,
  Atom,
  Code,
  Globe,
  Settings,
  Info,
  Heart,
  GraduationCap,
} from "lucide-react"
import Image from "next/image"

// Types
interface StudySession {
  id: string
  subject: string
  duration: number
  date: Date
  type: "focus" | "break"
  userId?: string
}

interface Goal {
  id: string
  title: string
  type: string
  target: number
  current: number
  deadline: Date
  description: string
  completed: boolean
  color: string
  userId?: string
}

interface StudySchedule {
  id: string
  title: string
  startDate: Date
  endDate: Date
  dailyHours: number
  subjects: string[]
  userId?: string
}

interface StudyBlock {
  id: string
  subject: string
  topic: string
  startTime: string
  endTime: string
  day: string
  color: string
  userId?: string
}

interface Task {
  id: string
  title: string
  subject: string
  priority: "high" | "medium" | "low"
  completed: boolean
  dueTime: string
  userId?: string
}

interface UserType {
  id: string
  email: string
  name: string
  verified: boolean
}

interface MusicTrack {
  id: string
  title: string
  category: string
  duration: string
  isPlaying: boolean
}

// Animated Notebook Component - Fixed for SSR
const AnimatedNotebook = ({ delay = 0, direction = 1 }) => {
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })

      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <motion.div
      className="absolute opacity-10"
      initial={{
        x: direction > 0 ? -100 : windowSize.width + 100,
        y: Math.random() * windowSize.height,
        rotate: Math.random() * 360,
      }}
      animate={{
        x: direction > 0 ? windowSize.width + 100 : -100,
        y: Math.random() * windowSize.height,
        rotate: Math.random() * 360 + 360,
      }}
      transition={{
        duration: 20 + Math.random() * 10,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      <div className="w-16 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg shadow-lg transform rotate-12">
        <div className="w-full h-2 bg-red-400 rounded-t-lg"></div>
        <div className="p-2 space-y-1">
          <div className="w-full h-1 bg-gray-300 rounded"></div>
          <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
          <div className="w-full h-1 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
        </div>
      </div>
    </motion.div>
  )
}

const colors = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-teal-500 to-blue-500",
]

const goalTypes = [
  "Daily Study Hours",
  "Weekly Study Hours",
  "Monthly Study Hours",
  "Complete Courses",
  "Read Books",
  "Practice Problems",
  "Study Sessions",
  "Custom Goal",
]

const subjects = [
  { name: "Mathematics", icon: Calculator, color: "from-blue-500 to-purple-500" },
  { name: "Science", icon: Beaker, color: "from-green-500 to-emerald-500" },
  { name: "English", icon: BookOpen, color: "from-red-500 to-pink-500" },
  { name: "History", icon: Globe, color: "from-yellow-500 to-orange-500" },
  { name: "Programming", icon: Code, color: "from-purple-500 to-indigo-500" },
  { name: "Art", icon: Palette, color: "from-pink-500 to-rose-500" },
  { name: "Music", icon: Music, color: "from-cyan-500 to-blue-500" },
  { name: "Physics", icon: Atom, color: "from-orange-500 to-red-500" },
]

const musicCategories = ["All", "Nature Sounds", "Instrumental", "Classical", "Ambient"]

const musicTracks: MusicTrack[] = [
  { id: "1", title: "Forest Rain", category: "Nature Sounds", duration: "60:00", isPlaying: false },
  { id: "2", title: "Ocean Waves", category: "Nature Sounds", duration: "45:00", isPlaying: false },
  { id: "3", title: "Lo-Fi Study Beats", category: "Instrumental", duration: "120:00", isPlaying: false },
  { id: "4", title: "Classical Piano", category: "Classical", duration: "90:00", isPlaying: false },
  { id: "5", title: "Ambient Space", category: "Ambient", duration: "75:00", isPlaying: false },
]

export default function StudyFlowApp() {
  // Auth States
  const [user, setUser] = useState<UserType | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // App States
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [focusDuration, setFocusDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [showTimerSettings, setShowTimerSettings] = useState(false)
  const [showAboutCreator, setShowAboutCreator] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Data States
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [schedules, setSchedules] = useState<StudySchedule[]>([])
  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  // Timer States
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentSession, setCurrentSession] = useState<"focus" | "break">("focus")

  // Modal States
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showFocusMusic, setShowFocusMusic] = useState(false)
  const [showAddBlock, setShowAddBlock] = useState(false)

  // AI States
  const [aiQuestion, setAiQuestion] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [showRecommendations, setShowRecommendations] = useState(false)

  // Music States
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load data from localStorage
  useEffect(() => {
    if (!isClient) return

    const savedUser = localStorage.getItem("studyflow_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const savedSessions = localStorage.getItem("studyflow_sessions")
    if (savedSessions) {
      setStudySessions(JSON.parse(savedSessions).map((s: any) => ({ ...s, date: new Date(s.date) })))
    }

    const savedGoals = localStorage.getItem("studyflow_goals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals).map((g: any) => ({ ...g, deadline: new Date(g.deadline) })))
    }

    const savedSchedules = localStorage.getItem("studyflow_schedules")
    if (savedSchedules) {
      setSchedules(
        JSON.parse(savedSchedules).map((s: any) => ({
          ...s,
          startDate: new Date(s.startDate),
          endDate: new Date(s.endDate),
        })),
      )
    }

    const savedBlocks = localStorage.getItem("studyflow_blocks")
    if (savedBlocks) {
      setStudyBlocks(JSON.parse(savedBlocks))
    }

    const savedTasks = localStorage.getItem("studyflow_tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [isClient])

  // Save data to localStorage
  useEffect(() => {
    if (!isClient) return
    localStorage.setItem("studyflow_sessions", JSON.stringify(studySessions))
  }, [studySessions, isClient])

  useEffect(() => {
    if (!isClient) return
    localStorage.setItem("studyflow_goals", JSON.stringify(goals))
  }, [goals, isClient])

  useEffect(() => {
    if (!isClient) return
    localStorage.setItem("studyflow_schedules", JSON.stringify(schedules))
  }, [schedules, isClient])

  useEffect(() => {
    if (!isClient) return
    localStorage.setItem("studyflow_blocks", JSON.stringify(studyBlocks))
  }, [studyBlocks, isClient])

  useEffect(() => {
    if (!isClient) return
    localStorage.setItem("studyflow_tasks", JSON.stringify(tasks))
  }, [tasks, isClient])

  // Pomodoro Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      handlePomodoroComplete()
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, pomodoroTime])

  // Auth Functions
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    setEmailSent(true)
    setTimeout(() => {
      const newUser: UserType = {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
        verified: true,
      }
      setUser(newUser)
      if (isClient) {
        localStorage.setItem("studyflow_user", JSON.stringify(newUser))
      }
      setShowAuth(false)
      setEmailSent(false)
    }, 3000)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    setEmailSent(true)
    setTimeout(() => {
      const newUser: UserType = {
        id: Date.now().toString(),
        email,
        name,
        verified: true,
      }
      setUser(newUser)
      if (isClient) {
        localStorage.setItem("studyflow_user", JSON.stringify(newUser))
      }
      setShowAuth(false)
      setEmailSent(false)
    }, 3000)
  }

  const handleSignOut = () => {
    setUser(null)
    if (isClient) {
      localStorage.removeItem("studyflow_user")
    }
  }

  // App Functions
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (isClient) {
      if (newMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  const handlePomodoroComplete = () => {
    setIsTimerRunning(false)
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: "Focus Session",
      duration: currentSession === "focus" ? focusDuration : breakDuration,
      date: new Date(),
      type: currentSession,
      userId: user?.id,
    }
    setStudySessions((prev) => [newSession, ...prev])

    if (currentSession === "focus") {
      setCurrentSession("break")
      setPomodoroTime(breakDuration * 60)
    } else {
      setCurrentSession("focus")
      setPomodoroTime(focusDuration * 60)
    }
  }

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning)
  const resetTimer = () => {
    setIsTimerRunning(false)
    setPomodoroTime(currentSession === "focus" ? focusDuration * 60 : breakDuration * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const addGoal = (title: string, type: string, target: number, deadline: Date, description: string) => {
    if (!title || !type || !target || !deadline) {
      alert("Please fill in all required fields")
      return
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      type,
      target,
      current: 0,
      deadline,
      description,
      completed: false,
      color: colors[Math.floor(Math.random() * colors.length)],
      userId: user?.id,
    }
    setGoals((prev) => [...prev, newGoal])
    setShowAddGoal(false)

    // Show success message
    setTimeout(() => {
      alert(`Goal "${title}" created successfully!`)
    }, 100)
  }

  const addSchedule = (
    title: string,
    startDate: Date,
    endDate: Date,
    dailyHours: number,
    selectedSubjects: string[],
  ) => {
    if (!title || !startDate || !endDate || !dailyHours || selectedSubjects.length === 0) return

    const newSchedule: StudySchedule = {
      id: Date.now().toString(),
      title,
      startDate,
      endDate,
      dailyHours,
      subjects: selectedSubjects,
      userId: user?.id,
    }
    setSchedules((prev) => [...prev, newSchedule])

    // Create study blocks for each selected subject
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const newBlocks: StudyBlock[] = []

    selectedSubjects.forEach((subject, index) => {
      const day = days[index % days.length]
      const startHour = 9 + (index % 8) // Distribute between 9 AM and 4 PM

      const newBlock: StudyBlock = {
        id: Date.now().toString() + index,
        subject,
        topic: `${subject} Study`,
        startTime: `${startHour}:00`,
        endTime: `${startHour + 1}:30`,
        day,
        color: colors[index % colors.length],
        userId: user?.id,
      }

      newBlocks.push(newBlock)
    })

    setStudyBlocks((prev) => [...prev, ...newBlocks])
    setShowAddSchedule(false)
    setCurrentPage("timetable")
  }

  // Task Functions
  const addTask = (title: string, subject: string, priority: "high" | "medium" | "low", dueTime: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      subject,
      priority,
      dueTime,
      completed: false,
      userId: user?.id,
    }
    setTasks((prev) => [...prev, newTask])
    setShowAddTask(false)
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  // AI Functions
  const handleAIQuestion = () => {
    if (!aiQuestion.trim()) return

    // Simulate AI response
    const responses = [
      "Consider studying Mathematics in the morning when your focus is highest, based on your completion patterns.",
      "Try the Pomodoro technique with 25-minute focused sessions followed by 5-minute breaks for better retention.",
      "Based on your study history, I recommend reviewing previous topics before starting new ones.",
      "Your most productive study time appears to be between 9 AM and 11 AM. Schedule important subjects during this window.",
    ]

    setAiResponse(responses[Math.floor(Math.random() * responses.length)])
    setAiQuestion("")
  }

  const generateRecommendations = () => {
    setShowRecommendations(true)
  }

  // Music Functions
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const quickActions = [
    {
      title: "Start Study Session",
      description: "Begin a focused study session",
      icon: Play,
      color: "from-blue-500 to-purple-500",
      action: () => setCurrentPage("timer"),
    },
    {
      title: "Set New Goal",
      description: "Create a new study goal",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      action: () => setShowAddGoal(true),
    },
    {
      title: "Plan Schedule",
      description: "Create your study timetable",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      action: () => setShowAddSchedule(true),
    },
    {
      title: "AI Study Assistant",
      description: "Get personalized study recommendations",
      icon: Brain,
      color: "from-pink-500 to-red-500",
      action: () => setShowAIAssistant(true),
    },
    {
      title: "Quick Pomodoro",
      description: "Start a 25-minute focus session",
      icon: Timer,
      color: "from-orange-500 to-red-500",
      action: () => {
        setCurrentPage("timer")
        setIsTimerRunning(true)
      },
    },
    {
      title: "Study Analytics",
      description: "View detailed progress insights",
      icon: BarChart3,
      color: "from-purple-500 to-indigo-500",
      action: () => setCurrentPage("progress"),
    },
    {
      title: "Focus Music",
      description: "Play concentration music",
      icon: Headphones,
      color: "from-teal-500 to-green-500",
      action: () => setShowFocusMusic(true),
    },
  ]

  const filteredTracks =
    selectedCategory === "All" ? musicTracks : musicTracks.filter((track) => track.category === selectedCategory)

  const todaysHours = studySessions.reduce((total, session) => {
    const today = new Date()
    if (
      session.date.getDate() === today.getDate() &&
      session.date.getMonth() === today.getMonth() &&
      session.date.getFullYear() === today.getFullYear()
    ) {
      return total + session.duration / 60
    }
    return total
  }, 0)

  const todaysSessions = studySessions.filter((session) => {
    const today = new Date()
    return (
      session.date.getDate() === today.getDate() &&
      session.date.getMonth() === today.getMonth() &&
      session.date.getFullYear() === today.getFullYear()
    )
  })

  const completedGoals = goals.filter((goal) => goal.completed).length

  const completedTasks = tasks.filter((task) => task.completed).length

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            StudyFlow
          </h1>
          <p className="text-gray-600">Loading your study companion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-500 relative overflow-hidden">
      {/* Animated Background Notebooks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <AnimatedNotebook key={i} delay={i * 2} direction={i % 2 === 0 ? 1 : -1} />
      ))}

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-purple-200 dark:border-purple-800"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <BookOpen className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  StudyFlow
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Your intelligent study companion ✨</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAboutCreator(true)}
                  className="rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-white hover:from-purple-500 hover:to-blue-500"
                >
                  <Info className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500"
                >
                  <motion.div animate={{ rotate: isDarkMode ? 180 : 0 }} transition={{ duration: 0.5 }}>
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.div>
                </Button>
              </motion.div>

              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">Welcome, {user.name}!</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-6 py-4"
      >
        <div className="flex space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-3 border border-purple-200 dark:border-purple-700 shadow-xl">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "from-purple-500 to-pink-500" },
            { id: "timer", label: "Timer", icon: Timer, color: "from-red-500 to-orange-500" },
            { id: "timetable", label: "Timetable", icon: Calendar, color: "from-blue-500 to-cyan-500" },
            { id: "progress", label: "Progress", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
            { id: "goals", label: "Goals", icon: Target, color: "from-indigo-500 to-purple-500" },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 font-medium ${
                currentPage === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <motion.div animate={{ rotate: currentPage === item.id ? 360 : 0 }} transition={{ duration: 0.5 }}>
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-8">
        <AnimatePresence mode="wait">
          {currentPage === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <motion.div className="text-center py-8">
                <motion.h2
                  className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  {user ? `Welcome back, ${user.name}! 🎓` : "Welcome to StudyFlow! 🎓"}
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 dark:text-gray-300"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  Ready to conquer your studies today?
                </motion.p>
              </motion.div>

              {/* Quick Actions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-xl">
                    <CardTitle className="flex items-center space-x-2 text-2xl">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Zap className="w-8 h-8" />
                      </motion.div>
                      <span>Quick Actions</span>
                      <motion.span
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        ✨
                      </motion.span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.title}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={action.action}
                          className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <motion.div
                            className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                          >
                            <action.icon className="w-8 h-8 text-white" />
                          </motion.div>
                          <h3 className="font-bold text-gray-800 dark:text-white mb-2">{action.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Live Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  {
                    title: "Today's Focus",
                    value: `${todaysHours.toFixed(1)}h`,
                    icon: Clock,
                    color: "from-blue-500 to-cyan-500",
                    change: `${todaysSessions.length} sessions`,
                  },
                  {
                    title: "Active Goals",
                    value: `${goals.length}`,
                    icon: Target,
                    color: "from-green-500 to-emerald-500",
                    change: `${completedGoals} completed`,
                  },
                  {
                    title: "Study Streak",
                    value: `${Math.floor(todaysHours)}`,
                    icon: Zap,
                    color: "from-orange-500 to-red-500",
                    change: "Keep it up!",
                  },
                  {
                    title: "Tasks Done",
                    value: `${completedTasks}/${tasks.length}`,
                    icon: CheckCircle2,
                    color: "from-purple-500 to-pink-500",
                    change: tasks.length > 0 ? `${Math.round((completedTasks / tasks.length) * 100)}%` : "0%",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10`}
                        animate={{ opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      />
                      <CardContent className="p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <motion.div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <stat.icon className="w-7 h-7 text-white" />
                          </motion.div>
                          <motion.div
                            className="text-right"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <p className="text-3xl font-bold">{stat.value}</p>
                          </motion.div>
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{stat.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.change}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Live Tasks */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <span>Live Tasks</span>
                      </div>
                      <Button
                        onClick={() => setShowAddTask(true)}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Task
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        </motion.div>
                        <p className="text-gray-500">No tasks yet. Add your first task to get started!</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {tasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-xl transition-all duration-300 ${
                              task.completed
                                ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700"
                                : "bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => toggleTask(task.id)}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    task.completed
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-300 hover:border-green-400"
                                  }`}
                                >
                                  {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </motion.button>
                                <div>
                                  <h4 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                                    {task.title}
                                  </h4>
                                  <p className="text-sm text-gray-500">{task.subject}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    task.priority === "high"
                                      ? "destructive"
                                      : task.priority === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {task.priority}
                                </Badge>
                                <span className="text-sm text-gray-500">{task.dueTime}</span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => deleteTask(task.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Timer Page */}
          {currentPage === "timer" && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <motion.h2
                className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Pomodoro Timer 🍅
              </motion.h2>

              <div className="max-w-2xl mx-auto">
                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                  <CardContent className="p-12">
                    <div className="text-center space-y-8">
                      <motion.div
                        animate={{ scale: isTimerRunning ? [1, 1.02, 1] : 1 }}
                        transition={{ duration: 1, repeat: isTimerRunning ? Number.POSITIVE_INFINITY : 0 }}
                      >
                        <Badge
                          className={`px-6 py-3 text-lg ${
                            currentSession === "focus"
                              ? "bg-gradient-to-r from-red-500 to-pink-500"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                          } text-white border-0`}
                        >
                          {currentSession === "focus" ? "Focus Time" : "Break Time"}
                        </Badge>
                      </motion.div>

                      <motion.div
                        className="relative"
                        animate={{
                          scale: isTimerRunning ? [1, 1.05, 1] : 1,
                          y: isTimerRunning ? [0, -10, 0] : 0,
                        }}
                        transition={{
                          duration: 2,
                          repeat: isTimerRunning ? Number.POSITIVE_INFINITY : 0,
                          ease: "easeInOut",
                        }}
                      >
                        <div
                          className={`w-80 h-80 mx-auto rounded-full bg-gradient-to-r ${
                            currentSession === "focus" ? "from-red-500 to-pink-500" : "from-green-500 to-emerald-500"
                          } p-4 shadow-2xl`}
                        >
                          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <div className="text-center">
                              <motion.p
                                className="text-6xl font-bold text-gray-800 dark:text-white"
                                key={pomodoroTime}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                              >
                                {formatTime(pomodoroTime)}
                              </motion.p>
                              <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
                                {currentSession === "focus" ? "Stay focused!" : "Take a break!"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <div className="flex justify-center space-x-6">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={toggleTimer}
                            size="lg"
                            className={`px-8 py-4 text-lg bg-gradient-to-r ${
                              currentSession === "focus" ? "from-red-500 to-pink-500" : "from-green-500 to-emerald-500"
                            } hover:opacity-90 text-white shadow-xl`}
                          >
                            {isTimerRunning ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
                            {isTimerRunning ? "Pause" : "Start"}
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={resetTimer} variant="outline" size="lg" className="px-8 py-4 text-lg">
                            <RotateCcw className="w-6 h-6 mr-2" />
                            Reset
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => setShowTimerSettings(true)}
                            variant="outline"
                            size="lg"
                            className="px-8 py-4 text-lg"
                          >
                            <Settings className="w-6 h-6 mr-2" />
                            Settings
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Progress/Analytics Page */}
          {currentPage === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-xl">
                  <CardTitle className="flex items-center space-x-2 text-2xl">
                    <BarChart3 className="w-8 h-8" />
                    <span>Study Analytics</span>
                    <motion.span
                      animate={{ rotate: [0, 20, -20, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      ✨
                    </motion.span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-12">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">
                      Study Analytics{" "}
                      <span className="text-2xl" role="img" aria-label="chart">
                        📊
                      </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
                      Track your progress and optimize your learning
                    </p>

                    {studySessions.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                            <BarChart3 className="w-16 h-16 text-white" />
                          </div>
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-4">No Study Data Yet</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                          Complete your first study session to see detailed analytics and insights about your learning
                          progress.
                        </p>
                        <Button
                          onClick={() => setCurrentPage("timer")}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 text-lg"
                        >
                          Start Your First Session
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6">
                          <h3 className="text-lg font-semibold mb-2">Total Sessions</h3>
                          <p className="text-3xl font-bold text-purple-600">{studySessions.length}</p>
                        </Card>
                        <Card className="p-6">
                          <h3 className="text-lg font-semibold mb-2">Total Hours</h3>
                          <p className="text-3xl font-bold text-blue-600">
                            {(studySessions.reduce((total, session) => total + session.duration, 0) / 60).toFixed(1)}h
                          </p>
                        </Card>
                        <Card className="p-6">
                          <h3 className="text-lg font-semibold mb-2">Average Session</h3>
                          <p className="text-3xl font-bold text-green-600">
                            {(
                              studySessions.reduce((total, session) => total + session.duration, 0) /
                              studySessions.length
                            ).toFixed(0)}
                            min
                          </p>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Timetable Page */}
          {currentPage === "timetable" && (
            <motion.div
              key="timetable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <motion.h2
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Study Timetable 📅
              </motion.h2>

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Weekly Schedule</h3>
                <Button onClick={() => setShowAddSchedule(true)} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Schedule
                </Button>
              </div>

              {/* Timetable Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, dayIndex) => (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIndex * 0.1 }}
                  >
                    <Card className="h-full border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-center text-lg font-bold">{day}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {studyBlocks
                          .filter((block) => block.day === day)
                          .map((block, blockIndex) => (
                            <motion.div
                              key={block.id}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: blockIndex * 0.1 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              className={`p-3 rounded-xl bg-gradient-to-r ${block.color} text-white shadow-lg relative group`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-sm">{block.subject}</h4>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setStudyBlocks((prev) => prev.filter((b) => b.id !== block.id))
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                              <p className="text-xs opacity-90 mb-2">{block.topic}</p>
                              <div className="flex items-center space-x-1 text-xs">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {block.startTime} - {block.endTime}
                                </span>
                              </div>
                            </motion.div>
                          ))}

                        {studyBlocks.filter((block) => block.day === day).length === 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 text-gray-400 dark:text-gray-600"
                          >
                            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No study blocks</p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Add Block Button */}
              <div className="flex justify-center mt-8">
                <Button onClick={() => setShowAddBlock(true)} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Individual Block
                </Button>
              </div>
            </motion.div>
          )}

          {/* Goals Page */}
          {currentPage === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  Goals Manager 🎯
                </motion.h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowAddGoal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                </motion.div>
              </div>

              {/* Goals List */}
              {goals.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                      <Target className="w-16 h-16 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">No Goals Yet</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    Set your first study goal to start tracking your progress and stay motivated!
                  </p>
                  <Button
                    onClick={() => setShowAddGoal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 text-lg"
                  >
                    Create Your First Goal
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        goal.completed
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-xl"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-bold">{goal.title}</h3>
                            {goal.completed && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                              >
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{goal.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                            <span>Type: {goal.type}</span>
                            <span>Due: {goal.deadline.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setGoals(goals.filter((g) => g.id !== goal.id))}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {goal.current} / {goal.target}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <motion.div
                              className={`h-3 rounded-full bg-gradient-to-r ${goal.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((goal.current / goal.target) * 100)}% complete
                        </div>

                        {/* Update Progress */}
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
                                    setGoals(
                                      goals.map((g) =>
                                        g.id === goal.id ? { ...g, current: value, completed: value >= g.target } : g,
                                      ),
                                    )
                                    ;(e.target as HTMLInputElement).value = ""
                                  }
                                }
                              }}
                            />
                            <span className="text-xs text-gray-500">/ {goal.target}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Goal Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold">{goals.filter((g) => g.completed).length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed Goals</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold">{goals.filter((g) => !g.completed).length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Goals</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold">
                      {goals.length > 0
                        ? Math.round((goals.filter((g) => g.completed).length / goals.length) * 100)
                        : 0}
                      %
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Other Pages Placeholder */}
          {currentPage !== "dashboard" &&
            currentPage !== "timer" &&
            currentPage !== "progress" &&
            currentPage !== "timetable" &&
            currentPage !== "goals" && (
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Feature
                </motion.h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  This feature is coming soon! Try the Dashboard and Timer for now.
                </p>
              </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* About Creator Modal */}
      <AnimatePresence>
        {showAboutCreator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAboutCreator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAboutCreator(false)}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Profile Card Content */}
              <div className="p-6 space-y-6">
                {/* Header with Profile Image */}
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src="/images/himanshu-profile.jpg"
                        alt="Himanshu Bali"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Himanshu_Bali</h2>
                      <span className="text-lg">🚀</span>
                    </div>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                      Aspiring Computer Science Engineer
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      Passionate About Technology & Innovation 💡
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    I am currently pursuing my{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Bachelor of Technology (BTech) in Computer Science Engineering
                    </span>
                    , with a strong passion for technology and problem-solving. My academic journey is equipping me with
                    a solid foundation in programming languages like{" "}
                    <span className="font-semibold text-blue-600">C++</span>,{" "}
                    <span className="font-semibold text-orange-600">Java</span>, and{" "}
                    <span className="font-semibold text-purple-600">Python</span>, as well as a growing understanding of
                    data structures, algorithms, and software development.
                  </p>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center border border-purple-200 dark:border-purple-700">
                    <div className="text-purple-600 dark:text-purple-400 font-bold text-lg">C++</div>
                    <div className="text-purple-500 dark:text-purple-400 text-xs">Programming</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center border border-green-200 dark:border-green-700">
                    <div className="text-green-600 dark:text-green-400 font-bold text-lg">Java</div>
                    <div className="text-green-500 dark:text-green-400 text-xs">Development</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center border border-purple-200 dark:border-purple-700">
                    <div className="text-purple-600 dark:text-purple-400 font-bold text-lg">Python</div>
                    <div className="text-purple-500 dark:text-purple-400 text-xs">AI & ML</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center border border-orange-200 dark:border-orange-700">
                    <div className="text-orange-600 dark:text-orange-400 font-bold text-lg">DSA</div>
                    <div className="text-orange-500 dark:text-orange-400 text-xs">Algorithms</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs">
                    <GraduationCap className="w-3 h-3" />
                    <span>BTech CSE Student</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs">
                    <Lightbulb className="w-3 h-3" />
                    <span>Innovation Enthusiast</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs">
                    <Heart className="w-3 h-3" />
                    <span>Healthcare Tech</span>
                  </div>
                </div>

                {/* Get In Touch Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Get In Touch</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Email</div>
                      <div className="text-blue-600 dark:text-blue-400 text-sm">himanshuofficialuserid@gmail.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All other modals remain the same... */}
      {/* Auth Modal, Add Goal Modal, Add Schedule Modal, etc. */}
      {/* I'll include the remaining modals for completeness */}

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  StudyFlow
                </h1>
                <p className="text-gray-600 dark:text-gray-300">Your intelligent study companion ✨</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-center mb-2">
                  {authMode === "signin" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  {authMode === "signin" ? "Sign in to your study scheduler account" : "Join StudyFlow today"}
                </p>

                {emailSent ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 dark:text-green-300 font-medium">
                      Confirmation email sent! Please check your inbox and click the confirmation link.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={authMode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
                    {authMode === "signup" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input name="name" placeholder="Your full name" required />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 text-lg font-medium"
                    >
                      {authMode === "signin" ? "Sign In" : "Create Account"}
                    </Button>
                  </form>
                )}

                <div className="text-center mt-6">
                  <button
                    onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {authMode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white relative">
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Set New Goal</h2>
                </div>
                <div className="absolute top-4 right-12">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🏆</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target as HTMLFormElement)
                    const title = formData.get("title") as string
                    const type = formData.get("type") as string
                    const target = Number.parseInt(formData.get("target") as string)
                    const deadline = new Date(formData.get("deadline") as string)
                    const description = formData.get("description") as string

                    if (title && type && target && deadline) {
                      addGoal(title, type, target, deadline, description)
                    }
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">Goal Title</label>
                    <Input
                      name="title"
                      placeholder="e.g., Study 2 hours daily"
                      className="border-2 border-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Goal Type</label>
                    <div className="relative">
                      <select
                        name="type"
                        className="w-full p-3 border-2 border-gray-200 rounded-xl dark:bg-gray-700 dark:border-gray-600 appearance-none"
                        required
                      >
                        <option value="">Select goal type</option>
                        {goalTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Value</label>
                      <Input
                        name="target"
                        type="number"
                        placeholder="e.g., 2"
                        className="border-2 border-gray-200 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Deadline</label>
                      <Input
                        name="deadline"
                        type="date"
                        className="border-2 border-gray-200 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description (optional)</label>
                    <Textarea
                      name="description"
                      placeholder="Describe your goal in detail. What motivates you to achieve this?"
                      className="border-2 border-gray-200 focus:border-green-500 min-h-[100px]"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddGoal(false)}
                      className="flex-1 py-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3"
                    >
                      Create Goal
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Schedule Modal */}
      <AnimatePresence>
        {showAddSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddSchedule(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
                <button
                  onClick={() => setShowAddSchedule(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Plan Study Schedule</h2>
                </div>
                <div className="absolute top-4 right-12">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target as HTMLFormElement)
                    const selectedSubjects = Array.from(formData.getAll("subjects")) as string[]
                    addSchedule(
                      formData.get("title") as string,
                      new Date(formData.get("startDate") as string),
                      new Date(formData.get("endDate") as string),
                      Number.parseInt(formData.get("dailyHours") as string),
                      selectedSubjects,
                    )
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">Schedule Title</label>
                    <Input
                      name="title"
                      placeholder="planner"
                      className="border-2 border-purple-200 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <Input
                        name="startDate"
                        type="date"
                        defaultValue="2025-06-04"
                        className="border-2 border-gray-200 focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Date</label>
                      <Input
                        name="endDate"
                        type="date"
                        placeholder="mm/dd/yyyy"
                        className="border-2 border-gray-200 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Daily Study Hours</label>
                    <div className="relative">
                      <select
                        name="dailyHours"
                        className="w-full p-3 border-2 border-gray-200 rounded-xl dark:bg-gray-700 dark:border-gray-600 appearance-none"
                        required
                      >
                        <option value="2">2 hours - Recommended</option>
                        <option value="1">1 hour</option>
                        <option value="3">3 hours</option>
                        <option value="4">4 hours</option>
                        <option value="5">5 hours</option>
                        <option value="6">6 hours</option>
                        <option value="8">8 hours</option>
                      </select>
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-4">Subjects to Include</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {subjects.map((subject) => (
                        <label
                          key={subject.name}
                          className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          <input type="checkbox" name="subjects" value={subject.name} className="sr-only peer" />
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${subject.color} flex items-center justify-center mb-2 peer-checked:scale-110 transition-transform`}
                          >
                            <subject.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm font-medium text-center peer-checked:text-purple-600">
                            {subject.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddSchedule(false)}
                      className="flex-1 py-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3"
                    >
                      Create Schedule
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAIAssistant(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white relative">
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <Brain className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">AI Study Assistant</h2>
                </div>
                <div className="absolute top-4 right-12">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Ask AI Section */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Ask Your AI Study Coach</h3>
                  <div className="flex space-x-3">
                    <Input
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      placeholder="e.g., How can I improve my focus during study sessions?"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleAIQuestion()}
                    />
                    <Button
                      onClick={handleAIQuestion}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6"
                    >
                      Ask AI
                    </Button>
                  </div>
                </div>

                {/* AI Response */}
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">AI RESPONSE</div>
                        <h4 className="font-semibold mb-2">Your Question</h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{aiResponse}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAiResponse("")}
                          className="text-purple-600 border-purple-300"
                        >
                          Ask Another
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Recommendations Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Personalized Recommendations</h3>
                    <Button
                      onClick={generateRecommendations}
                      variant="outline"
                      className="text-purple-600 border-purple-300"
                    >
                      Get Recommendations
                    </Button>
                  </div>

                  {showRecommendations && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      {/* Study Schedule Recommendation */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                              STUDY SCHEDULE
                            </div>
                            <h4 className="font-bold text-lg mb-2">Optimize Your Study Time</h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              Based on your {todaysHours.toFixed(1)}h total study time, I recommend 45-minute focused
                              sessions with 15-minute breaks.
                            </p>
                            <Button
                              onClick={() => {
                                setShowAIAssistant(false)
                                setShowAddSchedule(true)
                              }}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-300"
                            >
                              Create Schedule
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Subject Focus Recommendation */}
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                              SUBJECT FOCUS
                            </div>
                            <h4 className="font-bold text-lg mb-2">Prioritize Weak Areas</h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              Focus on Mathematics and Science this week. Your completion rate suggests these need more
                              attention.
                            </p>
                            <Button
                              onClick={() => {
                                setShowAIAssistant(false)
                                setShowAddGoal(true)
                              }}
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-300"
                            >
                              Set Goals
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Study Method Recommendation */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                              STUDY METHOD
                            </div>
                            <h4 className="font-bold text-lg mb-2">Try Active Recall</h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              Based on your learning pattern, active recall and spaced repetition would boost your
                              retention by 40%.
                            </p>
                            <Button variant="outline" size="sm" className="text-purple-600 border-purple-300">
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus Music Modal */}
      <AnimatePresence>
        {showFocusMusic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFocusMusic(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-green-500 p-6 text-white relative">
                <button
                  onClick={() => setShowFocusMusic(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <Headphones className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Focus Music</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Now Playing */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Nature Sounds</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Gentle rain sounds with forest ambiance</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-green-500 text-sm font-medium">🎵 Now Playing</span>
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center justify-center space-x-6 mb-6">
                    <Button variant="ghost" size="icon" className="w-12 h-12">
                      <SkipBack className="w-6 h-6" />
                    </Button>
                    <Button
                      onClick={togglePlayPause}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-white"
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="w-12 h-12">
                      <SkipForward className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 relative">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full"
                        style={{ width: `${volume}%` }}
                      />
                      <div
                        className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-teal-500 rounded-full cursor-pointer"
                        style={{ left: `${volume}%`, marginLeft: "-8px" }}
                      />
                    </div>
                    <span className="text-sm font-medium">{volume}%</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex space-x-2 mb-6 overflow-x-auto">
                  {musicCategories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`whitespace-nowrap ${
                        selectedCategory === category ? "bg-gradient-to-r from-teal-500 to-green-500 text-white" : ""
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Track List */}
                <div className="space-y-3">
                  {filteredTracks.map((track) => (
                    <motion.div
                      key={track.id}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        currentTrack?.id === track.id
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-teal-300"
                      }`}
                      onClick={() => playTrack(track)}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            currentTrack?.id === track.id && isPlaying
                              ? "bg-gradient-to-r from-teal-500 to-green-500"
                              : track.category === "Nature Sounds"
                                ? "bg-green-500"
                                : track.category === "Instrumental"
                                  ? "bg-purple-500"
                                  : "bg-blue-500"
                          }`}
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{track.title}</h4>
                          <p className="text-sm text-gray-500">{track.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{track.duration}</p>
                        {currentTrack?.id === track.id && <p className="text-sm text-green-500 font-medium">Playing</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Settings Modal */}
      <AnimatePresence>
        {showTimerSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTimerSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Timer Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Focus Duration (minutes)</label>
                  <div className="flex items-center space-x-4">
                    {[15, 25, 30, 45, 60].map((duration) => (
                      <Button
                        key={duration}
                        onClick={() => setFocusDuration(duration)}
                        variant={focusDuration === duration ? "default" : "outline"}
                        className={focusDuration === duration ? "bg-gradient-to-r from-red-500 to-pink-500" : ""}
                      >
                        {duration}
                      </Button>
                    ))}
                    <Input
                      type="number"
                      min="1"
                      max="120"
                      value={focusDuration}
                      onChange={(e) => setFocusDuration(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Break Duration (minutes)</label>
                  <div className="flex items-center space-x-4">
                    {[5, 10, 15, 20, 30].map((duration) => (
                      <Button
                        key={duration}
                        onClick={() => setBreakDuration(duration)}
                        variant={breakDuration === duration ? "default" : "outline"}
                        className={breakDuration === duration ? "bg-gradient-to-r from-green-500 to-emerald-500" : ""}
                      >
                        {duration}
                      </Button>
                    ))}
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={() => {
                      setPomodoroTime(currentSession === "focus" ? focusDuration * 60 : breakDuration * 60)
                      setShowTimerSettings(false)
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500"
                  >
                    Apply Settings
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTimerSettings(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddTask(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Add New Task
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  addTask(
                    formData.get("title") as string,
                    formData.get("subject") as string,
                    formData.get("priority") as "high" | "medium" | "low",
                    formData.get("dueTime") as string,
                  )
                }}
                className="space-y-4"
              >
                <Input name="title" placeholder="Task Title" required />
                <Input name="subject" placeholder="Subject" required />
                <select
                  name="priority"
                  className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <Input name="dueTime" type="time" required />
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                    Add Task
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddTask(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Block Modal */}
      <AnimatePresence>
        {showAddBlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddBlock(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Add Study Block
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)

                  const newBlock: StudyBlock = {
                    id: Date.now().toString(),
                    subject: formData.get("subject") as string,
                    topic: formData.get("topic") as string,
                    startTime: formData.get("startTime") as string,
                    endTime: formData.get("endTime") as string,
                    day: formData.get("day") as string,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    userId: user?.id,
                  }

                  setStudyBlocks((prev) => [...prev, newBlock])
                  setShowAddBlock(false)
                }}
                className="space-y-4"
              >
                <Input name="subject" placeholder="Subject" required />
                <Input name="topic" placeholder="Topic" required />

                <div>
                  <label className="block text-sm font-medium mb-2">Day</label>
                  <select
                    name="day"
                    className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <Input name="startTime" type="time" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <Input name="endTime" type="time" required />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500">
                    Add Block
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddBlock(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
