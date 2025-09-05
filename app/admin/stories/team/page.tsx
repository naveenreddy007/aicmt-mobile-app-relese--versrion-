import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeft } from "lucide-react"
import { getTeamMembers } from "@/app/actions/stories"
import { TeamMembersTable } from "@/components/admin/stories/team-members-table"

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
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function TeamMembersPage() {
  const teamMembers = await getTeamMembers()
  const activeMembers = teamMembers.filter(m => m.is_active)

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
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team member profiles and leadership information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {activeMembers.length} Active
          </Badge>
          <Badge variant="outline">
            {teamMembers.length} Total
          </Badge>
          <Link href="/admin/stories/team/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<LoadingTable />}>
        <TeamMembersTable members={teamMembers} />
      </Suspense>

      {teamMembers.length === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>No Team Members Yet</CardTitle>
            <CardDescription>
              Start showcasing your team by adding your first team member profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/stories/team/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Team Member
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}