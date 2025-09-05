"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface ProductFilters {
  category?: string[]
  priceRange?: [number, number]
  inStock?: boolean
  certification?: string[]
  material?: string[]
}

interface ProductFilterSidebarProps {
  filters?: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  className?: string
}

// Safe price formatting function
const formatPrice = (price: number | undefined): string => {
  if (typeof price !== "number" || isNaN(price)) {
    return "₹0"
  }
  return `₹${price.toLocaleString()}`
}

const categories = [
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

const certifications = ["CPCB Certified", "CIPET Certified", "ISO Certified", "ASTM Certified"]

const materials = ["PBAT", "PLA", "Starch Based", "Cornstarch", "Bagasse"]

export function ProductFilterSidebar({ filters = {}, onFiltersChange, className }: ProductFilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange || [0, 10000])

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.category || []
    const newCategories = checked ? [...currentCategories, category] : currentCategories.filter((c) => c !== category)

    onFiltersChange({
      ...filters,
      category: newCategories,
    })
  }

  const handleCertificationChange = (certification: string, checked: boolean) => {
    const currentCertifications = filters.certification || []
    const newCertifications = checked
      ? [...currentCertifications, certification]
      : currentCertifications.filter((c) => c !== certification)

    onFiltersChange({
      ...filters,
      certification: newCertifications,
    })
  }

  const handleMaterialChange = (material: string, checked: boolean) => {
    const currentMaterials = filters.material || []
    const newMaterials = checked ? [...currentMaterials, material] : currentMaterials.filter((m) => m !== material)

    onFiltersChange({
      ...filters,
      material: newMaterials,
    })
  }

  const handlePriceRangeChange = (newRange: number[]) => {
    const range: [number, number] = [newRange[0], newRange[1]]
    setPriceRange(range)
    onFiltersChange({
      ...filters,
      priceRange: range,
    })
  }

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked,
    })
  }

  const clearFilters = () => {
    setPriceRange([0, 10000])
    onFiltersChange({})
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Active Filters */}
      {(filters.category?.length || filters.certification?.length || filters.material?.length || filters.inStock) && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filters.category?.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleCategoryChange(category, false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {filters.certification?.map((cert) => (
              <Badge key={cert} variant="secondary" className="text-xs">
                {cert}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleCertificationChange(cert, false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {filters.material?.map((material) => (
              <Badge key={material} variant="secondary" className="text-xs">
                {material}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleMaterialChange(material, false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {filters.inStock && (
              <Badge variant="secondary" className="text-xs">
                In Stock
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleInStockChange(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Product Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.category?.includes(category) || false}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {certifications.map((certification) => (
            <div key={certification} className="flex items-center space-x-2">
              <Checkbox
                id={`cert-${certification}`}
                checked={filters.certification?.includes(certification) || false}
                onCheckedChange={(checked) => handleCertificationChange(certification, checked as boolean)}
              />
              <Label htmlFor={`cert-${certification}`} className="text-sm font-normal cursor-pointer">
                {certification}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Materials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {materials.map((material) => (
            <div key={material} className="flex items-center space-x-2">
              <Checkbox
                id={`material-${material}`}
                checked={filters.material?.includes(material) || false}
                onCheckedChange={(checked) => handleMaterialChange(material, checked as boolean)}
              />
              <Label htmlFor={`material-${material}`} className="text-sm font-normal cursor-pointer">
                {material}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Stock Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" checked={filters.inStock || false} onCheckedChange={handleInStockChange} />
            <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <FilterContent />
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Product Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
