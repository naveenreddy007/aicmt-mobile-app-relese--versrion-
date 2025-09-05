"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createCertificate, updateCertificate } from "@/app/actions/certificates"

interface CertificationFormProps {
  certification?: {
    id: string
    title: string
    description: string | null
    certificate_number: string | null
    issuing_authority: string | null
    issue_date: string | null
    expiry_date: string | null
    image_url: string | null
    document_url: string | null
    is_active: boolean
    display_order: number
  }
}

export function CertificationForm({ certification }: CertificationFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: certification?.title || "",
    description: certification?.description || "",
    certificate_number: certification?.certificate_number || "",
    issuing_authority: certification?.issuing_authority || "",
    issue_date: certification?.issue_date || "",
    expiry_date: certification?.expiry_date || "",
    image_url: certification?.image_url || "",
    document_url: certification?.document_url || "",
    is_active: certification?.is_active ?? true,
    display_order: certification?.display_order || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value.toString())
      })

      if (certification) {
        await updateCertificate(certification.id, formDataObj)
        toast.success("Certification updated successfully")
      } else {
        await createCertificate(formDataObj)
        toast.success("Certification created successfully")
      }
    } catch (error) {
      console.error("Error saving certification:", error)
      toast.error("Failed to save certification")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/certifications">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {certification ? "Edit Certification" : "Add New Certification"}
          </h1>
          <p className="text-muted-foreground">
            {certification ? "Update certification details" : "Create a new certification entry"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certification Details</CardTitle>
          <CardDescription>
            Fill in the certification information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter certification title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate_number">Certificate Number</Label>
                <Input
                  id="certificate_number"
                  value={formData.certificate_number}
                  onChange={(e) => handleInputChange("certificate_number", e.target.value)}
                  placeholder="Enter certificate number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuing_authority">Issuing Authority</Label>
                <Input
                  id="issuing_authority"
                  value={formData.issuing_authority}
                  onChange={(e) => handleInputChange("issuing_authority", e.target.value)}
                  placeholder="Enter issuing organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => handleInputChange("issue_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => handleInputChange("expiry_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleInputChange("display_order", parseInt(e.target.value) || 0)}
                  placeholder="Enter display order (0 = first)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_url">Document URL</Label>
                <Input
                  id="document_url"
                  value={formData.document_url}
                  onChange={(e) => handleInputChange("document_url", e.target.value)}
                  placeholder="Enter document URL"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter certification description"
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : certification ? "Update Certification" : "Create Certification"}
              </Button>
              <Link href="/admin/certifications">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}