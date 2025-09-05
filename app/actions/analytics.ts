"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getAnalyticsSummary() {
  const supabase = await createSupabaseServerClient()

  // Get current month data
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get previous month data
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

  // Format dates for queries
  const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString()
  const previousMonthStart = new Date(previousYear, previousMonth, 1).toISOString()
  const previousMonthEnd = new Date(currentYear, currentMonth, 0).toISOString()

  try {
    // Get total pageviews and visitors for current month
    const { data: currentMonthData, error: currentError } = await supabase
      .from("analytics")
      .select("pageviews, visitors")
      .gte("date", currentMonthStart)

    if (currentError) throw currentError

    // Get total pageviews and visitors for previous month
    const { data: previousMonthData, error: previousError } = await supabase
      .from("analytics")
      .select("pageviews, visitors")
      .gte("date", previousMonthStart)
      .lte("date", previousMonthEnd)

    if (previousError) throw previousError

    // Calculate totals
    const currentPageviews = Array.isArray(currentMonthData) ? currentMonthData.reduce((sum: number, day: any) => sum + (day.pageviews || 0), 0) : 0
    const currentVisitors = Array.isArray(currentMonthData) ? currentMonthData.reduce((sum: number, day: any) => sum + (day.visitors || 0), 0) : 0

    const previousPageviews = Array.isArray(previousMonthData) ? previousMonthData.reduce((sum: number, day: any) => sum + (day.pageviews || 0), 0) : 0
    const previousVisitors = Array.isArray(previousMonthData) ? previousMonthData.reduce((sum: number, day: any) => sum + (day.visitors || 0), 0) : 0

    // Calculate growth percentages
    const pageviewsGrowth =
      previousPageviews === 0 ? 100 : Math.round(((currentPageviews - previousPageviews) / previousPageviews) * 100)

    const visitorsGrowth =
      previousVisitors === 0 ? 100 : Math.round(((currentVisitors - previousVisitors) / previousVisitors) * 100)

    // Get all-time totals
    const { data: allTimeData, error: allTimeError } = await supabase.from("analytics").select("pageviews, visitors")

    if (allTimeError) throw allTimeError

    const totalPageviews = Array.isArray(allTimeData) ? allTimeData.reduce((sum: number, day: any) => sum + (day.pageviews || 0), 0) : 0
    const totalVisitors = Array.isArray(allTimeData) ? allTimeData.reduce((sum: number, day: any) => sum + (day.visitors || 0), 0) : 0

    return {
      currentMonthPageviews: currentPageviews,
      currentMonthVisitors: currentVisitors,
      previousMonthPageviews: previousPageviews,
      previousMonthVisitors: previousVisitors,
      pageviewsGrowth,
      visitorsGrowth,
      totalPageviews,
      totalVisitors,
    }
  } catch (error) {
    console.error("Error fetching analytics summary:", error)
    return {
      currentMonthPageviews: 0,
      currentMonthVisitors: 0,
      previousMonthPageviews: 0,
      previousMonthVisitors: 0,
      pageviewsGrowth: 0,
      visitorsGrowth: 0,
      totalPageviews: 0,
      totalVisitors: 0,
    }
  }
}

export async function getAnalyticsData(period = "30days") {
  const supabase = await createSupabaseServerClient()

  // Calculate date range based on period
  const endDate = new Date()
  const startDate = new Date()

  switch (period) {
    case "7days":
      startDate.setDate(endDate.getDate() - 7)
      break
    case "30days":
      startDate.setDate(endDate.getDate() - 30)
      break
    case "90days":
      startDate.setDate(endDate.getDate() - 90)
      break
    case "year":
      startDate.setFullYear(endDate.getFullYear() - 1)
      break
    default:
      startDate.setDate(endDate.getDate() - 30)
  }

  try {
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .gte("date", startDate.toISOString())
      .lte("date", endDate.toISOString())
      .order("date", { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return []
  }
}
