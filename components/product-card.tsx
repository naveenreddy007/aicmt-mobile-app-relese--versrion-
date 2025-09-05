import Link from "next/link"
import { CuboidIcon as Cube } from "lucide-react"
import { OptimizedImage } from "@/components/optimized-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProductImage {
  id: string
  image_url: string
  is_primary: boolean
}

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: string
    image_url: string
    category: string
    model_url?: string
    product_images?: ProductImage[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  // Get primary image or first image from product_images if available
  const imageUrl =
    product.image_url ||
    (product.product_images && product.product_images.length > 0
      ? product.product_images.find((img) => img.is_primary)?.image_url || product.product_images[0].image_url
      : "/placeholder-cnui9.png")

  // Check if product has a 3D model
  const has3DModel = !!product.model_url

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`} className="aspect-square overflow-hidden bg-gray-100">
        <div className="relative h-full w-full transition-transform group-hover:scale-105">
          <OptimizedImage src={imageUrl} alt={product.name} fill className="object-cover" />

          {/* 3D Model Badge */}
          {has3DModel && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                <Cube className="h-3 w-3 mr-1" />
                3D View
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-medium text-gray-900 group-hover:text-green-600 line-clamp-1">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="font-medium text-green-700">{product.price || "Contact for pricing"}</p>

          <Link href={`/products/${product.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
