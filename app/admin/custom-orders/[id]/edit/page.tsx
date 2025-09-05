import { notFound } from "next/navigation"
import { getCustomOrderById, updateCustomOrder } from "@/app/actions/custom-orders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CustomOrderEditForm } from "@/components/admin/custom-order-edit-form"

export default async function EditCustomOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const order = await getCustomOrderById(id)
  
  if (!order) {
    return notFound()
  }

  async function handleUpdate(formData: FormData) {
    "use server"
    const product_type = formData.get("product_type") as string
    const size = formData.get("size") as string
    const color = formData.get("color") as string
    const thickness = formData.get("thickness") as string
    const printing = formData.get("printing") as string
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const company_name = formData.get("company_name") as string
    const contact_name = formData.get("contact_name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const timeline = formData.get("timeline") as string
    const special_requirements = formData.get("special_requirements") as string
    const status = formData.get("status") as string

    const result = await updateCustomOrder(id, {
      product_type,
      size,
      color,
      thickness,
      printing_option: printing,
      quantity,
      company_name,
      contact_name,
      email,
      phone,
      timeline,
      special_requirements,
      status,
    })

    if (result.success) {
      const { redirect } = await import("next/navigation")
      redirect(`/admin/custom-orders/${id}`)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/custom-orders/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Custom Order</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>Update the custom order details</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomOrderEditForm order={order} onSubmit={handleUpdate} />
        </CardContent>
      </Card>
    </div>
  )
}
