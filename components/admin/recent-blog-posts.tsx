"use client"

import { useEffect, useState } from "react"
import { getBlogPosts } from "@/app/actions/blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RecentBlogPosts() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      const data = await getBlogPosts()
      setPosts(data.slice(0, 5)) // Get only the 5 most recent
      setIsLoading(false)
    }

    fetchPosts()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-500 hover:bg-green-600"
      case "draft":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No date"
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-[300px]">Loading blog posts...</div>
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-4">No blog posts found</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{post.title}</h4>
                  <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(post.published_at)}</p>
                <p className="text-sm line-clamp-2">{post.excerpt || "No excerpt available"}</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/blog/edit/${post.id}`}>Edit</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/blog">View All Posts</Link>
        </Button>
      </div>
    </div>
  )
}
