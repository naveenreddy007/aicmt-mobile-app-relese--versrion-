import type { Metadata } from "next"
import { getBlogPostBySlug } from "@/app/actions/blog"
import BlogPostClientPage from "./BlogPostClientPage"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found | AICMT International Blog",
    }
  }

  return {
    title: post.seo_title || `${post.title} | AICMT International Blog`,
    description: post.seo_description || post.excerpt || `Read about ${post.title} on AICMT International blog.`,
    keywords: post.seo_keywords || post.tags || [],
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read about ${post.title} on AICMT International blog.`,
      images: post.featured_image_url ? [{ url: post.featured_image_url }] : [],
      type: "article",
      publishedTime: post.published_at || post.created_at,
      authors: post.author ? [`${post.author.first_name || ""} ${post.author.last_name || ""}`.trim()] : [],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `Read about ${post.title} on AICMT International blog.`,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  return <BlogPostClientPage params={resolvedParams} />
}
