import type { Metadata } from "next"
import { getInquiries, getInquiryStats } from "@/app/actions/inquiries"
import { InquiriesTable } from "@/components/admin/inquiries-table"
import { InquiriesChart } from "@/components/admin/inquiries-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Inquiries | Admin Dashboard",
  description: "Manage customer inquiries and contact form submissions",
}

export default async function InquiriesPage() {
  // Fetch inquiries from the database
  const inquiries = await getInquiries()
  const stats = await getInquiryStats()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inquiries</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Inquiries</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <InquiriesTable inquiries={inquiries} />
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <InquiriesTable inquiries={inquiries.filter((inquiry) => inquiry.status === "new")} />
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <InquiriesTable inquiries={inquiries.filter((inquiry) => inquiry.status === "in-progress")} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <InquiriesTable inquiries={inquiries.filter((inquiry) => inquiry.status === "completed")} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Analytics</CardTitle>
              <CardDescription>Inquiry trends and statistics over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <InquiriesChart inquiries={inquiries} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
