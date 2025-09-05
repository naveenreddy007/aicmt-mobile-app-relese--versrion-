import { ArrowLeft, Download, Leaf, Shield } from "lucide-react"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"

import { Button } from "@/components/ui/button"
import { LanguageMeta } from "@/components/language-meta"
import { ProductFilterClientWrapper } from "@/components/product-filter-client-wrapper"

async function getProducts() {
  const supabase = await createSupabaseServerClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images!inner(
        image_url,
        alt_text,
        is_primary
      )
    `)
    .eq("product_images.is_primary", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  // Transform the data to include primary image URL
  const transformedProducts = products?.map(product => ({
    ...product,
    image_url: product.product_images?.[0]?.image_url || product.image_url
  })) || []

  return transformedProducts
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const products = await getProducts()

  return (
    <>
      <LanguageMeta pageName="products" />
      <div className="container px-4 py-12 md:px-6 md:py-24">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <Link href={`/${locale}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Products</h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Explore our range of biodegradable & compostable plastic alternatives that are safe for you and the planet
            </p>
          </div>

          {/* Safety Banner */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Safety Certified</h3>
              <p className="text-sm text-green-700">
                All our products are CPCB certified and tested for safety and compostability
              </p>
            </div>
          </div>

          {/* Product Categories */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Product Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "Filler Master Batches",
                "Carry Bags / Shopping Bags Plain",
                "Carry Bags / Shopping Bags With Private Labelling",
                "Grocery Pouches",
                "Supermarket Pouches with Perforation Rolls",
                "D-Cut Garment Bags",
                "Garbage Bags",
                "Tiffin Sheets",
                "Packaging Sheets in Rolls Form",
              ].map((category) => (
                <div key={category} className="bg-white p-3 rounded border text-sm font-medium">
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* Product Filtering and Display */}
          <ProductFilterClientWrapper products={products} />

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold">Download Product Catalog</h2>
                <p className="text-gray-500">
                  Get detailed specifications and information about our complete product range
                </p>
              </div>
              <Button className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Catalog
              </Button>
            </div>
          </div>

          {/* Safety and Certification Section */}
          <div className="mt-8 bg-white border rounded-lg overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Safety & Certifications</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold mb-2">CPCB Certified</h3>
                  <p className="text-sm text-gray-600">
                    All our products are certified by the Central Pollution Control Board
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold mb-2">Biodegradable & Compostable</h3>
                  <p className="text-sm text-gray-600">
                    Our products completely break down into natural elements within 180 days
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">Non-Toxic</h3>
                  <p className="text-sm text-gray-600">
                    Safe for humans, animals, and the environment with no harmful chemicals
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link href={`/${locale}/certification`}>
                  <Button variant="outline">View All Certifications</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
