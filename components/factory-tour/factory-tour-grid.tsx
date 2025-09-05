"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, ExternalLink, Video } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FactoryTour {
  id: string
  title: string
  description: string | null
  video_type: 'upload' | 'url'
  video_file_path: string | null
  video_url: string | null
  thumbnail_image: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface FactoryTourGridProps {
  tours: FactoryTour[]
}

export function FactoryTourGrid({ tours }: FactoryTourGridProps) {
  const [selectedTour, setSelectedTour] = useState<FactoryTour | null>(null)

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  // Helper function to get Vimeo embed URL
  const getVimeoEmbedUrl = (url: string): string => {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url
  }

  // Helper function to get embed URL for different video types
  const getEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYouTubeEmbedUrl(url)
    }
    if (url.includes('vimeo.com')) {
      return getVimeoEmbedUrl(url)
    }
    return url
  }

  // Helper function to get video source URL
  const getVideoUrl = (tour: FactoryTour): string => {
    if (tour.video_type === 'upload' && tour.video_file_path) {
      // For uploaded videos, construct the Supabase storage URL
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${tour.video_file_path}`
    }
    return tour.video_url || ''
  }

  // Helper function to check if video source is valid
  const isValidVideoSource = (tour: FactoryTour): boolean => {
    const url = getVideoUrl(tour)
    return url && url.trim() !== ''
  }

  // Helper function to get thumbnail URL
  const getThumbnailUrl = (tour: FactoryTour): string => {
    if (tour.thumbnail_image) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbnails/${tour.thumbnail_image}`
    }
    // Default thumbnail for videos without custom thumbnails
    return '/placeholder-video-thumbnail.svg'
  }

  // Sort tours by display order
  const sortedTours = [...tours].sort((a, b) => a.display_order - b.display_order)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTours.map((tour) => (
          <Card key={tour.id} className="group hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              {/* Thumbnail */}
              <img
                src={getThumbnailUrl(tour)}
                alt={tour.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to a default image if thumbnail fails to load
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-video-thumbnail.svg'
                }}
              />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white bg-opacity-90 rounded-full p-3">
                  <Play className="h-6 w-6 text-gray-900 fill-current" />
                </div>
              </div>
              
              {/* Video type badge */}
              <div className="absolute top-2 right-2">
                <Badge variant={tour.video_type === 'upload' ? 'default' : 'secondary'} className="text-xs">
                  {tour.video_type === 'upload' ? 'Video' : 'External'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{tour.title}</h3>
              {tour.description && (
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {tour.description}
                </p>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    onClick={() => setSelectedTour(tour)}
                    disabled={!isValidVideoSource(tour)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isValidVideoSource(tour) ? 'Watch Video' : 'Video Unavailable'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full">
                  <DialogHeader>
                    <DialogTitle>{tour.title}</DialogTitle>
                    {tour.description && (
                      <DialogDescription>{tour.description}</DialogDescription>
                    )}
                  </DialogHeader>
                  
                  <div className="aspect-video w-full">
                    {!isValidVideoSource(tour) ? (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Video source not available</p>
                        </div>
                      </div>
                    ) : tour.video_type === 'upload' ? (
                      <video
                        controls
                        className="w-full h-full rounded-lg"
                        poster={getThumbnailUrl(tour)}
                        onError={(e) => {
                          console.error('Video load error:', e)
                          const target = e.target as HTMLVideoElement
                          target.style.display = 'none'
                          const errorDiv = document.createElement('div')
                          errorDiv.className = 'w-full h-full bg-gray-100 rounded-lg flex items-center justify-center'
                          errorDiv.innerHTML = '<div class="text-center"><div class="h-12 w-12 text-gray-400 mx-auto mb-2">📹</div><p class="text-gray-500 text-sm">Video failed to load</p></div>'
                          target.parentNode?.appendChild(errorDiv)
                        }}
                      >
                        <source src={getVideoUrl(tour)} type="video/mp4" />
                        <source src={getVideoUrl(tour)} type="video/webm" />
                        <source src={getVideoUrl(tour)} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <iframe
                        src={getEmbedUrl(getVideoUrl(tour))}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                        title={tour.title}
                        onError={(e) => {
                          console.error('Iframe load error:', e)
                        }}
                      />
                    )}
                  </div>
                  
                  {tour.video_type === 'url' && (
                    <div className="flex justify-end">
                      <Button variant="outline" asChild>
                        <a 
                          href={getVideoUrl(tour)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open in New Tab
                        </a>
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {sortedTours.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Factory Tours Available</h3>
          <p className="text-muted-foreground">
            Factory tour videos will be available soon. Check back later!
          </p>
        </div>
      )}
    </>
  )
}