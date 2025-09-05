"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface CustomOrder {
  id: string
  product_type: string
  size: string
  color: string
  thickness: string
  printing: string
  quantity: number
  company_name: string
  contact_name: string
  email: string
  phone: string
  timeline: string
  special_requirements: string
  status: string
  created_at: string
}

interface CustomOrderEditFormProps {
  order: CustomOrder
  onSubmit: (formData: FormData) => Promise<void>
}

export function CustomOrderEditForm({ order, onSubmit }: CustomOrderEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error updating order:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="product_type">Product Type</Label>
          <Select name="product_type" defaultValue={order.product_type}>
            <SelectTrigger id="product_type">
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bags">Biodegradable Bags</SelectItem>
              <SelectItem value="containers">Food Containers</SelectItem>
              <SelectItem value="cutlery">Cutlery</SelectItem>
              <SelectItem value="film">Packaging Film</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Input id="size" name="size" defaultValue={order.size} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" defaultValue={order.color} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thickness">Thickness</Label>
          <Input id="thickness" name="thickness" defaultValue={order.thickness} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="printing">Printing</Label>
          <Select name="printing" defaultValue={order.printing}>
            <SelectTrigger id="printing">
              <SelectValue placeholder="Select printing option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="single_color">Single Color</SelectItem>
              <SelectItem value="multi_color">Multi-Color</SelectItem>
              <SelectItem value="custom_design">Custom Design</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" defaultValue={order.quantity} min={1} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input id="company_name" name="company_name" defaultValue={order.company_name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input id="contact_name" name="contact_name" defaultValue={order.contact_name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={order.email} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={order.phone} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline</Label>
          <Input id="timeline" name="timeline" defaultValue={order.timeline} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={order.status}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in_production">In Production</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="special_requirements">Special Requirements</Label>
        <Textarea
          id="special_requirements"
          name="special_requirements"
          rows={4}
          defaultValue={order.special_requirements || ""}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
