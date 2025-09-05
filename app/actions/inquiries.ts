"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// Get all inquiries
export async function getInquiries() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching inquiries:", error)
    return []
  }

  return data || []
}

// Get a single inquiry by ID
export async function getInquiryById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("inquiries").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching inquiry:", error)
    return null
  }

  return data
}

// Create a new inquiry
export async function createInquiry(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  // Extract form data
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = (formData.get("company") as string) || null
  const phone = (formData.get("phone") as string) || null
  const inquiryType = formData.get("inquiryType") as string
  const message = formData.get("message") as string
  const priority = (formData.get("priority") as string) || "normal"
  const productId = (formData.get("productId") as string) || null
  const hasSpecificProduct = formData.get("hasSpecificProduct") === "true"

  // Validate required fields
  if (!name || !email || !message || !inquiryType) {
    return { success: false, error: "Missing required fields" }
  }

  // Create inquiry object
  const inquiry = {
    name,
    email,
    company,
    phone,
    product_interest: inquiryType,
    message,
    priority,
    product_id: hasSpecificProduct ? productId : null,
    status: "new",
  }

  // Insert into database
  const { data, error } = await supabase.from("inquiries").insert([inquiry]).select()

  if (error) {
    console.error("Error creating inquiry:", error)
    return { success: false, error: "Failed to submit inquiry" }
  }

  // Revalidate inquiries page
  revalidatePath("/admin/inquiries")

  // Return success instead of redirecting
  return {
    success: true,
    inquiryId: data?.[0]?.id,
    message: "Inquiry submitted successfully",
  }
}

// Update an inquiry
export async function updateInquiry(id: string, data: any) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("inquiries").update(data).eq("id", id)

  if (error) {
    console.error("Error updating inquiry:", error)
    return { success: false, error: "Failed to update inquiry" }
  }

  revalidatePath("/admin/inquiries")
  revalidatePath(`/admin/inquiries/${id}`)

  return { success: true }
}

// Delete an inquiry
export async function deleteInquiry(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("inquiries").delete().eq("id", id)

  if (error) {
    console.error("Error deleting inquiry:", error)
    return { success: false, error: "Failed to delete inquiry" }
  }

  revalidatePath("/admin/inquiries")
  return { success: true }
}

// Get inquiry statistics
export async function getInquiryStats() {
  const supabase = await createSupabaseServerClient()

  // Get total count
  const { count: total, error: countError } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })

  // Get new inquiries count
  const { count: newCount, error: newError } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  // Get in-progress inquiries count
  const { count: inProgressCount, error: inProgressError } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "in-progress")

  // Get completed inquiries count
  const { count: completedCount, error: completedError } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  if (countError || newError || inProgressError || completedError) {
    console.error("Error fetching inquiry stats:", countError || newError || inProgressError || completedError)
    return {
      total: 0,
      new: 0,
      inProgress: 0,
      completed: 0,
    }
  }

  return {
    total: total || 0,
    new: newCount || 0,
    inProgress: inProgressCount || 0,
    completed: completedCount || 0,
  }
}
