import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const supabase = await createSupabaseServerClient()

    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = (formData.get("company") as string) || null
    const phone = (formData.get("phone") as string) || null
    const message = formData.get("message") as string
    const inquiryType = formData.get("inquiryType") as string
    const priority = (formData.get("priority") as string) || "normal"
    const productId = (formData.get("productId") as string) || null
    const hasSpecificProduct = formData.get("hasSpecificProduct") === "true"

    // Validate required fields
    if (!name || !email || !message || !inquiryType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Map form data to database schema
    const inquiryData = {
      name,
      email,
      company,
      phone,
      message,
      product_interest: inquiryType,
      priority,
      product_id: hasSpecificProduct ? productId : null,
      status: "new",
    }

    // Insert the inquiry into the database
    const { data: inquiry, error } = await supabase.from("inquiries").insert([inquiryData]).select()

    if (error) {
      console.error("Error saving inquiry:", error)
      return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiryId: inquiry[0].id,
    })
  } catch (error) {
    console.error("Error processing inquiry:", error)
    return NextResponse.json({ error: "Failed to process inquiry" }, { status: 500 })
  }
}
