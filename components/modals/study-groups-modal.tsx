"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Search, Clock, Star, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StudyGroupsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudyGroupsModal({ open, onOpenChange }: StudyGroupsModalProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "create">("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [groupName, setGroupName] = useState("")
  const [groupSubject, setGroupSubject] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [joinedGroups, setJoinedGroups] = useState<number[]>([])
  const { toast } = useToast()

  const studyGroups = [
    {
      id: 1,
      name: "Mathematics Masters",
      subject: "Mathematics",
      members: 24,
      description: "Advanced calculus and algebra study group",
      schedule: "Mon, Wed, Fri 7PM",
      rating: 4.8,
      tags: ["Calculus", "Algebra", "Problem Solving"],
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Science Squad",
      subject: "Science",
      members: 18,
      description: "Physics and chemistry focused group",
      schedule: "Tue, Thu 6PM",
      rating: 4.6,
      tags: ["Physics", "Chemistry", "Lab Work"],
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Code Crushers",
      subject: "Programming",
      members: 32,
      description: "Learn programming together",
      schedule: "Daily 8PM",
      rating: 4.9,
      tags: ["JavaScript", "Python", "Web Dev"],
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "History Buffs",
      subject: "History",
      members: 15,
      description: "World history discussion group",
      schedule: "Weekends 3PM",
      rating: 4.5,
      tags: ["World War", "Ancient", "Modern"],
      color: "bg-orange-500",
    },
  ]

  const filteredGroups = studyGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleJoinGroup = (groupId: number, groupName: string) => {
    setJoinedGroups((prev) => [...prev, groupId])
    toast({
      title: "🎉 Successfully Joined!",
      description: `Welcome to ${groupName}! You'll receive notifications about upcoming sessions.`,
    })
  }

  const handleCreateGroup = () => {
    if (!groupName || !groupSubject) return

    toast({
      title: "🎯 Study Group Created!",
      description: `${groupName} has been created successfully. Invite your friends to join!`,
    })

    setGroupName("")
    setGroupSubject("")
    setGroupDescription("")
    setActiveTab("browse")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            Study Groups
            <span className="text-xl ml-auto">👥</span>
          </DialogTitle>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-2">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "browse" ? "default" : "outline"}
              onClick={() => setActiveTab("browse")}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse Groups
            </Button>
            <Button
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => setActiveTab("create")}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>

          {activeTab === "browse" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search groups by name, subject, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-200 focus:border-cyan-400 bg-white text-gray-900"
                />
              </div>

              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {filteredGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 bg-white border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.name}</h3>
                            <p className="text-gray-700 text-sm mb-2">{group.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-900">{group.members} members</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-900">{group.schedule}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium text-gray-900">{group.rating}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs bg-gray-100 text-gray-800 border border-gray-300"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`mb-2 text-white ${group.color}`}>{group.subject}</Badge>
                            <div>
                              {joinedGroups.includes(group.id) ? (
                                <Button size="sm" disabled className="bg-green-500 text-white">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Joined
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                                  onClick={() => handleJoinGroup(group.id, group.name)}
                                >
                                  Join Group
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="groupName" className="text-gray-900 font-semibold">
                    Group Name
                  </Label>
                  <Input
                    id="groupName"
                    placeholder="e.g., Advanced Physics Study Group"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="border-2 border-gray-200 focus:border-cyan-400 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <Label htmlFor="groupSubject" className="text-gray-900 font-semibold">
                    Subject
                  </Label>
                  <Input
                    id="groupSubject"
                    placeholder="e.g., Physics, Mathematics, Programming"
                    value={groupSubject}
                    onChange={(e) => setGroupSubject(e.target.value)}
                    className="border-2 border-gray-200 focus:border-cyan-400 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <Label htmlFor="groupDescription" className="text-gray-900 font-semibold">
                    Description
                  </Label>
                  <textarea
                    id="groupDescription"
                    placeholder="Describe your study group, goals, and what members can expect..."
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    rows={4}
                    className="w-full p-3 border-2 border-gray-200 focus:border-cyan-400 rounded-md resize-none bg-white text-gray-900"
                  />
                </div>

                <Button
                  onClick={handleCreateGroup}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  disabled={!groupName || !groupSubject}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Study Group
                </Button>
              </div>
            </div>
          )}

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
