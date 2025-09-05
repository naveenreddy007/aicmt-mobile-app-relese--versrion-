"use client"

import { useState } from "react"
import { OptimizedImage } from "@/components/optimized-image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Printer, Layers, Maximize, Zap } from "lucide-react"

// Sample printing capabilities data
const printingCapabilities = [
  {
    id: "flexographic",
    name: "Flexographic Printing",
    description: "High-quality printing method ideal for packaging materials with fast production speeds.",
    image: "/printing/flexographic.jpg",
    features: ["Up to 8 colors", "Excellent for large runs", "Food-safe inks available", "Consistent quality"],
    applications: ["Bags", "Films", "Flexible packaging"],
  },
  {
    id: "gravure",
    name: "Gravure Printing",
    description: "Premium printing technique that offers exceptional quality and consistency for packaging.",
    image: "/printing/gravure.jpg",
    features: ["Superior image quality", "Vibrant colors", "Long-lasting prints", "Ideal for detailed designs"],
    applications: ["Premium packaging", "High-end bags", "Retail packaging"],
  },
  {
    id: "digital",
    name: "Digital Printing",
    description: "Modern printing method perfect for short runs and customized packaging solutions.",
    image: "/printing/digital.jpg",
    features: ["Variable data printing", "No minimum order quantity", "Quick turnaround", "Eco-friendly process"],
    applications: ["Custom packaging", "Promotional items", "Personalized products"],
  },
]

export function PrintingCapabilities() {
  const [activeTab, setActiveTab] = useState("flexographic")

  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Multi-Color Printing Capabilities</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Enhance your biodegradable packaging with our state-of-the-art printing technologies
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full" aria-label="Printing capabilities">
          {printingCapabilities.map((capability) => (
            <TabsTrigger key={capability.id} value={capability.id}>
              {capability.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {printingCapabilities.map((capability) => (
          <TabsContent key={capability.id} value={capability.id} className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="rounded-lg overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={capability.image}
                      alt={`${capability.name} printing process demonstration showing quality and detail`}
                      width={500}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{capability.name}</h3>
                      <p className="text-gray-600 mt-1">{capability.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Palette className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-gray-900">Features</h4>
                        </div>
                        <ul className="space-y-1">
                          {capability.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-green-600 mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Layers className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-gray-900">Applications</h4>
                        </div>
                        <ul className="space-y-1">
                          {capability.applications.map((application, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-green-600 mt-1">•</span>
                              <span>{application}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full sm:w-auto">Request Printing Sample</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-green-50 p-6 rounded-lg flex flex-col items-center text-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <Palette className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Custom Color Matching</h3>
          <p className="text-gray-600 text-sm">
            We can match any Pantone or custom color for your brand identity needs
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg flex flex-col items-center text-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <Maximize className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Surface Coverage</h3>
          <p className="text-gray-600 text-sm">Full surface printing available with edge-to-edge coverage options</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg flex flex-col items-center text-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <Zap className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Quick Turnaround</h3>
          <p className="text-gray-600 text-sm">Fast production times with our in-house printing facilities</p>
        </div>
      </div>
    </div>
  )
}
