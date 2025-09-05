import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Image, BarChart3 } from "lucide-react"
import { getGalleryItems } from "@/app/actions/gallery"
import { getMediaItems } from "@/app/actions/media"
import { getAllActiveStoriesData } from "@/app/actions/stories"
import { StoriesGalleryManager } from "@/components/admin/stories-gallery-manager"

export default async function StoriesGalleryPage() {
  try {
    const [galleryItems, mediaItems, storiesData] = await Promise.all([
      getGalleryItems(),
      getMediaItems(),
      getAllActiveStoriesData()
    ])

    // Calculate statistics
    const galleryStats = {
      total: galleryItems.length,
      facility: galleryItems.filter(item => item.category === 'facility').length,
      products: galleryItems.filter(item => item.category === 'products').length,
      events: galleryItems.filter(item => item.category === 'events').length,
      active: galleryItems.filter(item => item.is_active).length
    }

    const storiesStats = {
      journey: storiesData.journey.length,
      team: storiesData.team.length,
      achievements: storiesData.achievements.length,
      impact: storiesData.impact.length,
      total: storiesData.journey.length + storiesData.team.length + storiesData.achievements.length + storiesData.impact.length
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stories & Gallery Management</h1>
          <p className="text-gray-600">
            Manage your company stories and image gallery from one central location.
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storiesStats.total}</div>
              <p className="text-xs text-muted-foreground">
                Journey: {storiesStats.journey}, Team: {storiesStats.team}, Achievements: {storiesStats.achievements}, Impact: {storiesStats.impact}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{galleryStats.total}</div>
              <p className="text-xs text-muted-foreground">
                Active: {galleryStats.active} | Inactive: {galleryStats.total - galleryStats.active}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Facility: {galleryStats.facility}, Products: {galleryStats.products}, Events: {galleryStats.events}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Media Library</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Available media files
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Management Interface */}
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        }>
          <StoriesGalleryManager 
            initialGalleryItems={galleryItems}
            initialMediaItems={mediaItems}
            initialStoriesData={storiesData}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error loading stories and gallery data:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Data</h1>
          <p className="text-gray-600">
            Unable to load stories and gallery data. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}