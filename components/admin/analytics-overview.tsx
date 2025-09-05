"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAnalyticsData } from "@/app/actions/analytics"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AnalyticsOverview() {
  const [analyticsData, setAnalyticsData] = useState([])
  const [period, setPeriod] = useState("30days")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const data = await getAnalyticsData(period)

      // Format dates for display
      const formattedData = data.map((item) => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString(),
      }))

      setAnalyticsData(formattedData)
      setIsLoading(false)
    }

    fetchData()
  }, [period])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="30days" onValueChange={setPeriod} className="w-full">
          <TabsList className="grid grid-cols-4 w-[400px]">
            <TabsTrigger value="7days">7 days</TabsTrigger>
            <TabsTrigger value="30days">30 days</TabsTrigger>
            <TabsTrigger value="90days">90 days</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="h-[350px] flex items-center justify-center">Loading chart...</div>
      ) : (
        <ChartContainer
          config={{
            pageviews: {
              label: "Pageviews",
              color: "hsl(var(--chart-1))",
            },
            visitors: {
              label: "Visitors",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => value}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="pageviews"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                stroke="var(--color-pageviews)"
              />
              <Line
                type="monotone"
                dataKey="visitors"
                strokeWidth={2}
                stroke="var(--color-visitors)"
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}
