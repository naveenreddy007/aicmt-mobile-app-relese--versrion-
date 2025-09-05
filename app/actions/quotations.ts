"use server"

import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"

export async function getQuotationStats() {
  noStore()
  const supabase = createClient()

  const { count: total, error: totalError } = await supabase
    .from("quotations")
    .select("*", { count: "exact", head: true })

  if (totalError) {
    console.error("Error fetching total quotation count:", totalError)
    throw new Error("Could not fetch total quotation statistics.")
  }

  const { count: pending, error: pendingError } = await supabase
    .from("quotations")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  if (pendingError) {
    console.error("Error fetching pending quotation count:", pendingError)
    throw new Error("Could not fetch pending quotation statistics.")
  }

  const { count: approved, error: approvedError } = await supabase
    .from("quotations")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")

  if (approvedError) {
    console.error("Error fetching approved quotation count:", approvedError)
    throw new Error("Could not fetch approved quotation statistics.")
  }

  const { data: monthlyData, error: monthlyError } = await supabase.rpc(
    "get_monthly_quotation_stats"
  )

  if (monthlyError) {
    console.error("Error fetching monthly quotation stats:", monthlyError)
    throw new Error("Could not fetch monthly quotation statistics.")
  }

  return {
    total: total ?? 0,
    pending: pending ?? 0,
    approved: approved ?? 0,
    monthly: monthlyData || [],
  }
}

export async function getQuotationHistory(quotationId: string) {
  noStore()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('quotation_history')
    .select('*, author:profiles(first_name, last_name, avatar_url)')
    .eq('quotation_id', quotationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching quotation history:', error)
    throw new Error('Could not fetch quotation history.')
  }

  return data
}