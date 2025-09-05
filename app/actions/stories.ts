"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  JourneyMilestone,
  TeamMember,
  Achievement,
  ImpactStory,
  JourneyMilestoneSchema,
  TeamMemberSchema,
  AchievementSchema,
  ImpactStorySchema,
  StoriesData,
} from "@/lib/types/stories"

// Helper function to convert empty strings to null and handle image URLs
function processFormData(data: Record<string, any>) {
  const processed = { ...data }
  Object.keys(processed).forEach(key => {
    if (processed[key] === "") {
      if (key === "image_url") {
        // Convert empty image_url to null for database storage
        processed[key] = null
      } else {
        processed[key] = null
      }
    }
  })
  return processed
}

// Helper function to format Zod validation errors
function formatZodErrors(errors: z.ZodIssue[]) {
  const fieldErrors: Record<string, string> = {}
  const generalErrors: string[] = []
  
  errors.forEach(error => {
    const field = error.path.join('.')
    const message = error.message
    
    if (field) {
      fieldErrors[field] = message
    } else {
      generalErrors.push(message)
    }
  })
  
  return {
    fieldErrors,
    generalErrors,
    message: Object.keys(fieldErrors).length > 0 
      ? `Validation failed for: ${Object.keys(fieldErrors).join(', ')}`
      : 'Form validation failed'
  }
}

// ============================================================================
// JOURNEY MILESTONES
// ============================================================================

// Get all journey milestones
export async function getJourneyMilestones(): Promise<JourneyMilestone[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("journey_milestones")
      .select("*")
      .order("display_order", { ascending: true })
      .order("year", { ascending: false })
    
    if (error) {
      console.error("Error fetching journey milestones:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getJourneyMilestones:", error)
    return []
  }
}

// Get active journey milestones
export async function getActiveJourneyMilestones(): Promise<JourneyMilestone[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("journey_milestones")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("year", { ascending: false })
    
    if (error) {
      console.error("Error fetching active journey milestones:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getActiveJourneyMilestones:", error)
    return []
  }
}

// Get journey milestone by ID
export async function getJourneyMilestoneById(id: string): Promise<JourneyMilestone | null> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("journey_milestones")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      console.error("Error fetching journey milestone:", error)
      throw new Error("Failed to fetch journey milestone")
    }
    
    return data
  } catch (error) {
    console.error("Error in getJourneyMilestoneById:", error)
    throw new Error("Failed to fetch journey milestone")
  }
}

// Create journey milestone
export async function createJourneyMilestone(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const rawData = {
      year: formData.get("year") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    }
    
    const processedData = processFormData(rawData)
    const validatedData = JourneyMilestoneSchema.parse(processedData)
    
    const { data, error } = await supabase
      .from("journey_milestones")
      .insert([validatedData])
      .select()
      .single()
    
    if (error) {
      console.error("Error creating journey milestone:", error)
      throw new Error("Failed to create journey milestone")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in createJourneyMilestone:", error)
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error.errors)
      return { 
        success: false, 
        error: formattedErrors.message, 
        fieldErrors: formattedErrors.fieldErrors,
        details: error.errors 
      }
    }
    return { success: false, error: "Failed to create journey milestone" }
  }
}

// Update journey milestone
export async function updateJourneyMilestone(id: string, formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const rawData = {
      year: formData.get("year") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    }
    
    const processedData = processFormData(rawData)
    const validatedData = JourneyMilestoneSchema.parse(processedData)
    
    const { data, error } = await supabase
      .from("journey_milestones")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating journey milestone:", error)
      throw new Error("Failed to update journey milestone")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateJourneyMilestone:", error)
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error.errors)
      return { 
        success: false, 
        error: formattedErrors.message, 
        fieldErrors: formattedErrors.fieldErrors,
        details: error.errors 
      }
    }
    return { success: false, error: "Failed to update journey milestone" }
  }
}

// Delete journey milestone
export async function deleteJourneyMilestone(id: string) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { error } = await supabase
      .from("journey_milestones")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting journey milestone:", error)
      throw new Error("Failed to delete journey milestone")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteJourneyMilestone:", error)
    return { success: false, error: "Failed to delete journey milestone" }
  }
}

// Toggle journey milestone status
export async function toggleJourneyMilestoneStatus(id: string, currentStatus: boolean) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("journey_milestones")
      .update({ 
        is_active: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error toggling journey milestone status:", error)
      throw new Error("Failed to update journey milestone status")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in toggleJourneyMilestoneStatus:", error)
    return { success: false, error: "Failed to update journey milestone status" }
  }
}

// ============================================================================
// TEAM MEMBERS
// ============================================================================

// Get all team members
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("category", { ascending: true })
      .order("display_order", { ascending: true })
    
    if (error) {
      console.error("Error fetching team members:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getTeamMembers:", error)
    return []
  }
}

// Get active team members
export async function getActiveTeamMembers(): Promise<TeamMember[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("display_order", { ascending: true })
    
    if (error) {
      console.error("Error fetching active team members:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getActiveTeamMembers:", error)
    return []
  }
}

// Get team member by ID
export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      console.error("Error fetching team member:", error)
      throw new Error("Failed to fetch team member")
    }
    
    return data
  } catch (error) {
    console.error("Error in getTeamMemberById:", error)
    throw new Error("Failed to fetch team member")
  }
}

// Create team member
export async function createTeamMember(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const rawData = {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      category: formData.get("category") as string || "team",
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    }
    
    const processedData = processFormData(rawData)
    const validatedData = TeamMemberSchema.parse(processedData)
    
    const { data, error } = await supabase
      .from("team_members")
      .insert([validatedData])
      .select()
      .single()
    
    if (error) {
      console.error("Error creating team member:", error)
      throw new Error("Failed to create team member")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in createTeamMember:", error)
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error.errors)
      return { 
        success: false, 
        error: formattedErrors.message, 
        fieldErrors: formattedErrors.fieldErrors,
        details: error.errors 
      }
    }
    return { success: false, error: "Failed to create team member" }
  }
}

// Update team member
export async function updateTeamMember(id: string, formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const rawData = {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      category: formData.get("category") as string || "team",
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    }
    
    const processedData = processFormData(rawData)
    const validatedData = TeamMemberSchema.parse(processedData)
    
    const { data, error } = await supabase
      .from("team_members")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating team member:", error)
      throw new Error("Failed to update team member")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateTeamMember:", error)
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error.errors)
      return { 
        success: false, 
        error: formattedErrors.message, 
        fieldErrors: formattedErrors.fieldErrors,
        details: error.errors 
      }
    }
    return { success: false, error: "Failed to update team member" }
  }
}

// Delete team member
export async function deleteTeamMember(id: string) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting team member:", error)
      throw new Error("Failed to delete team member")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteTeamMember:", error)
    return { success: false, error: "Failed to delete team member" }
  }
}

// Toggle team member status
export async function toggleTeamMemberStatus(id: string, currentStatus: boolean) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("team_members")
      .update({ 
        is_active: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error toggling team member status:", error)
      throw new Error("Failed to update team member status")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in toggleTeamMemberStatus:", error)
    return { success: false, error: "Failed to update team member status" }
  }
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

// Get all achievements
export async function getAchievements(): Promise<Achievement[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("display_order", { ascending: true })
      .order("year", { ascending: false })
    
    if (error) {
      console.error("Error fetching achievements:", error)
      throw new Error("Failed to fetch achievements")
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getAchievements:", error)
    throw new Error("Failed to fetch achievements")
  }
}

// Get active achievements
export async function getActiveAchievements(): Promise<Achievement[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("year", { ascending: false })
    
    if (error) {
      console.error("Error fetching active achievements:", error)
      throw new Error("Failed to fetch active achievements")
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getActiveAchievements:", error)
    throw new Error("Failed to fetch active achievements")
  }
}

// Get achievement by ID
export async function getAchievementById(id: string): Promise<Achievement | null> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      console.error("Error fetching achievement:", error)
      throw new Error("Failed to fetch achievement")
    }
    
    return data
  } catch (error) {
    console.error("Error in getAchievementById:", error)
    throw new Error("Failed to fetch achievement")
  }
}

// Create achievement
export async function createAchievement(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      year: formData.get("year") as string,
      category: formData.get("category") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    }
    
    const processedData = processFormData(rawData)
    const validatedData = AchievementSchema.parse(processedData)
    
    const { data, error } = await supabase
      .from("achievements")
      .insert([validatedData])
      .select()
      .single()
    
    if (error) {
      console.error("Error creating achievement:", error)
      throw new Error("Failed to create achievement")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in createAchievement:", error)
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error.errors)
      return { 
        success: false, 
        error: formattedErrors.message, 
        fieldErrors: formattedErrors.fieldErrors,
        details: error.errors 
      }
    }
    return { success: false, error: "Failed to create achievement" }
  }
}

// Update achievement
export async function updateAchievement(id: string, formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      year: formData.get("year") as string,
      category: formData.get("category") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    }
    
    const processedData = processFormData(rawData)
    const validatedData = AchievementSchema.parse(processedData)
    
    const { data, error } = await supabase
      .from("achievements")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating achievement:", error)
      throw new Error("Failed to update achievement")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateAchievement:", error)
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error.errors)
      return { 
        success: false, 
        error: formattedErrors.message, 
        fieldErrors: formattedErrors.fieldErrors,
        details: error.errors 
      }
    }
    return { success: false, error: "Failed to update achievement" }
  }
}

// Delete achievement
export async function deleteAchievement(id: string) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting achievement:", error)
      throw new Error("Failed to delete achievement")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteAchievement:", error)
    return { success: false, error: "Failed to delete achievement" }
  }
}

// Toggle achievement status
export async function toggleAchievementStatus(id: string, currentStatus: boolean) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("achievements")
      .update({ 
        is_active: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error toggling achievement status:", error)
      throw new Error("Failed to update achievement status")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in toggleAchievementStatus:", error)
    return { success: false, error: "Failed to update achievement status" }
  }
}

// ============================================================================
// IMPACT STORIES
// ============================================================================

// Get all impact stories
export async function getImpactStories(): Promise<ImpactStory[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("impact_stories")
      .select("*")
      .order("category", { ascending: true })
      .order("display_order", { ascending: true })
    
    if (error) {
      console.error("Error fetching impact stories:", error)
      throw new Error("Failed to fetch impact stories")
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getImpactStories:", error)
    throw new Error("Failed to fetch impact stories")
  }
}

// Get active impact stories
export async function getActiveImpactStories(): Promise<ImpactStory[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("impact_stories")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("display_order", { ascending: true })
    
    if (error) {
      console.error("Error fetching active impact stories:", error)
      throw new Error("Failed to fetch active impact stories")
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getActiveImpactStories:", error)
    throw new Error("Failed to fetch active impact stories")
  }
}

// Get impact story by ID
export async function getImpactStoryById(id: string): Promise<ImpactStory | null> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("impact_stories")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      console.error("Error fetching impact story:", error)
      throw new Error("Failed to fetch impact story")
    }
    
    return data
  } catch (error) {
    console.error("Error in getImpactStoryById:", error)
    throw new Error("Failed to fetch impact story")
  }
}

// Create impact story
export async function createImpactStory(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      stats: formData.get("stats") as string,
      category: formData.get("category") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    }
    
    const processedData = processFormData(rawData)
    const validatedData = ImpactStorySchema.parse(processedData)
    
    const { data, error } = await supabase
      .from("impact_stories")
      .insert([validatedData])
      .select()
      .single()
    
    if (error) {
      console.error("Error creating impact story:", error)
      throw new Error("Failed to create impact story")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in createImpactStory:", error)
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error.errors)
      return { 
        success: false, 
        error: formattedErrors.message, 
        fieldErrors: formattedErrors.fieldErrors,
        details: error.errors 
      }
    }
    return { success: false, error: "Failed to create impact story" }
  }
}

// Update impact story
export async function updateImpactStory(id: string, formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      stats: formData.get("stats") as string,
      category: formData.get("category") as string,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    }
    
    const processedData = processFormData(rawData)
    const validatedData = ImpactStorySchema.parse(processedData)
    
    const { data, error } = await supabase
      .from("impact_stories")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating impact story:", error)
      throw new Error("Failed to update impact story")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateImpactStory:", error)
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error.errors)
      return { 
        success: false, 
        error: formattedErrors.message, 
        fieldErrors: formattedErrors.fieldErrors,
        details: error.errors 
      }
    }
    return { success: false, error: "Failed to update impact story" }
  }
}

// Delete impact story
export async function deleteImpactStory(id: string) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { error } = await supabase
      .from("impact_stories")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting impact story:", error)
      throw new Error("Failed to delete impact story")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteImpactStory:", error)
    return { success: false, error: "Failed to delete impact story" }
  }
}

// Toggle impact story status
export async function toggleImpactStoryStatus(id: string, currentStatus: boolean) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("impact_stories")
      .update({ 
        is_active: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error toggling impact story status:", error)
      throw new Error("Failed to update impact story status")
    }
    
    revalidatePath("/admin/stories")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in toggleImpactStoryStatus:", error)
    return { success: false, error: "Failed to update impact story status" }
  }
}

// ============================================================================
// COMBINED STORIES DATA
// ============================================================================

// Get all active stories data for frontend
export async function getAllActiveStoriesData(): Promise<StoriesData> {
  try {
    const [journey, team, achievements, impact] = await Promise.all([
      getActiveJourneyMilestones(),
      getActiveTeamMembers(),
      getActiveAchievements(),
      getActiveImpactStories(),
    ])
    
    return {
      journey,
      team,
      achievements,
      impact,
    }
  } catch (error) {
    console.error("Error in getAllActiveStoriesData:", error)
    throw new Error("Failed to fetch stories data")
  }
}

// Server actions for form submissions with redirects
export async function createJourneyMilestoneAction(formData: FormData) {
  const result = await createJourneyMilestone(formData)
  
  if (result.success) {
    redirect("/admin/stories/journey")
  } else {
    throw new Error(result.error)
  }
}

export async function updateJourneyMilestoneAction(id: string, formData: FormData) {
  const result = await updateJourneyMilestone(id, formData)
  
  if (result.success) {
    redirect("/admin/stories/journey")
  } else {
    throw new Error(result.error)
  }
}

export async function createTeamMemberAction(formData: FormData) {
  const result = await createTeamMember(formData)
  
  if (result.success) {
    redirect("/admin/stories/team")
  } else {
    throw new Error(result.error)
  }
}

export async function updateTeamMemberAction(id: string, formData: FormData) {
  const result = await updateTeamMember(id, formData)
  
  if (result.success) {
    redirect("/admin/stories/team")
  } else {
    throw new Error(result.error)
  }
}

export async function createAchievementAction(formData: FormData) {
  const result = await createAchievement(formData)
  
  if (result.success) {
    redirect("/admin/stories/achievements")
  } else {
    throw new Error(result.error)
  }
}

export async function updateAchievementAction(id: string, formData: FormData) {
  const result = await updateAchievement(id, formData)
  
  if (result.success) {
    redirect("/admin/stories/achievements")
  } else {
    throw new Error(result.error)
  }
}

export async function createImpactStoryAction(formData: FormData) {
  const result = await createImpactStory(formData)
  
  if (result.success) {
    redirect("/admin/stories/impact")
  } else {
    throw new Error(result.error)
  }
}

export async function updateImpactStoryAction(id: string, formData: FormData) {
  const result = await updateImpactStory(id, formData)
  
  if (result.success) {
    redirect("/admin/stories/impact")
  } else {
    throw new Error(result.error)
  }
}