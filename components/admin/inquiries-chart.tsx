"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InquiriesChart({ inquiries }) {
  const [timeRange, setTimeRange] = useState("month")

  // Process data for charts
  const processData = () => {
    if (!inquiries || inquiries.length === 0) {
      return { byDate: [], byType: [], byStatus: [] }
    }

    // Get date ranges
    const now = new Date()
    const startDate = new Date()

    if (timeRange === "week") {
      startDate.setDate(now.getDate() - 7)
    } else if (timeRange === "month") {
      startDate.setMonth(now.getMonth() - 1)
    } else if (timeRange === "year") {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    // Filter inquiries by date range
    const filteredInquiries = inquiries.filter((inquiry) => {
      const inquiryDate = new Date(inquiry.created_at)
      return inquiryDate >= startDate && inquiryDate <= now
    })

    // Group by date
    const dateGroups = {}
    filteredInquiries.forEach((inquiry) => {
      const date = new Date(inquiry.created_at)
      let dateKey

      if (timeRange === "week") {
        dateKey = date.toLocaleDateString("en-US", { weekday: "short" })
      } else if (timeRange === "month") {
        dateKey = date.toLocaleDateString("en-US", { day: "2-digit" })
      } else if (timeRange === "year") {
        dateKey = date.toLocaleDateString("en-US", { month: "short" })
      }

      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = 0
      }
      dateGroups[dateKey]++
    })

    const byDate = Object.keys(dateGroups).map((date) => ({
      name: date,
      inquiries: dateGroups[date],
    }))

    // Group by type
    const typeGroups = {}
    filteredInquiries.forEach((inquiry) => {
      const type = inquiry.product_interest || "General"
      if (!typeGroups[type]) {
        typeGroups[type] = 0
      }
      typeGroups[type]++
    })

    const byType = Object.keys(typeGroups).map((type) => ({
      name: type,
      value: typeGroups[type],
    }))

    // Group by status
    const statusGroups = {}
    filteredInquiries.forEach((inquiry) => {
      const status = inquiry.status || "new"
      if (!statusGroups[status]) {
        statusGroups[status] = 0
      }
      statusGroups[status]++
    })

    const byStatus = Object.keys(statusGroups).map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusGroups[status],
    }))

    return { byDate, byType, byStatus }
  }

  const { byDate, byType, byStatus } = processData()

  return (
    <div className="space-y-4">
      <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="week">Last 7 Days</TabsTrigger>
            <TabsTrigger value="month">Last 30 Days</TabsTrigger>
            <TabsTrigger value="year">Last Year</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Inquiries Over Time</CardTitle>
            <CardDescription>Number of inquiries received over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {byDate.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDate}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inquiries" fill="#3b82f6" name="Inquiries" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No data available for the selected time range</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Inquiry Type</CardTitle>
            <CardDescription>Distribution by inquiry type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {byType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byType} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" name="Inquiries" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No data available for the selected time range</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>By Status</CardTitle>
          <CardDescription>Distribution of inquiries by status</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {byStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#f59e0b" name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No data available for the selected time range</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
