import { BlogCategoryForm } from "@/components/admin/blog-category-form"
import { getBlogCategory } from "@/app/actions/blog"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"

interface EditBlogCategoryPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditBlogCategoryPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const category = await getBlogCategory(id)
    return {
      title: `Edit: ${category?.name || "Category"} | Admin Dashboard`,
    }
  } catch (error) {
    return {
      title: "Edit Blog Category | Admin Dashboard",
    }
  }
}

export default async function EditBlogCategoryPage({ params }: EditBlogCategoryPageProps) {
  const { id } = await params

  try {
    const category = await getBlogCategory(id)

    if (!category) {
      return notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <BlogCategoryForm category={category} />
      </div>
    )
  } catch (error: any) {
    console.error("Error fetching blog category for edit:", error)
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-24 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
              Error Loading Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-2">Could not load category data for editing.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Details: {error.message || "An unexpected error occurred."}
            </p>
            <Link href="/admin/blog/categories">
              <Button variant="outline">Back to Categories</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
}
