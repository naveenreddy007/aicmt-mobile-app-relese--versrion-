import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeft } from "lucide-react"
import { getImpactStories } from "@/app/actions/stories"
import { ImpactStoriesTable } from "@/components/admin/stories/impact-stories-table"

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

export default async function ImpactStoriesPage() {
  const impactStories = await getImpactStories()
  const activeStories = impactStories.filter(s => s.is_active)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stories">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stories
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Impact Stories</h1>
          <p className="text-muted-foreground">
            Manage stories showcasing your positive impact and success stories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {activeStories.length} Active
          </Badge>
          <Badge variant="outline">
            {impactStories.length} Total
          </Badge>
          <Link href="/admin/stories/impact/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Impact Story
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<LoadingTable />}>
        <ImpactStoriesTable stories={impactStories} />
      </Suspense>

      {impactStories.length === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>No Impact Stories Yet</CardTitle>
            <CardDescription>
              Start showcasing your positive impact by adding your first story.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/stories/impact/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Impact Story
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}