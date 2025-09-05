"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data - in a real app, this would come from your API
const data = [
  { date: "May 1", visitors: 124 },
  { date: "May 2", visitors: 142 },
  { date: "May 3", visitors: 156 },
  { date: "May 4", visitors: 132 },
  { date: "May 5", visitors: 148 },
  { date: "May 6", visitors: 165 },
  { date: "May 7", visitors: 187 },
  { date: "May 8", visitors: 201 },
  { date: "May 9", visitors: 176 },
  { date: "May 10", visitors: 164 },
  { date: "May 11", visitors: 182 },
  { date: "May 12", visitors: 208 },
  { date: "May 13", visitors: 224 },
  { date: "May 14", visitors: 236 },
  { date: "May 15", visitors: 229 },
  { date: "May 16", visitors: 243 },
  { date: "May 17", visitors: 258 },
  { date: "May 18", visitors: 271 },
  { date: "May 19", visitors: 286 },
  { date: "May 20", visitors: 298 },
  { date: "May 21", visitors: 312 },
  { date: "May 22", visitors: 324 },
  { date: "May 23", visitors: 337 },
  { date: "May 24", visitors: 351 },
  { date: "May 25", visitors: 368 },
  { date: "May 26", visitors: 384 },
  { date: "May 27", visitors: 396 },
  { date: "May 28", visitors: 412 },
  { date: "May 29", visitors: 427 },
  { date: "May 30", visitors: 438 },
]

export function DashboardChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis
          dataKey="date"
          stroke={isDark ? "#888" : "#666"}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.split(" ")[1]}
        />
        <YAxis stroke={isDark ? "#888" : "#666"} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            border: `1px solid ${isDark ? "#444" : "#ddd"}`,
            borderRadius: "4px",
            color: isDark ? "#fff" : "#333",
          }}
        />
        <Bar dataKey="visitors" fill="#4ade80" radius={[4, 4, 0, 0]} name="Unique Visitors" />
      </BarChart>
    </ResponsiveContainer>
  )
}
