import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EventsTable } from "@/components/admin/events-table"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Events Management | Admin Dashboard",
  description: "Manage events and announcements",
}

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage your events and announcements
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            View and manage all events and announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventsTable />
        </CardContent>
      </Card>
    </div>
  )
}