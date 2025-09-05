"use client"

import { useEffect, useState } from "react"
import { getTopProducts } from "@/app/actions/products"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function ProductsOverview() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const data = await getTopProducts()
      setProducts(data)
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  // Prepare data for category distribution chart
  const getCategoryData = () => {
    const categories = {}

    products.forEach((product) => {
      categories[product.category] = (categories[product.category] || 0) + 1
    })

    return Object.keys(categories).map((category) => ({
      name: category,
      value: categories[category],
    }))
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  if (isLoading) {
    return <div className="flex items-center justify-center h-[300px]">Loading products...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Category Distribution</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {getCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} products`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Recent Products</h4>
          <div className="space-y-2">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <Badge variant={product.is_active ? "default" : "outline"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/products">Manage Products</Link>
        </Button>
      </div>
    </div>
  )
}
