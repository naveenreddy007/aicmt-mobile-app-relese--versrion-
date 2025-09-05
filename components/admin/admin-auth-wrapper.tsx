import type React from "react"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export default async function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  // Get the Supabase client
  const supabase = await createSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // No session, redirect to login
    redirect("/auth/login?callbackUrl=/admin/dashboard")
  }

  // Get the user's profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single()

  // Check if user has admin role
  if (!profile || profile.role !== "admin") {
    redirect("/unauthorized")
  }

  return <>{children}</>
}