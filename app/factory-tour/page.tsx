import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getActiveFactoryTours } from "@/app/actions/factory-tour"
import { FactoryTourGrid } from "@/components/factory-tour/factory-tour-grid"
import { Play, Factory } from "lucide-react"

export const metadata: Metadata = {
  title: "Factory Tour | AICMT International",
  description:
    "Take a virtual tour of our state-of-the-art biodegradable plastic manufacturing facility. See how we create sustainable packaging solutions.",
  keywords: ["factory tour", "biodegradable plastics", "manufacturing", "sustainability", "facility"],
}

export default async function FactoryTourPage() {
  let tours: any[] = []
  let error: string | null = null

  try {
    tours = await getActiveFactoryTours()
  } catch (err) {
    console.error("Error fetching factory tours:", err)
    error = "Failed to load factory tours"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Factory className="h-12 w-12 text-green-600 mr-4" />
              <Play className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Factory Tour
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Take a virtual journey through our state-of-the-art biodegradable plastic manufacturing facility. 
              Discover how we create sustainable packaging solutions that protect both your products and our planet.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Advanced Technology</h3>
                  <p className="text-sm text-gray-600">State-of-the-art equipment for precision manufacturing</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Quality Control</h3>
                  <p className="text-sm text-gray-600">Rigorous testing ensures product excellence</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Sustainability</h3>
                  <p className="text-sm text-gray-600">Eco-friendly processes from start to finish</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factory Tour Videos */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Factory className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Unable to Load Tours</h3>
                <p className="text-muted-foreground">
                  We're experiencing technical difficulties. Please try again later.
                </p>
              </CardContent>
            </Card>
          ) : tours.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Explore Our Manufacturing Process
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Watch these videos to see how we transform raw materials into biodegradable packaging solutions
                </p>
              </div>
              <Suspense fallback={<FactoryTourGridSkeleton />}>
                <FactoryTourGrid tours={tours} />
              </Suspense>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tours Available</h3>
                <p className="text-muted-foreground">
                  Factory tour videos are coming soon. Check back later for an inside look at our facility.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Partner with Us?
            </h2>
            <p className="text-gray-600 mb-8">
              After seeing our manufacturing capabilities, discover how our biodegradable packaging solutions 
              can benefit your business and the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                View Products
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FactoryTourGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <div className="aspect-video">
            <Skeleton className="w-full h-full rounded-t-lg" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}