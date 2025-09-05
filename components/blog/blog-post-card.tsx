"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Clock, Eye, Tag } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { BlogPost } from "@/app/actions/blog"

interface BlogPostCardProps {
  post: BlogPost
  showExcerpt?: boolean
  showAuthor?: boolean
  showCategory?: boolean
  showTags?: boolean
  showStats?: boolean
}

export function BlogPostCard({
  post,
  showExcerpt = true,
  showAuthor = true,
  showCategory = true,
  showTags = true,
  showStats = true,
}: BlogPostCardProps) {
  const publishDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at)
  const readingTime = Math.ceil((post.content?.length || 0) / 1000) // Rough estimate: 1000 chars per minute

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {post.featured_image_url && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <Link href={`/blog/${post.slug}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featured_image_url || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=200&width=400&text=Blog+Post"
              }}
            />
          </Link>
        </div>
      )}

      <CardHeader className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {showCategory && post.category && (
            <Badge variant="secondary" className="text-xs">
              {post.category.name}
            </Badge>
          )}
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {format(publishDate, "MMM d, yyyy")}
          </div>
        </div>

        <Link href={`/blog/${post.slug}`} className="group">
          <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>

        {showExcerpt && post.excerpt && (
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3">{post.excerpt}</p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {showTags && post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Link key={index} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                <Badge
                  variant="outline"
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Tag className="mr-1 h-2 w-2" />
                  {tag}
                </Badge>
              </Link>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        {showAuthor && post.author && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {post.author.first_name?.[0] || post.author.last_name?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {post.author.first_name || post.author.last_name
                ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim()
                : "Anonymous"}
            </span>
          </div>
        )}

        {showStats && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min read
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views_count || 0}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
