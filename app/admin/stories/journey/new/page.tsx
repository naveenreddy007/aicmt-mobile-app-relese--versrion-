import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { JourneyMilestoneForm } from "@/components/admin/stories/journey-milestone-form"

export default function NewJourneyMilestonePage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Add Journey Milestone</h1>
          <p className="text-muted-foreground">
            Create a new milestone in your company's journey
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <JourneyMilestoneForm />
      </div>
    </div>
  )
}