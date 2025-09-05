import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getJourneyMilestoneById } from "@/app/actions/stories"
import { JourneyMilestoneForm } from "@/components/admin/stories/journey-milestone-form"

interface EditJourneyMilestonePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditJourneyMilestonePage({
  params,
}: EditJourneyMilestonePageProps) {
  const { id } = await params
  const milestone = await getJourneyMilestoneById(id)

  if (!milestone) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stories/journey">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Journey
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Journey Milestone</h1>
          <p className="text-muted-foreground">
            Update milestone: {milestone.title}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <JourneyMilestoneForm milestone={milestone} />
      </div>
    </div>
  )
}