"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Define types
export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  author_id: string | null
  category_id: string | null
  category?: { name: string; slug: string }
  tags: string[]
  status: "draft" | "published" | "archived"
  featured_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  seo_keywords: string[] | null
  published_at: string | null
  created_at: string
  updated_at: string
  views_count: number
  author?: {
    id: string
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
  } | null
}

export type BlogCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
  post_count?: number
}

export type BlogComment = {
  id: string
  post_id: string
  user_id: string | null
  name: string
  email: string
  content: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

// Validation schemas
const BlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  author_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured_image_url: z.string().url().optional().nullable(),
  meta_title: z.string().max(70).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
  seo_keywords: z.array(z.string()).optional().nullable(),
  published_at: z.string().optional().nullable(),
})

const BlogCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
})

const BlogCommentSchema = z.object({
  post_id: z.string().uuid("Invalid post ID"),
  user_id: z.string().uuid("Invalid user ID").optional().nullable(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  content: z.string().min(1, "Comment content is required"),
  is_approved: z.boolean().default(false),
})

// Blog Post Actions
export async function getBlogPosts() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:category_id(id, name, slug),
      blog_post_tags(blog_tags(id, name, slug))
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    throw new Error("Failed to fetch blog posts")
  }

  // Transform the data to include tags as a simple array
  const transformedData = data?.map(post => {
    if (!post || typeof post !== 'object') return { tags: [] } as any
    return {
      ...(post as any),
      tags: (post as any).blog_post_tags?.map((pt: { blog_tags?: { name?: string } }) => pt.blog_tags?.name).filter(Boolean) || []
    }
  }) || []

  return transformedData
}

export async function getPublishedBlogPosts(limit?: number, offset?: number) {
  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      category:category_id(id, name, slug),
      blog_post_tags(blog_tags(id, name, slug))
    `)
    .eq("status", "published" as any)
    .order("published_at", { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1)
  }

  const { data, error, count } = await query.returns<BlogPost[]>()

  if (error) {
    console.error("Error fetching published blog posts:", error)
    throw new Error("Failed to fetch published blog posts")
  }

  // Transform the data to include tags as a simple array
  const transformedData = data?.map(post => {
    if (!post || typeof post !== 'object') return { tags: [] } as any
    return {
      ...(post as any),
      tags: (post as any).blog_post_tags?.map((pt: { blog_tags?: { name?: string } }) => pt.blog_tags?.name).filter(Boolean) || []
    }
  }) || []

  return { data: transformedData, count }
}

export async function getBlogPost(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:category_id(id, name, slug),
      blog_post_tags(blog_tags(id, name, slug))
    `)
    .eq("id", id as any)
    .single()

  if (error) {
    console.error("Error fetching blog post:", error)
    throw new Error("Failed to fetch blog post")
  }

  // Transform the data to include tags as a simple array
  const transformedData = {
    ...(data as any),
    tags: (data as any).blog_post_tags?.map((pt: { blog_tags?: { name?: string } }) => pt.blog_tags?.name).filter(Boolean) || []
  }

  return transformedData as BlogPost
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:category_id(id, name, slug),
      blog_post_tags(blog_tags(id, name, slug))
    `)
    .eq("slug", slug as any)
    .single()

  if (error) {
    console.warn(`Failed to fetch blog post by slug "${slug}":`, error.message)
    return null
  }

  // Increment view count
  if (data) {
    await supabase
      .from("blog_posts")
      .update({ views_count: ((data as any).views_count || 0) + 1 } as any)
      .eq("id", (data as any).id as any)
  }

  // Transform the data to include tags as a simple array
  const transformedData = {
    ...(data as any),
    tags: (data as any).blog_post_tags?.map((pt: { blog_tags?: { name?: string } }) => pt.blog_tags?.name).filter(Boolean) || []
  }

  return transformedData as BlogPost
}

// Helper function to handle post tags
async function handlePostTags(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, postId: string, tagNames: string[]) {
  // First, get or create tags
  const tagIds: string[] = []
  
  for (const tagName of tagNames) {
    if (!tagName.trim()) continue
    
    const slug = tagName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    
    // Try to find existing tag
    let { data: existingTag } = await supabase
      .from('blog_tags')
      .select('id')
      .eq('name', tagName.trim() as any)
      .single()
    
    if (existingTag) {
      tagIds.push((existingTag as any).id)
    } else {
      // Create new tag
      const { data: newTag, error } = await supabase
        .from('blog_tags')
        .insert({ name: tagName.trim(), slug } as any)
        .select('id')
        .single()
      
      if (newTag && !error) {
        tagIds.push((newTag as any).id)
      }
    }
  }
  
  // Create post-tag relationships
  if (tagIds.length > 0) {
    const postTagData = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }))
    
    await supabase.from('blog_post_tags').insert(postTagData as any)
  }
}

export async function createBlogPost(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  // Extract form data
  const rawData: Record<string, unknown> = {}
  const tags: string[] = []
  
  formData.forEach((value, key) => {
    if (key === "tags") {
      // Handle tags separately
      if (typeof value === "string") {
        if (value.includes(",")) {
          // Handle comma-separated values
          const values = value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
          tags.push(...values)
        } else {
          tags.push(value)
        }
      }
    } else if (key === "seo_keywords") {
      // Handle seo_keywords arrays
      const existingValue = rawData[key] || []
      if (typeof value === "string") {
        if (value.includes(",")) {
          const values = value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
          rawData[key] = [...(existingValue as any), ...values]
        } else {
          rawData[key] = [...(existingValue as any), value]
        }
      }
    } else {
      // Map old field names to new ones for backward compatibility
      if (key === "featured_image") {
        rawData["featured_image_url"] = value
      } else if (key === "seo_title") {
        rawData["meta_title"] = value
      } else if (key === "seo_description") {
        rawData["meta_description"] = value
      } else if (key === "publish_date") {
        rawData["published_at"] = value
      } else {
        rawData[key] = value
      }
    }
  })

  // Remove tags from validation since they're handled separately
  delete rawData.tags

  // Validate data
  const validationResult = BlogPostSchema.safeParse(rawData)
  if (!validationResult.success) {
    console.error("Validation errors:", validationResult.error.flatten().fieldErrors)
    return { error: `Invalid blog post data: ${JSON.stringify(validationResult.error.flatten().fieldErrors)}` }
  }

  const postData = validationResult.data

  // Set publish date if status is published and no date is provided
  if (postData.status === "published" && !postData.published_at) {
    postData.published_at = new Date().toISOString()
  }

  // Insert post
  const { data: post, error } = await supabase.from("blog_posts").insert([postData] as any).select().single()

  if (error) {
    console.error("Error creating blog post:", error)
    return { error: `Failed to create blog post: ${error.message}` }
  }

  // Handle tags if provided
  if (tags.length > 0 && (post as any)?.id) {
    await handlePostTags(supabase as any, (post as any).id, tags)
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")

  return { data: post }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient()

  // Extract form data
  const rawData: Record<string, unknown> = {}
  const tags: string[] = []
  
  formData.forEach((value, key) => {
    if (key === "tags") {
      // Handle tags separately
      if (typeof value === "string") {
        if (value.includes(",")) {
          // Handle comma-separated values
          const values = value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
          tags.push(...values)
        } else {
          tags.push(value)
        }
      }
    } else if (key === "seo_keywords") {
      // Handle seo_keywords arrays
      const existingValue = rawData[key] || []
      if (typeof value === "string") {
        if (value.includes(",")) {
          const values = value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
          rawData[key] = [...(existingValue as any), ...values]
        } else {
          rawData[key] = [...(existingValue as any), value]
        }
      }
    } else {
      // Map old field names to new ones for backward compatibility
      if (key === "featured_image") {
        rawData["featured_image_url"] = value
      } else if (key === "seo_title") {
        rawData["meta_title"] = value
      } else if (key === "seo_description") {
        rawData["meta_description"] = value
      } else if (key === "publish_date") {
        rawData["published_at"] = value
      } else {
        rawData[key] = value
      }
    }
  })

  // Don't allow changing the ID
  delete rawData.id
  // Remove tags from validation since they're handled separately
  delete rawData.tags

  // Validate data
  const validationResult = BlogPostSchema.partial().safeParse(rawData)
  if (!validationResult.success) {
    console.error("Validation errors:", validationResult.error.flatten().fieldErrors)
    return { error: `Invalid blog post data: ${JSON.stringify(validationResult.error.flatten().fieldErrors)}` }
  }

  const postData = validationResult.data

  // Set publish date if status is published and no date is provided
  if (postData.status === "published" && !postData.published_at) {
    postData.published_at = new Date().toISOString()
  }

  // Update post
  const { data: post, error } = await supabase.from("blog_posts").update(postData as any).eq("id", id as any).select().single()

  if (error) {
    console.error("Error updating blog post:", error)
    return { error: `Failed to update blog post: ${error.message}` }
  }

  // Handle tags - first remove existing tags, then add new ones
  if ((post as any)?.id) {
    // Remove existing tag relationships
    await supabase.from('blog_post_tags').delete().eq('post_id', (post as any).id)
    
    // Add new tags if provided
    if (tags.length > 0) {
      await handlePostTags(supabase as any, (post as any).id, tags)
    }
  }

  revalidatePath("/admin/blog")
  revalidatePath(`/admin/blog/edit/${id}`)
  revalidatePath("/blog")
  if ((post as any)?.slug) {
    revalidatePath(`/blog/${(post as any).slug}`)
  }

  return { data: post }
}

export async function deleteBlogPost(id: string) {
  const supabase = await createSupabaseServerClient()

  // Get the slug before deleting for revalidation
  const { data: post } = await supabase.from("blog_posts").select("slug").eq("id", id as any).single()

  // Delete the post
  const { error } = await supabase.from("blog_posts").delete().eq("id", id as any)

  if (error) {
    console.error("Error deleting blog post:", error)
    return { error: `Failed to delete blog post: ${error.message}` }
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  if ((post as any)?.slug) {
    revalidatePath(`/blog/${(post as any).slug}`)
  }

  return { success: true }
}

// Blog Category Actions
export async function getBlogCategories() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("blog_categories").select("*").order("name")

  if (error) {
    console.error("Error fetching blog categories:", error)
    throw new Error("Failed to fetch blog categories")
  }

  return data as any
}

export async function getBlogCategoriesWithCount() {
  const supabase = await createSupabaseServerClient()

  // First get all categories
  const { data: categories, error: categoriesError } = await supabase.from("blog_categories").select("*").order("name")

  if (categoriesError) {
    console.error("Error fetching blog categories:", categoriesError)
    throw new Error("Failed to fetch blog categories")
  }

  // Then get post counts for each category
  const { data: posts, error: postsError } = await supabase
    .from("blog_posts")
    .select("category_id")
    .eq("status", "published" as any)

  if (postsError) {
    console.error("Error fetching post counts:", postsError)
    throw new Error("Failed to fetch post counts")
  }

  // Count posts per category
  const categoryCounts: Record<string, number> = {}
  posts.forEach((post) => {
    if ((post as any).category_id) {
      categoryCounts[(post as any).category_id] = (categoryCounts[(post as any).category_id] || 0) + 1
    }
  })

  // Add counts to categories
  const categoriesWithCount = categories.map((category) => ({
    ...(category as any),
    post_count: categoryCounts[(category as any).id] || 0,
  }))

  return categoriesWithCount as (BlogCategory & { post_count: number })[]
}

export async function getBlogCategory(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("blog_categories").select("*").eq("id", id as any).single()

  if (error) {
    console.error("Error fetching blog category:", error)
    throw new Error("Failed to fetch blog category")
  }

  return data as any
}

export async function getBlogCategoryBySlug(slug: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("blog_categories").select("*").eq("slug", slug as any).single()

  if (error) {
    console.warn(`Failed to fetch blog category by slug "${slug}":`, error.message)
    return null
  }

  return data as any
}

export async function createBlogCategory(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const rawData = Object.fromEntries(formData.entries())

  // Validate data
  const validationResult = BlogCategorySchema.safeParse(rawData)
  if (!validationResult.success) {
    console.error("Validation errors:", validationResult.error.flatten().fieldErrors)
    return { error: `Invalid blog category data: ${JSON.stringify(validationResult.error.flatten().fieldErrors)}` }
  }

  const categoryData = validationResult.data

  // Generate slug if not provided
  if (!categoryData.slug) {
    categoryData.slug = categoryData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim()
  }

  // Insert category
  const { data, error } = await supabase.from("blog_categories").insert([categoryData] as any).select().single()

  if (error) {
    console.error("Error creating blog category:", error)
    return { error: `Failed to create blog category: ${error.message}` }
  }

  revalidatePath("/admin/blog/categories")
  revalidatePath("/blog")

  return { data }
}

export async function updateBlogCategory(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const rawData = Object.fromEntries(formData.entries())

  // Don't allow changing the ID
  delete rawData.id

  // Validate data
  const validationResult = BlogCategorySchema.partial().safeParse(rawData)
  if (!validationResult.success) {
    console.error("Validation errors:", validationResult.error.flatten().fieldErrors)
    return { error: `Invalid blog category data: ${JSON.stringify(validationResult.error.flatten().fieldErrors)}` }
  }

  const categoryData = validationResult.data

  // Generate slug if name is changed and slug is not provided
  if (categoryData.name && !categoryData.slug) {
    categoryData.slug = categoryData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim()
  }

  // Update category
  const { data, error } = await supabase.from("blog_categories").update(categoryData).eq("id", id as any).select().single()

  if (error) {
    console.error("Error updating blog category:", error)
    return { error: `Failed to update blog category: ${error.message}` }
  }

  revalidatePath("/admin/blog/categories")
  revalidatePath("/blog")

  return { data }
}

export async function deleteBlogCategory(id: string) {
  const supabase = await createSupabaseServerClient()

  // Check if category has posts
  const { count, error: countError } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id)

  if (countError) {
    console.error("Error checking category posts:", countError)
    return { error: `Failed to check if category has posts: ${countError.message}` }
  }

  if (count && count > 0) {
    return { error: `Cannot delete category with ${count} posts. Please reassign posts first.` }
  }

  // Delete the category
  const { error } = await supabase.from("blog_categories").delete().eq("id", id as any)

  if (error) {
    console.error("Error deleting blog category:", error)
    return { error: `Failed to delete blog category: ${error.message}` }
  }

  revalidatePath("/admin/blog/categories")
  revalidatePath("/blog")

  return { success: true }
}

// Blog Comment Actions
export async function getBlogComments(postId?: string, isApproved?: boolean) {
  const supabase = await createSupabaseServerClient()

  let query = supabase.from("blog_comments").select("*").order("created_at", { ascending: false })

  if (postId) {
    query = query.eq("post_id", postId)
  }

  if (isApproved !== undefined) {
    query = query.eq("is_approved", isApproved)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching blog comments:", error)
    throw new Error("Failed to fetch blog comments")
  }

  return data as BlogComment[]
}

export async function createBlogComment(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const rawData = Object.fromEntries(formData.entries())

  // Validate data
  const validationResult = BlogCommentSchema.safeParse(rawData)
  if (!validationResult.success) {
    console.error("Validation errors:", validationResult.error.flatten().fieldErrors)
    return { error: `Invalid blog comment data: ${JSON.stringify(validationResult.error.flatten().fieldErrors)}` }
  }

  const commentData = validationResult.data

  // Insert comment
  const { data, error } = await supabase.from("blog_comments").insert([commentData]).select().single()

  if (error) {
    console.error("Error creating blog comment:", error)
    return { error: `Failed to create blog comment: ${error.message}` }
  }

  revalidatePath(`/blog/${data.post_id}`)

  return { data }
}

export async function approveComment(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_comments")
    .update({ is_approved: true })
    .eq("id", id as any)
    .select()
    .single()

  if (error) {
    console.error("Error approving comment:", error)
    return { error: `Failed to approve comment: ${error.message}` }
  }

  revalidatePath("/admin/blog/comments")
  if (data.post_id) {
    const { data: post } = await supabase.from("blog_posts").select("slug").eq("id", data.post_id as any).single()

    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }
  }

  return { data }
}

export async function deleteComment(id: string) {
  const supabase = await createSupabaseServerClient()

  // Get post_id before deleting for revalidation
  const { data: comment } = await supabase.from("blog_comments").select("post_id").eq("id", id as any).single()

  // Delete the comment
  const { error } = await supabase.from("blog_comments").delete().eq("id", id as any)

  if (error) {
    console.error("Error deleting comment:", error)
    return { error: `Failed to delete comment: ${error.message}` }
  }

  revalidatePath("/admin/blog/comments")
  if (comment?.post_id) {
    const { data: post } = await supabase.from("blog_posts").select("slug").eq("id", comment.post_id as any).single()

    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }
  }

  return { success: true }
}

// Tag-related actions
export async function getAllTags() {
  const supabase = await createSupabaseServerClient()

  // Get all tags with their usage count
  const { data, error } = await supabase
    .from("blog_tags")
    .select(`
      *,
      blog_post_tags!inner(
        blog_posts!inner(
          status
        )
      )
    `)

  if (error) {
    console.error("Error fetching tags:", error)
    return []
  }

  // Count published posts for each tag
  const tagCounts: Record<string, { name: string; slug: string; count: number }> = {}

  data.forEach((tag: any) => {
    const publishedCount = tag.blog_post_tags.filter(
      (pt: any) => pt.blog_posts.status === 'published'
    ).length
    
    if (publishedCount > 0) {
      tagCounts[tag.id] = {
        name: tag.name,
        slug: tag.slug,
        count: publishedCount
      }
    }
  })

  // Convert to array and sort by count (most popular first)
  return Object.values(tagCounts).sort((a, b) => b.count - a.count)
}

export async function getPostsByTag(tag: string) {
  const supabase = await createSupabaseServerClient()

  // First find the tag by name or slug
  const { data: tagData, error: tagError } = await supabase
    .from("blog_tags")
    .select("id")
    .or(`name.eq.${tag},slug.eq.${tag}`)
    .single()

  if (tagError || !tagData) {
    console.error("Error fetching tag:", tagError)
    return []
  }

  // Then get posts with this tag
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:category_id(id, name, slug),
      blog_post_tags!inner(
        blog_tags!inner(id, name, slug)
      )
    `)
    .eq("status", "published")
    .eq("blog_post_tags.tag_id", tagData.id)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts by tag:", error)
    throw new Error("Failed to fetch posts by tag")
  }

  // Transform the data to include tags as a simple array
  const transformedData = data?.map(post => ({
    ...post,
    tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || []
  })) || []

  return transformedData as BlogPost[]
}

export async function getPostsByCategory(categoryId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:category_id(id, name, slug),
      blog_post_tags(blog_tags(id, name, slug))
    `)
    .eq("status", "published")
    .eq("category_id", categoryId)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts by category:", error)
    throw new Error("Failed to fetch posts by category")
  }

  // Transform the data to include tags as a simple array
  const transformedData = data?.map(post => ({
    ...post,
    tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || []
  })) || []

  return transformedData as BlogPost[]
}

export async function getPostsByCategorySlug(slug: string) {
  const supabase = await createSupabaseServerClient()

  // First get the category
  const { data: category, error: categoryError } = await supabase
    .from("blog_categories")
    .select("id")
    .eq("slug", slug as any)
    .single()

  if (categoryError || !category) {
    console.error("Error fetching category by slug:", categoryError)
    throw new Error("Failed to fetch category by slug")
  }

  // Then get posts in that category
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:category_id(id, name, slug),
      blog_post_tags(blog_tags(id, name, slug))
    `)
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts by category slug:", error)
    throw new Error("Failed to fetch posts by category slug")
  }

  // Transform the data to include tags as a simple array
  const transformedData = data?.map(post => ({
    ...post,
    tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || []
  })) || []

  return transformedData as BlogPost[]
}

// Search
export async function searchBlogPosts(query: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:category_id(id, name, slug),
      blog_post_tags(blog_tags(id, name, slug))
    `)
    .eq("status", "published")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error searching blog posts:", error)
    throw new Error("Failed to search blog posts")
  }

  // Transform the data to include tags as a simple array
  const transformedData = data?.map(post => ({
    ...post,
    tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || []
  })) || []

  return transformedData as BlogPost[]
}

// Blog statistics
export async function getBlogStats() {
  const supabase = await createSupabaseServerClient()

  // Get total posts
  const { count: totalPosts, error: totalError } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })

  // Get published posts
  const { count: publishedPosts, error: publishedError } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")

  // Get draft posts
  const { count: draftPosts, error: draftError } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft")

  // Get categories count
  const { count: categoriesCount, error: categoriesError } = await supabase
    .from("blog_categories")
    .select("*", { count: "exact", head: true })

  // Get comments count
  const { count: commentsCount, error: commentsError } = await supabase
    .from("blog_comments")
    .select("*", { count: "exact", head: true })

  if (totalError || publishedError || draftError || categoriesError || commentsError) {
    console.error(
      "Error fetching blog stats:",
      totalError || publishedError || draftError || categoriesError || commentsError,
    )
    throw new Error("Failed to fetch blog stats")
  }

  return {
    total: totalPosts || 0,
    published: publishedPosts || 0,
    drafts: draftPosts || 0,
    categories: categoriesCount || 0,
    comments: commentsCount || 0,
  }
}

// Get related posts
export async function getRelatedPosts(postId: string, limit = 3) {
  const supabase = await createSupabaseServerClient()

  // First get the current post to get its category
  const { data: currentPost, error: postError } = await supabase
    .from("blog_posts")
    .select("category_id")
    .eq("id", postId as any)
    .single()

  if (postError || !currentPost) {
    console.error("Error fetching current post:", postError)
    throw new Error("Failed to fetch current post")
  }

  // Find posts with the same category
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      category:category_id(id, name, slug),
      blog_post_tags(blog_tags(id, name, slug))
    `)
    .eq("status", "published")
    .neq("id", postId)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (currentPost.category_id) {
    query = query.eq("category_id", currentPost.category_id)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching related posts:", error)
    throw new Error("Failed to fetch related posts")
  }

  // Transform the data to include tags as a simple array
  const transformedData = data?.map(post => ({
    ...post,
    tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || []
  })) || []

  // If we don't have enough related posts, get recent posts
  if (transformedData.length < limit) {
    const neededPosts = limit - transformedData.length
    const existingIds = [postId, ...transformedData.map((p) => p.id)]

    const { data: recentPosts, error: recentError } = await supabase
      .from("blog_posts")
      .select(`
        *,
        category:category_id(id, name, slug),
        blog_post_tags(blog_tags(id, name, slug))
      `)
      .eq("status", "published")
      .not("id", "in", `(${existingIds.map((id) => `"${id}"`).join(",")})`)
      .order("published_at", { ascending: false })
      .limit(neededPosts)

    if (recentError) {
      console.error("Error fetching recent posts:", recentError)
    } else if (recentPosts) {
      // Transform recent posts too
      const transformedRecentPosts = recentPosts.map(post => ({
        ...post,
        tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || []
      }))
      transformedData.push(...transformedRecentPosts)
    }
  }

  return transformedData as BlogPost[]
}
