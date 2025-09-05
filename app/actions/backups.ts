"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"

type BackupRow = Database['public']['Tables']['backups']['Row']
type BackupInsert = Database['public']['Tables']['backups']['Insert']
type BackupUpdate = Database['public']['Tables']['backups']['Update']

// Interface for the backup data that matches the actual usage
interface BackupData {
  id?: string
  filename?: string
  size?: number
  backup_type?: string
  status?: string
  storage_path?: string
  created_by?: string | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export async function getBackups() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("backups").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching backups:", error)
    throw new Error("Failed to fetch backups")
  }

  return data
}

export async function getBackup(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("backups").select("*").eq("id", id as any).single()

  if (error) {
    console.error("Error fetching backup:", error)
    throw new Error("Failed to fetch backup")
  }

  return data
}

export async function createBackup(backupData: BackupData) {
  const supabase = await createSupabaseServerClient()

  // Remove empty ID to let Supabase generate it
  if (backupData.id === "" || backupData.id === undefined) {
    delete backupData.id
  }

  // Set created_by if not provided
  if (!backupData.created_by) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user?.id) {
      backupData.created_by = session.user.id
    }
  }

  const { data, error } = await supabase.from("backups").insert([backupData as any]).select()

  if (error) {
    console.error("Error creating backup:", error)
    throw new Error("Failed to create backup")
  }

  revalidatePath("/admin/backups")
  return data[0]
}

export async function updateBackup(id: string, backupData: BackupData) {
  const supabase = await createSupabaseServerClient()

  // Don't update the ID
  if (backupData.id) {
    delete backupData.id
  }

  const { data, error } = await supabase.from("backups").update(backupData as any).eq("id", id as any).select()

  if (error) {
    console.error("Error updating backup:", error)
    throw new Error("Failed to update backup")
  }

  revalidatePath("/admin/backups")
  return data[0]
}

export async function deleteBackup(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("backups").delete().eq("id", id as any)

  if (error) {
    console.error("Error deleting backup:", error)
    throw new Error("Failed to delete backup")
  }

  revalidatePath("/admin/backups")
  return { success: true }
}
