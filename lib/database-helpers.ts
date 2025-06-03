import { getSupabaseClient } from "./supabase"

// Helper function to create an RPC function for incrementing values
export async function createIncrementFunction() {
  const supabase = getSupabaseClient()

  try {
    // Check if the function already exists
    const { data, error } = await supabase.rpc("increment", { x: 1 })

    if (error && error.message.includes("function does not exist")) {
      // Create the function if it doesn't exist
      const { error: createError } = await supabase.rpc("create_increment_function")

      if (createError) {
        console.error("Error creating increment function:", createError)
      } else {
        console.log("Increment function created successfully")
      }
    }
  } catch (error) {
    console.error("Error checking increment function:", error)
  }
}

// Helper function to ensure user profile exists
export async function ensureUserProfile(userId: string, userData: any) {
  const supabase = getSupabaseClient()

  try {
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single()

    if (profileError && profileError.code === "PGRST116") {
      // Profile doesn't exist, create it
      console.log("Creating user profile...")
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        email: userData.email || "",
        full_name: userData.full_name || userData.email?.split("@")[0] || "Student",
        study_streak: 0,
        total_study_hours: 0,
        level: 1,
        experience_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error creating profile:", insertError)
        throw insertError
      }
      console.log("Profile created successfully")
      return true
    } else if (profileError) {
      console.error("Error checking profile:", profileError)
      throw profileError
    }

    return true
  } catch (error) {
    console.error("Error ensuring user profile:", error)
    return false
  }
}
