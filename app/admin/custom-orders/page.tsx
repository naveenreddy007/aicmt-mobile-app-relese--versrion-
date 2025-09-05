import type { Metadata } from "next"
import { getCustomOrderStats } from "@/app/actions/custom-orders"
import { getCustomOrdersWithBillNumbers } from "@/app/actions/bill-numbers"
import { CustomOrdersTable } from "@/components/admin/custom-orders-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Custom Orders | Admin Dashboard",
  description: "Manage custom product orders and quotes",
}

export default async function CustomOrdersPage() {
  // Fetch custom orders from the database with bill numbers
  const ordersResult = await getCustomOrdersWithBillNumbers()
  const orders = ordersResult.success ? ordersResult.data : []
  const stats = await getCustomOrderStats()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Custom Orders</h1>
        <Button asChild>
          <Link href="/admin/custom-orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Order
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
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
            <CardTitle className="text-sm font-medium">Quoted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quoted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProduction}</div>
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
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="quoted">Quoted</TabsTrigger>
          <TabsTrigger value="in-production">In Production</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <CustomOrdersTable orders={orders} />
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <CustomOrdersTable orders={orders.filter((order) => order.status === "new")} />
        </TabsContent>

        <TabsContent value="quoted" className="space-y-4">
          <CustomOrdersTable orders={orders.filter((order) => order.status === "quoted")} />
        </TabsContent>

        <TabsContent value="in-production" className="space-y-4">
          <CustomOrdersTable orders={orders.filter((order) => order.status === "in-production")} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <CustomOrdersTable orders={orders.filter((order) => order.status === "completed")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
