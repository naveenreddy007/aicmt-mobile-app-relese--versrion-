import { BlogPostForm } from "@/components/admin/blog-post-form"
import { getBlogCategories } from "@/app/actions/blog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Blog Post | Admin Dashboard",
  description: "Create a new blog post.",
}

export default async function NewBlogPostPage() {
  const categories = await getBlogCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogPostForm categories={categories} />
    </div>
  )
}
