"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { X, Upload, ImagePlus, Loader2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { uploadMediaFiles } from "@/app/actions/media"

interface MediaItem {
  id: string
  url: string
  original_name: string
  file_size: number
  mime_type: string
  alt_text?: string
}

interface EnhancedMediaSelectorWithUploadProps {
  selectedImageId?: string
  selectedImageUrl?: string
  onSelect: (imageId: string, imageUrl: string) => void
  mediaItems: MediaItem[]
  label?: string
  required?: boolean
  onMediaItemsUpdate?: (newItems: MediaItem[]) => void
}

export function EnhancedMediaSelectorWithUpload({ 
  selectedImageId = "", 
  selectedImageUrl = "", 
  onSelect, 
  mediaItems,
  label = "Select Image",
  required = false,
  onMediaItemsUpdate
}: EnhancedMediaSelectorWithUploadProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [manualUrl, setManualUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Find selected media item on mount or when selectedImageId changes
  useState(() => {
    if (selectedImageId) {
      const media = mediaItems.find(item => item.id === selectedImageId)
      setSelectedMedia(media || null)
    } else if (selectedImageUrl && !selectedImageId) {
      // Handle case where we have URL but no ID (manual URL)
      setManualUrl(selectedImageUrl)
    } else {
      setSelectedMedia(null)
      setManualUrl("")
    }
  })

  const filteredMedia = (mediaItems || []).filter((item) => 
    item.mime_type?.startsWith('image/') && 
    (item.original_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media)
    setManualUrl("")
    onSelect(media.id, media.url)
  }

  const handleClearSelection = () => {
    setSelectedMedia(null)
    setManualUrl("")
    onSelect("", "")
  }

  const handleManualUrlSubmit = () => {
    if (manualUrl.trim()) {
      try {
        new URL(manualUrl) // Validate URL
        setSelectedMedia(null)
        onSelect("", manualUrl.trim())
        toast.success("Image URL set successfully")
      } catch {
        toast.error("Please enter a valid URL")
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error("Please select image files only")
      return
    }

    if (imageFiles.some(file => file.size > 10 * 1024 * 1024)) {
      toast.error("File size must be less than 10MB")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      imageFiles.forEach(file => {
        formData.append("files", file)
      })

      const result = await uploadMediaFiles(formData)
      
      if (result.success && result.files) {
        toast.success(`Successfully uploaded ${result.files.length} file(s)`)
        
        // Update media items if callback provided
        if (onMediaItemsUpdate) {
          onMediaItemsUpdate([...mediaItems, ...result.files])
        }
        
        // Auto-select the first uploaded image if no image is currently selected
        if (!selectedMedia && !manualUrl && result.files.length > 0) {
          const firstFile = result.files[0]
          handleMediaSelect(firstFile)
        }
      } else {
        toast.error(result.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("An error occurred during upload")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {(selectedMedia || manualUrl) ? (
        <div className="relative border rounded-lg p-4 bg-gray-50">
          <div className="absolute top-2 right-2 z-10">
            <Button variant="destructive" size="icon" onClick={handleClearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="relative h-[200px] w-full rounded-md overflow-hidden">
              <Image 
                src={selectedMedia?.url || manualUrl} 
                alt={selectedMedia?.original_name || "Selected image"} 
                fill 
                className="object-contain" 
              />
            </div>
            
            {selectedMedia ? (
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
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-sm">Manual URL</p>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{manualUrl}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="library">Media Library</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
              <TabsTrigger value="url">Manual URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="library" className="p-4">
              <div className="space-y-4">
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

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
                    <div className="text-center py-8 text-muted-foreground">
                      No images found
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="p-4">
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <div className="space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground">Uploading images...</p>
                      {uploadProgress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop images here, or click to browse
                        </p>
                        <Input 
                          ref={fileInputRef}
                          type="file" 
                          className="hidden" 
                          multiple 
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Images
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supported formats: JPG, PNG, WebP, GIF (Max 10MB per file)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="manual-url">Image URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="manual-url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                    />
                    <Button onClick={handleManualUrlSubmit} disabled={!manualUrl.trim()}>
                      Set URL
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a direct URL to an image hosted elsewhere
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
