import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getAchievementById } from "@/app/actions/stories"
import { AchievementForm } from "@/components/admin/stories/achievement-form"

interface EditAchievementPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditAchievementPage({
  params,
}: EditAchievementPageProps) {
  const { id } = await params
  const achievement = await getAchievementById(id)

  if (!achievement) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stories/achievements">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Achievements
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Achievement</h1>
          <p className="text-muted-foreground">
            Update achievement: {achievement.title}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <AchievementForm achievement={achievement} />
      </div>
    </div>
  )
}