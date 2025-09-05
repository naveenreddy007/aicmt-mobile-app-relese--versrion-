import { createClient } from "@supabase/supabase-js"
import type { Database } from "./supabase/database.types"

// These environment variables are set by the Supabase integration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Authentication helpers
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

// Database helpers
export async function fetchProducts() {
  const { data, error } = await supabase.from("products_with_marketplace_links").select("*").order("created_at", { ascending: false })

  return { data, error }
}

export async function fetchProduct(id: string) {
  const { data, error } = await supabase.from("products_with_marketplace_links").select("*").eq("id", id).single()

  return { data, error }
}

// Fetch products without marketplace links (for admin/editing)
export async function fetchProductsBasic() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  return { data, error }
}

export async function fetchProductBasic(id: string) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  return { data, error }
}

export async function createProduct(product: Database['public']['Tables']['products']['Insert']) {
  const { data, error } = await supabase.from("products").insert([product]).select()

  return { data, error }
}

export async function updateProduct(id: string, product: Database['public']['Tables']['products']['Update']) {
  const { data, error } = await supabase.from("products").update(product).eq("id", id).select()

  return { data, error }
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id)

  return { error }
}

// Blog helpers
export async function fetchBlogPosts() {
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  return { data, error }
}

export async function fetchBlogPost(slug: string) {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  return { data, error }
}

export async function createBlogPost(post: Database['public']['Tables']['blog_posts']['Insert']) {
  const { data, error } = await supabase.from("blog_posts").insert([post]).select()

  return { data, error }
}

export async function updateBlogPost(id: string, post: Database['public']['Tables']['blog_posts']['Update']) {
  const { data, error } = await supabase.from("blog_posts").update(post).eq("id", id).select()

  return { data, error }
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  return { error }
}

// Inquiries helpers
export async function fetchInquiries() {
  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false })

  return { data, error }
}

export async function createInquiry(inquiry: Database['public']['Tables']['inquiries']['Insert']) {
  const { data, error } = await supabase.from("inquiries").insert([inquiry]).select()

  return { data, error }
}

export async function updateInquiry(id: string, inquiry: Database['public']['Tables']['inquiries']['Update']) {
  const { data, error } = await supabase.from("inquiries").update(inquiry).eq("id", id).select()

  return { data, error }
}

// Users helpers
export async function fetchUsers() {
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return { data, error }
}

export async function fetchUser(id: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  return { data, error }
}

export async function updateUser(id: string, user: Database['public']['Tables']['profiles']['Update']) {
  const { data, error } = await supabase.from("profiles").update(user).eq("id", id).select()

  return { data, error }
}

// Storage helpers
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  })

  return { data, error }
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path])

  return { error }
}

export async function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return data.publicUrl
}
