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
import { Achievement } from "@/lib/types/stories"
import {
  createAchievement,
  updateAchievement,
} from "@/app/actions/stories"
import { EnhancedMediaSelectorWithUpload } from "@/components/admin/enhanced-media-selector-with-upload"
import { getMediaItems } from "@/app/actions/media"

interface AchievementFormProps {
  achievement?: Achievement
}

const ACHIEVEMENT_CATEGORIES = [
  { value: "award", label: "Award" },
  { value: "certification", label: "Certification" },
  { value: "recognition", label: "Recognition" },
  { value: "milestone", label: "Milestone" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
]

export function AchievementForm({ achievement }: AchievementFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(achievement?.category || "award")
  const [selectedImageUrl, setSelectedImageUrl] = useState(achievement?.image_url || "")
  const [selectedImageId, setSelectedImageId] = useState("")
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [isLoadingMedia, setIsLoadingMedia] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const isEditing = !!achievement

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
    
    // Validate year if provided
    const year = formData.get("year") as string
    if (year && year.trim() && !/^\d{4}$/.test(year.trim())) {
      newErrors.year = "Year must be a 4-digit number"
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
      if (isEditing && achievement) {
        result = await updateAchievement(achievement.id, formData)
      } else {
        result = await createAchievement(formData)
      }
      
      if (result.success) {
        toast.success(isEditing ? "Achievement updated successfully" : "Achievement created successfully")
        router.push("/admin/stories/achievements")
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
      setGeneralError(isEditing ? "Failed to update achievement" : "Failed to create achievement")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Achievement" : "Create Achievement"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{generalError}</p>
          </div>
        )}
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Best Innovation Award 2024"
              defaultValue={achievement?.title || ""}
              required
              className={errors.title ? "border-red-500" : ""}
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
              placeholder="Describe this achievement and its significance..."
              defaultValue={achievement?.description || ""}
              rows={4}
              required
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="text"
                placeholder="2024"
                defaultValue={achievement?.year || ""}
                className={errors.year ? "border-red-500" : ""}
              />
              {errors.year && (
                <p className="text-sm text-red-600">{errors.year}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {ACHIEVEMENT_CATEGORIES.map((category) => (
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
                defaultValue={achievement?.display_order || 0}
                min="0"
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
              label="Achievement Image"
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
              defaultChecked={achievement?.is_active ?? true}
            />
            <Label htmlFor="is_active">Active</Label>
            <p className="text-sm text-muted-foreground ml-2">
              Only active achievements will be displayed on the website
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
                ? "Update Achievement"
                : "Create Achievement"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}