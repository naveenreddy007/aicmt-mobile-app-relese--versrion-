"use client"

import { useState, useMemo } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductSearch } from "@/components/product-search"
import { ProductSort } from "@/components/product-sort"
import { ProductFilterSidebar } from "@/components/product-filter-sidebar"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Product {
  id: string
  name: string
  description: string
  category?: string
  created_at: string
}

// Product categories based on your requirements
const PRODUCT_CATEGORIES = [
  "Filler Master Batches",
  "Carry Bags / Shopping Bags Plain",
  "Carry Bags / Shopping Bags With Private Labelling",
  "Grocery Pouches",
  "Supermarket Pouches with Perforation Rolls",
  "D-Cut Garment Bags",
  "Garbage Bags",
  "Tiffin Sheets",
  "Packaging Sheets in Rolls Form",
]

interface ProductFilterClientWrapperProps {
  products: Product[]
}

export function ProductFilterClientWrapper({ products }: ProductFilterClientWrapperProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "category":
          return (a.category || "").localeCompare(b.category || "")
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchQuery, sortBy, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <ProductSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="flex items-center gap-4">
          <ProductSort value={sortBy} onChange={setSortBy} />

          {/* Mobile Filter Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <ProductFilterSidebar
                categories={PRODUCT_CATEGORIES}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <ProductFilterSidebar
            categories={PRODUCT_CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  )
}
