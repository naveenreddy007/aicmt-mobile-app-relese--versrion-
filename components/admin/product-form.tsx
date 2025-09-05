"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash, Upload, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { createProduct, updateProduct } from "@/app/actions/products"
import { MarketplaceLinksManager } from "@/components/admin/marketplace-links-manager"

// Product categories
const PRODUCT_CATEGORIES = [
  { id: "granules", name: "Granules & Resins" },
  { id: "bags", name: "Carry Bags" },
  { id: "packaging", name: "Food Packaging" },
  { id: "films", name: "Films & Wraps" },
  { id: "custom", name: "Custom Solutions" },
]

interface ProductFormProps {
  product?: any
}

export function ProductForm({ product = null }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper to parse features from product data
  const parseProductFeatures = (productFeatures: any) => {
    if (productFeatures && typeof productFeatures === "object" && Array.isArray(productFeatures.features)) {
      return productFeatures.features.length > 0 ? productFeatures.features : [""]
    }
    if (Array.isArray(productFeatures)) {
      return productFeatures.length > 0 ? productFeatures : [""]
    }
    return [""]
  }

  // Helper to parse specifications from product data
  const parseProductSpecifications = (productSpecifications: any) => {
    if (Array.isArray(productSpecifications) && productSpecifications.length > 0) {
      if (productSpecifications.every((spec) => typeof spec === "object" && "name" in spec && "value" in spec)) {
        return productSpecifications
      }
    } else if (typeof productSpecifications === "object" && productSpecifications !== null) {
      const specsArray = Object.entries(productSpecifications).map(([name, value]) => ({
        name,
        value: String(value),
      }))
      return specsArray.length > 0 ? specsArray : [{ name: "", value: "" }]
    }
    return [{ name: "", value: "" }]
  }

  const [formData, setFormData] = useState({
    name: product?.name || "",
    code: product?.code || "",
    category: product?.category || "granules",
    description: product?.description || "",
    features: product ? parseProductFeatures(product.features) : [""],
    specifications: product ? parseProductSpecifications(product.specifications) : [{ name: "", value: "" }],
    price: product?.price?.toString() || "",
    is_active: product?.is_active ?? true,
    amazon_url: product?.amazon_url || "",
    amazon_enabled: product?.amazon_enabled ?? false,
    inquiry_enabled: product?.inquiry_enabled ?? true,
  })

  // Image handling
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<any[]>([])

  // Initialize existing images
  useEffect(() => {
    if (product?.product_images) {
      const sortedImages = [...product.product_images].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      setExistingImages(sortedImages)
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features]
    newFeatures.splice(index, 1)
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  const handleSpecChange = (index: number, field: "name" | "value", value: string) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index] = { ...newSpecs[index], [field]: value }
    setFormData((prev) => ({ ...prev, specifications: newSpecs }))
  }

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }],
    }))
  }

  const removeSpec = (index: number) => {
    const newSpecs = [...formData.specifications]
    newSpecs.splice(index, 1)
    setFormData((prev) => ({ ...prev, specifications: newSpecs }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setSelectedImages((prev) => [...prev, ...files])

      // Create previews
      const newPreviews = files.map((file) => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index])
    const updatedImages = [...selectedImages]
    const updatedPreviews = [...imagePreviews]
    updatedImages.splice(index, 1)
    updatedPreviews.splice(index, 1)
    setSelectedImages(updatedImages)
    setImagePreviews(updatedPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("code", formData.code)
      submitData.append("category", formData.category)
      submitData.append("description", formData.description)
      submitData.append("price", formData.price)
      submitData.append("isActive", formData.is_active.toString())
      submitData.append("amazonUrl", formData.amazon_url)
      submitData.append("amazonEnabled", formData.amazon_enabled.toString())
      submitData.append("inquiryEnabled", formData.inquiry_enabled.toString())

      // Add features
      const featuresText = formData.features.filter((f) => f.trim() !== "").join("\n")
      submitData.append("features", featuresText)

      // Add specifications
      const specsText = formData.specifications
        .filter((s) => s.name.trim() !== "" && s.value.trim() !== "")
        .map((s) => `${s.name.trim()}: ${s.value.trim()}`)
        .join("\n")
      submitData.append("specifications", specsText)

      // Add images
      selectedImages.forEach((image) => {
        submitData.append(product ? "newImages" : "images", image)
      })

      let result
      if (product) {
        result = await updateProduct(product.id, submitData)
      } else {
        result = await createProduct(submitData)
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: product ? "Product updated successfully" : "Product created successfully",
        })
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
          <CardDescription>
            {product ? "Update product information" : "Create a new product in the catalog"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Product Code *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="Enter product code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  placeholder="Enter price or leave blank"
                />
                <p className="text-xs text-gray-500">Leave blank if price is variable or on request</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amazon_url">Amazon URL</Label>
                <Input
                  id="amazon_url"
                  name="amazon_url"
                  value={formData.amazon_url}
                  onChange={handleChange}
                  type="url"
                  placeholder="Enter Amazon product URL"
                />
                <p className="text-xs text-gray-500">Optional: Link to Amazon product page</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="amazon_enabled"
                    checked={formData.amazon_enabled}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, amazon_enabled: checked }))}
                  />
                  <Label htmlFor="amazon_enabled">Show Amazon Link</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="inquiry_enabled"
                    checked={formData.inquiry_enabled}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, inquiry_enabled: checked }))}
                  />
                  <Label htmlFor="inquiry_enabled">Allow Inquiries</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="Enter product description"
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="space-y-4">
            <Label>Product Images</Label>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Current Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={image.image_url || "/placeholder.svg"}
                          alt={image.alt_text || formData.name}
                          width={200}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      {image.is_primary && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {imagePreviews.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">New Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`New image ${index + 1}`}
                          width={200}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {existingImages.length === 0 && imagePreviews.length === 0 && (
              <div className="border border-dashed rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No images uploaded yet</p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-4">
            <Label>Features</Label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter product feature"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    disabled={formData.features.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <Label>Specifications</Label>
            <div className="space-y-2">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={spec.name}
                    onChange={(e) => handleSpecChange(index, "name", e.target.value)}
                    placeholder="Specification name"
                    className="flex-1"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    placeholder="Value"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSpec(index)}
                    disabled={formData.specifications.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>
            </div>
          </div>

          {/* Marketplace Links */}
          {product && (
            <div className="space-y-4">
              <Label>Marketplace Links</Label>
              <MarketplaceLinksManager productId={product.id} />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Update Product" : "Create Product"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
