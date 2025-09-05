import { z } from "zod"

// Certificate schema for validation
export const CertificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  certificate_number: z.string().nullable().optional(),
  issuing_authority: z.string().nullable().optional(),
  issue_date: z.string().nullable().optional().refine((date) => {
    if (!date) return true // Allow null/undefined
    // Validate date format if provided
    return !isNaN(Date.parse(date))
  }, "Invalid date format"),
  expiry_date: z.string().nullable().optional().refine((date) => {
    if (!date) return true // Allow null/undefined
    // Validate date format if provided
    return !isNaN(Date.parse(date))
  }, "Invalid date format"),
  image_url: z.string().nullable().optional().refine((url) => {
    if (!url) return true // Allow null/undefined
    // Basic URL validation if provided
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }, "Invalid URL format"),
  document_url: z.string().nullable().optional().refine((url) => {
    if (!url) return true // Allow null/undefined
    // Basic URL validation if provided
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }, "Invalid URL format"),
  is_active: z.boolean().default(true),
  display_order: z.number().default(0),
})

export type Certificate = {
  id: string
  title: string
  description: string | null
  certificate_number: string | null
  issuing_authority: string | null
  issue_date: string | null
  expiry_date: string | null
  image_url: string | null
  document_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}