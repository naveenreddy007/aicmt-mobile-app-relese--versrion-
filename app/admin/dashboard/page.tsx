import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAnalyticsSummary } from "@/app/actions/analytics"
import { getInquiryStats } from "@/app/actions/inquiries"
import { getProductStats } from "@/app/actions/products"
import AnalyticsOverview from "@/components/admin/analytics-overview"
import RecentInquiries from "@/components/admin/recent-inquiries"
import RecentBlogPosts from "@/components/admin/recent-blog-posts"
import ProductsOverview from "@/components/admin/products-overview"
import QuotationAnalytics from "@/components/admin/quotation-analytics"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardPage() {
  // Fetch data for dashboard
  const analyticsSummary = await getAnalyticsSummary()
  const inquiryStats = await getInquiryStats()
  const productStats = await getProductStats()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
              <TabsTrigger value="quotations">Quotations</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pageviews</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsSummary.totalPageviews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +{analyticsSummary.pageviewsGrowth}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsSummary.totalVisitors.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+{analyticsSummary.visitorsGrowth}% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inquiryStats.new}</div>
                    <p className="text-xs text-muted-foreground">{inquiryStats.total} total inquiries</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{productStats.active}</div>
                    <p className="text-xs text-muted-foreground">{productStats.total} total products</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Website Traffic</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Suspense
                      fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}
                    >
                      <AnalyticsOverview />
                    </Suspense>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Inquiries</CardTitle>
                    <CardDescription>{inquiryStats.new} new inquiries this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<div className="h-[350px] flex items-center justify-center">Loading inquiries...</div>}
                    >
                      <RecentInquiries />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Blog Posts</CardTitle>
                    <CardDescription>Latest content published on the site</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<div className="h-[350px] flex items-center justify-center">Loading blog posts...</div>}
                    >
                      <RecentBlogPosts />
                    </Suspense>
                  </CardContent>
                </Card>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Product Overview</CardTitle>
                    <CardDescription>Product performance and inventory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<div className="h-[350px] flex items-center justify-center">Loading products...</div>}
                    >
                      <ProductsOverview />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="quotations" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                <Suspense
                  fallback={<div className="h-[350px] flex items-center justify-center">Loading quotations...</div>}
                >
                  <QuotationAnalytics />
                </Suspense>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
