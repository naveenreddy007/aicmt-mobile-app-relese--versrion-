"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OptimizedImage } from "@/components/optimized-image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample raw materials data
const rawMaterials = [
  {
    id: "pbat",
    name: "PBAT",
    fullName: "Polybutylene Adipate Terephthalate",
    description: "A biodegradable random copolymer specifically designed to improve flexibility and toughness.",
    image: "/raw-materials/pbat.jpg",
    properties: [
      "Excellent flexibility",
      "Good impact resistance",
      "Biodegradable in composting conditions",
      "Compatible with other biopolymers",
    ],
    applications: ["Films", "Bags", "Packaging"],
  },
  {
    id: "pla",
    name: "PLA",
    fullName: "Polylactic Acid",
    description: "A biodegradable thermoplastic derived from renewable resources like corn starch or sugarcane.",
    image: "/raw-materials/pla.jpg",
    properties: [
      "High strength and modulus",
      "Good processability",
      "Transparent",
      "Biodegradable in industrial composting",
    ],
    applications: ["Rigid packaging", "Food containers", "Disposable items"],
  },
  {
    id: "starch",
    name: "Starch Compounds",
    fullName: "Modified Starch Blends",
    description: "Natural polymers derived from plants, modified to enhance processability and performance.",
    image: "/raw-materials/starch.jpg",
    properties: ["Fully biodegradable", "Renewable resource", "Cost-effective", "Customizable properties"],
    applications: ["Food packaging", "Agricultural films", "Disposable cutlery"],
  },
  {
    id: "additives",
    name: "Bio-Additives",
    fullName: "Biodegradable Processing Additives",
    description: "Special compounds that enhance processing and performance of biodegradable plastics.",
    image: "/raw-materials/additives.jpg",
    properties: [
      "Improve processing",
      "Enhance mechanical properties",
      "Accelerate biodegradation",
      "Maintain biodegradability",
    ],
    applications: ["Processing aid", "Performance enhancement", "Biodegradation control"],
  },
]

export function RawMaterialsShowcase() {
  const [activeTab, setActiveTab] = useState("pbat")

  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Our Raw Materials</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          We use only the highest quality biodegradable raw materials to create sustainable plastic alternatives
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full" aria-label="Raw materials categories">
          {rawMaterials.map((material) => (
            <TabsTrigger key={material.id} value={material.id} className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2">
              {material.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {rawMaterials.map((material) => (
          <TabsContent key={material.id} value={material.id} className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <OptimizedImage
                      src={material.image}
                      alt={`${material.name} (${material.fullName}) raw material sample`}
                      width={500}
                      height={400}
                      className="w-full h-auto object-cover"
                      fallback={
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">{material.name} Image</span>
                        </div>
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">{material.name}</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Info className="h-4 w-4" />
                                <span className="sr-only">More info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{material.fullName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-gray-600 mt-1">{material.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">Key Properties:</h4>
                      <ul className="mt-2 space-y-1">
                        {material.properties.map((property, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{property}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">Applications:</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {material.applications.map((application, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {application}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
