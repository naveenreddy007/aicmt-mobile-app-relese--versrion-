"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, Loader2 } from "lucide-react"
import { getAnalyticsData } from "@/app/actions/analytics"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// Fallback data for when no real data is available
const fallbackVisitorData = [
  { date: "Jan", visitors: 0, pageviews: 0 },
  { date: "Feb", visitors: 0, pageviews: 0 },
  { date: "Mar", visitors: 0, pageviews: 0 },
  { date: "Apr", visitors: 0, pageviews: 0 },
  { date: "May", visitors: 0, pageviews: 0 },
  { date: "Jun", visitors: 0, pageviews: 0 },
]

const fallbackDeviceData = [
  { name: "Desktop", value: 0 },
  { name: "Mobile", value: 0 },
  { name: "Tablet", value: 0 },
]

const fallbackSourceData = [
  { name: "Organic Search", value: 0 },
  { name: "Direct", value: 0 },
  { name: "Social Media", value: 0 },
  { name: "Referral", value: 0 },
  { name: "Email", value: 0 },
]

const fallbackPageData = [
  { name: "Home", views: 0 },
  { name: "Products", views: 0 },
  { name: "About", views: 0 },
  { name: "Blog", views: 0 },
  { name: "Certification", views: 0 },
  { name: "Contact", views: 0 },
]

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "12m" | "custom">("30d")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [analyticsData, setAnalyticsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let period = "30days"
        switch (dateRange) {
          case "7d":
            period = "7days"
            break
          case "30d":
            period = "30days"
            break
          case "90d":
            period = "90days"
            break
          case "12m":
            period = "year"
            break
          default:
            period = "30days"
        }

        const data = await getAnalyticsData(period)
        setAnalyticsData(data)
      } catch (err) {
        console.error("Error fetching analytics:", err)
        setError("Failed to load analytics data")
        setAnalyticsData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange])

  // Process data for charts
  const processedVisitorData = analyticsData.length > 0
    ? analyticsData.map(item => ({
        date: format(new Date(item.date), "MMM dd"),
        visitors: item.visitors || 0,
        pageviews: item.pageviews || 0,
      }))
    : fallbackVisitorData

  // For now, use fallback data for device, source, and page data since these aren't in the analytics table
  const deviceData = fallbackDeviceData
  const sourceData = fallbackSourceData
  const pageData = fallbackPageData

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Select defaultValue="30d" onValueChange={(value) => setDateRange(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>

        {dateRange === "custom" && (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
            <span>to</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Overview</CardTitle>
              <CardDescription>
                {isLoading ? "Loading analytics data..." :
                 error ? "Error loading data" :
                 analyticsData.length === 0 ? "No analytics data available yet" :
                 "Visitors and page views over time"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processedVisitorData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="pageviews" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  {analyticsData.length === 0 ? "No traffic source data available yet" : "Where your visitors are coming from"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {sourceData.every(item => item.value === 0) ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No traffic source data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>
                  {analyticsData.length === 0 ? "No device data available yet" : "Devices used to access your site"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {deviceData.every(item => item.value === 0) ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No device data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Analysis</CardTitle>
              <CardDescription>
                {analyticsData.length === 0 ? "No traffic data available yet" : "Detailed traffic sources and referrers"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {sourceData.every(item => item.value === 0) ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No traffic data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Content</CardTitle>
              <CardDescription>
                {analyticsData.length === 0 ? "No page view data available yet" : "Most viewed pages on your website"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {pageData.every(item => item.views === 0) ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No page view data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pageData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device & Browser Analysis</CardTitle>
              <CardDescription>
                {analyticsData.length === 0 ? "No device data available yet" : "Breakdown of devices and browsers used"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {deviceData.every(item => item.value === 0) ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No device data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
