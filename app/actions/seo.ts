"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSeoMetadata() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("seo_metadata").select("*").order("page_path", { ascending: true })

  if (error) {
    console.error("Error fetching SEO metadata:", error)
    throw new Error("Failed to fetch SEO metadata")
  }

  return data
}

export async function getSeoMetadataForPage(pagePath: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("seo_metadata").select("*").eq("page_path", pagePath).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned" which is fine
    console.error("Error fetching SEO metadata:", error)
    throw new Error("Failed to fetch SEO metadata")
  }

  return data
}

export async function createSeoMetadata(seoData: any) {
  const supabase = await createSupabaseServerClient()

  // Remove empty ID to let Supabase generate it
  if (seoData.id === "" || seoData.id === undefined) {
    delete seoData.id
  }

  const { data, error } = await supabase.from("seo_metadata").insert([seoData]).select()

  if (error) {
    console.error("Error creating SEO metadata:", error)
    throw new Error("Failed to create SEO metadata")
  }

  revalidatePath("/admin/seo")
  return data[0]
}

export async function updateSeoMetadata(id: string, seoData: any) {
  const supabase = await createSupabaseServerClient()

  // Don't update the ID
  if (seoData.id) {
    delete seoData.id
  }

  const { data, error } = await supabase.from("seo_metadata").update(seoData).eq("id", id).select()

  if (error) {
    console.error("Error updating SEO metadata:", error)
    throw new Error("Failed to update SEO metadata")
  }

  revalidatePath("/admin/seo")
  return data[0]
}

export async function deleteSeoMetadata(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("seo_metadata").delete().eq("id", id)

  if (error) {
    console.error("Error deleting SEO metadata:", error)
    throw new Error("Failed to delete SEO metadata")
  }

  revalidatePath("/admin/seo")
  return { success: true }
}
