import { BlogPostForm } from "@/components/admin/blog-post-form"
import { getBlogPost, getBlogCategories } from "@/app/actions/blog"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditBlogPostPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const post = await getBlogPost(id)
    return {
      title: `Edit: ${post?.title || "Blog Post"} | Admin Dashboard`,
    }
  } catch (error) {
    return {
      title: "Edit Blog Post | Admin Dashboard",
    }
  }
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params

  try {
    const [post, categories] = await Promise.all([getBlogPost(id), getBlogCategories()])

    if (!post) {
      return notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <BlogPostForm post={post} categories={categories} />
      </div>
    )
  } catch (error: any) {
    console.error("Error fetching blog post for edit:", error)
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-24 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
              Error Loading Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-2">Could not load blog post data for editing.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Details: {error.message || "An unexpected error occurred."}
            </p>
            <Link href="/admin/blog">
              <Button variant="outline">Back to Blog Posts</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
}
