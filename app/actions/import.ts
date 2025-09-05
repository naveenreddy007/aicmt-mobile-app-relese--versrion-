"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import Papa from "papaparse"
import type { Product } from "@/lib/types"

type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at" | "image_url"> & {
  features?: object
  specifications?: object
}

async function parseAndUpsert(products: ProductInsert[]) {
  const supabase = await createSupabaseServerClient()

  // Validate data structure (basic check)
  const validProducts = products.filter((p) => p.code && p.name && p.category)

  if (validProducts.length === 0) {
    return {
      status: "error",
      message: "No valid product data found in the file. Ensure 'code', 'name', and 'category' are present.",
    }
  }

  const { error, count } = await supabase
    .from("products")
    .upsert(validProducts, {
      onConflict: "code", // Use 'code' to find existing products to update
    })
    .select()

  if (error) {
    console.error("Supabase upsert error:", error)
    return { status: "error", message: `Database error: ${error.message}` }
  }

  return { status: "success", message: `Successfully imported/updated ${count ?? 0} products.` }
}

export async function importProductsFromCsv(prevState: any, formData: FormData) {
  const file = formData.get("file") as File
  if (!file || file.size === 0) {
    return { status: "error", message: "No file uploaded." }
  }

  const text = await file.text()

  try {
    const result = Papa.parse<ProductInsert>(text, {
      header: true,
      skipEmptyLines: true,
      transform: (value, header) => {
        // PapaParse reads everything as strings, so we need to convert back
        if (header === "features" || header === "specifications") {
          try {
            return JSON.parse(value)
          } catch {
            return {}
          }
        }
        if (header === "is_active") {
          return value.toLowerCase() === "true"
        }
        return value
      },
    })

    if (result.errors.length > 0) {
      console.error("CSV parsing errors:", result.errors)
      return {
        status: "error",
        message: `CSV parsing error on row ${result.errors[0].row}: ${result.errors[0].message}`,
      }
    }

    return await parseAndUpsert(result.data)
  } catch (e) {
    const error = e as Error
    return { status: "error", message: `An unexpected error occurred: ${error.message}` }
  }
}

export async function importProductsFromJson(prevState: any, formData: FormData) {
  const file = formData.get("file") as File
  if (!file || file.size === 0) {
    return { status: "error", message: "No file uploaded." }
  }

  const text = await file.text()

  try {
    const products = JSON.parse(text) as ProductInsert[]
    if (!Array.isArray(products)) {
      return { status: "error", message: "JSON file must contain an array of product objects." }
    }
    return await parseAndUpsert(products)
  } catch (e) {
    const error = e as Error
    return { status: "error", message: `Invalid JSON file: ${error.message}` }
  }
}
