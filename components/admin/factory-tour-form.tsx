"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createFactoryTour, updateFactoryTour, getVideoUrl, getThumbnailUrl } from "@/app/actions/factory-tour"
import { toast } from "sonner"
import { ArrowLeft, Upload, Video, Link as LinkIcon, Play } from "lucide-react"
import Link from "next/link"
import { FactoryTour } from "@/app/actions/factory-tour"

interface FactoryTourFormProps {
  factoryTour?: FactoryTour
}

export function FactoryTourForm({ factoryTour }: FactoryTourFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const videoFileRef = useRef<HTMLInputElement>(null)
  const thumbnailFileRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: factoryTour?.title || "",
    description: factoryTour?.description || "",
    video_type: factoryTour?.video_type || "upload" as "upload" | "url",
    video_url: factoryTour?.video_url || "",
    display_order: factoryTour?.display_order || 0,
    is_active: factoryTour?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      
      // Add basic form data
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('video_type', formData.video_type)
      formDataToSend.append('video_url', formData.video_url)
      formDataToSend.append('display_order', formData.display_order.toString())
      formDataToSend.append('is_active', formData.is_active.toString())
      
      // Add video file if uploaded
      if (videoFileRef.current?.files?.[0]) {
        formDataToSend.append('video_file', videoFileRef.current.files[0])
      }
      
      // Add thumbnail file if uploaded
      if (thumbnailFileRef.current?.files?.[0]) {
        formDataToSend.append('thumbnail_file', thumbnailFileRef.current.files[0])
      }
      
      let result
      if (factoryTour) {
        // Update existing factory tour
        result = await updateFactoryTour(factoryTour.id, formDataToSend)
      } else {
        // Create new factory tour
        result = await createFactoryTour(formDataToSend)
      }
      
      if (result.success) {
        toast.success(factoryTour ? "Factory tour updated successfully" : "Factory tour created successfully")
        router.push("/admin/factory-tour")
      } else {
        toast.error(result.error || "Failed to save factory tour")
      }
    } catch (error) {
      console.error("Error saving factory tour:", error)
      toast.error("Failed to save factory tour")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setThumbnailPreview(url)
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null
  }

  const getVimeoEmbedUrl = (url: string) => {
    const regExp = /vimeo\.com\/(\d+)/
    const match = url.match(regExp)
    return match ? `https://player.vimeo.com/video/${match[1]}` : null
  }

  const getEmbedUrl = (url: string) => {
    return getYouTubeEmbedUrl(url) || getVimeoEmbedUrl(url) || url
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/factory-tour">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {factoryTour ? "Edit Factory Tour Video" : "Add New Factory Tour Video"}
          </h1>
          <p className="text-muted-foreground">
            {factoryTour ? "Update factory tour video details" : "Create a new factory tour video entry"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>
            Fill in the factory tour video information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleInputChange("display_order", parseInt(e.target.value) || 0)}
                  placeholder="Enter display order"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter video description"
                rows={4}
              />
            </div>

            {/* Video Type Selection */}
            <div className="space-y-4">
              <Label>Video Source</Label>
              <RadioGroup
                value={formData.video_type}
                onValueChange={(value) => handleInputChange("video_type", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Video File
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url" />
                  <Label htmlFor="url" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Video URL
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Video Upload */}
            {formData.video_type === "upload" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video_file">Video File</Label>
                  <Input
                    id="video_file"
                    type="file"
                    ref={videoFileRef}
                    accept="video/*"
                    onChange={handleVideoFileChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: MP4, WebM, AVI, MOV (Max size: 100MB)
                  </p>
                </div>
                
                {(videoPreview || factoryTour?.video_file_path) && (
                  <div className="space-y-2">
                    <Label>Video Preview</Label>
                    <div className="border rounded-lg p-4">
                      <video
                        src={videoPreview || (factoryTour?.video_file_path ? getVideoUrl(factoryTour.video_file_path) : undefined)}
                        controls
                        className="w-full max-w-md h-48 object-cover rounded"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Video URL */}
            {formData.video_type === "url" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => handleInputChange("video_url", e.target.value)}
                    placeholder="Enter YouTube, Vimeo, or direct video URL"
                  />
                  <p className="text-sm text-muted-foreground">
                    Supports YouTube, Vimeo, and direct video URLs
                  </p>
                </div>
                
                {formData.video_url && (
                  <div className="space-y-2">
                    <Label>Video Preview</Label>
                    <div className="border rounded-lg p-4">
                      {getYouTubeEmbedUrl(formData.video_url) || getVimeoEmbedUrl(formData.video_url) ? (
                        <iframe
                          src={getEmbedUrl(formData.video_url)}
                          className="w-full max-w-md h-48 rounded"
                          frameBorder="0"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={formData.video_url}
                          controls
                          className="w-full max-w-md h-48 object-cover rounded"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail Upload */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail_file">Thumbnail Image (Optional)</Label>
                <Input
                  id="thumbnail_file"
                  type="file"
                  ref={thumbnailFileRef}
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                />
                <p className="text-sm text-muted-foreground">
                  Upload a custom thumbnail image for the video
                </p>
              </div>
              
              {(thumbnailPreview || factoryTour?.thumbnail_image) && (
                <div className="space-y-2">
                  <Label>Thumbnail Preview</Label>
                  <div className="border rounded-lg p-4">
                    <img
                      src={thumbnailPreview || (factoryTour?.thumbnail_image ? getThumbnailUrl(factoryTour.thumbnail_image) : undefined)}
                      alt="Thumbnail preview"
                      className="w-32 h-24 object-cover rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : factoryTour ? "Update Video" : "Create Video"}
              </Button>
              <Link href="/admin/factory-tour">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}