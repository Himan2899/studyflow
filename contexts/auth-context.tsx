"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthChangeEvent } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resendConfirmation: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  const createUserProfile = async (userId: string, email: string, fullName: string) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", userId).single()

      if (!existingProfile) {
        const { error } = await supabase.from("profiles").insert({
          id: userId,
          email: email,
          full_name: fullName,
          theme_preference: "light",
          study_streak: 0,
          total_study_hours: 0,
          level: 1,
          experience_points: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) {
          console.error("Error creating user profile:", JSON.stringify(error, null, 2))
          throw error
        }
        console.log("User profile created successfully")
      } else {
        console.log("User profile already exists")
      }
    } catch (error) {
      console.error("Failed to create user profile:", JSON.stringify(error, null, 2))
      throw error
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      setUser(session?.user ?? null)

      // Create profile for new users or ensure existing users have profiles
      if (session?.user && (event === "SIGNED_UP" as AuthChangeEvent || event === "SIGNED_IN" as AuthChangeEvent)) {
        try {
          await createUserProfile(
            session.user.id,
            session.user.email || "",
            session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Student",
          )
        } catch (error) {
          console.error("Failed to create/verify user profile:", JSON.stringify(error, null, 2))
        }
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resendConfirmation }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
