"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function seedProducts() {
  const supabase = await createSupabaseServerClient()

  // Sample product data
  const products = [
    {
      name: "PBAT Film Grade Resin",
      code: "PBAT-F23",
      category: "granules",
      description:
        "High-quality PBAT (Polybutylene Adipate Terephthalate) resin specifically formulated for film applications. Offers excellent biodegradability and mechanical properties.",
      features: [
        "100% biodegradable",
        "Excellent film forming properties",
        "High tensile strength",
        "Compatible with existing processing equipment",
      ],
      specifications: [
        { name: "Melt Flow Index", value: "2.5-3.5 g/10min" },
        { name: "Density", value: "1.25-1.27 g/cm³" },
        { name: "Tensile Strength", value: "≥ 20 MPa" },
        { name: "Elongation at Break", value: "≥ 500%" },
      ],
      price: "Contact for pricing",
      image_url: "/biodegradable-plastic-granules.png",
      is_active: true,
    },
    {
      name: "Eco Carry Bag - Small",
      code: "CB-ECO-S",
      category: "bags",
      description:
        "Biodegradable carry bags made from our proprietary blend of compostable materials. Perfect for retail stores looking to reduce their environmental footprint.",
      features: [
        "100% compostable",
        "Meets IS/ISO 17088 standards",
        "High load capacity",
        "Customizable printing available",
      ],
      specifications: [
        { name: "Size", value: '8" × 12"' },
        { name: "Thickness", value: "25 microns" },
        { name: "Load Capacity", value: "Up to 2 kg" },
        { name: "Biodegradation Time", value: "180 days in composting conditions" },
      ],
      price: "₹2.50 per piece",
      image_url: "/earth-friendly-shopping.png",
      is_active: true,
    },
    {
      name: "Food Container - Medium",
      code: "FP-CONT-M",
      category: "packaging",
      description:
        "Biodegradable food containers perfect for takeaway and food delivery services. Maintains food temperature while being environmentally responsible.",
      features: ["Oil and water resistant", "Microwave safe", "Freezer safe", "No plastic or wax coating"],
      specifications: [
        { name: "Size", value: '6" × 6" × 2.5"' },
        { name: "Capacity", value: "750 ml" },
        { name: "Temperature Range", value: "-20°C to 120°C" },
        { name: "Material", value: "PLA + natural fibers" },
      ],
      price: "₹4.75 per piece",
      image_url: "/earth-friendly-takeout.png",
      is_active: true,
    },
    {
      name: "Agricultural Film - 100 micron",
      code: "FILM-AG-100",
      category: "films",
      description:
        "Biodegradable agricultural mulch film that helps control weed growth and soil temperature while naturally decomposing after the growing season.",
      features: [
        "UV stabilized",
        "Controlled biodegradation",
        "Excellent soil temperature regulation",
        "Reduces herbicide use",
      ],
      specifications: [
        { name: "Width", value: "1.2 meters" },
        { name: "Thickness", value: "100 microns" },
        { name: "Roll Length", value: "500 meters" },
        { name: "Biodegradation Time", value: "6-8 months depending on soil conditions" },
      ],
      price: "₹120 per kg",
      image_url: "/clear-biodegradable-pellets.png",
      is_active: true,
    },
    {
      name: "PLA General Purpose Resin",
      code: "PLA-G21",
      category: "granules",
      description:
        "Plant-based PLA (Polylactic Acid) resin derived from renewable resources. Ideal for various applications requiring a rigid, compostable material.",
      features: ["Derived from plant starch", "High clarity", "Rigid material", "Industrially compostable"],
      specifications: [
        { name: "Melt Flow Index", value: "6.0 g/10min" },
        { name: "Density", value: "1.24 g/cm³" },
        { name: "Tensile Strength", value: "50 MPa" },
        { name: "Glass Transition Temperature", value: "55-60°C" },
      ],
      price: "Contact for pricing",
      image_url: "/clear-eco-pellets.png",
      is_active: false,
    },
  ]

  // Insert products
  for (const product of products) {
    const { error } = await supabase.from("products").insert([product])

    if (error) {
      console.error("Error seeding product:", error)
      throw new Error(`Failed to seed product ${product.name}: ${error.message}`)
    }
  }

  revalidatePath("/admin/products")
  return { success: true, count: products.length }
}
