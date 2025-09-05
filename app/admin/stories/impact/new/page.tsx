import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ImpactStoryForm } from "@/components/admin/stories/impact-story-form"

export default function NewImpactStoryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stories/impact">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Impact Stories
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Impact Story</h1>
          <p className="text-muted-foreground">
            Create a new story showcasing your positive impact
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <ImpactStoryForm />
      </div>
    </div>
  )
}