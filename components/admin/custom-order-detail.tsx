import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CustomOrderDetail({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-500 hover:bg-blue-600"
      case "quoted":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "in-production":
        return "bg-purple-500 hover:bg-purple-600"
      case "completed":
        return "bg-green-500 hover:bg-green-600"
      case "cancelled":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Order Information</CardTitle>
            <Badge className={`${getStatusColor(order.status)} text-white`}>
              {order.status ? order.status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "New"}
            </Badge>
          </div>
          <CardDescription>Created on {formatDate(order.created_at)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Company:</span>
                  <span>{order.company_name}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Contact:</span>
                  <span>{order.contact_name}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{order.email}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{order.phone || "Not provided"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Order Timeline</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{formatDate(order.updated_at)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Quote Sent:</span>
                  <span>{order.quote_sent_at ? formatDate(order.quote_sent_at) : "Not quoted yet"}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Timeline:</span>
                  <span>
                    {order.timeline === "urgent"
                      ? "Urgent (1-2 weeks)"
                      : order.timeline === "standard"
                        ? "Standard (3-4 weeks)"
                        : "Relaxed (5+ weeks)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Specifications</CardTitle>
          <CardDescription>Custom product details and requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Product Details</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Product Type:</span>
                  <span>{order.product_type}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Product Name:</span>
                  <span>{order.product_name}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span>{order.quantity.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Specifications</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Size:</span>
                  <span>{order.size}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Color:</span>
                  <span>{order.color}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Thickness:</span>
                  <span>{order.thickness}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Printing:</span>
                  <span>{order.printing_option}</span>
                </div>
                {order.printing_option !== "none" && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Print Location:</span>
                    <span>{order.print_location || "Not specified"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(order.special_instructions || order.additional_requirements) && (
            <div className="mt-6 space-y-4">
              {order.special_instructions && (
                <div>
                  <h3 className="font-medium mb-2">Special Instructions</h3>
                  <p className="whitespace-pre-wrap bg-muted p-3 rounded-md">{order.special_instructions}</p>
                </div>
              )}
              {order.additional_requirements && (
                <div>
                  <h3 className="font-medium mb-2">Additional Requirements</h3>
                  <p className="whitespace-pre-wrap bg-muted p-3 rounded-md">{order.additional_requirements}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
