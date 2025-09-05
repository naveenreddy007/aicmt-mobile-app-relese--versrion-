"use client"

import type React from "react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { OptimizedImage } from "@/components/optimized-image" // Assuming this is your optimized image component

interface ProductImageZoomProps {
  src: string
  alt: string
  width?: number // Intrinsic width of the original image for optimization
  height?: number // Intrinsic height of the original image for optimization
  containerWidth?: number | string // Display width of the container
  containerHeight?: number | string // Display height of the container
  magnification?: number
  className?: string
}

export function ProductImageZoom({
  src,
  alt,
  width, // Pass the original image width
  height, // Pass the original image height
  containerWidth = 500,
  containerHeight = 500,
  magnification = 2.5,
  className,
}: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleMouseEnter = () => {
    if (imageLoaded) {
      setIsZoomed(true)
    }
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageLoaded) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPosition({ x, y })
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Fallback to placeholder if src is missing
  const imageSrc = src || "/generic-product-display.png"

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-zoom-in bg-gray-100", className)}
      style={{ width: containerWidth, height: containerHeight }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Optimized Regular image */}
      <OptimizedImage
        src={imageSrc}
        alt={alt}
        width={width || 500} // Provide original image width for optimization
        height={height || 500} // Provide original image height for optimization
        className="w-full h-full object-contain"
        onLoad={handleImageLoad}
        priority // Consider if the main zoomed image should be priority
      />

      {/* Zoomed image view */}
      {isZoomed && imageLoaded && (
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(${imageSrc})`, // Use the potentially placeholder-resolved src
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${magnification * 100}%`,
            imageRendering: "pixelated", // Or "crisp-edges" for sharper zoom, browser support varies
          }}
          aria-hidden="true"
        />
      )}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">Loading...</div>
      )}
    </div>
  )
}
