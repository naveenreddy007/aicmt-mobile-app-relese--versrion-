"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "2023-01-01", visitors: 200, pageViews: 400 },
  { date: "2023-01-02", visitors: 220, pageViews: 420 },
  { date: "2023-01-03", visitors: 270, pageViews: 500 },
  { date: "2023-01-04", visitors: 250, pageViews: 480 },
  { date: "2023-01-05", visitors: 260, pageViews: 520 },
  { date: "2023-01-06", visitors: 300, pageViews: 600 },
  { date: "2023-01-07", visitors: 320, pageViews: 650 },
  { date: "2023-01-08", visitors: 350, pageViews: 700 },
  { date: "2023-01-09", visitors: 370, pageViews: 750 },
  { date: "2023-01-10", visitors: 390, pageViews: 780 },
  { date: "2023-01-11", visitors: 400, pageViews: 800 },
  { date: "2023-01-12", visitors: 420, pageViews: 850 },
  { date: "2023-01-13", visitors: 450, pageViews: 900 },
  { date: "2023-01-14", visitors: 470, pageViews: 950 },
]

export function DashboardStats() {
  return (
    <ChartContainer
      config={{
        visitors: {
          label: "Visitors",
          color: "hsl(var(--chart-1))",
        },
        pageViews: {
          label: "Page Views",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="visitors"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: "var(--color-visitors)", opacity: 0.8 },
            }}
            style={{
              stroke: "var(--color-visitors)",
            }}
          />
          <Line
            type="monotone"
            dataKey="pageViews"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: "var(--color-pageViews)", opacity: 0.8 },
            }}
            style={{
              stroke: "var(--color-pageViews)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
