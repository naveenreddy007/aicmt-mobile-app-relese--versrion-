import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { SustainabilityCalculator } from "@/components/sustainability-calculator"
import { FaqAccordion } from "@/components/faq-accordion"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { BiodegradationTimeline } from "@/components/biodegradation-timeline"
import { ProductComparison } from "@/components/product-comparison"

export default function FeaturesPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Interactive Features</h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl">
            Explore our interactive tools and information resources
          </p>
        </div>

        <div className="space-y-24">
          {/* Sustainability Calculator */}
          <section>
            <SustainabilityCalculator />
          </section>

          {/* Biodegradation Timeline */}
          <section>
            <BiodegradationTimeline />
          </section>

          {/* Product Comparison */}
          <section>
            <ProductComparison />
          </section>

          {/* Testimonials */}
          <section>
            <TestimonialsCarousel />
          </section>

          {/* FAQ */}
          <section>
            <FaqAccordion />
          </section>
        </div>
      </div>
    </div>
  )
}
