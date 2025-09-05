import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogPostsTable } from "@/components/admin/blog-posts-table"
import { Plus, LayoutGrid, ListFilter, MessageSquare, Tag } from "lucide-react"
import { getBlogPosts, getBlogStats } from "@/app/actions/blog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Blog Management | Admin Dashboard",
  description: "Manage blog posts, categories, and tags",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BlogManagementPage() {
  const stats = await getBlogStats()
  const posts = await getBlogPosts()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/blog/categories">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Categories
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList>
          <TabsTrigger value="posts">
            <ListFilter className="mr-2 h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comments ({stats.comments})
          </TabsTrigger>
          <TabsTrigger value="tags">
            <Tag className="mr-2 h-4 w-4" />
            Tags
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Manage your blog posts, edit content, and control publication status</CardDescription>
            </CardHeader>
            <CardContent>
              <BlogPostsTable initialPosts={posts} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Manage and moderate user comments on your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button asChild>
                  <Link href="/admin/blog/comments">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View All Comments
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tags" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>View and manage tags used across your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button asChild>
                  <Link href="/admin/blog/tags">
                    <Tag className="mr-2 h-4 w-4" />
                    Manage Tags
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
