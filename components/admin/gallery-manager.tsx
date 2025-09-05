"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Search,
  Filter,
} from "lucide-react"
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/app/actions/gallery"
import type { GalleryItem } from "@/app/actions/gallery"

interface MediaItem {
  id: string
  url: string
  name: string
  type: string
  size: string
}

interface GalleryManagerProps {
  initialGalleryItems: GalleryItem[]
  availableMedia: MediaItem[]
}

const categoryLabels = {
  facility: "Our Facility",
  products: "Products",
  events: "Events & Exhibitions",
}

export function GalleryManager({ initialGalleryItems, availableMedia }: GalleryManagerProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter items based on category and search
  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddItem = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await createGalleryItem(formData)
      if (result.success) {
        toast.success("Gallery item added successfully")
        setIsAddDialogOpen(false)
        // Refresh the page to get updated data
        window.location.reload()
      } else {
        toast.error(result.error || "Failed to add gallery item")
      }
    } catch (error) {
      toast.error("Failed to add gallery item")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditItem = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await updateGalleryItem(formData)
      if (result.success) {
        toast.success("Gallery item updated successfully")
        setIsEditDialogOpen(false)
        setEditingItem(null)
        // Refresh the page to get updated data
        window.location.reload()
      } else {
        toast.error(result.error || "Failed to update gallery item")
      }
    } catch (error) {
      toast.error("Failed to update gallery item")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) {
      return
    }

    setIsLoading(true)
    try {
      const result = await deleteGalleryItem(id)
      if (result.success) {
        toast.success("Gallery item deleted successfully")
        setGalleryItems(prev => prev.filter(item => item.id !== id))
      } else {
        toast.error(result.error || "Failed to delete gallery item")
      }
    } catch (error) {
      toast.error("Failed to delete gallery item")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (item: GalleryItem) => {
    const formData = new FormData()
    formData.append("id", item.id)
    formData.append("is_active", (!item.is_active).toString())

    setIsLoading(true)
    try {
      const result = await updateGalleryItem(formData)
      if (result.success) {
        toast.success(`Gallery item ${!item.is_active ? 'activated' : 'deactivated'} successfully`)
        setGalleryItems(prev => 
          prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i)
        )
      } else {
        toast.error(result.error || "Failed to update gallery item")
      }
    } catch (error) {
      toast.error("Failed to update gallery item")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gallery items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="facility">Our Facility</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="events">Events & Exhibitions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add to Gallery
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Image to Gallery</DialogTitle>
              <DialogDescription>
                Select an image from your media library and assign it to a gallery category.
              </DialogDescription>
            </DialogHeader>
            <GalleryItemForm
              availableMedia={availableMedia}
              onSubmit={handleAddItem}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="group">
            <CardHeader className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={item.url || "/placeholder.svg"}
                  alt={item.alt_text || item.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary">
                    {categoryLabels[item.category]}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingItem(item)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(item)}
                      >
                        {item.is_active ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Show
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {!item.is_active && (
                  <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                    <Badge variant="destructive">Hidden</Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {item.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Order: {item.display_order}</span>
                <span className={item.is_active ? "text-green-600" : "text-red-600"}>
                  {item.is_active ? "Active" : "Hidden"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== "all" 
              ? "No gallery items match your filters."
              : "No gallery items found. Add some images to get started."
            }
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
            <DialogDescription>
              Update the gallery item details.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <GalleryItemForm
              availableMedia={availableMedia}
              initialData={editingItem}
              onSubmit={handleEditItem}
              isLoading={isLoading}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface GalleryItemFormProps {
  availableMedia: MediaItem[]
  initialData?: GalleryItem
  onSubmit: (formData: FormData) => void
  isLoading: boolean
  isEdit?: boolean
}

function GalleryItemForm({ availableMedia, initialData, onSubmit, isLoading, isEdit }: GalleryItemFormProps) {
  const [selectedMediaId, setSelectedMediaId] = useState(initialData?.media_id || "")
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(
    availableMedia.find(m => m.id === initialData?.media_id) || null
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (isEdit && initialData) {
      formData.append("id", initialData.id)
    }
    onSubmit(formData)
  }

  const handleMediaSelect = (mediaId: string) => {
    setSelectedMediaId(mediaId)
    const media = availableMedia.find(m => m.id === mediaId)
    setSelectedMedia(media || null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="media_id">Select Image</Label>
            <Select 
              name="media_id" 
              value={selectedMediaId} 
              onValueChange={handleMediaSelect}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an image" />
              </SelectTrigger>
              <SelectContent>
                {availableMedia.filter(media => media.type === "image").map((media) => (
                  <SelectItem key={media.id} value={media.id}>
                    {media.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={initialData?.category || "facility"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facility">Our Facility</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="events">Events & Exhibitions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title || ""}
              placeholder="Enter image title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ""}
              placeholder="Enter image description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="alt_text">Alt Text</Label>
            <Input
              id="alt_text"
              name="alt_text"
              defaultValue={initialData?.alt_text || ""}
              placeholder="Enter alt text for accessibility"
            />
          </div>

          <div>
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              name="display_order"
              type="number"
              min="0"
              defaultValue={initialData?.display_order || 0}
              placeholder="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              name="is_active"
              defaultChecked={initialData?.is_active ?? true}
            />
            <Label htmlFor="is_active">Active (visible in gallery)</Label>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Preview</Label>
          {selectedMedia ? (
            <div className="space-y-2">
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <Image
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p><strong>Name:</strong> {selectedMedia.name}</p>
                <p><strong>Type:</strong> {selectedMedia.type}</p>
                <p><strong>Size:</strong> {selectedMedia.size}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
              <p className="text-muted-foreground">Select an image to preview</p>
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading || !selectedMediaId}>
          {isLoading ? "Saving..." : isEdit ? "Update" : "Add to Gallery"}
        </Button>
      </DialogFooter>
    </form>
  )
}