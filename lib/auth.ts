import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"

// Use the existing supabase client to prevent multiple instances
export const getSupabaseClient = () => {
  return supabase
}

// Server-side client (should be used in server components or API routes)
export const getServerSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")
}

// User roles
export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  CUSTOMER: "customer",
}

// Check if user has required role
export const hasRole = (user, requiredRole) => {
  if (!user || !user.role) return false

  // Admin has access to everything
  if (user.role === ROLES.ADMIN) return true

  // Staff has access to staff and customer areas
  if (user.role === ROLES.STAFF && requiredRole === ROLES.CUSTOMER) return true

  // Direct role match
  return user.role === requiredRole
}

// This function is no longer used in the admin layout
// We're directly using the Supabase client instead
export async function getSession() {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get("sb-refresh-token")?.value
  const accessToken = cookieStore.get("sb-access-token")?.value

  if (!refreshToken || !accessToken) {
    return null
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: null, // We'll fetch the user separately
  }
}
