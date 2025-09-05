"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, X, RotateCw } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/optimized-image"

interface ProductImage {
  id: string
  image_url: string
  alt_text: string | null
  is_primary: boolean
  display_order: number
}

interface ProductMediaGalleryProps {
  images: ProductImage[]
  productName: string
  modelUrl?: string // Optional 3D model URL
}

export function ProductMediaGallery({ images, productName, modelUrl }: ProductMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [is3DMode, setIs3DMode] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Sort images by display_order
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)

  // Find primary image and put it first
  const primaryImageIndex = sortedImages.findIndex((img) => img.is_primary)
  if (primaryImageIndex > 0) {
    const primaryImage = sortedImages.splice(primaryImageIndex, 1)[0]
    sortedImages.unshift(primaryImage)
  }

  // If no images, use a placeholder
  const displayImages =
    sortedImages.length > 0
      ? sortedImages
      : [
          {
            id: "placeholder",
            image_url: "/generic-product-display.png",
            alt_text: productName,
            is_primary: true,
            display_order: 0,
          },
        ]

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index)
    setIsZoomed(false)
    setDragPosition({ x: 0, y: 0 })
  }

  // Handle next/prev navigation
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
    setDragPosition({ x: 0, y: 0 })
  }, [displayImages.length])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
    setIsZoomed(false)
    setDragPosition({ x: 0, y: 0 })
  }, [displayImages.length])

  // Handle zoom toggle
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed)
    setDragPosition({ x: 0, y: 0 })
  }

  // Handle mouse move for zoom positioning
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || isDragging || isMobile) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - dragPosition.x, y: e.clientY - dragPosition.y })
  }



  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    setIsDragging(true)
    const touch = e.touches[0]
    setDragStart({ x: touch.clientX - dragPosition.x, y: touch.clientY - dragPosition.y })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const newX = touch.clientX - dragStart.x
    const newY = touch.clientY - dragStart.y

    // Limit drag to keep image visible
    const container = imageContainerRef.current
    if (container) {
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight
      const maxX = containerWidth * 0.5
      const maxY = containerHeight * 0.5
      const limitedX = Math.max(-maxX, Math.min(maxX, newX))
      const limitedY = Math.max(-maxY, Math.min(maxY, newY))
      setDragPosition({ x: limitedX, y: limitedY })
    } else {
      setDragPosition({ x: newX, y: newY })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Handle lightbox open/close
  const openLightbox = () => {
    setIsLightboxOpen(true)
    document.body.style.overflow = "hidden" // Prevent scrolling when lightbox is open
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    document.body.style.overflow = "" // Restore scrolling
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "" // Restore scrolling if component unmounts while lightbox is open
    }
  }, [])

  // Reset zoom and drag when active image changes
  useEffect(() => {
    setIsZoomed(false)
    setDragPosition({ x: 0, y: 0 })
  }, [activeIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return

      switch (e.key) {
        case "ArrowLeft":
          handlePrev()
          break
        case "ArrowRight":
          handleNext()
          break
        case "Escape":
          closeLightbox()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLightboxOpen, handleNext, handlePrev])

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        ref={imageContainerRef}
        className={cn(
          "relative aspect-square overflow-hidden rounded-lg border bg-background",
          isZoomed && "cursor-move",
        )}
        onMouseMove={handleMouseMove}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 3D Model View */}
        {is3DMode && modelUrl ? (
          <div className="h-full w-full">
            <model-viewer
              src={modelUrl}
              alt={`3D model of ${productName}`}
              auto-rotate
              camera-controls
              style={{ width: "100%", height: "100%" }}
            ></model-viewer>
          </div>
        ) : (
          // Image View
          <div
            className={cn(
              "h-full w-full flex items-center justify-center transition-transform duration-200",
              isZoomed && "scale-[2]",
            )}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transform: `scale(2) translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                  }
                : {}
            }
          >
            <OptimizedImage
              src={displayImages[activeIndex].image_url}
              alt={displayImages[activeIndex].alt_text || productName}
              width={600}
              height={600}
              className="h-full w-full object-contain"
              priority={activeIndex === 0}
            />
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {modelUrl && (
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
              onClick={() => setIs3DMode(!is3DMode)}
            >
              <RotateCw className="h-4 w-4" />
              <span className="sr-only">{is3DMode ? "View Image" : "View 3D Model"}</span>
            </Button>
          )}

          {!is3DMode && (
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
              onClick={handleZoomToggle}
            >
              {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
              <span className="sr-only">{isZoomed ? "Zoom Out" : "Zoom In"}</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={openLightbox}
          >
            <Maximize className="h-4 w-4" />
            <span className="sr-only">Fullscreen</span>
          </Button>
        </div>

        {/* Navigation Arrows (only if more than one image) */}
        {displayImages.length > 1 && !is3DMode && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next</span>
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails (only if more than one image) */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border",
                activeIndex === index && "ring-2 ring-primary ring-offset-2",
              )}
              onClick={() => handleThumbnailClick(index)}
            >
              <OptimizedImage
                src={image.image_url}
                alt={image.alt_text || `${productName} - Image ${index + 1}`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
          {modelUrl && (
            <button
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border flex items-center justify-center bg-gray-100",
                is3DMode && "ring-2 ring-primary ring-offset-2",
              )}
              onClick={() => setIs3DMode(true)}
            >
              <RotateCw className="h-6 w-6 text-gray-500" />
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>

          <div className="relative h-full w-full flex items-center justify-center">
            {/* Navigation Arrows */}
            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-8 w-8" />
                  <span className="sr-only">Previous</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8" />
                  <span className="sr-only">Next</span>
                </Button>
              </>
            )}

            {/* Lightbox Image */}
            <div
              className="h-full w-full flex items-center justify-center p-4"
              onMouseMove={handleMouseMove}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className={cn(
                  "relative max-h-full max-w-full transition-transform duration-200",
                  isZoomed && "cursor-move",
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: `scale(2) translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                      }
                    : {}
                }
              >
                <OptimizedImage
                  src={displayImages[activeIndex].image_url}
                  alt={displayImages[activeIndex].alt_text || productName}
                  width={1200}
                  height={1200}
                  className="max-h-[90vh] max-w-full object-contain"
                />
              </div>
            </div>

            {/* Zoom Control */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-4 right-4 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={handleZoomToggle}
            >
              {isZoomed ? <ZoomOut className="h-6 w-6" /> : <ZoomIn className="h-6 w-6" />}
              <span className="sr-only">{isZoomed ? "Zoom Out" : "Zoom In"}</span>
            </Button>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto px-4">
                {displayImages.map((image, index) => (
                  <button
                    key={image.id}
                    className={cn(
                      "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border",
                      activeIndex === index && "ring-2 ring-white ring-offset-1 ring-offset-black",
                    )}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <OptimizedImage
                      src={image.image_url}
                      alt={image.alt_text || `${productName} - Image ${index + 1}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
