import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogCommentsTable } from "@/components/admin/blog-comments-table"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Blog Comments | Admin Dashboard",
  description: "Manage blog comments and moderation",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BlogCommentsPage() {
  // Get comments with post titles
  const supabase = await createSupabaseServerClient()

  const { data: comments, error } = await supabase
    .from("blog_comments")
    .select(`
      *,
      blog_posts!inner(title)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching comments:", error)
    throw new Error("Failed to fetch comments")
  }

  // Transform the data to include post titles
  const commentsWithPostTitles = comments.map((comment) => ({
    ...comment,
    post_title: comment.blog_posts?.title || "Unknown Post",
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blog Comments</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>Manage and moderate user comments on your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogCommentsTable initialComments={commentsWithPostTitles} />
        </CardContent>
      </Card>
    </div>
  )
}
