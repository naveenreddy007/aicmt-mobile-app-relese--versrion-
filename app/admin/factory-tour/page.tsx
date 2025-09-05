import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FactoryToursTable } from "@/components/admin/factory-tours-table"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Factory Tour Management | Admin Dashboard",
  description: "Manage factory tour videos and content",
}

export default function FactoryTourPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factory Tour</h1>
          <p className="text-muted-foreground">
            Manage factory tour videos and content
          </p>
        </div>
        <Link href="/admin/factory-tour/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Factory Tour Videos</CardTitle>
          <CardDescription>
            View and manage all factory tour videos and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FactoryToursTable />
        </CardContent>
      </Card>
    </div>
  )
}