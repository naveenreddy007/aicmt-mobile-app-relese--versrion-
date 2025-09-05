import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OptimizedImage } from "@/components/optimized-image"
import { TranslatedText } from "@/components/translated-text"
import { getPostsByTag } from "@/app/actions/blog"

interface TagPageProps {
  params: Promise<{
    locale: string
    tag: string
  }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { locale, tag } = await params
  
  // Convert slug back to tag name (replace hyphens with spaces and capitalize)
  const tagName = tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  // Get posts by tag
  const posts = await getPostsByTag(tag)

  if (!posts || posts.length === 0) {
    notFound()
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/blog`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <TranslatedText textKey="blog.backToBlog" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              #{tagName}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Posts tagged with "{tagName}"
          </h1>
          <p className="text-sm text-gray-500">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative aspect-video w-full">
                <OptimizedImage
                  src={post.featured_image_url || "/placeholder.svg?height=300&width=500&query=blog post"}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <Calendar className="h-3 w-3" />
                  <span>{post.published_at ? formatDate(post.published_at) : "No date"}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <User className="h-3 w-3" />
                  <span>Admin</span>
                  <Separator orientation="vertical" className="h-3" />
                  <Clock className="h-3 w-3" />
                  <span>{Math.ceil((post.content?.length || 0) / 1500)} min read</span>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <Link href={`/${locale}/blog/${post.slug}`}>
                  <Button variant="outline" size="sm">
                    <TranslatedText textKey="blog.readMore" />
                  </Button>
                </Link>
                <div className="flex flex-wrap gap-1">
                  {post.tags &&
                    post.tags.slice(0, 2).map((tag: string, index: number) => (
                      <Link
                        key={index}
                        href={`/${locale}/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                        className="no-underline"
                      >
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </Badge>
                      </Link>
                    ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params
  const tagName = tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  return {
    title: `${tagName} | Blog Tags`,
    description: `Browse all posts tagged with ${tagName}`,
  }
}