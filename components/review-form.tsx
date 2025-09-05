"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Star, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createReview } from "@/app/actions/reviews"

interface ReviewFormProps {
  productId: string
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Limit to 3 images
      if (images.length + newFiles.length > 3) {
        toast({
          title: "Too many images",
          description: "You can upload a maximum of 3 images",
          variant: "destructive",
        })
        return
      }

      // Create preview URLs
      const newUrls = newFiles.map((file) => URL.createObjectURL(file))

      setImages([...images, ...newFiles])
      setImageUrls([...imageUrls, ...newUrls])
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images]
    const newUrls = [...imageUrls]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newUrls[index])

    newImages.splice(index, 1)
    newUrls.splice(index, 1)

    setImages(newImages)
    setImageUrls(newUrls)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("productId", productId)
      formData.append("rating", rating.toString())

      // Add images to form data
      images.forEach((image) => {
        formData.append("images", image)
      })

      const result = await createReview(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Review Submitted",
          description: "Thank you for your review! It will be published after moderation.",
        })

        // Reset form
        if (formRef.current) {
          formRef.current.reset()
        }
        setRating(0)
        setImages([])
        setImageUrls([])

        // Switch back to reviews tab
        document.querySelector('[data-value="reviews"]')?.click()
      }
    } catch (err) {
      console.error("Error submitting review:", err)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        {rating === 0 && <p className="text-sm text-red-500">Please select a rating</p>}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your name" required />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="Your email (will not be published)" required />
      </div>

      {/* Review Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Review Title</Label>
        <Input id="title" name="title" placeholder="Summarize your review" required />
      </div>

      {/* Review Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Review</Label>
        <Textarea id="content" name="content" placeholder="Write your review here..." rows={5} required />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Add Photos (optional)</Label>
        <div className="flex flex-wrap gap-4">
          {/* Image previews */}
          {imageUrls.map((url, index) => (
            <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
              <Image
                src={url || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          ))}

          {/* Upload button */}
          {images.length < 3 && (
            <label className="w-24 h-24 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <Upload className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Add Photo</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-500">You can upload up to 3 images (PNG, JPG, JPEG)</p>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={rating === 0 || isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting this review, you agree to our terms and conditions. All reviews are moderated before being
        published.
      </p>
    </form>
  )
}
