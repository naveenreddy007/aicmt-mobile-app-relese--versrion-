"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getMediaItems() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("media_library").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching media items:", error)
    throw new Error("Failed to fetch media items")
  }

  // Generate public URLs for each media item
  const mediaItemsWithUrls = data?.map(item => {
    const { data: urlData } = supabase.storage
      .from("media-library")
      .getPublicUrl(item.file_path)
    
    // Determine file type from mime_type
    const fileType = item.mime_type?.startsWith('image/') ? 'image' : 
                     item.mime_type?.startsWith('video/') ? 'video' : 'document'
    
    return {
      ...item,
      url: urlData.publicUrl,
      type: fileType,
      size: formatFileSize(item.file_size || 0),
      name: item.original_name || item.filename
    }
  }) || []

  return mediaItemsWithUrls
}

export async function getMediaItem(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("media_library").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching media item:", error)
    throw new Error("Failed to fetch media item")
  }

  return data
}

export async function createMediaItem(mediaData: any) {
  const supabase = await createSupabaseServerClient()

  // Remove empty ID to let Supabase generate it
  if (mediaData.id === "" || mediaData.id === undefined) {
    delete mediaData.id
  }

  // Set uploaded_by if not provided
  if (!mediaData.uploaded_by) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user?.id) {
      mediaData.uploaded_by = session.user.id
    }
  }

  const { data, error } = await supabase.from("media_library").insert([mediaData]).select()

  if (error) {
    console.error("Error creating media item:", error)
    throw new Error("Failed to create media item")
  }

  revalidatePath("/admin/media")
  return data[0]
}

export async function updateMediaItem(id: string, mediaData: any) {
  const supabase = await createSupabaseServerClient()

  // Don't update the ID
  if (mediaData.id) {
    delete mediaData.id
  }

  const { data, error } = await supabase.from("media_library").update(mediaData).eq("id", id).select()

  if (error) {
    console.error("Error updating media item:", error)
    throw new Error("Failed to update media item")
  }

  revalidatePath("/admin/media")
  revalidatePath(`/admin/media/${id}`)
  return data[0]
}

// Upload files to media library
export async function uploadMediaFiles(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const files = formData.getAll("files") as File[]
    const uploadedFiles = []

    for (const file of files) {
      if (!file || file.size === 0) continue

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = file.name.split('.').pop()
      const filename = `${timestamp}-${randomString}.${fileExtension}`
      const filePath = `uploads/${filename}`

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media-library")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Error uploading file:", uploadError)
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("media-library")
        .getPublicUrl(filePath)

      // Get file type
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'document'

      // Save metadata to database
      const { data: dbData, error: dbError } = await supabase
        .from("media_library")
        .insert({
          filename: filename,
          original_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          category: 'general',
          is_active: true,
        })
        .select()
        .single()

      if (dbError) {
        console.error("Error saving file metadata:", dbError)
        // Clean up uploaded file
        await supabase.storage.from("media-library").remove([filePath])
        throw new Error(`Failed to save metadata for ${file.name}: ${dbError.message}`)
      }

      uploadedFiles.push({
        ...dbData,
        url: urlData.publicUrl,
        type: fileType,
        size: formatFileSize(file.size),
      })
    }

    revalidatePath("/admin/media")
    return { success: true, files: uploadedFiles }
  } catch (error) {
    console.error("Error in uploadMediaFiles:", error)
    return { success: false, error: error instanceof Error ? error.message : "Upload failed" }
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export async function deleteMediaItem(id: string) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get file info first
    const { data: fileData, error: fetchError } = await supabase
      .from("media_library")
      .select("file_path")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching file data:", fetchError)
      throw new Error("Failed to fetch file data")
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("media-library")
      .remove([fileData.file_path])

    if (storageError) {
      console.error("Error deleting from storage:", storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("media_library")
      .delete()
      .eq("id", id)

    if (dbError) {
      console.error("Error deleting from database:", dbError)
      throw new Error("Failed to delete media item")
    }

    revalidatePath("/admin/media")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteMediaItem:", error)
    return { success: false, error: error instanceof Error ? error.message : "Delete failed" }
  }
}
