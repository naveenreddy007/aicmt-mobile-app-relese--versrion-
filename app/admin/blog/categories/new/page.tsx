import { BlogCategoryForm } from "@/components/admin/blog-category-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Blog Category | Admin Dashboard",
  description: "Create a new blog category.",
}

export default function NewBlogCategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BlogCategoryForm />
    </div>
  )
}
