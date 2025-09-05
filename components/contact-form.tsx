"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function ContactForm({ createInquiry }) {
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
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields including phone
    if (!formData.name || !formData.email || !formData.phone || !formData.inquiryType || !formData.message) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields including phone number.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData object for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value || "")
      })

      // Call the server action
      const result = await createInquiry(formDataObj)

      if (result.success) {
        // Show success toast
        toast({
          title: "Message Sent",
          description: "Thank you for contacting us. We&apos;ll get back to you soon.",
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          inquiryType: "",
          message: "",
        })

        // Redirect to thank you page
        router.push("/thank-you")
      } else {
        // Show error toast
        toast({
          title: "Submission Failed",
          description: result.error || "There was a problem sending your message. Please try again.",
          variant: "destructive",
        })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Submission Failed",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Inquire About Biodegradable & Compostable Products</h2>
        <p className="text-gray-600">
          Get in touch with us for product information, quotes, and partnership opportunities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inquiryType">Inquiry Type *</Label>
          <Select value={formData.inquiryType} onValueChange={handleSelectChange} required>
            <SelectTrigger id="inquiryType">
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Product Information</SelectItem>
              <SelectItem value="quote">Request a Quote</SelectItem>
              <SelectItem value="sample">Request a Sample</SelectItem>
              <SelectItem value="partnership">Be our Marketing Partner</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message"
            className="min-h-[120px]"
            required
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>For quick responses:</strong> Send us a WhatsApp message at{" "}
            <a href="https://wa.me/917578007116" className="font-medium underline">
              +91-7578007116
            </a>
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  )
}
