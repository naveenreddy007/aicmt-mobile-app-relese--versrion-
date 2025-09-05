import { createSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Product360Viewer } from "@/components/product-360-viewer"

async function getProduct(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_models(*)
    `)
    .eq("id", id)
    .single()

  if (error || !product) {
    console.error("Error fetching product:", error)
    return null
  }

  return product
}

export default async function ProductPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  // Get model URL from product or product_models
  const modelUrl =
    product.model_url ||
    (product.product_models && product.product_models.length > 0 ? product.product_models[0].model_url : null)

  if (!modelUrl) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link href={`/products/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Product
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{product.name} - 3D Preview</h1>
          <p className="text-gray-500 mt-2">
            Interact with the 3D model by dragging to rotate, scrolling to zoom, and double-clicking to reset the view.
          </p>
        </div>

        <div className="max-w-3xl mx-auto w-full">
          <Product360Viewer
            modelUrl={modelUrl}
            alt={`3D model of ${product.name}`}
            className="aspect-square w-full h-full border rounded-lg shadow-lg"
          />
        </div>

        <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About This Product</h2>
          <p className="mb-4">{product.description}</p>
          <div className="flex justify-center mt-6">
            <Link href={`/products/${params.id}`}>
              <Button>View Product Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
