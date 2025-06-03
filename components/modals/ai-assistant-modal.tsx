"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Sparkles, Target, Clock, TrendingUp, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userStats: any
}

export function AIAssistantModal({ open, onOpenChange, userStats }: AIAssistantModalProps) {
  const [question, setQuestion] = useState("")
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateRecommendations = () => {
    setLoading(true)

    setTimeout(() => {
      const aiRecommendations = [
        {
          type: "Study Schedule",
          title: "Optimize Your Study Time",
          description: `Based on your ${userStats.totalStudyHours}h total study time, I recommend 45-minute focused sessions with 15-minute breaks.`,
          icon: Clock,
          color: "from-blue-500 to-cyan-500",
          action: "Create Schedule",
          bgColor: "bg-blue-50",
          textColor: "text-blue-900",
        },
        {
          type: "Subject Focus",
          title: "Prioritize Weak Areas",
          description:
            "Focus on Mathematics and Science this week. Your completion rate suggests these need more attention.",
          icon: Target,
          color: "from-green-500 to-emerald-500",
          action: "Set Goals",
          bgColor: "bg-green-50",
          textColor: "text-green-900",
        },
        {
          type: "Study Method",
          title: "Try Active Recall",
          description:
            "Based on your learning pattern, active recall and spaced repetition would boost your retention by 40%.",
          icon: Brain,
          color: "from-purple-500 to-pink-500",
          action: "Learn More",
          bgColor: "bg-purple-50",
          textColor: "text-purple-900",
        },
        {
          type: "Progress Boost",
          title: "Level Up Strategy",
          description: `You're ${userStats.experiencePoints % 100}/100 XP to Level ${userStats.level + 1}. Complete 2 more sessions today!`,
          icon: TrendingUp,
          color: "from-orange-500 to-red-500",
          action: "Start Session",
          bgColor: "bg-orange-50",
          textColor: "text-orange-900",
        },
      ]

      setRecommendations(aiRecommendations)
      setLoading(false)

      toast({
        title: "🤖 AI Analysis Complete!",
        description: "Your personalized study recommendations are ready.",
      })
    }, 2000)
  }

  const handleAskQuestion = () => {
    if (!question.trim()) return

    setLoading(true)

    setTimeout(() => {
      const responses = [
        "Based on your study pattern, I recommend the Pomodoro Technique with 25-minute focused sessions.",
        "Your current level suggests you're ready for more challenging material. Try increasing session duration to 45 minutes.",
        "Consider studying Mathematics in the morning when your focus is highest, based on your completion patterns.",
        "You're doing great! Your consistency shows improvement. Keep maintaining your daily study streak.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setRecommendations([
        {
          type: "AI Response",
          title: "Your Question",
          description: randomResponse,
          icon: Lightbulb,
          color: "from-indigo-500 to-purple-500",
          action: "Ask Another",
          bgColor: "bg-indigo-50",
          textColor: "text-indigo-900",
        },
      ])

      setLoading(false)
      setQuestion("")

      toast({
        title: "💡 AI Response Ready!",
        description: "Your study coach has analyzed your question.",
      })
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Brain className="h-6 w-6" />
            </div>
            AI Study Assistant
            <Sparkles className="h-5 w-5 ml-auto" />
          </DialogTitle>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Ask Your AI Study Coach</h3>
            <div className="flex gap-3">
              <Input
                placeholder="e.g., How can I improve my focus during study sessions?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 border-2 border-gray-200 focus:border-pink-400 bg-pink-50/50 text-gray-900 placeholder:text-gray-600"
                onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
              />
              <Button
                onClick={handleAskQuestion}
                disabled={loading || !question.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                Ask AI
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
              <Button
                onClick={generateRecommendations}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {loading ? "Analyzing..." : "Get Recommendations"}
              </Button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full"
                />
                <span className="ml-3 text-gray-700 font-medium">AI is analyzing your study patterns...</span>
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="grid gap-4">
                {recommendations.map((rec, index) => {
                  const Icon = rec.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`hover:shadow-lg transition-all duration-300 ${rec.bgColor} border border-gray-200`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${rec.color} text-white shadow-lg`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium ${rec.textColor} uppercase tracking-wide`}>
                                  {rec.type}
                                </span>
                              </div>
                              <h4 className={`font-semibold ${rec.textColor} mb-2`}>{rec.title}</h4>
                              <p className={`${rec.textColor} text-sm mb-3 opacity-80`}>{rec.description}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`border-gray-300 ${rec.textColor} hover:bg-white/50`}
                              >
                                {rec.action}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
