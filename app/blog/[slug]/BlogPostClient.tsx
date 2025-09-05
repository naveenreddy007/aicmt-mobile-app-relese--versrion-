"use client"

import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  LinkIcon,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

// This should be fetched dynamically in a real app
const relatedPosts = [
  {
    id: 2,
    title: "Understanding Biodegradation: How Compostable Plastics Break Down",
    slug: "understanding-biodegradation-compostable-plastics",
    image: "/microbial-decomposition.png",
    date: "March 22, 2023",
  },
  {
    id: 4,
    title: "5 Ways Businesses Can Reduce Their Plastic Footprint",
    slug: "5-ways-businesses-reduce-plastic-footprint",
    image: "/business-sustainability.png",
    date: "January 18, 2023",
  },
]

type BlogPostClientProps = {
  params: { slug: string; locale: string }
  blogPost: any // Type this properly based on your getBlogPostBySlug return type
}

export default function BlogPostClient({ params, blogPost }: BlogPostClientProps) {
  const [currentURL, setCurrentURL] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentURL(window.location.href)
    }
  }, [])

  const formattedDate = format(new Date(blogPost.published_at || blogPost.created_at), "MMMM d, yyyy")

  const wordsPerMinute = 200
  const numberOfWords = blogPost.content?.split(/\s/g).length || 0
  const readTime = `${Math.ceil(numberOfWords / wordsPerMinute)} min read`

  const author = Array.isArray(blogPost.author) ? null : blogPost.author

  const handleCopyLink = () => {
    if (currentURL) {
      navigator.clipboard.writeText(currentURL)
      toast({
        title: "Link Copied!",
        description: "The article link has been copied to your clipboard.",
      })
    }
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link href={`/${params.locale}/blog`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                {blogPost.category && (
                  <Badge variant="outline" className="bg-green-50">
                    {blogPost.category}
                  </Badge>
                )}
                {blogPost.category && <Separator orientation="vertical" className="h-4" />}
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
                <Separator orientation="vertical" className="h-4" />
                <Clock className="h-4 w-4" />
                <span>{readTime}</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{blogPost.title}</h1>

              <div className="flex items-center gap-3 pt-4">
                <Avatar>
                  <AvatarImage
                    src={author?.avatar_url || "/placeholder-user.jpg"}
                    alt={author ? `${author.first_name} ${author.last_name}` : "AICMT Team"}
                  />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{author ? `${author.first_name} ${author.last_name}` : "AICMT Team"}</p>
                  <p className="text-sm text-gray-500">Content Contributor</p>
                </div>
              </div>
            </div>
          </header>

          {blogPost.featured_image_url && (
            <div className="relative aspect-[16/9] w-full my-8">
              <Image
                src={blogPost.featured_image_url || "/placeholder.svg"}
                alt={blogPost.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}

          {blogPost.content ? (
            <div
              className="prose prose-green max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Content is not available for this post.</p>
            </div>
          )}

          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-500" />
                {blogPost.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-green-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Share this Article</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <Link
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentURL)}&text=${encodeURIComponent(blogPost.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <Link
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentURL)}&title=${encodeURIComponent(blogPost.title)}&summary=${encodeURIComponent(blogPost.excerpt || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <Link
                  href={`https://wa.me/?text=${encodeURIComponent(blogPost.title + " " + currentURL)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" /> {/* Using MessageCircle for WhatsApp */}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleCopyLink}
                aria-label="Copy link to share on Instagram or elsewhere"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleCopyLink}
                aria-label="Copy article link"
              >
                <LinkIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </article>

        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {relatedPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.image && (
                  <div className="relative aspect-video w-full">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <CardHeader>
                  {post.date && <div className="text-xs text-gray-500 mb-1">{post.date}</div>}
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/${params.locale}/blog/${post.slug}`}>
                    <Button variant="outline" size="sm">
                      Read Article
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
