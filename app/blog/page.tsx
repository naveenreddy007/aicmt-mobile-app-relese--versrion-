import { Suspense } from "react"
import type { Metadata } from "next"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getPublishedBlogPosts, searchBlogPosts } from "@/app/actions/blog"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog | AICMT International",
  description:
    "Latest insights on biodegradable plastics, sustainability, and environmental innovation from AICMT International.",
  keywords: ["biodegradable plastics", "sustainability", "environment", "innovation", "blog"],
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string
    tag?: string
  }>
}

const POSTS_PER_PAGE = 9

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam, search: searchQuery, category: categorySlug, tag: tagName } = await searchParams
  const page = Number.parseInt(pageParam || "1", 10)

  const offset = (page - 1) * POSTS_PER_PAGE

  let posts: any[] = []
  let totalCount = 0
  let pageTitle = "Latest Blog Posts"

  try {
    if (searchQuery) {
      posts = await searchBlogPosts(searchQuery)
      totalCount = posts.length
      pageTitle = `Search Results for "${searchQuery}"`
    } else {
      const result = await getPublishedBlogPosts(POSTS_PER_PAGE, offset)
      posts = result.data || []
      totalCount = result.count || 0
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    posts = []
    totalCount = 0
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover insights on sustainable packaging, biodegradable materials, and environmental innovation
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-3">
              {posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {posts.map((post) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                        showExcerpt={true}
                        showAuthor={true}
                        showCategory={true}
                        showTags={true}
                        showStats={true}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      {hasPrevPage && (
                        <Button asChild variant="outline">
                          <Link
                            href={`/blog?page=${page - 1}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                          >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous
                          </Link>
                        </Button>
                      )}

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1
                          const isCurrentPage = pageNum === page

                          return (
                            <Button key={pageNum} asChild variant={isCurrentPage ? "default" : "outline"} size="sm">
                              <Link
                                href={`/blog?page=${pageNum}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                              >
                                {pageNum}
                              </Link>
                            </Button>
                          )
                        })}
                      </div>

                      {hasNextPage && (
                        <Button asChild variant="outline">
                          <Link
                            href={`/blog?page=${page + 1}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                          >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? `No posts match your search for "${searchQuery}"`
                        : "No blog posts are available at the moment."}
                    </p>
                    {searchQuery && (
                      <Button asChild variant="outline">
                        <Link href="/blog">View All Posts</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Suspense fallback={<BlogSidebarSkeleton />}>
                <BlogSidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function BlogSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <div className="p-4">
            <Skeleton className="h-4 w-24 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
