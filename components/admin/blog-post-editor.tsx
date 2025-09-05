"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ImagePlus, Save } from "lucide-react"

// Mock data for categories
const categories = [
  "Industry Insights",
  "Sustainability",
  "Market Trends",
  "Product Insights",
  "Regulations",
  "E-commerce",
]

interface BlogPostEditorProps {
  post: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    featured_image_url: string
    status: string
    category: string
    tags: string[]
    author: string
    date: string
    seo: {
      meta_title: string
      meta_description: string
      keywords: string
    }
  }
  isNew?: boolean
}

export function BlogPostEditor({ post, isNew = false }: BlogPostEditorProps) {
  const router = useRouter()
  const [formData, setFormData] = useState(post)
  const [date, setDate] = useState<Date | undefined>(post.date ? new Date(post.date) : undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")
    setFormData({
      ...formData,
      tags: tagsArray,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      status: checked ? "published" : "draft",
    })
  }

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      setFormData({
        ...formData,
        date: newDate.toISOString(),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, we would save the post to Supabase
      console.log("Saving post:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to blog management page
      router.push("/admin/blog")
    } catch (error) {
      console.error("Error saving post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/gi, "-")

    setFormData({
      ...formData,
      slug,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug">Slug</Label>
                    <Button type="button" variant="outline" size="sm" onClick={generateSlug} className="h-8">
                      Generate
                    </Button>
                  </div>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="enter-post-slug"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your post content here..."
                    className="min-h-[300px]"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the post"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="featured_image_url">Featured Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="featured_image_url"
                      name="featured_image_url"
                      value={formData.featured_image_url}
                      onChange={handleInputChange}
                      placeholder="/path/to/image.jpg"
                    />
                    <Button type="button" variant="outline" className="shrink-0">
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Browse
                    </Button>
                  </div>
                </div>

                {formData.featured_image_url && (
                  <div className="mt-4">
                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                      <Image
                        src={formData.featured_image_url || "/placeholder.svg"}
                        alt="Featured image preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Featured image preview</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="seo.meta_title">SEO Title</Label>
                  <Input
                    id="seo.meta_title"
                    name="seo.meta_title"
                    value={formData.seo.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO optimized title"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="seo.meta_description">Meta Description</Label>
                  <Textarea
                    id="seo.meta_description"
                    name="seo.meta_description"
                    value={formData.seo.meta_description}
                    onChange={handleInputChange}
                    placeholder="Brief description for search engines"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="seo.keywords">Keywords</Label>
                  <Input
                    id="seo.keywords"
                    name="seo.keywords"
                    value={formData.seo.keywords}
                    onChange={handleInputChange}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags.join(", ")}
                    onChange={handleTagsChange}
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Publication Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="status" checked={formData.status === "published"} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="status">{formData.status === "published" ? "Published" : "Draft"}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save Post"}
        </Button>
      </div>
    </form>
  )
}
