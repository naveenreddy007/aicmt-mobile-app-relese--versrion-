import { ProductForm } from "@/components/admin/product-form"
import { getProductById } from "@/app/actions/products" // Ensure this path is correct
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export const metadata = {
  title: "Edit Product | Admin Dashboard",
  description: "Update product information",
}

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-24 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
              Invalid Product ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No product ID was provided. Please go back and select a product to edit.
            </p>
            <Link href="/admin/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // console.log(`Fetching product with ID: ${id}`); // For debugging
  const { product, error } = await getProductById(id)

  if (error) {
    console.error(`Error fetching product ${id}:`, error)
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-24 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
              Error Loading Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-2">Could not load product data.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Details: {typeof error === "string" ? error : JSON.stringify(error)}
            </p>
            <Link href="/admin/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product) {
    // console.log(`Product with ID ${id} not found.`); // For debugging
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-24 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
              Product Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The product with ID <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{id}</span>{" "}
              could not be found. It might have been deleted.
            </p>
            <Link href="/admin/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // console.log("Product data passed to form:", product); // For debugging
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <ProductForm product={product} />
    </div>
  )
}
