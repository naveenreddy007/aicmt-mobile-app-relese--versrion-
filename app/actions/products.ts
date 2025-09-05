"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// Get all products with optional filtering
export async function getProducts(filters?: {
  search?: string
  category?: string
  status?: string
  page?: number
  limit?: number
}) {
  const supabase = await createSupabaseServerClient()

  try {
    let query = supabase.from("products").select(`
        *,
        product_images(*)
      `)

    // Apply filters
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
      )
    }

    if (filters?.category && filters.category !== "all") {
      query = query.eq("category", filters.category)
    }

    if (filters?.status && filters.status !== "all") {
      const isActive = filters.status === "active"
      query = query.eq("is_active", isActive)
    }

    // Apply pagination
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to)

    // Order by creation date
    query = query.order("created_at", { ascending: false })

    const { data: products, error, count } = await query

    if (error) {
      console.error("Error fetching products:", error)
      return { error: error.message }
    }

    return {
      products: products || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    }
  } catch (error) {
    console.error("Error in getProducts:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Get a single product by ID
export async function getProductById(productId: string) {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images(*)
      `)
      .eq("id", productId)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      return { error: error.message }
    }

    return { product }
  } catch (error) {
    console.error("Error in getProductById:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Add the missing getProduct function that was expected by other components
export async function getProduct(id: string) {
  return getProductById(id)
}

// Create a new product
export async function createProduct(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  try {
    // Get form data
    const name = formData.get("name") as string
    const code = formData.get("code") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string
    const isActive = formData.get("isActive") === "true"
    const amazonUrl = formData.get("amazonUrl") as string
    const amazonEnabled = formData.get("amazonEnabled") === "true"
    const inquiryEnabled = formData.get("inquiryEnabled") === "true"

    // Parse features
    const featuresString = formData.get("features") as string
    const features = featuresString
      ? {
          features: featuresString.split("\n").filter((feature) => feature.trim() !== ""),
        }
      : null

    // Parse specifications
    const specificationsString = formData.get("specifications") as string
    const specifications = specificationsString
      ? specificationsString.split("\n").reduce((acc: Record<string, string>, line) => {
          const [key, value] = line.split(":")
          if (key && value) {
            acc[key.trim()] = value.trim()
          }
          return acc
        }, {})
      : null

    // Insert product
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name,
        code,
        category,
        description,
        features,
        specifications,
        price: price || null,
        is_active: isActive,
        amazon_url: amazonUrl || null,
        amazon_enabled: amazonEnabled,
        inquiry_enabled: inquiryEnabled,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating product:", error)
      return { error: error.message }
    }

    // Handle images
    const uploadedImages = formData.getAll("images") as File[]
    let imageCounter = 0

    // Process uploaded files
    if (uploadedImages && uploadedImages.length > 0 && uploadedImages[0].size > 0) {
      for (const image of uploadedImages) {
        const fileName = `${Date.now()}-${image.name}`
        const filePath = `products/${product.id}/${fileName}`

        const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, image)

        if (uploadError) {
          console.error("Error uploading image file:", uploadError)
          continue // Skip this image
        }

        const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

        await supabase.from("product_images").insert({
          product_id: product.id,
          image_url: publicUrlData.publicUrl,
          alt_text: name,
          is_primary: imageCounter === 0,
          display_order: imageCounter,
        })

        // Update product's main image_url with first image
        if (imageCounter === 0) {
          await supabase.from("products").update({ image_url: publicUrlData.publicUrl }).eq("id", product.id)
        }

        imageCounter++
      }
    }

    revalidatePath("/admin/products")
    revalidatePath("/products")

    return { success: true, productId: product.id }
  } catch (error) {
    console.error("Error in createProduct:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Update an existing product
export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient()

  try {
    // Get form data
    const name = formData.get("name") as string
    const code = formData.get("code") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string
    const isActive = formData.get("isActive") === "true"

    // Parse features
    const featuresString = formData.get("features") as string
    const features = featuresString
      ? {
          features: featuresString.split("\n").filter((feature) => feature.trim() !== ""),
        }
      : null

    // Parse specifications
    const specificationsString = formData.get("specifications") as string
    const specifications = specificationsString
      ? specificationsString.split("\n").reduce((acc: Record<string, string>, line) => {
          const [key, value] = line.split(":")
          if (key && value) {
            acc[key.trim()] = value.trim()
          }
          return acc
        }, {})
      : null

    // Update product
    const { error } = await supabase
      .from("products")
      .update({
        name,
        code,
        category,
        description,
        features,
        specifications,
        price: price || null,
        is_active: isActive,
        amazon_url: amazonUrl || null,
        amazon_enabled: amazonEnabled,
        inquiry_enabled: inquiryEnabled,
      })
      .eq("id", productId)

    if (error) {
      console.error("Error updating product:", error)
      return { error: error.message }
    }

    // Handle new images
    const newImages = formData.getAll("newImages") as File[]
    if (newImages && newImages.length > 0 && newImages[0].size > 0) {
      // Get current highest display order
      const { data: existingImages } = await supabase
        .from("product_images")
        .select("display_order")
        .eq("product_id", productId)
        .order("display_order", { ascending: false })
        .limit(1)

      const startOrder = existingImages && existingImages.length > 0 ? existingImages[0].display_order + 1 : 0

      for (let i = 0; i < newImages.length; i++) {
        const image = newImages[i]
        const fileName = `${Date.now()}-${image.name}`
        const filePath = `products/${productId}/${fileName}`

        // Upload image to storage
        const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, image)

        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          continue
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

        // Insert image record
        await supabase.from("product_images").insert({
          product_id: productId,
          image_url: publicUrlData.publicUrl,
          alt_text: name,
          is_primary: false, // New images are not primary by default
          display_order: startOrder + i,
        })
      }
    }

    // Handle image deletions
    const deletedImageIds = formData.get("deletedImageIds") as string
    if (deletedImageIds) {
      const ids = deletedImageIds.split(",").filter(Boolean)
      if (ids.length > 0) {
        // Get the images to delete
        const { data: imagesToDelete } = await supabase
          .from("product_images")
          .select("id, image_url, is_primary")
          .in("id", ids)

        // Delete the images
        const { error: deleteError } = await supabase.from("product_images").delete().in("id", ids)

        if (deleteError) {
          console.error("Error deleting images:", deleteError)
        } else {
          // If a primary image was deleted, set a new primary image
          const wasPrimaryDeleted = imagesToDelete?.some((img) => img.is_primary)
          if (wasPrimaryDeleted) {
            // Get the first remaining image
            const { data: remainingImages } = await supabase
              .from("product_images")
              .select("id, image_url")
              .eq("product_id", productId)
              .order("display_order", { ascending: true })
              .limit(1)

            if (remainingImages && remainingImages.length > 0) {
              // Set it as primary
              await supabase.from("product_images").update({ is_primary: true }).eq("id", remainingImages[0].id)

              // Also update the product's image_url
              await supabase.from("products").update({ image_url: remainingImages[0].image_url }).eq("id", productId)
            } else {
              // No images left, clear the product's image_url
              await supabase.from("products").update({ image_url: null }).eq("id", productId)
            }
          }
        }
      }
    }

    // Handle primary image change
    const primaryImageId = formData.get("primaryImageId") as string
    if (primaryImageId) {
      // First, set all images to non-primary
      await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId)

      // Then set the selected image as primary
      await supabase.from("product_images").update({ is_primary: true }).eq("id", primaryImageId)

      // Also update the product's image_url
      const { data: primaryImage } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("id", primaryImageId)
        .single()

      if (primaryImage) {
        await supabase.from("products").update({ image_url: primaryImage.image_url }).eq("id", productId)
      }
    }

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/edit/${productId}`)
    revalidatePath("/products")
    revalidatePath(`/products/${productId}`)

    return { success: true }
  } catch (error) {
    console.error("Error in updateProduct:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Delete a product
export async function deleteProduct(productId: string) {
  const supabase = await createSupabaseServerClient()

  try {
    // First, delete associated images from storage
    const { data: images } = await supabase.from("product_images").select("image_url").eq("product_id", productId)

    if (images) {
      for (const image of images) {
        // Extract file path from URL
        const url = new URL(image.image_url)
        const filePath = url.pathname.split("/").slice(-3).join("/") // Get last 3 parts of path

        await supabase.storage.from("product-images").remove([filePath])
      }
    }

    // Delete the product (cascade will delete images)
    const { error } = await supabase.from("products").delete().eq("id", productId)

    if (error) {
      console.error("Error deleting product:", error)
      return { error: error.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/products")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteProduct:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Bulk delete products
export async function bulkDeleteProducts(productIds: string[]) {
  const supabase = await createSupabaseServerClient()

  try {
    // Delete associated images from storage for all products
    const { data: images } = await supabase.from("product_images").select("image_url").in("product_id", productIds)

    if (images) {
      for (const image of images) {
        const url = new URL(image.image_url)
        const filePath = url.pathname.split("/").slice(-3).join("/")

        await supabase.storage.from("product-images").remove([filePath])
      }
    }

    // Delete the products
    const { error } = await supabase.from("products").delete().in("id", productIds)

    if (error) {
      console.error("Error bulk deleting products:", error)
      return { error: error.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/products")

    return { success: true }
  } catch (error) {
    console.error("Error in bulkDeleteProducts:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Export products to CSV
export async function exportProducts() {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products for export:", error)
      return { error: error.message }
    }

    // Convert to CSV format
    const headers = ["ID", "Name", "Code", "Category", "Price", "Status", "Created At"]
    const csvData = [
      headers.join(","),
      ...products.map((product) =>
        [
          product.id,
          `"${product.name}"`,
          product.code,
          product.category,
          product.price || "Contact for pricing",
          product.is_active ? "Active" : "Draft",
          new Date(product.created_at).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    return { success: true, csvData }
  } catch (error) {
    console.error("Error in exportProducts:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Get product statistics
export async function getProductStats() {
  const supabase = await createSupabaseServerClient()

  try {
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })

    if (totalError) throw totalError

    // Get active products count
    const { count: active, error: activeError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    if (activeError) throw activeError

    // Get products by category
    const { data: categoryData, error: categoryError } = await supabase.from("products").select("category")

    if (categoryError) throw categoryError

    // Count products by category
    const categories = categoryData.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {})

    return {
      total: total || 0,
      active: active || 0,
      categories,
    }
  } catch (error) {
    console.error("Error fetching product stats:", error)
    return {
      total: 0,
      active: 0,
      categories: {},
    }
  }
}

// Get top products
export async function getTopProducts(limit = 5) {
  const supabase = await createSupabaseServerClient()

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching top products:", error)
    return []
  }
}
