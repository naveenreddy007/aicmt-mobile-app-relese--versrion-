"use client"

import type { Product } from "@/types/product"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/optimized-image"

interface ProductGridProps {
  products: Product[]
  locale?: string
  className?: string
}

export function ProductGrid({ products, locale = "en", className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {products.map((product) => {
        // Parse features from JSONB if needed
        const features = Array.isArray(product.features) ? product.features : product.features?.features || []

        return (
          <Card key={product.id} className="overflow-hidden flex flex-col h-full">
            <CardHeader className="p-0">
              <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                <OptimizedImage
                  src={product.image_url || "/placeholder.svg?height=300&width=300&query=product"}
                  alt={`${product.name} - ${product.description}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-500">CODE: {product.code}</p>
                </div>
                <Badge className="bg-green-600">CPCB</Badge>
              </div>

              {product.description && <p className="text-sm text-gray-700 mt-2 line-clamp-2">{product.description}</p>}

              {features.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-1">Key Features:</h4>
                  <ul className="text-sm space-y-1">
                    {features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-1.5">•</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 flex items-center gap-1.5 text-green-700 text-xs">
                <Leaf className="h-3.5 w-3.5" />
                <span>100% Biodegradable</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="w-full flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/${locale}/products/${product.id}`}>Details</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link href={`/${locale}/contact?product=${product.id}`}>Inquire</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
