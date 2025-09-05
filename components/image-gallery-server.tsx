import { getGalleryItemsByCategory } from "@/app/actions/gallery"
import { ImageGalleryClient } from "@/components/image-gallery"

// Server-side wrapper component
export async function ImageGallery() {
  try {
    const galleryData = await getGalleryItemsByCategory()
    return <ImageGalleryClient galleryData={galleryData} />
  } catch (error) {
    console.error("Error loading gallery data:", error)
    return (
      <div className="w-full max-w-6xl mx-auto py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Gallery</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Explore our facilities, products, and events through our image gallery
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">
            Unable to load gallery images at the moment. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}