"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createBlogCategory, updateBlogCategory } from "@/app/actions/blog"
import type { BlogCategory } from "@/app/actions/blog"

// Define Zod schema for form validation
const FormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, with hyphens")
    .optional()
    .or(z.literal("")),
  description: z.string().optional().nullable(),
})

type BlogCategoryFormValues = z.infer<typeof FormSchema>

interface BlogCategoryFormProps {
  category?: BlogCategory
}

export function BlogCategoryForm({ category }: BlogCategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set up default values for the form
  const defaultValues: Partial<BlogCategoryFormValues> = {
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
  }

  const form = useForm<BlogCategoryFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  })

  const onSubmit = async (data: BlogCategoryFormValues) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })

      let result
      if (category?.id) {
        result = await updateBlogCategory(category.id, formData)
      } else {
        result = await createBlogCategory(formData)
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: category ? "Category Updated" : "Category Created",
          description: category
            ? "Your category has been updated successfully."
            : "Your category has been created successfully.",
        })
        router.push("/admin/blog/categories")
      }
    } catch (error: any) {
      console.error("Failed to save category:", error)
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
    const name = form.getValues("name")
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .slice(0, 100)
      form.setValue("slug", slug, { shouldValidate: true })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{category ? "Edit Category" : "Create New Category"}</CardTitle>
          <CardDescription>
            {category ? "Update the details of this category." : "Fill in the details to create a new category."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              className={cn(form.formState.errors.name && "border-destructive")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={3}
              placeholder="Brief description of the category (optional)"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blog/categories")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {category ? "Update Category" : "Create Category"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
