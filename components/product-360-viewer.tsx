"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Declare model-viewer as a valid JSX element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface Product360ViewerProps {
  modelUrl: string
  alt: string
  className?: string
}

export function Product360Viewer({ modelUrl, alt, className }: Product360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // Check if <model-viewer> is supported
    if (typeof customElements !== "undefined" && !customElements.get("model-viewer")) {
      // Import the model-viewer library dynamically
      import("@google/model-viewer")
        .then(() => {
          setIsSupported(true)
        })
        .catch((error) => {
          console.error("Error loading model-viewer:", error)
          setIsSupported(false)
        })
    }
  }, [])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setIsSupported(false)
  }

  if (!isSupported) {
    return (
      <div className={cn("flex items-center justify-center bg-gray-100 rounded-lg p-8", className)}>
        <div className="text-center">
          <p className="text-gray-500">3D viewer is not supported in your browser.</p>
          <p className="text-sm text-gray-400 mt-2">Try using a modern browser like Chrome or Edge.</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("relative aspect-square rounded-lg overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      <model-viewer
        src={modelUrl}
        alt={alt}
        auto-rotate
        rotation-per-second="30deg"
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        environment-image="neutral"
        shadow-intensity="1"
        exposure="0.5"
        style={{ width: "100%", height: "100%" }}
        onLoad={handleLoad}
        onError={handleError}
      ></model-viewer>
    </div>
  )
}
