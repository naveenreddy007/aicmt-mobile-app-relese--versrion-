import { notFound } from "next/navigation"
import { getInquiryById } from "@/app/actions/inquiries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InquiryStatusForm } from "@/components/admin/inquiry-status-form"
import { InquiryNotesForm } from "@/components/admin/inquiry-notes-form"
import { ArrowLeft, Mail, Phone, Building, Calendar } from "lucide-react"
import Link from "next/link"

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const inquiry = await getInquiryById(id)

  if (!inquiry) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500 hover:bg-blue-600"
      case "in-progress":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "completed":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/inquiries">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Inquiry Details</h1>
        </div>
        <Badge className={`${getStatusColor(inquiry.status)} text-white`}>
          {inquiry.status ? inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1) : "New"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Contact details of the person who submitted the inquiry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Name</p>
              <p className="text-lg">{inquiry.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </p>
              <p className="text-base">
                <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                  {inquiry.email}
                </a>
              </p>
            </div>
            {inquiry.phone && (
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone
                </p>
                <p className="text-base">
                  <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">
                    {inquiry.phone}
                  </a>
                </p>
              </div>
            )}
            {inquiry.company && (
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" /> Company
                </p>
                <p className="text-base">{inquiry.company}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Submitted On
              </p>
              <p className="text-base">{formatDate(inquiry.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inquiry Details</CardTitle>
            <CardDescription>Information about the inquiry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Inquiry Type</p>
              <p className="text-base capitalize">{inquiry.product_interest || "General"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Message</p>
              <div className="rounded-md border p-4 whitespace-pre-wrap">{inquiry.message}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Management</CardTitle>
            <CardDescription>Update the status of this inquiry</CardDescription>
          </CardHeader>
          <CardContent>
            <InquiryStatusForm inquiry={inquiry} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Add internal notes about this inquiry</CardDescription>
          </CardHeader>
          <CardContent>
            <InquiryNotesForm inquiry={inquiry} />
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Notes are for internal use only and are not visible to customers.
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
