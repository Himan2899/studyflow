"use client"

import { motion } from "framer-motion"
import { BookOpen, PenTool, Calculator, Lightbulb, Target, Clock, Star, Zap } from "lucide-react"

const floatingElements = [
  { icon: BookOpen, color: "text-blue-400", size: "w-6 h-6" },
  { icon: PenTool, color: "text-purple-400", size: "w-5 h-5" },
  { icon: Calculator, color: "text-green-400", size: "w-6 h-6" },
  { icon: Lightbulb, color: "text-yellow-400", size: "w-5 h-5" },
  { icon: Target, color: "text-red-400", size: "w-6 h-6" },
  { icon: Clock, color: "text-indigo-400", size: "w-5 h-5" },
  { icon: Star, color: "text-pink-400", size: "w-6 h-6" },
  { icon: Zap, color: "text-orange-400", size: "w-5 h-5" },
]

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Floating Study Elements */}
      {Array.from({ length: 12 }).map((_, i) => {
        const Element = floatingElements[i % floatingElements.length]
        const Icon = Element.icon
        return (
          <motion.div
            key={i}
            className={`absolute ${Element.color} ${Element.size} opacity-30`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Icon className="w-full h-full" />
          </motion.div>
        )
      })}

      {/* Floating Notebooks */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`notebook-${i}`}
          className="absolute opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="w-8 h-10 bg-gradient-to-b from-blue-300 to-blue-400 dark:from-blue-600 dark:to-blue-700 rounded-sm shadow-lg">
            <div className="w-full h-1 bg-red-400 mt-1 rounded-full" />
            <div className="space-y-1 p-1 mt-1">
              <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-3/4 h-0.5 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
