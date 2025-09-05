"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { getCustomOrderById } from "@/app/actions/custom-orders"
import { CustomOrderDetail } from "@/components/admin/custom-order-detail"
import { QuotationForm } from "@/components/admin/quotation-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { sendQuotationReminder } from "@/app/actions/send-email"
import { useToast } from "@/components/ui/use-toast"
import { generateQuotationPDF } from "@/lib/pdf"
import { QuotationHistory } from "@/components/admin/quotation-history"
import { PaymentForm } from "@/components/admin/payment-form"
import { PaymentHistoryForQuotation } from "@/components/admin/payment-history"

export default function CustomOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function initializeParams() {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    initializeParams()
  }, [params])

  useEffect(() => {
    if (!id) return
    
    async function fetchOrder() {
      try {
        const orderData = await getCustomOrderById(id)
        if (!orderData) {
          notFound()
        }
        setOrder(orderData)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!order) {
    notFound()
  }

  const handleSendReminder = async () => {
    const result = await sendQuotationReminder(order.contact_email, order)
    if (result.success) {
      toast({ title: "Reminder Sent", description: "Quotation reminder sent to customer." })
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  const handleGeneratePDF = () => {
    generateQuotationPDF(order)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/custom-orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Custom Order Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/custom-orders/${id}/edit`}>Edit Order</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          <CustomOrderDetail order={order} />
        </TabsContent>
        <TabsContent value="quotation" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Management</CardTitle>
              <CardDescription>
                {order.status === "quoted"
                  ? `Quotation ${order.quote_reference} was sent on ${new Date(
                      order.quote_sent_at
                    ).toLocaleDateString()}`
                  : "Create a quotation for this custom order"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {order.status === "quoted" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm">Quote Reference</h3>
                      <p>{order.quote_reference}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Amount</h3>
                      <p>${order.quote_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Sent Date</h3>
                      <p>{new Date(order.quote_sent_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Valid Until</h3>
                      <p>{new Date(order.quote_valid_until).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-sm">Notes</h3>
                    <p className="whitespace-pre-wrap">{order.quote_notes}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleSendReminder}>
                      Send Reminder
                    </Button>
                    <Button onClick={handleGeneratePDF}>Generate PDF</Button>
                  </div>
                </div>
              ) : (
                <QuotationForm orderId={order.id} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-6">
          {order.quotations && order.quotations.length > 0 ? (
            <>
              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Total Amount</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${parseFloat(order.quotations[0].total_amount || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Received</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${parseFloat(order.quotations[0].received_amount || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-900">Balance</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    ${(parseFloat(order.quotations[0].total_amount || 0) - parseFloat(order.quotations[0].received_amount || 0)).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Add Payment Form */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Add Payment</h3>
                <PaymentForm quotationId={order.quotations[0].id} />
              </div>

              {/* Payment History */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                <PaymentHistoryForQuotation quotationId={order.quotations[0].id} />
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No quotation available. Create a quotation first to manage payments.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="communication" className="space-y-4 pt-4">
          <QuotationHistory customOrderId={order.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
