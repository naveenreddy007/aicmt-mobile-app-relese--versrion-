"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, Tag, Calendar, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getAllTags, getBlogCategoriesWithCount, getPublishedBlogPosts } from "@/app/actions/blog"
import type { BlogCategory, BlogPost } from "@/app/actions/blog"

interface BlogSidebarProps {
  className?: string
}

export function BlogSidebar({ className }: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<(BlogCategory & { post_count: number })[]>([])
  const [tags, setTags] = useState<{ name: string; count: number; slug: string }[]>([])
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [categoriesData, tagsData, recentPostsData] = await Promise.all([
          getBlogCategoriesWithCount(),
          getAllTags(),
          getPublishedBlogPosts(5, 0),
        ])

        setCategories(categoriesData)
        setTags(tagsData.slice(0, 10)) // Show top 10 tags
        setRecentPosts(recentPostsData.data || [])
      } catch (error) {
        console.error("Error fetching sidebar data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSidebarData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Search className="mr-2 h-4 w-4" />
              Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories */}
        {categories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2 h-4 w-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="flex items-center justify-between py-1 hover:text-primary transition-colors"
                  >
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.post_count}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Tags */}
        {tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Tag className="mr-2 h-4 w-4" />
                Popular Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link key={tag.name} href={`/blog/tag/${encodeURIComponent(tag.name)}`}>
                    <Badge
                      variant="outline"
                      className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {tag.name} ({tag.count})
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-4 w-4" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post, index) => (
                  <div key={post.id}>
                    <Link href={`/blog/${post.slug}`} className="block hover:text-primary transition-colors">
                      <h4 className="text-sm font-medium leading-tight line-clamp-2">{post.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </Link>
                    {index < recentPosts.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
