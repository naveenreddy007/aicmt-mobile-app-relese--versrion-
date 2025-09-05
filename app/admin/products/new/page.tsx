import { ProductForm } from "@/components/admin/product-form"

export const metadata = {
  title: "Add New Product | Admin Dashboard",
  description: "Create a new product in your catalog",
}

export default function NewProductPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
