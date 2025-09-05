"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { JourneyMilestone } from "@/lib/types/stories"
import {
  createJourneyMilestone,
  updateJourneyMilestone,
} from "@/app/actions/stories"
import { EnhancedMediaSelectorWithUpload } from "@/components/admin/enhanced-media-selector-with-upload"
import { getMediaItems } from "@/app/actions/media"

interface JourneyMilestoneFormProps {
  milestone?: JourneyMilestone
}

export function JourneyMilestoneForm({ milestone }: JourneyMilestoneFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState(milestone?.image_url || "")
  const [selectedImageId, setSelectedImageId] = useState("")
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [isLoadingMedia, setIsLoadingMedia] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string>("")
  const isEditing = !!milestone

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
    const year = formData.get("year") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    
    if (!year?.trim()) {
      newErrors.year = "Year is required"
    } else if (!/^\d{4}$/.test(year.trim())) {
      newErrors.year = "Year must be a 4-digit number"
    }
    
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
    
    // Add the selected image URL to form data
    formData.set("image_url", selectedImageUrl)
    
    // Client-side validation
    if (!validateForm(formData)) {
      setIsSubmitting(false)
      setGeneralError("Please fix the validation errors below")
      return
    }
    
    try {
      let result
      if (isEditing && milestone) {
        result = await updateJourneyMilestone(milestone.id, formData)
      } else {
        result = await createJourneyMilestone(formData)
      }
      
      if (result.success) {
        toast.success(
          isEditing
            ? "Journey milestone updated successfully"
            : "Journey milestone created successfully"
        )
        router.push("/admin/stories/journey")
      } else {
        // Handle validation errors
        if (result.fieldErrors) {
          setErrors(result.fieldErrors)
        }
        setGeneralError(result.error || "An error occurred")
        toast.error(result.error || "Failed to save journey milestone")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setGeneralError("An unexpected error occurred")
      toast.error(
        isEditing
          ? "Failed to update journey milestone"
          : "Failed to create journey milestone"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Journey Milestone" : "Create Journey Milestone"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{generalError}</p>
          </div>
        )}
        <form action={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                name="year"
                type="text"
                placeholder="2024"
                defaultValue={milestone?.year || ""}
                className={errors.year ? "border-red-500" : ""}
                required
              />
              {errors.year && (
                <p className="text-sm text-red-600">{errors.year}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                placeholder="0"
                defaultValue={milestone?.display_order || 0}
                className={errors.display_order ? "border-red-500" : ""}
                min="0"
              />
              {errors.display_order && (
                <p className="text-sm text-red-600">{errors.display_order}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Company Founded"
              defaultValue={milestone?.title || ""}
              className={errors.title ? "border-red-500" : ""}
              required
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe this milestone in your company's journey..."
              defaultValue={milestone?.description || ""}
              className={errors.description ? "border-red-500" : ""}
              rows={4}
              required
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
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
              label="Milestone Image"
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

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              name="is_active"
              defaultChecked={milestone?.is_active ?? true}
            />
            <Label htmlFor="is_active">Active</Label>
            <p className="text-sm text-muted-foreground ml-2">
              Only active milestones will be displayed on the website
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Milestone"
                : "Create Milestone"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}