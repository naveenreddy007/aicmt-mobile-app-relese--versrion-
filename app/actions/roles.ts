"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getRoles() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("roles").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching roles:", error)
    throw new Error("Failed to fetch roles")
  }

  return data
}

export async function getRole(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("roles").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching role:", error)
    throw new Error("Failed to fetch role")
  }

  return data
}

export async function createRole(roleData: any) {
  const supabase = await createSupabaseServerClient()

  // Remove empty ID to let Supabase generate it
  if (roleData.id === "" || roleData.id === undefined) {
    delete roleData.id
  }

  const { data, error } = await supabase.from("roles").insert([roleData]).select()

  if (error) {
    console.error("Error creating role:", error)
    throw new Error("Failed to create role")
  }

  revalidatePath("/admin/roles")
  return data[0]
}

export async function updateRole(id: string, roleData: any) {
  const supabase = await createSupabaseServerClient()

  // Don't update the ID
  if (roleData.id) {
    delete roleData.id
  }

  const { data, error } = await supabase.from("roles").update(roleData).eq("id", id).select()

  if (error) {
    console.error("Error updating role:", error)
    throw new Error("Failed to update role")
  }

  revalidatePath("/admin/roles")
  return data[0]
}

export async function deleteRole(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("roles").delete().eq("id", id)

  if (error) {
    console.error("Error deleting role:", error)
    throw new Error("Failed to delete role")
  }

  revalidatePath("/admin/roles")
  return { success: true }
}

export async function getPermissions() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("permissions").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching permissions:", error)
    throw new Error("Failed to fetch permissions")
  }

  return data
}

export async function getRolePermissions(roleId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("role_permissions").select("permission_id").eq("role_id", roleId)

  if (error) {
    console.error("Error fetching role permissions:", error)
    throw new Error("Failed to fetch role permissions")
  }

  return data.map((item) => item.permission_id)
}

export async function updateRolePermissions(roleId: string, permissionIds: string[]) {
  const supabase = await createSupabaseServerClient()

  // First delete existing permissions
  const { error: deleteError } = await supabase.from("role_permissions").delete().eq("role_id", roleId)

  if (deleteError) {
    console.error("Error deleting existing role permissions:", deleteError)
    throw new Error("Failed to update role permissions")
  }

  // Then insert new permissions
  if (permissionIds.length > 0) {
    const permissionsToInsert = permissionIds.map((permissionId) => ({
      role_id: roleId,
      permission_id: permissionId,
    }))

    const { error: insertError } = await supabase.from("role_permissions").insert(permissionsToInsert)

    if (insertError) {
      console.error("Error inserting role permissions:", insertError)
      throw new Error("Failed to update role permissions")
    }
  }

  revalidatePath("/admin/roles")
  return { success: true }
}
