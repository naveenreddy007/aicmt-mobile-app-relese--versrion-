"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  sizes?: string
}

const FALLBACK_IMAGE = "/generic-product-display.png" // Define fallback image path

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    // Reset state when src prop changes
    setCurrentSrc(src)
    setIsLoading(true)
    setIsError(false)
    console.log(`OptimizedImage: src prop changed to: ${src}`)
  }, [src])

  const handleError = () => {
    console.error(`OptimizedImage: Error loading image: ${currentSrc}. Falling back to ${FALLBACK_IMAGE}`)
    setIsError(true)
    setIsLoading(false)
    setCurrentSrc(FALLBACK_IMAGE) // Set to fallback on error
  }

  const handleLoad = () => {
    console.log(`OptimizedImage: Successfully loaded image: ${currentSrc}`)
    setIsLoading(false)
    setIsError(false) // Ensure error state is cleared if a retry mechanism were implemented
  }

  // Determine the source to use, prioritizing the prop, then fallback on error
  const imageSrcToUse = isError ? FALLBACK_IMAGE : currentSrc || FALLBACK_IMAGE
  const imageAlt = alt || "Image"

  // Log final props being passed to Next/Image
  // console.log('OptimizedImage: Rendering Next/Image with:', {
  //   src: imageSrcToUse,
  //   alt: imageAlt,
  //   width: fill ? undefined : width || 400,
  //   height: fill ? undefined : height || 400,
  //   fill,
  //   priority,
  //   className,
  //   isLoading,
  //   isError
  // });

  return (
    <div className={cn("relative overflow-hidden", fill ? "w-full h-full" : "", className)}>
      {fill ? (
        <Image
          key={imageSrcToUse} // Add key to force re-render on src change, especially for fallback
          src={imageSrcToUse || "/placeholder.svg"}
          alt={imageAlt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", className, isLoading && "opacity-0")} // Hide while loading
          onLoad={handleLoad}
          onError={handleError}
          unoptimized={imageSrcToUse.includes("placeholder.svg") || imageSrcToUse === FALLBACK_IMAGE}
        />
      ) : (
        <Image
          key={imageSrcToUse} // Add key
          src={imageSrcToUse || "/placeholder.svg"}
          alt={imageAlt}
          width={width || 400}
          height={height || 400}
          priority={priority}
          sizes={sizes}
          className={cn(className, isLoading && "opacity-0")} // Hide while loading
          onLoad={handleLoad}
          onError={handleError}
          unoptimized={imageSrcToUse.includes("placeholder.svg") || imageSrcToUse === FALLBACK_IMAGE}
        />
      )}
      {isLoading && !isError && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800",
            fill ? "w-full h-full" : "",
          )}
          style={fill ? {} : { width: width || 400, height: height || 400 }}
        >
          <svg
            className="animate-spin h-8 w-8 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  )
}
