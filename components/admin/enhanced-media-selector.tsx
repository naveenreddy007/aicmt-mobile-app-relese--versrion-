"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2, Upload, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface MediaItem {
  id: string
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  url: string
  created_at: string
}

interface EnhancedMediaSelectorProps {
  selectedImageId?: string
  selectedImageUrl?: string
  onSelect: (imageId: string, imageUrl: string) => void
  mediaItems: MediaItem[]
  label?: string
  required?: boolean
}

export function EnhancedMediaSelector({ 
  selectedImageId = "", 
  selectedImageUrl = "", 
  onSelect, 
  mediaItems,
  label = "Select Image",
  required = false
}: EnhancedMediaSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  // Find selected media item on mount or when selectedImageId changes
  useEffect(() => {
    if (selectedImageId) {
      const media = mediaItems.find(item => item.id === selectedImageId)
      setSelectedMedia(media || null)
    } else {
      setSelectedMedia(null)
    }
  }, [selectedImageId, mediaItems])

  const filteredMedia = (mediaItems || []).filter((item) => 
    item.mime_type?.startsWith('image/') && 
    (item.original_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media)
    onSelect(media.id, media.url)
  }

  const handleClearSelection = () => {
    setSelectedMedia(null)
    onSelect("", "")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {selectedMedia ? (
        <div className="relative border rounded-lg p-4 bg-gray-50">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClearSelection}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="relative h-[200px] w-full rounded-md overflow-hidden">
              <Image 
                src={selectedMedia.url} 
                alt={selectedMedia.original_name} 
                fill 
                className="object-contain" 
              />
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-sm">{selectedMedia.original_name}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {selectedMedia.mime_type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formatFileSize(selectedMedia.file_size)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="library">Media Library</TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search images..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMedia.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200 bg-white"
                        onClick={() => handleMediaSelect(item)}
                      >
                        <div className="relative h-24 w-full">
                          <Image 
                            src={item.url} 
                            alt={item.original_name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs truncate font-medium" title={item.original_name}>
                            {item.original_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(item.file_size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredMedia.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground">
                        {searchTerm ? (
                          <div>
                            <p>No images found matching "{searchTerm}"</p>
                            <Button 
                              variant="link" 
                              onClick={() => setSearchTerm("")} 
                              className="mt-2"
                              type="button"
                            >
                              Clear search
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p>No images available</p>
                            <p className="text-sm">Upload images to the media library first</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}