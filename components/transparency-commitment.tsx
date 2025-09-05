import { Shield, FileText, Leaf, Recycle, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TransparencyCommitment() {
  return (
    <div className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Commitment to Transparency</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            We believe in being completely transparent about our products, processes, and environmental impact
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <Shield className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Product Verification</CardTitle>
              <CardDescription>Every product can be verified for authenticity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Each of our products comes with a unique verification code that allows you to confirm its authenticity
                and certification status. This ensures you&apos;re getting genuine AICMT compostable products that meet all
                regulatory standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Public Certifications</CardTitle>
              <CardDescription>All our certifications are publicly available</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We make all our certifications and test reports publicly available for review. This includes our CPCB
                certification, CIPET test reports, and other quality and safety certifications. We have nothing to hide
                and everything to share.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Leaf className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Material Disclosure</CardTitle>
              <CardDescription>Full transparency about what&apos;s in our products</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We disclose all materials used in our products. Our compostable plastics are made primarily from PBAT
                (Polybutylene Adipate Terephthalate) and PLA (Polylactic Acid), which are derived from renewable
                resources and fully biodegradable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Recycle className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>End-of-Life Information</CardTitle>
              <CardDescription>Clear guidance on proper disposal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We provide clear information about how to properly dispose of our products at the end of their useful
                life. This includes composting instructions, expected decomposition timeframes, and guidance on how to
                identify industrial composting facilities in your area.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Globe className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Environmental Impact</CardTitle>
              <CardDescription>Honest reporting of our ecological footprint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We&apos;re transparent about the environmental impact of our products and operations. This includes our
                carbon footprint, water usage, and waste reduction metrics. We regularly publish updates on our
                sustainability goals and progress.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-700">Our Promise to You</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                At AICMT International, we promise to always be honest and transparent. If you ever have questions about
                our products, processes, or environmental claims, we&apos;re here to provide clear, factual answers.
              </p>
              <p className="text-gray-700">
                We believe that transparency builds trust, and trust is the foundation of lasting relationships with our
                customers and partners.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
