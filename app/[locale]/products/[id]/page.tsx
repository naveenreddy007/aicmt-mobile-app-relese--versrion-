import { ArrowLeft, Leaf, Shield, Recycle, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductMediaGallery } from "@/components/product-media-gallery"
import { ProductReviews } from "@/components/product-reviews"

async function getProduct(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images(*)
    `)
    .eq("id", id)
    .single()

  if (error || !product) {
    console.error("Error fetching product:", error)
    return null
  }

  return product
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string; locale: string }> 
}) {
  const { id, locale } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  // Parse features and specifications from JSONB
  const features = product.features?.features || []
  const specifications = product.specifications || {}

  // Get 3D model URL if available
  const modelUrl = product.model_url || null

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/products`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Media Gallery */}
          <ProductMediaGallery images={product.product_images || []} productName={product.name} modelUrl={modelUrl} />

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-gray-500 mt-1">Product Code: {product.code}</p>
            </div>

            <div className="text-xl font-semibold text-green-700">{product.price}</div>

            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>

            <Tabs defaultValue="features" className="w-full">
              <TabsList>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="usage">Usage &amp; Care</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="pt-4">
                <ul className="space-y-2">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Leaf className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="specifications" className="pt-4">
                <div className="space-y-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 border-b pb-2">
                      <div className="font-medium capitalize">{key.replace(/_/g, " ")}</div>
                      <div>{String(value)}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="usage" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">Recommended Usage</h3>
                    <p className="text-gray-600 mt-1">
                      This product is designed for {product.category.toLowerCase()} applications and is suitable for
                      both commercial and residential use.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg">Disposal Instructions</h3>
                    <p className="text-gray-600 mt-1">
                      This product is 100% biodegradable and compostable. It can be disposed of in industrial composting
                      facilities or home composting systems.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg">Environmental Impact</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Recycle className="h-5 w-5 text-green-600" />
                      <span>Fully biodegrades within 180 days in composting conditions</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href={`/${locale}/contact`} className="w-full sm:w-auto">
                <Button className="w-full" size="lg">
                  Request Sample
                </Button>
              </Link>

              <Link href={`/${locale}/contact`} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full" size="lg">
                  Contact Sales
                </Button>
              </Link>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h3 className="font-medium">Need more information?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Our team is ready to answer any questions about this product and help you find the perfect solution for
                your needs.
              </p>
              <Link href={`/${locale}/contact`}>
                <Button variant="link" className="p-0 h-auto mt-2">
                  Contact us →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Certification Section */}
        <div className="mt-12 bg-white border rounded-lg overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Product Certifications</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">CPCB Certified</h3>
                <p className="text-sm text-gray-600">Certified by the Central Pollution Control Board of India</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">100% Biodegradable</h3>
                <p className="text-sm text-gray-600">Breaks down completely into natural elements within 180 days</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Food Safe</h3>
                <p className="text-sm text-gray-600">Safe for food contact with no harmful chemicals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>
      </div>
    </div>
  )
}