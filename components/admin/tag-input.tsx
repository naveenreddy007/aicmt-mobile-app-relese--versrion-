"use client"

import type React from "react"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  className?: string
  maxTags?: number
}

export function TagInput({ tags, onTagsChange, placeholder = "Add tag...", className, maxTags = 20 }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or comma
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    }
    // Remove last tag on Backspace if input is empty
    else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = (tag: string) => {
    // Normalize tag (lowercase, trim)
    const normalizedTag = tag.toLowerCase().trim()

    // Don't add empty tags, duplicate tags, or exceed max tags
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < maxTags) {
      onTagsChange([...tags, normalizedTag])
    }

    // Clear input
    setInputValue("")
  }

  const removeTag = (index: number) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    onTagsChange(newTags)
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 border rounded-md p-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {tag}
          <button
            type="button"
            className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
            onClick={() => removeTag(index)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag} tag</span>
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={tags.length < maxTags ? placeholder : `Maximum ${maxTags} tags reached`}
        className="flex-1 min-w-[120px] border-0 focus-visible:ring-0 p-0 text-sm"
        disabled={tags.length >= maxTags}
      />
    </div>
  )
}
