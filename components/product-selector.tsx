"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { getProducts } from "@/app/actions/products"

interface Product {
  id: string
  name: string
  code: string
  category: string
  price: number | null
  is_active: boolean
  image_url?: string
}

interface ProductSelectorProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function ProductSelector({
  value,
  onValueChange,
  placeholder = "Select a product...",
  className,
  disabled = false,
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const selectedProduct = products.find((product) => product.id === value)

  // Fetch products
  const fetchProducts = async (search?: string) => {
    setLoading(true)
    try {
      const result = await getProducts({
        search,
        status: "active", // Only show active products
        limit: 50, // Limit for performance
      })

      if (result.error) {
        console.error("Error fetching products:", result.error)
        setProducts([])
      } else {
        setProducts(result.products || [])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchProducts()
  }, [])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        fetchProducts(searchTerm)
      } else {
        fetchProducts()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSelect = (productId: string) => {
    if (value === productId) {
      onValueChange(undefined) // Deselect if already selected
    } else {
      onValueChange(productId)
    }
    setOpen(false)
  }

  const handleClear = () => {
    onValueChange(undefined)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedProduct ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono text-xs text-muted-foreground">
                {selectedProduct.code}
              </span>
              <span className="truncate">{selectedProduct.name}</span>
              {selectedProduct.price && (
                <Badge variant="secondary" className="ml-auto">
                  ₹{selectedProduct.price}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search products..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading products...</CommandEmpty>
            ) : products.length === 0 ? (
              <CommandEmpty>No products found.</CommandEmpty>
            ) : (
              <>
                <CommandGroup>
                  {selectedProduct && (
                    <CommandItem onSelect={handleClear} className="text-muted-foreground">
                      <span>Clear selection</span>
                    </CommandItem>
                  )}
                  {products.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.id}
                      onSelect={() => handleSelect(product.id)}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === product.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-mono text-xs text-muted-foreground shrink-0">
                          {product.code}
                        </span>
                        <span className="truncate">{product.name}</span>
                        {product.price && (
                          <Badge variant="secondary" className="ml-auto shrink-0">
                            ₹{product.price}
                          </Badge>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Hook for easier integration
export function useProductSelector(initialValue?: string) {
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(initialValue)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Fetch selected product details when ID changes
  useEffect(() => {
    if (selectedProductId) {
      const fetchProduct = async () => {
        try {
          const result = await getProducts({ limit: 1 })
          if (result.products) {
            const product = result.products.find(p => p.id === selectedProductId)
            setSelectedProduct(product || null)
          }
        } catch (error) {
          console.error("Error fetching selected product:", error)
          setSelectedProduct(null)
        }
      }
      fetchProduct()
    } else {
      setSelectedProduct(null)
    }
  }, [selectedProductId])

  return {
    selectedProductId,
    setSelectedProductId,
    selectedProduct,
  }
}