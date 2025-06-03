import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StudyFlow - Smart Study Scheduler",
  description:
    "An intelligent study planner with AI-powered scheduling, Pomodoro timer, and gamified progress tracking.",
  keywords: "study planner, pomodoro timer, study scheduler, education, productivity",
  authors: [{ name: "StudyFlow Team" }],
  openGraph: {
    title: "StudyFlow - Smart Study Scheduler",
    description: "Transform your study habits with AI-powered scheduling and gamified learning.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
