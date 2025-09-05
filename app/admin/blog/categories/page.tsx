import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogCategoriesTable } from "@/components/admin/blog-categories-table"
import { Plus } from "lucide-react"
import { getBlogCategoriesWithCount } from "@/app/actions/blog"
import Link from "next/link"

export const metadata = {
  title: "Blog Categories | Admin Dashboard",
  description: "Manage blog categories",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BlogCategoriesPage() {
  const categories = await getBlogCategoriesWithCount()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blog Categories</h1>
        <Button asChild>
          <Link href="/admin/blog/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your blog categories and organize your content</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogCategoriesTable initialCategories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
