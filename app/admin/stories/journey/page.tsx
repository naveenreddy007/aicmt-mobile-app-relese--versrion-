import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeft } from "lucide-react"
import { getJourneyMilestones } from "@/app/actions/stories"
import { JourneyMilestonesTable } from "@/components/admin/stories/journey-milestones-table"
import { StoriesBreadcrumb } from "@/components/admin/stories/stories-breadcrumb"

export const dynamic = "force-dynamic"

function LoadingTable() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function JourneyMilestonesPage() {
  const milestones = await getJourneyMilestones()
  const activeMilestones = milestones.filter(m => m.is_active)

  return (
    <div className="container mx-auto py-8 px-4">
      <StoriesBreadcrumb
        items={[
          { label: "Journey Milestones", current: true }
        ]}
        className="mb-6"
      />

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stories">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stories
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Journey Milestones</h1>
          <p className="text-muted-foreground">
            Manage key moments and milestones in your company's journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {activeMilestones.length} Active
          </Badge>
          <Badge variant="outline">
            {milestones.length} Total
          </Badge>
          <Link href="/admin/stories/journey/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<LoadingTable />}>
        <JourneyMilestonesTable milestones={milestones} />
      </Suspense>

      {milestones.length === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>No Journey Milestones Yet</CardTitle>
            <CardDescription>
              Start building your company's story by adding your first milestone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/stories/journey/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Milestone
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}