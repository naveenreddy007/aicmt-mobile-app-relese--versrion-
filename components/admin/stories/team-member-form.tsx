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
import { TeamMember } from "@/lib/types/stories"
import {
  createTeamMember,
  updateTeamMember,
} from "@/app/actions/stories"
import { EnhancedMediaSelectorWithUpload } from "@/components/admin/enhanced-media-selector-with-upload"
import { getMediaItems } from "@/app/actions/media"

interface TeamMemberFormProps {
  teamMember?: TeamMember
}

const TEAM_CATEGORIES = [
  { value: "leadership", label: "Leadership" },
  { value: "team", label: "Team" },
  { value: "advisors", label: "Advisors" },
  { value: "founders", label: "Founders" },
]

export function TeamMemberForm({ teamMember }: TeamMemberFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(teamMember?.category || "team")
  const [selectedImageUrl, setSelectedImageUrl] = useState(teamMember?.image_url || "")
  const [selectedImageId, setSelectedImageId] = useState("")
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [isLoadingMedia, setIsLoadingMedia] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const isEditing = !!teamMember

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setIsLoadingMedia(true)
        const items = await getMediaItems()
        setMediaItems(items)
      } catch (error) {
        console.error('Failed to fetch media items:', error)
      } finally {
        setIsLoadingMedia(false)
      }
    }

    fetchMediaItems()
  }, [])

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate required fields
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    
    if (!name?.trim()) {
      newErrors.name = "Name is required"
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long"
    }
    
    if (!position?.trim()) {
      newErrors.position = "Position is required"
    } else if (position.trim().length < 2) {
      newErrors.position = "Position must be at least 2 characters long"
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
      if (isEditing && teamMember) {
        result = await updateTeamMember(teamMember.id, formData)
      } else {
        result = await createTeamMember(formData)
      }
      
      if (result.success) {
        toast.success(isEditing ? "Team member updated successfully" : "Team member created successfully")
        router.push("/admin/stories/team")
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
      setGeneralError(isEditing ? "Failed to update team member" : "Failed to create team member")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Team Member" : "Create Team Member"}
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
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                defaultValue={teamMember?.name || ""}
                className={errors.name ? "border-red-500" : ""}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                name="position"
                type="text"
                placeholder="CEO & Founder"
                defaultValue={teamMember?.position || ""}
                className={errors.position ? "border-red-500" : ""}
                required
              />
              {errors.position && (
                <p className="text-sm text-red-600">{errors.position}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_CATEGORIES.map((category) => (
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
                defaultValue={teamMember?.display_order || 0}
                className={errors.display_order ? "border-red-500" : ""}
                min="0"
              />
              {errors.display_order && (
                <p className="text-sm text-red-600">{errors.display_order}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description about this team member..."
              defaultValue={teamMember?.description || ""}
              rows={4}
            />
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
              label="Profile Image"
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
              defaultChecked={teamMember?.is_active ?? true}
            />
            <Label htmlFor="is_active">Active</Label>
            <p className="text-sm text-muted-foreground ml-2">
              Only active team members will be displayed on the website
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
                ? "Update Team Member"
                : "Create Team Member"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}