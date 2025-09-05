"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }

  return data
}

export async function getUser(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching user:", error)
    throw new Error("Failed to fetch user")
  }

  return data
}

export async function updateUser(id: string, userData: any) {
  const supabase = await createSupabaseServerClient()

  // Don't update the ID
  if (userData.id) {
    delete userData.id
  }

  const { data, error } = await supabase.from("profiles").update(userData).eq("id", id).select()

  if (error) {
    console.error("Error updating user:", error)
    throw new Error("Failed to update user")
  }

  revalidatePath("/admin/users")
  revalidatePath(`/admin/users/${id}`)
  return data[0]
}

export async function createUserProfile(userData: any) {
  const supabase = await createSupabaseServerClient()

  // For profiles, ID must match auth.users ID
  if (!userData.id) {
    throw new Error("User ID is required for creating a profile")
  }

  const { data, error } = await supabase.from("profiles").insert([userData]).select()

  if (error) {
    console.error("Error creating user profile:", error)
    throw new Error("Failed to create user profile")
  }

  revalidatePath("/admin/users")
  return data[0]
}
