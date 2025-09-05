"use client"

import { useState, useEffect } from "react"
import { OptimizedImage } from "@/components/optimized-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Info, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Product {
  id: string
  name: string
  description: string
  price: string
  image_url?: string
  code?: string
  is_active: boolean
  features?: {
    features: string[]
  }
  created_at: string
}

export function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images(
            image_url,
            alt_text,
            is_primary
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4)

      if (error) {
        console.error("Error fetching featured products:", error)
      } else {
        // Transform the data to include primary image URL
        const transformedProducts = data?.map(product => {
          const primaryImage = product.product_images?.find(img => img.is_primary)
          return {
            ...product,
            image_url: primaryImage?.image_url || product.image_url
          }
        }) || []
        setProducts(transformedProducts)
      }

      setLoading(false)
    }

    fetchProducts()
  }, [])

  // Generate badge data based on product attributes
  const getBadgeInfo = (product: Product, index: number) => {
    const options = [
      { text: "New", color: "bg-blue-100 text-blue-800" },
      { text: "Featured", color: "bg-green-100 text-green-800" },
      { text: "Best Seller", color: "bg-orange-100 text-orange-800" },
    ]

    // Use product index to deterministically assign a badge
    return options[index % options.length]
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Discover our newest and most popular biodegradable plastic solutions
          </p>
        </div>
        <Link href="/products">
          <Button variant="outline" className="mt-4 md:mt-0 gap-2">
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-2/3"></div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-9 bg-gray-200 rounded animate-pulse w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const badge = getBadgeInfo(product, index)
            const features = product.features?.features || []

            return (
              <Card
                key={product.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                tabIndex={0}
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <OptimizedImage
                      src={product.image_url || "/placeholder.svg?height=300&width=300&query=biodegradable product"}
                      alt={`${product.name}: ${product.description}`}
                      width={300}
                      height={300}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        hoveredProduct === product.id ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>

                  <Badge className={`absolute top-2 right-2 ${badge.color}`}>{badge.text}</Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="font-medium text-green-600 mb-2">{product.price}</div>

                  <div className="space-y-1">
                    {features.slice(0, 2).map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Star className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Link href={`/products/${product.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Info className="h-3 w-3" />
                      Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    className="gap-1"
                    aria-label={`Inquire about ${product.name}`}
                    onClick={() => {
                      // Store the selected product in localStorage for the inquiry form
                      localStorage.setItem(
                        "inquiryProduct",
                        JSON.stringify({
                          id: product.id,
                          name: product.name,
                          code: product.code,
                        }),
                      )
                      // Navigate to the contact page
                      window.location.href = "/contact"
                    }}
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Inquire
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No featured products found. Please add products through the admin dashboard.</p>
        </div>
      )}

      <div className="mt-12 bg-green-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/4 flex justify-center">
            <OptimizedImage
              src="/eco-friendly-packaging.png"
              alt="Special food packaging"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
          <div className="md:w-3/4">
            <Badge className="bg-green-100 text-green-800 mb-2">Special Highlight</Badge>
            <h3 className="text-xl font-bold mb-2">Special Food Packaging Solutions</h3>
            <p className="text-gray-600 mb-4">
              Our specialized food packaging solutions are designed to meet the unique requirements of the food
              industry. From heat-resistant containers to leak-proof designs, we offer a complete range of biodegradable
              options.
            </p>
            <Button className="gap-2">
              Explore Food Packaging
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
