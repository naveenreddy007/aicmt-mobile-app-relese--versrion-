import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GalleryManager } from "@/components/admin/gallery-manager"
import { getGalleryItems } from "@/app/actions/gallery"
import { getMediaItems } from "@/app/actions/media"

export const metadata = {
  title: "Gallery Management | Admin Dashboard",
  description: "Manage gallery images and categories",
}

export default async function GalleryPage() {
  const [galleryItems, mediaItems] = await Promise.all([
    getGalleryItems(),
    getMediaItems(),
  ])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gallery Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{galleryItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Active gallery images
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {galleryItems.filter(item => item.category === 'facility').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Facility images
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {galleryItems.filter(item => item.category === 'products').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Product images
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {galleryItems.filter(item => item.category === 'events').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Event images
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>
            Manage gallery images by category. Add images from your media library to display in the frontend gallery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GalleryManager 
            initialGalleryItems={galleryItems} 
            availableMedia={mediaItems}
          />
        </CardContent>
      </Card>
    </div>
  )
}