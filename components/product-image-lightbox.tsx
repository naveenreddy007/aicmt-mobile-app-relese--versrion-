"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/optimized-image"
import { cn } from "@/lib/utils"

interface ProductImage {
  id: string
  image_url: string
  alt_text: string | null
}

interface ProductImageLightboxProps {
  images: ProductImage[]
  initialIndex?: number
  onClose: () => void
}

export function ProductImageLightbox({ images, initialIndex = 0, onClose }: ProductImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const currentImage = images[currentIndex]

  const navigateNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
    setDragPosition({ x: 0, y: 0 })
  }, [images.length])

  const navigatePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsZoomed(false)
    setDragPosition({ x: 0, y: 0 })
  }, [images.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          navigatePrev()
          break
        case "ArrowRight":
          navigateNext()
          break
        case "Escape":
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, images.length, navigateNext, navigatePrev, onClose])

  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
    setDragPosition({ x: 0, y: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || isDragging) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - dragPosition.x, y: e.clientY - dragPosition.y })
  }

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !isZoomed) return
    setDragPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </Button>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            onClick={navigatePrev}
          >
            <ChevronLeft className="h-8 w-8" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            onClick={navigateNext}
          >
            <ChevronRight className="h-8 w-8" />
            <span className="sr-only">Next</span>
          </Button>
        </>
      )}

      {/* Image container */}
      <div
        className="relative h-full w-full flex items-center justify-center p-8"
        onMouseMove={isDragging ? handleDrag : handleMouseMove}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div
          className={cn("relative max-h-full max-w-full transition-transform duration-200", isZoomed && "cursor-move")}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transform: `scale(2.5) translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                }
              : {}
          }
        >
          <OptimizedImage
            src={currentImage.image_url}
            alt={currentImage.alt_text || "Product image"}
            width={1200}
            height={1200}
            className="max-h-[85vh] max-w-full object-contain"
          />
        </div>
      </div>

      {/* Zoom control */}
      <Button
        variant="outline"
        size="icon"
        className="absolute bottom-4 right-4 z-10 bg-black/50 text-white border-white/20 hover:bg-black/70"
        onClick={toggleZoom}
      >
        {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
        <span className="sr-only">{isZoomed ? "Zoom Out" : "Zoom In"}</span>
      </Button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto px-4 max-w-full">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-white/30",
                currentIndex === index && "ring-2 ring-white ring-offset-1 ring-offset-black",
              )}
              onClick={() => setCurrentIndex(index)}
            >
              <OptimizedImage
                src={image.image_url}
                alt={image.alt_text || `Product image ${index + 1}`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
