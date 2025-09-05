"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { ImpactStory } from "@/lib/types/stories"
import {
  createImpactStory,
  updateImpactStory,
} from "@/app/actions/stories"
import { EnhancedMediaSelectorWithUpload } from "@/components/admin/enhanced-media-selector-with-upload"
import { getMediaItems } from "@/app/actions/media"

interface ImpactStoryFormProps {
  story?: ImpactStory
}

const STORY_CATEGORIES = [
  { value: "community_impact", label: "Community Impact" },
  { value: "environmental", label: "Environmental" },
  { value: "social_change", label: "Social Change" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "technology", label: "Technology" },
  { value: "economic", label: "Economic" },
  { value: "other", label: "Other" },
]

export function ImpactStoryForm({ story }: ImpactStoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(story?.category || "community_impact")
  const [selectedImageUrl, setSelectedImageUrl] = useState(story?.image_url || "")
  const [selectedImageId, setSelectedImageId] = useState("")
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [isLoadingMedia, setIsLoadingMedia] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const isEditing = !!story

  useEffect(() => {
    const loadMediaItems = async () => {
      try {
        setIsLoadingMedia(true)
        const items = await getMediaItems()
        setMediaItems(items)
      } catch (error) {
        console.error("Error loading media items:", error)
        setMediaItems([])
      } finally {
        setIsLoadingMedia(false)
      }
    }

    loadMediaItems()
  }, [])

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate required fields
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    
    if (!title?.trim()) {
      newErrors.title = "Title is required"
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long"
    }
    
    if (!description?.trim()) {
      newErrors.description = "Description is required"
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long"
    }
    
    // Validate subtitle if provided
    const subtitle = formData.get("subtitle") as string
    if (subtitle && subtitle.trim() && subtitle.trim().length < 3) {
      newErrors.subtitle = "Subtitle must be at least 3 characters long"
    }
    
    // Validate image URL if provided
    if (selectedImageUrl && selectedImageUrl.trim() && selectedImageUrl !== "") {
      try {
        new URL(selectedImageUrl)
      } catch {
        newErrors.image_url = "Please provide a valid image URL"
      }
    }
    
    // Validate display order
    const displayOrder = formData.get("display_order") as string
    if (displayOrder && isNaN(Number(displayOrder))) {
      newErrors.display_order = "Display order must be a number"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setErrors({})
    setGeneralError("")
    
    // Add the selected category and image URL to form data
    formData.set("category", selectedCategory)
    formData.set("image_url", selectedImageUrl)
    
    // Client-side validation
    if (!validateForm(formData)) {
      setIsSubmitting(false)
      setGeneralError("Please fix the validation errors below")
      return
    }
    
    try {
      let result
      if (isEditing && story) {
        result = await updateImpactStory(story.id, formData)
      } else {
        result = await createImpactStory(formData)
      }
      
      if (result.success) {
        toast.success(isEditing ? "Impact story updated successfully" : "Impact story created successfully")
        router.push("/admin/stories/impact")
      } else {
        if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
          setErrors(result.fieldErrors)
          setGeneralError("Please fix the validation errors below")
        } else {
          setGeneralError(result.error || "An unexpected error occurred")
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setGeneralError(isEditing ? "Failed to update impact story" : "Failed to create impact story")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Impact Story" : "Create Impact Story"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {generalError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {generalError}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Transforming Lives Through Technology"
              defaultValue={story?.title || ""}
              className={errors.title ? "border-red-500" : ""}
              required
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              name="subtitle"
              type="text"
              placeholder="How our initiative changed communities"
              defaultValue={story?.subtitle || ""}
              className={errors.subtitle ? "border-red-500" : ""}
            />
            {errors.subtitle && (
              <p className="text-sm text-red-600">{errors.subtitle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell the full story of this impact..."
              defaultValue={story?.description || ""}
              className={errors.description ? "border-red-500" : ""}
              rows={6}
              required
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {STORY_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                placeholder="0"
                defaultValue={story?.display_order?.toString() || "0"}
                className={errors.display_order ? "border-red-500" : ""}
              />
              {errors.display_order && (
                <p className="text-sm text-red-600">{errors.display_order}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <EnhancedMediaSelectorWithUpload
              selectedImageUrl={selectedImageUrl}
              selectedImageId={selectedImageId}
              onSelect={(imageId: string, imageUrl: string) => {
                setSelectedImageId(imageId)
                setSelectedImageUrl(imageUrl)
              }}
              mediaItems={mediaItems}
              label="Story Image"
              required={false}
              onMediaItemsUpdate={(newItems) => setMediaItems(newItems)}
            />
            <input
              type="hidden"
              name="image_url"
              value={selectedImageUrl}
            />
            {errors.image_url && (
              <p className="text-sm text-red-600">{errors.image_url}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stats">Impact Statistics</Label>
            <Input
              id="stats"
              name="stats"
              type="text"
              placeholder="1000+ lives impacted"
              defaultValue={story?.stats || ""}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              name="is_active"
              defaultChecked={story?.is_active ?? true}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/stories/impact")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Impact Story"
                : "Create Impact Story"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}