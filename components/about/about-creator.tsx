"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, ExternalLink, Rocket, GraduationCap, Lightbulb, Heart } from "lucide-react"
import Image from "next/image"
import { LucideIcon } from "lucide-react"

interface Skill {
  name: string
  category: string
  color: string
  bgColor: string
}

interface Role {
  icon: LucideIcon
  text: string
  color: string
}

export function AboutCreator() {
  const skills: Skill[] = [
    {
      name: "C++",
      category: "Programming",
      color: "bg-purple-100 text-purple-700 border-purple-200",
      bgColor: "bg-purple-50",
    },
    {
      name: "Java",
      category: "Development",
      color: "bg-green-100 text-green-700 border-green-200",
      bgColor: "bg-green-50",
    },
    {
      name: "Python",
      category: "AI & ML",
      color: "bg-purple-100 text-purple-700 border-purple-200",
      bgColor: "bg-purple-50",
    },
    {
      name: "DSA",
      category: "Algorithms",
      color: "bg-orange-100 text-orange-700 border-orange-200",
      bgColor: "bg-orange-50",
    },
  ]

  const roles: Role[] = [
    {
      icon: GraduationCap,
      text: "BTech CSE Student",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Lightbulb,
      text: "Innovation Enthusiast",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: Heart,
      text: "Healthcare Tech",
      color: "bg-red-100 text-red-700",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Rocket className="h-6 w-6" />
            </div>
            About the Creator
            <span className="text-xl ml-auto">🚀</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Profile Section */}
            <div className="flex flex-col items-center lg:items-start space-y-4 lg:min-w-[300px]">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                  <Image
                    src="/himanshu-profile.jpg"
                    alt="Himanshu Bali's profile photo"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
              </div>

              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 justify-center lg:justify-start">
                  <Rocket className="h-6 w-6 text-blue-500" />
                  Himanshu Bali
                </h2>
                <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Aspiring Computer Science Engineer
                </p>
                <p className="text-gray-600 mt-1 flex items-center gap-1 justify-center lg:justify-start">
                  Passionate About Technology & Innovation
                  <span className="text-yellow-500">💡</span>
                </p>
              </div>

              {/* Contact Button */}
              <Button
                className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg"
                onClick={() => window.open("mailto:himanshuofficialuserid@gmail.com", "_blank")}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Me
              </Button>
            </div>

            {/* Content Section */}
            <div className="flex-1 space-y-6">
              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  I am currently pursuing my{" "}
                  <span className="font-semibold text-gray-800">
                    Bachelor of Technology (BTech) in Computer Science Engineering
                  </span>
                  , with a strong passion for technology and problem-solving. My academic journey is equipping me with a
                  solid foundation in programming languages like{" "}
                  <span className="font-semibold text-purple-600">C++</span>,{" "}
                  <span className="font-semibold text-green-600">Java</span>, and{" "}
                  <span className="font-semibold text-purple-600">Python</span>, as well as a growing understanding of
                  data structures, algorithms, and software development.
                </p>
              </div>

              {/* Skills Grid */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Skills</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`${skill.bgColor} rounded-xl p-4 text-center border-2 ${skill.color.split(" ")[2]} hover:shadow-lg transition-all duration-300`}
                    >
                      <div className={`text-2xl font-bold ${skill.color.split(" ")[1]}`}>{skill.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{skill.category}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Role Badges */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Roles</h3>
                <div className="flex flex-wrap gap-3">
                  {roles.map((role, index) => {
                    const Icon = role.icon
                    return (
                      <motion.div
                        key={role.text}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Badge
                          className={`${role.color} px-4 py-2 text-sm font-medium border-0 shadow-sm hover:shadow-md transition-all duration-300`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {role.text}
                        </Badge>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Get in Touch
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm mb-2">
                      Feel free to reach out for collaborations, questions, or just to connect!
                    </p>
                    <p className="text-blue-600 font-medium">himanshuofficialuserid@gmail.com</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => window.open("mailto:himanshuofficialuserid@gmail.com", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
