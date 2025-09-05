"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { CertificateSchema, type Certificate } from "@/lib/types/certificates"

// Re-export Certificate type for convenience
export type { Certificate }

// Get all certificates
export async function getCertificates(): Promise<Certificate[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true })
    
    if (error) {
      console.error("Error fetching certificates:", error)
      throw new Error("Failed to fetch certificates")
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getCertificates:", error)
    throw new Error("Failed to fetch certificates")
  }
}

// Get active certificates for public display
export async function getActiveCertificates(): Promise<Certificate[]> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    
    if (error) {
      console.error("Error fetching active certificates:", error)
      throw new Error("Failed to fetch active certificates")
    }
    
    return data || []
  } catch (error) {
    console.error("Error in getActiveCertificates:", error)
    throw new Error("Failed to fetch active certificates")
  }
}

// Get certificate by ID
export async function getCertificateById(id: string): Promise<Certificate | null> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      if (error.code === "PGRST116") {
        return null // Certificate not found
      }
      console.error("Error fetching certificate:", error)
      throw new Error("Failed to fetch certificate")
    }
    
    return data
  } catch (error) {
    console.error("Error in getCertificateById:", error)
    throw new Error("Failed to fetch certificate")
  }
}

// Create new certificate
export async function createCertificate(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Extract and validate form data
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      certificate_number: formData.get("certificate_number") as string || null,
      issuing_authority: formData.get("issuing_authority") as string || null,
      issue_date: formData.get("issue_date") as string || null,
      expiry_date: formData.get("expiry_date") as string || null,
      image_url: formData.get("image_url") as string || null,
      document_url: formData.get("document_url") as string || null,
      is_active: formData.get("is_active") === "true",
      display_order: parseInt(formData.get("display_order") as string) || 0,
    }
    
    // Convert empty strings to null for date fields
    const processedData = {
      ...rawData,
      description: rawData.description === "" ? null : rawData.description,
      certificate_number: rawData.certificate_number === "" ? null : rawData.certificate_number,
      issuing_authority: rawData.issuing_authority === "" ? null : rawData.issuing_authority,
      issue_date: rawData.issue_date === "" ? null : rawData.issue_date,
      expiry_date: rawData.expiry_date === "" ? null : rawData.expiry_date,
      image_url: rawData.image_url === "" ? null : rawData.image_url,
      document_url: rawData.document_url === "" ? null : rawData.document_url,
    }
    
    // Validate data
    const validatedData = CertificateSchema.parse(processedData)
    
    // Insert certificate
    const { data, error } = await supabase
      .from("certifications")
      .insert([validatedData])
      .select()
      .single()
    
    if (error) {
      console.error("Error creating certificate:", error)
      throw new Error("Failed to create certificate")
    }
    
    revalidatePath("/admin/certifications")
    revalidatePath("/certification")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in createCertificate:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid form data", details: error.errors }
    }
    return { success: false, error: "Failed to create certificate" }
  }
}

// Update certificate
export async function updateCertificate(id: string, formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Extract and validate form data
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      certificate_number: formData.get("certificate_number") as string || null,
      issuing_authority: formData.get("issuing_authority") as string || null,
      issue_date: formData.get("issue_date") as string || null,
      expiry_date: formData.get("expiry_date") as string || null,
      image_url: formData.get("image_url") as string || null,
      document_url: formData.get("document_url") as string || null,
      is_active: formData.get("is_active") === "true",
      display_order: parseInt(formData.get("display_order") as string) || 0,
    }
    
    // Convert empty strings to null for date fields
    const processedData = {
      ...rawData,
      description: rawData.description === "" ? null : rawData.description,
      certificate_number: rawData.certificate_number === "" ? null : rawData.certificate_number,
      issuing_authority: rawData.issuing_authority === "" ? null : rawData.issuing_authority,
      issue_date: rawData.issue_date === "" ? null : rawData.issue_date,
      expiry_date: rawData.expiry_date === "" ? null : rawData.expiry_date,
      image_url: rawData.image_url === "" ? null : rawData.image_url,
      document_url: rawData.document_url === "" ? null : rawData.document_url,
    }
    
    // Validate data
    const validatedData = CertificateSchema.parse(processedData)
    
    // Update certificate
    const { data, error } = await supabase
      .from("certifications")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating certificate:", error)
      throw new Error("Failed to update certificate")
    }
    
    revalidatePath("/admin/certifications")
    revalidatePath("/certification")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateCertificate:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid form data", details: error.errors }
    }
    return { success: false, error: "Failed to update certificate" }
  }
}

// Delete certificate
export async function deleteCertificate(id: string) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting certificate:", error)
      throw new Error("Failed to delete certificate")
    }
    
    revalidatePath("/admin/certifications")
    revalidatePath("/certification")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteCertificate:", error)
    return { success: false, error: "Failed to delete certificate" }
  }
}

// Toggle certificate status
export async function toggleCertificateStatus(id: string, currentStatus: boolean) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("certifications")
      .update({ 
        is_active: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error toggling certificate status:", error)
      throw new Error("Failed to update certificate status")
    }
    
    revalidatePath("/admin/certifications")
    revalidatePath("/certification")
    
    return { success: true, data }
  } catch (error) {
    console.error("Error in toggleCertificateStatus:", error)
    return { success: false, error: "Failed to update certificate status" }
  }
}

// Server action for form submission (create)
export async function createCertificateAction(formData: FormData) {
  const result = await createCertificate(formData)
  
  if (result.success) {
    redirect("/admin/certifications")
  } else {
    throw new Error(result.error)
  }
}

// Server action for form submission (update)
export async function updateCertificateAction(id: string, formData: FormData) {
  const result = await updateCertificate(id, formData)
  
  if (result.success) {
    redirect("/admin/certifications")
  } else {
    throw new Error(result.error)
  }
}