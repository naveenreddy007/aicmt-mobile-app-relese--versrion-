"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ProductFilter } from "@/types/product"

interface ProductSortProps {
  sortBy?: ProductFilter["sortBy"]
  sortOrder?: ProductFilter["sortOrder"]
  onSort: (sortBy: ProductFilter["sortBy"], sortOrder: ProductFilter["sortOrder"]) => void
  className?: string
}

export function ProductSort({ sortBy, sortOrder = "asc", onSort, className }: ProductSortProps) {
  const getSortLabel = () => {
    if (!sortBy) return "Sort by"

    const labels = {
      name: "Name",
      price: "Price",
      newest: "Newest",
    }

    return `${labels[sortBy]} (${sortOrder === "asc" ? "A-Z" : "Z-A"})`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          {getSortLabel()}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSort("name", "asc")}>Name (A-Z)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort("name", "desc")}>Name (Z-A)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort("price", "asc")}>Price (Low to High)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort("price", "desc")}>Price (High to Low)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort("newest", "desc")}>Newest First</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort("newest", "asc")}>Oldest First</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
