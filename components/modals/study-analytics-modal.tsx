"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StudyAnalytics } from "@/components/analytics/study-analytics"
import { BarChart3, Sparkles } from "lucide-react"

interface StudyAnalyticsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudyAnalyticsModal({ open, onOpenChange }: StudyAnalyticsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
            Study Analytics
            <Sparkles className="h-5 w-5 ml-auto" />
          </DialogTitle>
        </DialogHeader>

        <div className="p-2">
          <StudyAnalytics />
        </div>

        <div className="flex justify-end pt-4 px-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
