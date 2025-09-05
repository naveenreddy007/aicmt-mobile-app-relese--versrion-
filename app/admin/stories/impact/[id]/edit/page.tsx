import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getImpactStoryById } from "@/app/actions/stories"
import { ImpactStoryForm } from "@/components/admin/stories/impact-story-form"

interface EditImpactStoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditImpactStoryPage({
  params,
}: EditImpactStoryPageProps) {
  const { id } = await params
  const impactStory = await getImpactStoryById(id)

  if (!impactStory) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Edit Impact Story</h1>
          <p className="text-muted-foreground">
            Update story: {impactStory.title}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <ImpactStoryForm impactStory={impactStory} />
      </div>
    </div>
  )
}