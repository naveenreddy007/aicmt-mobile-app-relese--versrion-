import { LanguageMeta } from "@/components/language-meta"
import { SustainabilityCalculator } from "@/components/sustainability-calculator"
import { ProductComparison } from "@/components/product-comparison"
import { BiodegradationTimeline } from "@/components/biodegradation-timeline"
import { FaqAccordion } from "@/components/faq-accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, BarChart3, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <>
      <LanguageMeta pageName="features" />

      <section className="container py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Interactive Tools & Features</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our interactive tools to learn about biodegradable plastics, calculate environmental impact, and
            compare products.
          </p>
        </div>

        <Tabs defaultValue="calculator" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Impact Calculator</span>
              <span className="sm:hidden">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Product Comparison</span>
              <span className="sm:hidden">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Biodegradation</span>
              <span className="sm:hidden">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="p-4 border rounded-lg">
            <SustainabilityCalculator />
          </TabsContent>

          <TabsContent value="comparison" className="p-4 border rounded-lg">
            <ProductComparison />
          </TabsContent>

          <TabsContent value="timeline" className="p-4 border rounded-lg">
            <BiodegradationTimeline />
          </TabsContent>

          <TabsContent value="faq" className="p-4 border rounded-lg">
            <FaqAccordion />
          </TabsContent>
        </Tabs>
      </section>

      <section className="bg-green-50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certification Verification</CardTitle>
                <CardDescription>Verify the authenticity of our products</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Our products come with unique certification codes that can be verified online.</p>
                <Link href={`/${locale}/certification`}>
                  <Button variant="outline" className="w-full">
                    Verify Certification
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Reports</CardTitle>
                <CardDescription>Access detailed environmental impact reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Download comprehensive reports on the environmental benefits of our products.</p>
                <Button variant="outline" className="w-full">
                  Download Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Educational Resources</CardTitle>
                <CardDescription>Learn more about biodegradable plastics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Access educational materials about biodegradable plastics and sustainability.</p>
                <Link href={`/${locale}/blog`}>
                  <Button variant="outline" className="w-full">
                    Explore Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
