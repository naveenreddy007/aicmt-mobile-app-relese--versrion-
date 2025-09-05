"use client"

import { useState, useEffect } from "react"
import { OptimizedImage } from "@/components/optimized-image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryItem } from "@/app/actions/gallery"

interface GalleryCategory {
  id: string
  name: string
  images: {
    src: string
    alt: string
    caption: string
  }[]
}

interface ImageGalleryClientProps {
  galleryData: {
    facility: GalleryItem[]
    products: GalleryItem[]
    events: GalleryItem[]
  }
}

function ImageGalleryClient({ galleryData }: ImageGalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState("facility")
  const [modalOpen, setModalOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Transform gallery data to match the expected format
  const galleryCategories: GalleryCategory[] = [
    {
      id: "facility",
      name: "Our Facility",
      images: galleryData.facility.map(item => ({
        src: item.url || "/placeholder.svg",
        alt: item.alt_text || item.title,
        caption: item.description || item.title,
      })),
    },
    {
      id: "products",
      name: "Products",
      images: galleryData.products.map(item => ({
        src: item.url || "/placeholder.svg",
        alt: item.alt_text || item.title,
        caption: item.description || item.title,
      })),
    },
    {
      id: "events",
      name: "Events & Exhibitions",
      images: galleryData.events.map(item => ({
        src: item.url || "/placeholder.svg",
        alt: item.alt_text || item.title,
        caption: item.description || item.title,
      })),
    },
  ]

  const currentCategory = galleryCategories.find((cat) => cat.id === activeCategory)

  const openModal = (index: number) => {
    setActiveImageIndex(index)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const nextImage = () => {
    if (currentCategory) {
      setActiveImageIndex((prevIndex) => (prevIndex === currentCategory.images.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const prevImage = () => {
    if (currentCategory) {
      setActiveImageIndex((prevIndex) => (prevIndex === 0 ? currentCategory.images.length - 1 : prevIndex - 1))
    }
  }

  useEffect(() => {
    if (modalOpen) {
      // Save the previously focused element
      const previouslyFocused = document.activeElement

      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") closeModal()
      }

      document.addEventListener("keydown", handleEscape)

      return () => {
        document.removeEventListener("keydown", handleEscape)
        // Restore focus when modal closes
        if (previouslyFocused) {
          ;(previouslyFocused as HTMLElement).focus()
        }
      }
    }
  }, [modalOpen])

  // Show empty state if no images in any category
  const hasImages = galleryCategories.some(category => category.images.length > 0)
  
  if (!hasImages) {
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
            No gallery images available. Please check back later or contact us for more information.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Gallery</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Explore our facilities, products, and events through our image gallery
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          {galleryCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name} ({category.images.length})
            </TabsTrigger>
          ))}
        </TabsList>

        {galleryCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            {category.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {category.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square relative rounded-md overflow-hidden group cursor-pointer"
                    onClick={() => openModal(index)}
                    onKeyDown={(e) => e.key === "Enter" && openModal(index)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View larger image: ${image.caption}`}
                  >
                    <OptimizedImage
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      fallback={
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">{image.alt}</span>
                        </div>
                      }
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-5 w-5 text-gray-700" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-sm">{image.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No {category.name.toLowerCase()} images available yet.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal for full-size image view */}
      {modalOpen && currentCategory && currentCategory.images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation()
                closeModal()
              }}
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="max-h-[80vh] flex items-center justify-center">
              <OptimizedImage
                src={currentCategory.images[activeImageIndex].src}
                alt={currentCategory.images[activeImageIndex].alt}
                width={1200}
                height={800}
                className="max-h-[80vh] w-auto object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/50 p-2">
              <p>{currentCategory.images[activeImageIndex].caption}</p>
              <p className="text-sm text-gray-300 mt-1">
                {activeImageIndex + 1} / {currentCategory.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Export the client component for use in server components
export { ImageGalleryClient }
