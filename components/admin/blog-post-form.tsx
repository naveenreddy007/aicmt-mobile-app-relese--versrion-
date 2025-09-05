"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { TagInput } from "@/components/admin/tag-input"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { createBlogPost, updateBlogPost } from "@/app/actions/blog"
import type { BlogPost, BlogCategory } from "@/app/actions/blog"
import { EnhancedMediaSelector } from "@/components/admin/enhanced-media-selector"
import { getMediaItems } from "@/app/actions/media"

// Define Zod schema for form validation
const FormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, with hyphens")
    .optional()
    .or(z.literal("")),
  content: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  author_id: z.string().uuid("Invalid author ID").optional().nullable(),
  category_id: z.string().uuid("Invalid category ID").optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured_image_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  meta_title: z.string().max(70).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
  seo_keywords: z.array(z.string()).optional().nullable(),
  published_at: z.date().optional().nullable(),
})

type BlogPostFormValues = z.infer<typeof FormSchema>

interface BlogPostFormProps {
  post?: BlogPost
  categories: BlogCategory[]
  authors?: { id: string; name: string }[]
}

export function BlogPostForm({ post, categories, authors = [] }: BlogPostFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [isLoadingMedia, setIsLoadingMedia] = useState(true)

  // Set up default values for the form
  const defaultValues: Partial<BlogPostFormValues> = {
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    author_id: post?.author_id || null,
    category_id: post?.category_id || null,
    tags: post?.tags || [],
    status: post?.status || "draft",
    featured_image_url: post?.featured_image_url || "",
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
    seo_keywords: post?.seo_keywords || [],
    published_at: post?.published_at ? new Date(post.published_at) : null,
  }

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  })

  // Load media items
  useEffect(() => {
    const loadMediaItems = async () => {
      try {
        setIsLoadingMedia(true)
        const items = await getMediaItems()
        setMediaItems(items)
      } catch (error) {
        console.error("Error loading media items:", error)
        toast({
          title: "Error",
          description: "Failed to load media library",
          variant: "destructive",
        })
      } finally {
        setIsLoadingMedia(false)
      }
    }

    loadMediaItems()
  }, [])

  // Reset form when post changes
  useEffect(() => {
    if (post) {
      form.reset({
        ...defaultValues,
        published_at: post.published_at ? new Date(post.published_at) : null,
      })
    }
  }, [post, form])

  const onSubmit = async (data: BlogPostFormValues) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "tags" || key === "seo_keywords") {
            if (Array.isArray(value) && value.length > 0) {
              value.forEach((tag) => formData.append(key, tag))
            }
          } else if (key === "published_at" && value instanceof Date) {
            formData.append(key, value.toISOString())
          } else {
            formData.append(key, String(value))
          }
        }
      })

      let result
      if (post?.id) {
        result = await updateBlogPost(post.id, formData)
      } else {
        result = await createBlogPost(formData)
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: post ? "Post Updated" : "Post Created",
          description: post
            ? "Your blog post has been updated successfully."
            : "Your blog post has been created successfully.",
        })
        router.push("/admin/blog")
      }
    } catch (error: any) {
      console.error("Failed to save blog post:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = () => {
    const title = form.getValues("title")
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .slice(0, 200)
      form.setValue("slug", slug, { shouldValidate: true })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{post ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
          <CardDescription>
            {post ? "Update the details of this blog post." : "Fill in the details to create a new blog post."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  className={cn(form.formState.errors.title && "border-destructive")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="slug"
                    {...form.register("slug")}
                    placeholder="auto-generated-if-empty"
                    className={cn(form.formState.errors.slug && "border-destructive")}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.slug.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...form.register("excerpt")}
                  rows={3}
                  placeholder="Brief summary of the post (optional)"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Controller
                  name="content"
                  control={form.control}
                  render={({ field }) => <RichTextEditor value={field.value || ""} onChange={field.onChange} />}
                />
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-4 md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Publish Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      name="status"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value || "draft"}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="published_at">Publish Date (Optional)</Label>
                    <Controller
                      name="published_at"
                      control={form.control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category_id">Category</Label>
                    <Controller
                      name="category_id"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                          <SelectTrigger id="category_id">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Controller
                      name="tags"
                      control={form.control}
                      render={({ field }) => (
                        <TagInput
                          tags={field.value || []}
                          onTagsChange={(newTags) => field.onChange(newTags)}
                          placeholder="Add tags..."
                        />
                      )}
                    />
                  </div>
                  {authors.length > 0 && (
                    <div>
                      <Label htmlFor="author_id">Author</Label>
                      <Controller
                        name="author_id"
                        control={form.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                            <SelectTrigger id="author_id">
                              <SelectValue placeholder="Select author" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {authors.map((author) => (
                                <SelectItem key={author.id} value={author.id}>
                                  {author.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Featured Image</CardTitle>
                  <CardDescription>
                    Select an image from your media library or upload a new one
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMedia ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading media library...</span>
                    </div>
                  ) : (
                    <Controller
                      name="featured_image_url"
                      control={form.control}
                      render={({ field }) => (
                        <EnhancedMediaSelector
                          selectedImageUrl={field.value || ""}
                          onSelect={(imageId, imageUrl) => {
                            field.onChange(imageUrl)
                          }}
                          mediaItems={mediaItems}
                          label="Featured Image"
                        />
                      )}
                    />
                  )}
                  {form.formState.errors.featured_image_url && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.featured_image_url.message}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SEO Section */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">SEO Title</Label>
                <Input id="meta_title" {...form.register("meta_title")} />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.watch("meta_title")?.length || 0}/70 characters
                </p>
              </div>
              <div>
                <Label htmlFor="meta_description">SEO Description</Label>
                <Textarea id="meta_description" {...form.register("meta_description")} rows={3} />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.watch("meta_description")?.length || 0}/160 characters
                </p>
              </div>
              <div>
                <Label htmlFor="seo_keywords">SEO Keywords</Label>
                <Controller
                  name="seo_keywords"
                  control={form.control}
                  render={({ field }) => (
                    <TagInput
                      tags={field.value || []}
                      onTagsChange={(newTags) => field.onChange(newTags)}
                      placeholder="Add keywords..."
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {post ? "Update Post" : "Create Post"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
