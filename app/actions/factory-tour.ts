'use server'

import { createSupabaseServerClient as createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Types
export interface FactoryTour {
  id: string
  title: string
  description: string | null
  video_type: 'upload' | 'url'
  video_file_path: string | null
  video_url: string | null
  thumbnail_image: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Validation schemas
const factoryTourSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
  video_type: z.enum(['upload', 'url']),
  video_url: z.string().url('Invalid URL').optional(),
  display_order: z.number().int().min(0),
  is_active: z.boolean().default(true),
})

// Get all factory tours
export async function getFactoryTours(activeOnly: boolean = false) {
  const supabase = await createClient()
  
  let query = supabase
    .from('factory_tours')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (activeOnly) {
    query = query.eq('is_active', true)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching factory tours:', error)
    throw new Error('Failed to fetch factory tours')
  }
  
  return data as FactoryTour[]
}

// Get active factory tours for public display
export async function getActiveFactoryTours() {
  return getFactoryTours(true)
}

// Get single factory tour
export async function getFactoryTour(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('factory_tours')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching factory tour:', error)
    throw new Error('Factory tour not found')
  }
  
  return data as FactoryTour
}

// Create factory tour
export async function createFactoryTour(formData: FormData) {
  const supabase = await createClient()
  
  try {
    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const video_type = formData.get('video_type') as 'upload' | 'url'
    const video_url = formData.get('video_url') as string
    const display_order = parseInt(formData.get('display_order') as string)
    const is_active = formData.get('is_active') === 'true'
    const video_file = formData.get('video_file') as File
    const thumbnail_file = formData.get('thumbnail_file') as File
    
    // Validate basic data
    const validatedData = factoryTourSchema.parse({
      title,
      description: description || undefined,
      video_type,
      video_url: video_url || undefined,
      display_order,
      is_active,
    })
    
    let video_file_path: string | null = null
    let thumbnail_image: string | null = null
    
    // Handle video upload
    if (video_type === 'upload' && video_file && video_file.size > 0) {
      const fileExt = video_file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `factory-tours/videos/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, video_file)
      
      if (uploadError) {
        console.error('Error uploading video:', uploadError)
        throw new Error('Failed to upload video file')
      }
      
      video_file_path = filePath
    }
    
    // Handle thumbnail upload
    if (thumbnail_file && thumbnail_file.size > 0) {
      const fileExt = thumbnail_file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `factory-tours/thumbnails/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, thumbnail_file)
      
      if (uploadError) {
        console.error('Error uploading thumbnail:', uploadError)
        throw new Error('Failed to upload thumbnail image')
      }
      
      thumbnail_image = filePath
    }
    
    // Insert into database
    const { data, error } = await supabase
      .from('factory_tours')
      .insert({
        title: validatedData.title,
        description: validatedData.description || null,
        video_type: validatedData.video_type,
        video_file_path,
        video_url: validatedData.video_url || null,
        thumbnail_image,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating factory tour:', error)
      throw new Error('Failed to create factory tour')
    }
    
    revalidatePath('/admin/factory-tour')
    revalidatePath('/factory-tour')
    
    return { success: true, data }
  } catch (error) {
    console.error('Error in createFactoryTour:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}

// Update factory tour
export async function updateFactoryTour(id: string, formData: FormData) {
  const supabase = await createClient()
  
  try {
    // Get existing tour
    const existingTour = await getFactoryTour(id)
    
    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const video_type = formData.get('video_type') as 'upload' | 'url'
    const video_url = formData.get('video_url') as string
    const display_order = parseInt(formData.get('display_order') as string)
    const is_active = formData.get('is_active') === 'true'
    const video_file = formData.get('video_file') as File
    const thumbnail_file = formData.get('thumbnail_file') as File
    
    // Validate basic data
    const validatedData = factoryTourSchema.parse({
      title,
      description: description || undefined,
      video_type,
      video_url: video_url || undefined,
      display_order,
      is_active,
    })
    
    let video_file_path = existingTour.video_file_path
    let thumbnail_image = existingTour.thumbnail_image
    
    // Handle video upload
    if (video_type === 'upload' && video_file && video_file.size > 0) {
      // Delete old video if exists
      if (existingTour.video_file_path) {
        await supabase.storage
          .from('videos')
          .remove([existingTour.video_file_path])
      }
      
      const fileExt = video_file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `factory-tours/videos/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, video_file)
      
      if (uploadError) {
        console.error('Error uploading video:', uploadError)
        throw new Error('Failed to upload video file')
      }
      
      video_file_path = filePath
    } else if (video_type === 'url') {
      // If switching to URL, remove uploaded file
      if (existingTour.video_file_path) {
        await supabase.storage
          .from('videos')
          .remove([existingTour.video_file_path])
        video_file_path = null
      }
    }
    
    // Handle thumbnail upload
    if (thumbnail_file && thumbnail_file.size > 0) {
      // Delete old thumbnail if exists
      if (existingTour.thumbnail_image) {
        await supabase.storage
          .from('images')
          .remove([existingTour.thumbnail_image])
      }
      
      const fileExt = thumbnail_file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `factory-tours/thumbnails/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, thumbnail_file)
      
      if (uploadError) {
        console.error('Error uploading thumbnail:', uploadError)
        throw new Error('Failed to upload thumbnail image')
      }
      
      thumbnail_image = filePath
    }
    
    // Update in database
    const { data, error } = await supabase
      .from('factory_tours')
      .update({
        title: validatedData.title,
        description: validatedData.description || null,
        video_type: validatedData.video_type,
        video_file_path,
        video_url: validatedData.video_url || null,
        thumbnail_image,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating factory tour:', error)
      throw new Error('Failed to update factory tour')
    }
    
    revalidatePath('/admin/factory-tour')
    revalidatePath('/factory-tour')
    
    return { success: true, data }
  } catch (error) {
    console.error('Error in updateFactoryTour:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}

// Delete factory tour
export async function deleteFactoryTour(id: string) {
  const supabase = await createClient()
  
  try {
    // Get existing tour to delete files
    const existingTour = await getFactoryTour(id)
    
    // Delete associated files
    const filesToDelete = []
    if (existingTour.video_file_path) {
      filesToDelete.push(existingTour.video_file_path)
    }
    if (existingTour.thumbnail_image) {
      filesToDelete.push(existingTour.thumbnail_image)
    }
    
    if (filesToDelete.length > 0) {
      // Delete video files
      if (existingTour.video_file_path) {
        await supabase.storage
          .from('videos')
          .remove([existingTour.video_file_path])
      }
      
      // Delete thumbnail files
      if (existingTour.thumbnail_image) {
        await supabase.storage
          .from('images')
          .remove([existingTour.thumbnail_image])
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from('factory_tours')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting factory tour:', error)
      throw new Error('Failed to delete factory tour')
    }
    
    revalidatePath('/admin/factory-tour')
    revalidatePath('/factory-tour')
    
    return { success: true }
  } catch (error) {
    console.error('Error in deleteFactoryTour:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}

// Update display order
export async function updateFactoryTourOrder(tours: { id: string; display_order: number }[]) {
  const supabase = await createClient()
  
  try {
    const updates = tours.map(tour => 
      supabase
        .from('factory_tours')
        .update({ display_order: tour.display_order })
        .eq('id', tour.id)
    )
    
    await Promise.all(updates)
    
    revalidatePath('/admin/factory-tour')
    revalidatePath('/factory-tour')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating factory tour order:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}

// Get video URL for display
export async function getVideoUrl(filePath: string) {
  const supabase = await createClient()
  
  const { data } = supabase.storage
    .from('videos')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

// Get thumbnail URL for display
export async function getThumbnailUrl(filePath: string) {
  const supabase = await createClient()
  
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}