"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Types
type ReviewFormData = {
  productId: string
  name: string
  email: string
  rating: number
  title: string
  content: string
  images?: string[]
}

type ReviewResponse = {
  reviewId: string
  content: string
}

// Create a new review
export async function createReview(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  try {
    // Get form data
    const productId = formData.get("productId") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const rating = Number.parseInt(formData.get("rating") as string)
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    // Validate form data
    if (!productId || !name || !email || !rating || !title || !content) {
      return { error: "All fields are required" }
    }

    if (rating < 1 || rating > 5) {
      return { error: "Rating must be between 1 and 5" }
    }

    // Get current user if logged in
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id

    // Insert review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: userId || null,
        name,
        email,
        rating,
        title,
        content,
        status: "pending", // All reviews start as pending
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return { error: error.message }
    }

    // Handle images if any
    const images = formData.getAll("images") as File[]
    if (images && images.length > 0 && images[0].size > 0) {
      for (const image of images) {
        const fileName = `${Date.now()}-${image.name}`
        const filePath = `reviews/${review.id}/${fileName}`

        // Upload image to storage
        const { error: uploadError } = await supabase.storage.from("product-reviews").upload(filePath, image)

        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          continue
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from("product-reviews").getPublicUrl(filePath)

        // Insert image record
        await supabase.from("review_images").insert({
          review_id: review.id,
          image_url: publicUrlData.publicUrl,
        })
      }
    }

    // Revalidate product page
    revalidatePath(`/products/${productId}`)

    return { success: true, reviewId: review.id }
  } catch (error) {
    console.error("Error in createReview:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Update review status (admin only)
export async function updateReviewStatus(reviewId: string, status: "pending" | "approved" | "rejected") {
  const supabase = await createSupabaseServerClient()

  try {
    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Unauthorized" }
    }

    // Update review status
    const { error } = await supabase.from("reviews").update({ status }).eq("id", reviewId)

    if (error) {
      console.error("Error updating review status:", error)
      return { error: error.message }
    }

    // Get product ID to revalidate page
    const { data: review } = await supabase.from("reviews").select("product_id").eq("id", reviewId).single()

    if (review) {
      revalidatePath(`/products/${review.product_id}`)
      revalidatePath("/admin/reviews")
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateReviewStatus:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Add admin response to review
export async function addReviewResponse(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  try {
    const reviewId = formData.get("reviewId") as string
    const content = formData.get("content") as string

    if (!reviewId || !content) {
      return { error: "Review ID and content are required" }
    }

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Unauthorized" }
    }

    // Add response
    const { error } = await supabase.from("review_responses").insert({
      review_id: reviewId,
      admin_id: session.user.id,
      content,
    })

    if (error) {
      console.error("Error adding review response:", error)
      return { error: error.message }
    }

    // Get product ID to revalidate page
    const { data: review } = await supabase.from("reviews").select("product_id").eq("id", reviewId).single()

    if (review) {
      revalidatePath(`/products/${review.product_id}`)
      revalidatePath("/admin/reviews")
    }

    return { success: true }
  } catch (error) {
    console.error("Error in addReviewResponse:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Mark review as helpful
export async function markReviewHelpful(reviewId: string) {
  const supabase = await createSupabaseServerClient()

  try {
    // Get current helpful count
    const { data: review, error: fetchError } = await supabase
      .from("reviews")
      .select("helpful_count, product_id")
      .eq("id", reviewId)
      .single()

    if (fetchError) {
      console.error("Error fetching review:", fetchError)
      return { error: fetchError.message }
    }

    // Increment helpful count
    const { error: updateError } = await supabase
      .from("reviews")
      .update({ helpful_count: (review.helpful_count || 0) + 1 })
      .eq("id", reviewId)

    if (updateError) {
      console.error("Error updating helpful count:", updateError)
      return { error: updateError.message }
    }

    // Revalidate product page
    revalidatePath(`/products/${review.product_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error in markReviewHelpful:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Get reviews for a product
export async function getProductReviews(productId: string) {
  const supabase = await createSupabaseServerClient()

  try {
    // Get approved reviews for the product
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        *,
        review_images(*),
        review_responses(*)
      `)
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return { error: error.message }
    }

    return { reviews }
  } catch (error) {
    console.error("Error in getProductReviews:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Get all reviews (admin only)
export async function getAllReviews() {
  const supabase = await createSupabaseServerClient()

  try {
    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Unauthorized" }
    }

    // Get all reviews
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        *,
        products(name),
        review_images(*),
        review_responses(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all reviews:", error)
      return { error: error.message }
    }

    return { reviews }
  } catch (error) {
    console.error("Error in getAllReviews:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Delete a review (admin only)
export async function deleteReview(reviewId: string) {
  const supabase = await createSupabaseServerClient()

  try {
    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Unauthorized" }
    }

    // Get product ID to revalidate page
    const { data: review } = await supabase.from("reviews").select("product_id").eq("id", reviewId).single()

    // Delete review (cascade will delete images and responses)
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId)

    if (error) {
      console.error("Error deleting review:", error)
      return { error: error.message }
    }

    if (review) {
      revalidatePath(`/products/${review.product_id}`)
      revalidatePath("/admin/reviews")
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteReview:", error)
    return { error: "An unexpected error occurred" }
  }
}
