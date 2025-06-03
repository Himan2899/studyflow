import { getSupabaseClient } from "./supabase"

export async function createUserProfile(userId: string, email: string, fullName: string) {
  const supabase = getSupabaseClient()

  try {
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      email: email,
      full_name: fullName,
      theme_preference: "light",
      study_streak: 0,
      total_study_hours: 0,
      level: 1,
      experience_points: 0,
    })

    if (error) {
      console.error("Error creating user profile:", error)
      throw error
    }
  } catch (error) {
    console.error("Failed to create user profile:", error)
    throw error
  }
}
