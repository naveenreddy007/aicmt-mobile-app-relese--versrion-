import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { TeamMemberForm } from "@/components/admin/stories/team-member-form"

export default function NewTeamMemberPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stories/team">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Team Member</h1>
          <p className="text-muted-foreground">
            Create a new team member profile
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <TeamMemberForm />
      </div>
    </div>
  )
}