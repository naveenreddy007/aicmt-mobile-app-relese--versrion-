"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { ProductSelector } from "@/components/product-selector"

export function InquiryForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiryType: "",
    message: "",
    productId: "",
    hasSpecificProduct: true,
    priority: "normal",
  })

  useEffect(() => {
    // Check if there's product information in localStorage
    const storedProduct = localStorage.getItem("inquiryProduct")
    if (storedProduct) {
      try {
        const productInfo = JSON.parse(storedProduct)
        setFormData((prev) => ({
          ...prev,
          product: productInfo.name,
          message: `I'm interested in ${productInfo.name} (Code: ${productInfo.code}). Please provide more information.`,
        }))
        // Clear the localStorage after using it
        localStorage.removeItem("inquiryProduct")
      } catch (error) {
        console.error("Error parsing product info:", error)
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "hasSpecificProduct") {
          formDataToSend.append(key, value.toString())
        } else {
          formDataToSend.append(key, value)
        }
      })

      const response = await fetch("/api/inquiries", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your inquiry has been submitted successfully.",
        })
        router.push("/thank-you")
      } else {
        throw new Error("Failed to submit inquiry")
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your company name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Your phone number"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inquiryType">Inquiry Type *</Label>
          <Select value={formData.inquiryType} onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Inquiry</SelectItem>
              <SelectItem value="product">Product Information</SelectItem>
              <SelectItem value="quote">Request Quote</SelectItem>
              <SelectItem value="support">Technical Support</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="hasSpecificProduct"
            checked={formData.hasSpecificProduct}
            onCheckedChange={(checked) => setFormData({ ...formData, hasSpecificProduct: checked, productId: checked ? formData.productId : "" })}
          />
          <Label htmlFor="hasSpecificProduct">I have a specific product in mind</Label>
        </div>
        
        {formData.hasSpecificProduct && (
          <div className="space-y-2">
            <Label>Select Product</Label>
            <ProductSelector
              value={formData.productId}
              onValueChange={(value) => setFormData({ ...formData, productId: value })}
              placeholder="Search and select a product..."
            />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please describe your inquiry in detail..."
          className="min-h-[120px]"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
