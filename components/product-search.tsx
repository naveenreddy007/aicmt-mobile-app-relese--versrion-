"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProductSearchProps {
  initialValue?: string
  onSearch: (value: string) => void
  className?: string
  placeholder?: string
}

export function ProductSearch({
  initialValue = "",
  onSearch,
  className,
  placeholder = "Search products...",
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  // Update search term when initialValue changes
  useEffect(() => {
    setSearchTerm(initialValue)
  }, [initialValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleClear = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  )
}
