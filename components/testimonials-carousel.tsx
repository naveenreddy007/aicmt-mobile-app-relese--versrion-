"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OptimizedImage } from "@/components/optimized-image"

// Fallback testimonial data (will only be used if database fetch fails)
const fallbackTestimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    position: "Procurement Manager",
    company: "GreenRetail Solutions",
    image: "/confident-professional.png",
    quote:
      "Switching to AICMT&apos;s compostable bags has been a game-changer for our retail chain. Our customers appreciate our commitment to sustainability, and the quality of the bags is exceptional.",
  },
]

export function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [testimonials] = useState(fallbackTestimonials)
  const [loading, setLoading] = useState(true)

  // Fetch testimonials from database
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // const supabase = createClientComponentClient()

        // Here you would normally query a testimonials table
        // For now, we'll leave this commented out since we haven't created that table yet

        /*
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching testimonials:', error)
        } else if (data && data.length > 0) {
          setTestimonials(data)
        }
        */

        // For now, we'll keep using the fallback data
        // Remove this timeout in production
        setTimeout(() => {
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error in testimonials fetch:", error)
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Handle next/previous navigation
  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1))
  }, [testimonials.length])

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1))
  }, [testimonials.length])

  // Set up autoplay
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      goToNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, goToNext])

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">What Our Customers Say</h2>
          <p className="text-gray-500 mt-2">Hear from businesses that have made the switch to compostable plastics</p>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">What Our Customers Say</h2>
        <p className="text-gray-500 mt-2">Hear from businesses that have made the switch to compostable plastics</p>
      </div>

      <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden">
                          <OptimizedImage
                            src={testimonial.image || "/placeholder.svg?height=80&width=80&query=person"}
                            alt={testimonial.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <Quote className="h-8 w-8 text-green-200 mb-2" />
                        <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                        <div>
                          <p className="font-bold">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">
                            {testimonial.position}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-md border-gray-200 z-10"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-md border-gray-200 z-10"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>

        {/* Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index ? "w-6 bg-green-600" : "w-2 bg-gray-300"
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
