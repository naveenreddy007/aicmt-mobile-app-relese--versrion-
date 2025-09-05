// Removed unused imports
import { Calendar, Users, Award, TrendingUp, BookOpen } from "lucide-react"
import { getAllActiveStoriesData } from "@/app/actions/stories"
import { OurStoriesClient } from "@/components/our-stories-client"

export async function OurStories() {
  try {
    const storiesData = await getAllActiveStoriesData()
    
    // Transform data to match the expected format
    const companyStories = [
      {
        id: "journey",
        title: "Our Journey",
        icon: <Calendar className="h-5 w-5" />,
        content: storiesData.journey.map(milestone => ({
          year: milestone.year || "N/A",
          title: milestone.title,
          description: milestone.description,
          image: milestone.image_url || "/placeholder.jpg",
        })),
      },
      {
        id: "team",
        title: "Our Team",
        icon: <Users className="h-5 w-5" />,
        content: storiesData.team.map(member => ({
          name: member.name,
          description: member.description,
          image: member.image_url || "/placeholder.jpg",
          position: member.position,
          category: member.category,
        })),
      },
      {
        id: "achievements",
        title: "Achievements",
        icon: <Award className="h-5 w-5" />,
        content: storiesData.achievements.map(achievement => ({
          title: achievement.title,
          description: achievement.description,
          image: achievement.image_url || "/placeholder.jpg",
          year: achievement.year || "N/A",
          category: achievement.category,
        })),
      },
      {
        id: "impact",
        title: "Our Impact",
        icon: <TrendingUp className="h-5 w-5" />,
        content: storiesData.impact.map(story => ({
          title: story.title,
          description: story.description,
          image: story.image_url || "/placeholder.jpg",
          stats: story.stats || "",
          category: story.category,
        })),
      },
    ]
    
    // Filter out empty sections
    const filteredStories = companyStories.filter(story => story.content.length > 0)
    
    if (filteredStories.length === 0) {
      return (
        <div className="w-full max-w-6xl mx-auto py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="h-6 w-6 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Our Stories</h2>
            </div>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Our stories are being updated. Please check back soon!
            </p>
          </div>
        </div>
      )
    }

    return <OurStoriesClient stories={filteredStories} />
  } catch (error) {
    console.error("Error loading stories:", error)
    return (
      <div className="w-full max-w-6xl mx-auto py-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Our Stories</h2>
          </div>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Unable to load stories at the moment. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}

