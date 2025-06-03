"use client"

import { motion } from "framer-motion"
import { BookOpen, PenTool, Calculator, Lightbulb, Target, Clock, Star, Zap, Palette, Sparkles } from "lucide-react"

const floatingElements = [
  { icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-100", size: "w-8 h-8" },
  { icon: PenTool, color: "text-purple-500", bgColor: "bg-purple-100", size: "w-6 h-6" },
  { icon: Calculator, color: "text-green-500", bgColor: "bg-green-100", size: "w-8 h-8" },
  { icon: Lightbulb, color: "text-yellow-500", bgColor: "bg-yellow-100", size: "w-6 h-6" },
  { icon: Target, color: "text-red-500", bgColor: "bg-red-100", size: "w-8 h-8" },
  { icon: Clock, color: "text-indigo-500", bgColor: "bg-indigo-100", size: "w-6 h-6" },
  { icon: Star, color: "text-pink-500", bgColor: "bg-pink-100", size: "w-8 h-8" },
  { icon: Zap, color: "text-orange-500", bgColor: "bg-orange-100", size: "w-6 h-6" },
  { icon: Palette, color: "text-cyan-500", bgColor: "bg-cyan-100", size: "w-7 h-7" },
  { icon: Sparkles, color: "text-violet-500", bgColor: "bg-violet-100", size: "w-7 h-7" },
]

export function EnhancedAnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Vibrant Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 via-pink-50 to-orange-100" />

      {/* Multiple Animated Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-full blur-3xl"
        animate={{
          x: [0, 150, 0],
          y: [0, -80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-300/30 to-orange-300/30 rounded-full blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, 80, 0],
          scale: [1, 0.7, 1],
        }}
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-green-300/25 to-cyan-300/25 rounded-full blur-3xl"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -60, 60, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Enhanced Floating Study Elements */}
      {Array.from({ length: 15 }).map((_, i) => {
        const Element = floatingElements[i % floatingElements.length]
        const Icon = Element.icon
        return (
          <motion.div
            key={i}
            className={`absolute ${Element.bgColor} rounded-full p-3 shadow-lg`}
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              rotate: [0, 360],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Icon className={`${Element.size} ${Element.color}`} />
          </motion.div>
        )
      })}

      {/* Colorful Floating Notebooks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const colors = [
          "from-blue-400 to-blue-500",
          "from-purple-400 to-purple-500",
          "from-green-400 to-green-500",
          "from-pink-400 to-pink-500",
          "from-orange-400 to-orange-500",
          "from-cyan-400 to-cyan-500",
          "from-red-400 to-red-500",
          "from-indigo-400 to-indigo-500",
        ]
        const color = colors[i % colors.length]

        return (
          <motion.div
            key={`notebook-${i}`}
            className="absolute opacity-40"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              rotate: Math.random() * 360,
            }}
            animate={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className={`w-10 h-12 bg-gradient-to-b ${color} rounded-lg shadow-lg`}>
              <div className="w-full h-1.5 bg-white/80 mt-1.5 rounded-full mx-auto" style={{ width: "80%" }} />
              <div className="space-y-1 p-1.5 mt-1">
                <div className="w-full h-0.5 bg-white/60 rounded" />
                <div className="w-3/4 h-0.5 bg-white/60 rounded" />
                <div className="w-full h-0.5 bg-white/60 rounded" />
                <div className="w-2/3 h-0.5 bg-white/60 rounded" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
