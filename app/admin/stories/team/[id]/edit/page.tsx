import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getTeamMemberById } from "@/app/actions/stories"
import { TeamMemberForm } from "@/components/admin/stories/team-member-form"

interface EditTeamMemberPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditTeamMemberPage({
  params,
}: EditTeamMemberPageProps) {
  const { id } = await params
  const teamMember = await getTeamMemberById(id)

  if (!teamMember) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Edit Team Member</h1>
          <p className="text-muted-foreground">
            Update profile: {teamMember.name}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <TeamMemberForm teamMember={teamMember} />
      </div>
    </div>
  )
}