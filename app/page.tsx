"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ImprovedLoginForm } from "@/components/auth/improved-login-form"
import { ImprovedSignupForm } from "@/components/auth/improved-signup-form"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EnhancedOverview } from "@/components/dashboard/enhanced-overview"
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer"
import { useAuth } from "@/contexts/auth-context"
import { StudyPlansManager } from "@/components/study-plans/study-plans-manager"

export default function Home() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [activeTab, setActiveTab] = useState("overview")
  const { user, loading } = useAuth()

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <EnhancedOverview />
      case "pomodoro":
        return (
          <div className="flex justify-center">
            <PomodoroTimer />
          </div>
        )
      case "study-plans":
        return <StudyPlansManager />
      case "goals":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Goals</h2>
            <p className="text-gray-600">Coming soon! Set and track your study goals.</p>
          </div>
        )
      case "achievements":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Achievements</h2>
            <p className="text-gray-600">Coming soon! View your earned achievements and badges.</p>
          </div>
        )
      case "settings":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Settings</h2>
            <p className="text-gray-600">Coming soon! Customize your study experience.</p>
          </div>
        )
      default:
        return <EnhancedOverview />
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveTab()}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  )
}
