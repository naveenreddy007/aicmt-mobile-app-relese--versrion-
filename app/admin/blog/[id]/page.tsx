import { notFound } from "next/navigation"
import { BlogPostForm } from "@/components/admin/blog-post-form"

// Sample blog posts data - in a real app, this would come from your database
const blogPosts = [
  {
    id: "blog-001",
    title: "Biodegradable Plastics: The Future of Packaging",
    slug: "biodegradable-plastics-future-packaging",
    content: "This is a detailed article about biodegradable plastics and their role in the future of packaging...",
    excerpt:
      "Explore how biodegradable plastics are revolutionizing the packaging industry and helping to create a more sustainable future.",
    author: {
      id: "author-1",
      name: "Priya Sharma",
      avatar: "/confident-leader.png",
    },
    category: "Industry Trends",
    tags: ["Biodegradable", "Packaging", "Sustainability"],
    status: "published",
    publishDate: "2023-05-10",
    featuredImage: "/sustainable-future-city.png",
    seo: {
      title: "Biodegradable Plastics: The Future of Sustainable Packaging",
      description:
        "Learn how biodegradable plastics are revolutionizing the packaging industry and creating a more sustainable future for our planet.",
      keywords: "biodegradable plastics, sustainable packaging, eco-friendly packaging, future of packaging",
    },
  },
]

async function getBlogPost(id) {
  // In a real app, this would fetch from your database
  return blogPosts.find((post) => post.id === id) || null
}

export default async function EditBlogPostPage({ params }) {
  const post = await getBlogPost(params.id)

  if (!post && params.id !== "new") {
    notFound()
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {params.id === "new" ? "Create New Blog Post" : "Edit Blog Post"}
        </h1>
        <p className="text-muted-foreground">
          {params.id === "new" ? "Create a new blog post to share with your audience" : "Edit your existing blog post"}
        </p>
      </div>

      <BlogPostForm post={post} />
    </div>
  )
}
