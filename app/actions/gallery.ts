"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Gallery item schema
const GalleryItemSchema = z.object({
  media_id: z.string().uuid(),
  category: z.enum(["facility", "products", "events"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  alt_text: z.string().optional(),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

const UpdateGalleryItemSchema = GalleryItemSchema.partial().extend({
  id: z.string().uuid(),
})

export type GalleryItem = {
  id: string
  media_id: string
  category: "facility" | "products" | "events"
  title: string
  description?: string
  alt_text?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  media_library?: {
    id: string
    filename: string
    original_name: string
    file_path: string
    file_size: number
    mime_type: string
    alt_text?: string
    caption?: string
  }
  url?: string
  type?: string
  size?: string
  name?: string
}

// Get all gallery items with media information
export async function getGalleryItems(category?: string): Promise<GalleryItem[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    let query = supabase
      .from("gallery")
      .select(`
        *,
        media_library (
          id,
          filename,
          original_name,
          file_path,
          file_size,
          mime_type,
          alt_text,
          caption
        )
      `)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
    
    if (category) {
      query = query.eq("category", category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error("Error fetching gallery items:", error)
      return []
    }
    
    // Generate public URLs and format data
    const itemsWithUrls = await Promise.all(
      (data || []).map(async (item) => {
        let url = "/placeholder.svg"
        let type = "unknown"
        let size = "0 B"
        let name = item.title
        
        if (item.media_library?.file_path) {
          const { data: urlData } = supabase.storage
            .from("media-library")
            .getPublicUrl(item.media_library.file_path)
          
          if (urlData?.publicUrl) {
            url = urlData.publicUrl
          }
          
          // Determine file type
          if (item.media_library.mime_type) {
            if (item.media_library.mime_type.startsWith("image/")) {
              type = "image"
            } else if (item.media_library.mime_type.startsWith("video/")) {
              type = "video"
            } else if (item.media_library.mime_type.includes("pdf")) {
              type = "pdf"
            } else {
              type = "document"
            }
          }
          
          // Format file size
          if (item.media_library.file_size) {
            const bytes = item.media_library.file_size
            if (bytes === 0) {
              size = "0 B"
            } else {
              const k = 1024
              const sizes = ["B", "KB", "MB", "GB"]
              const i = Math.floor(Math.log(bytes) / Math.log(k))
              size = `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
            }
          }
          
          name = item.media_library.original_name || item.title
        }
        
        return {
          ...item,
          url,
          type,
          size,
          name,
        }
      })
    )
    
    return itemsWithUrls
  } catch (error) {
    console.error("Error in getGalleryItems:", error)
    return []
  }
}

// Get gallery items by category
export async function getGalleryItemsByCategory() {
  try {
    const allItems = await getGalleryItems()
    
    const categorizedItems = {
      facility: allItems.filter(item => item.category === "facility"),
      products: allItems.filter(item => item.category === "products"),
      events: allItems.filter(item => item.category === "events"),
    }
    
    return categorizedItems
  } catch (error) {
    console.error("Error in getGalleryItemsByCategory:", error)
    return {
      facility: [],
      products: [],
      events: [],
    }
  }
}

// Get single gallery item
export async function getGalleryItem(id: string): Promise<GalleryItem | null> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("gallery")
      .select(`
        *,
        media_library (
          id,
          filename,
          original_name,
          file_path,
          file_size,
          mime_type,
          alt_text,
          caption
        )
      `)
      .eq("id", id)
      .single()
    
    if (error) {
      console.error("Error fetching gallery item:", error)
      return null
    }
    
    // Generate public URL
    let url = "/placeholder.svg"
    if (data.media_library?.file_path) {
      const { data: urlData } = supabase.storage
        .from("media-library")
        .getPublicUrl(data.media_library.file_path)
      
      if (urlData?.publicUrl) {
        url = urlData.publicUrl
      }
    }
    
    return {
      ...data,
      url,
    }
  } catch (error) {
    console.error("Error in getGalleryItem:", error)
    return null
  }
}

// Create gallery item
export async function createGalleryItem(formData: FormData) {
  try {
    const rawData = {
      media_id: formData.get("media_id") as string,
      category: formData.get("category") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string || undefined,
      alt_text: formData.get("alt_text") as string || undefined,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    }
    
    const validatedData = GalleryItemSchema.parse(rawData)
    
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("gallery")
      .insert([validatedData])
      .select()
      .single()
    
    if (error) {
      console.error("Error creating gallery item:", error)
      return { success: false, error: error.message }
    }
    
    revalidatePath("/admin/gallery")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in createGalleryItem:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create gallery item" 
    }
  }
}

// Update gallery item
export async function updateGalleryItem(formData: FormData) {
  try {
    const rawData = {
      id: formData.get("id") as string,
      media_id: formData.get("media_id") as string || undefined,
      category: formData.get("category") as string || undefined,
      title: formData.get("title") as string || undefined,
      description: formData.get("description") as string || undefined,
      alt_text: formData.get("alt_text") as string || undefined,
      display_order: formData.get("display_order") ? parseInt(formData.get("display_order") as string) : undefined,
      is_active: formData.get("is_active") ? formData.get("is_active") === "true" : undefined,
    }
    
    const validatedData = UpdateGalleryItemSchema.parse(rawData)
    const { id, ...updateData } = validatedData
    
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("gallery")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating gallery item:", error)
      return { success: false, error: error.message }
    }
    
    revalidatePath("/admin/gallery")
    revalidatePath("/")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateGalleryItem:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update gallery item" 
    }
  }
}

// Delete gallery item
export async function deleteGalleryItem(id: string) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting gallery item:", error)
      return { success: false, error: error.message }
    }
    
    revalidatePath("/admin/gallery")
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteGalleryItem:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete gallery item" 
    }
  }
}

// Reorder gallery items
export async function reorderGalleryItems(items: { id: string; display_order: number }[]) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const updates = items.map(item => 
      supabase
        .from("gallery")
        .update({ display_order: item.display_order })
        .eq("id", item.id)
    )
    
    await Promise.all(updates)
    
    revalidatePath("/admin/gallery")
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Error in reorderGalleryItems:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to reorder gallery items" 
    }
  }
}