import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AchievementForm } from "@/components/admin/stories/achievement-form"

export default function NewAchievementPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Add Achievement</h1>
          <p className="text-muted-foreground">
            Create a new achievement or recognition
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <AchievementForm />
      </div>
    </div>
  )
}