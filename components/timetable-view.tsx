"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Clock, BookOpen, Trash2 } from "lucide-react"

interface StudyBlock {
  id: string
  subject: string
  topic: string
  startTime: string
  endTime: string
  color: string
  day: string
  userId?: string
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const subjectColors = [
  "bg-gradient-to-r from-purple-500 to-pink-500",
  "bg-gradient-to-r from-blue-500 to-cyan-500",
  "bg-gradient-to-r from-green-500 to-emerald-500",
  "bg-gradient-to-r from-orange-500 to-red-500",
  "bg-gradient-to-r from-indigo-500 to-purple-500",
  "bg-gradient-to-r from-teal-500 to-blue-500",
]

interface TimetableViewProps {
  initialBlocks?: StudyBlock[]
  onAddBlock?: (block: StudyBlock) => void
  onDeleteBlock?: (id: string) => void
}

export default function TimetableView({ initialBlocks = [], onAddBlock, onDeleteBlock }: TimetableViewProps) {
  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>(initialBlocks)
  const [isAddingBlock, setIsAddingBlock] = useState(false)
  const [newBlock, setNewBlock] = useState({
    subject: "",
    topic: "",
    startTime: "",
    endTime: "",
    day: "Monday",
  })

  const addStudyBlock = () => {
    if (newBlock.subject && newBlock.topic && newBlock.startTime && newBlock.endTime) {
      const block: StudyBlock = {
        id: Date.now().toString(),
        ...newBlock,
        color: subjectColors[Math.floor(Math.random() * subjectColors.length)],
      }

      if (onAddBlock) {
        onAddBlock(block)
      } else {
        setStudyBlocks([...studyBlocks, block])
      }

      setNewBlock({ subject: "", topic: "", startTime: "", endTime: "", day: "Monday" })
      setIsAddingBlock(false)
    }
  }

  const deleteBlock = (id: string) => {
    if (onDeleteBlock) {
      onDeleteBlock(id)
    } else {
      setStudyBlocks(studyBlocks.filter((block) => block.id !== id))
    }
  }

  const getBlocksForDay = (day: string) => {
    const blocks = onDeleteBlock ? initialBlocks : studyBlocks
    return blocks.filter((block) => block.day === day)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Study Timetable 📅
        </motion.h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsAddingBlock(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Study Block
          </Button>
        </motion.div>
      </div>

      {/* Add Block Modal */}
      <AnimatePresence>
        {isAddingBlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsAddingBlock(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">Add Study Block</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Subject"
                  value={newBlock.subject}
                  onChange={(e) => setNewBlock({ ...newBlock, subject: e.target.value })}
                />
                <Input
                  placeholder="Topic"
                  value={newBlock.topic}
                  onChange={(e) => setNewBlock({ ...newBlock, topic: e.target.value })}
                />
                <select
                  value={newBlock.day}
                  onChange={(e) => setNewBlock({ ...newBlock, day: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="time"
                    value={newBlock.startTime}
                    onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={newBlock.endTime}
                    onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <Button onClick={addStudyBlock} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500">
                    Add Block
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingBlock(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {days.map((day, dayIndex) => (
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
                {getBlocksForDay(day).map((block, blockIndex) => (
                  <motion.div
                    key={block.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: blockIndex * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-3 rounded-xl ${block.color} text-white shadow-lg relative group`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{block.subject}</h4>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteBlock(block.id)}
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

                {getBlocksForDay(day).length === 0 && (
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

      {/* Weekly Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>Weekly Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                <p className="text-2xl font-bold text-blue-600">
                  {(onDeleteBlock ? initialBlocks : studyBlocks).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Blocks</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((onDeleteBlock ? initialBlocks : studyBlocks).length * 1.5 * 10) / 10}h
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Study Hours</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <p className="text-2xl font-bold text-purple-600">
                  {new Set((onDeleteBlock ? initialBlocks : studyBlocks).map((b) => b.subject)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Subjects</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10">
                <p className="text-2xl font-bold text-orange-600">
                  {days.filter((day) => getBlocksForDay(day).length > 0).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
