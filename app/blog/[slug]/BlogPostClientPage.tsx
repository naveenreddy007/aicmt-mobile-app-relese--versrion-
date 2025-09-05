"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Clock, Eye, Tag, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { getBlogPostBySlug, getRelatedPosts } from "@/app/actions/blog"
import type { BlogPost } from "@/app/actions/blog"
import { useEffect, useState } from "react"

interface BlogPostPageProps {
  params: { slug: string }
}

export default function BlogPostClientPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [publishDate, setPublishDate] = useState<Date | null>(null)
  const [readingTime, setReadingTime] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await getBlogPostBySlug(params.slug)

      if (!fetchedPost) {
        notFound()
        return
      }

      setPost(fetchedPost)
      setRelatedPosts(await getRelatedPosts(fetchedPost.id, 3))
      setPublishDate(fetchedPost.published_at ? new Date(fetchedPost.published_at) : new Date(fetchedPost.created_at))
      setReadingTime(Math.ceil((fetchedPost.content?.length || 0) / 1000))
    }

    fetchData()
  }, [params.slug])

  if (!post) {
    return <div>Loading...</div>
  }

  // Simple markdown to HTML converter
  const markdownToHtml = (markdown: string) => {
    if (!markdown) return ""

    const html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2 text-gray-900">$1</h3>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Lists
      .replace(/^\s*- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^\s*\d+\. (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      // Links and Images
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-blue-600 hover:underline font-medium">$1</a>')
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded-lg shadow-sm" />')
      // Blockquotes
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="pl-4 border-l-4 border-green-500 italic text-gray-700 my-4">$1</blockquote>',
      )
      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm">$1</code></pre>',
      )
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br />")

    return `<p class="mb-4">${html}</p>`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <div className="flex items-center gap-2 mb-4">
              {post.category && <Badge variant="secondary">{post.category.name}</Badge>}
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {publishDate && format(publishDate, "MMMM d, yyyy")}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {readingTime} min read
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="mr-1 h-3 w-3" />
                {post.views_count || 0} views
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>

            {post.excerpt && <p className="text-lg text-gray-600 mb-6">{post.excerpt}</p>}

            {post.author && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.avatar_url || undefined} />
                  <AvatarFallback>{post.author.first_name?.[0] || post.author.last_name?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {post.author.first_name || post.author.last_name
                      ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim()
                      : "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600">Author</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <article className="max-w-none">
                {post.featured_image_url && (
                  <div className="aspect-video overflow-hidden rounded-lg mb-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.featured_image_url || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=400&width=800&text=Blog+Post+Image"
                      }}
                    />
                  </div>
                )}

                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content || "") }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Link key={index} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                          <Badge
                            variant="outline"
                            className="hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share this post
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: post.title,
                            text: post.excerpt || post.title,
                            url: window.location.href,
                          })
                        }
                      }}
                    >
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Twitter
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </Button>
                  </div>
                </div>
              </article>

              {relatedPosts.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <BlogPostCard
                        key={relatedPost.id}
                        post={relatedPost}
                        showExcerpt={true}
                        showAuthor={false}
                        showCategory={true}
                        showTags={false}
                        showStats={false}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
