"use client"

import { useState, useMemo } from "react"
import type { Product, ProductFilter, ProductFilterOption } from "@/types/product"

export function useProductFilter(products: Product[], initialFilters: ProductFilter = {}) {
  const [filters, setFilters] = useState<ProductFilter>(initialFilters)

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by category
      if (filters.category && product.category !== filters.category) {
        return false
      }

      // Filter by search term
      if (filters.search && filters.search.trim() !== "") {
        const searchTerm = filters.search.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(searchTerm)
        const matchesDescription = product.description?.toLowerCase().includes(searchTerm) || false
        const matchesCode = product.code.toLowerCase().includes(searchTerm)

        if (!matchesName && !matchesDescription && !matchesCode) {
          return false
        }
      }

      // Filter by price
      if (filters.minPrice || filters.maxPrice) {
        // Only apply price filter if product has a numeric price
        if (product.price && !isNaN(Number.parseFloat(product.price))) {
          const productPrice = Number.parseFloat(product.price)

          if (filters.minPrice && productPrice < filters.minPrice) {
            return false
          }

          if (filters.maxPrice && productPrice > filters.maxPrice) {
            return false
          }
        }
      }

      // Filter by features
      if (filters.features && filters.features.length > 0) {
        // Skip if product has no features
        if (!product.features || !Array.isArray(product.features)) {
          return false
        }

        // Check if product has all selected features
        const hasAllFeatures = filters.features.every((feature) =>
          product.features?.some(
            (productFeature) =>
              typeof productFeature === "string" && productFeature.toLowerCase().includes(feature.toLowerCase()),
          ),
        )

        if (!hasAllFeatures) {
          return false
        }
      }

      return true
    })
  }, [products, filters])

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    if (!filters.sortBy) return filteredProducts

    return [...filteredProducts].sort((a, b) => {
      const sortOrder = filters.sortOrder === "desc" ? -1 : 1

      switch (filters.sortBy) {
        case "name":
          return sortOrder * a.name.localeCompare(b.name)

        case "price":
          const priceA = a.price ? Number.parseFloat(a.price) : 0
          const priceB = b.price ? Number.parseFloat(b.price) : 0
          return sortOrder * (priceA - priceB)

        case "newest":
          return sortOrder * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        default:
          return 0
      }
    })
  }, [filteredProducts, filters.sortBy, filters.sortOrder])

  // Extract available categories from products
  const categories = useMemo<ProductFilterOption[]>(() => {
    const categoryMap = products.reduce(
      (acc, product) => {
        const category = product.category
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(categoryMap).map(([id, count]) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " "),
      count,
    }))
  }, [products])

  // Extract available features from products
  const availableFeatures = useMemo<ProductFilterOption[]>(() => {
    const featureSet = new Set<string>()

    products.forEach((product) => {
      if (product.features && Array.isArray(product.features)) {
        product.features.forEach((feature) => {
          if (typeof feature === "string") {
            featureSet.add(feature)
          }
        })
      }
    })

    return Array.from(featureSet).map((feature) => ({
      id: feature,
      label: feature,
    }))
  }, [products])

  // Calculate price range
  const priceRange = useMemo(() => {
    let min = Number.POSITIVE_INFINITY
    let max = 0

    products.forEach((product) => {
      if (product.price && !isNaN(Number.parseFloat(product.price))) {
        const price = Number.parseFloat(product.price)
        min = Math.min(min, price)
        max = Math.max(max, price)
      }
    })

    return {
      min: min === Number.POSITIVE_INFINITY ? 0 : min,
      max: max === 0 ? 1000 : max,
    }
  }, [products])

  // Update filters
  const updateFilter = (filterUpdate: Partial<ProductFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...filterUpdate,
    }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({})
  }

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredProducts: sortedProducts,
    totalProducts: products.length,
    filteredCount: sortedProducts.length,
    categories,
    availableFeatures,
    priceRange,
  }
}
