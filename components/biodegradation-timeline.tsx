"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Timeline data
const timelineData = [
  {
    day: 0,
    title: "Initial State",
    description: "The compostable plastic product in its original form before composting begins.",
    image: "/placeholder.svg?height=300&width=400&query=new compostable plastic bag",
  },
  {
    day: 30,
    title: "Early Degradation",
    description:
      "After 30 days, the material begins to show signs of degradation with visible changes in structure and integrity.",
    image: "/placeholder.svg?height=300&width=400&query=partially degraded plastic",
  },
  {
    day: 60,
    title: "Fragmentation",
    description: "By day 60, the product has fragmented into smaller pieces as the polymer chains break down.",
    image: "/placeholder.svg?height=300&width=400&query=fragmented biodegradable plastic",
  },
  {
    day: 90,
    title: "Advanced Degradation",
    description:
      "At 90 days, significant degradation has occurred with the material losing most of its original structure.",
    image: "/placeholder.svg?height=300&width=400&query=advanced biodegradation",
  },
  {
    day: 120,
    title: "Near Complete Biodegradation",
    description: "By 120 days, the product is nearly completely biodegraded, with only small fragments remaining.",
    image: "/placeholder.svg?height=300&width=400&query=almost completely biodegraded plastic",
  },
  {
    day: 180,
    title: "Complete Biodegradation",
    description:
      "After 180 days, the product has completely biodegraded into carbon dioxide, water, and biomass, leaving no visible traces or microplastics.",
    image: "/placeholder.svg?height=300&width=400&query=rich compost soil",
  },
]

export function BiodegradationTimeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = timelineData[activeIndex]

  const goToNext = () => {
    setActiveIndex((current) => (current === timelineData.length - 1 ? 0 : current + 1))
  }

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? timelineData.length - 1 : current - 1))
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Biodegradation Timeline</h2>
        <p className="text-gray-500 mt-2">See how our compostable plastics break down over time</p>
      </div>

      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">Visual Timeline</TabsTrigger>
          <TabsTrigger value="technical">Technical Process</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="pt-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={activeItem.image || "/placeholder.svg"}
                        alt={activeItem.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{activeItem.title}</h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Day {activeItem.day}
                      </span>
                    </div>
                    <p className="text-gray-600">{activeItem.description}</p>
                  </div>
                </div>

                {/* Navigation buttons */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-white shadow-md border-gray-200 z-10"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white shadow-md border-gray-200 z-10"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>

              {/* Timeline bar */}
              <div className="mt-8">
                <div className="relative pt-8">
                  <div className="h-1 w-full bg-gray-200 rounded-full">
                    <div
                      className="h-1 bg-green-600 rounded-full"
                      style={{ width: `${(activeIndex / (timelineData.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    {timelineData.map((item, index) => (
                      <button
                        key={index}
                        className={`w-6 h-6 rounded-full flex items-center justify-center -mt-5 relative ${
                          index <= activeIndex ? "bg-green-600 text-white" : "bg-gray-200"
                        }`}
                        onClick={() => setActiveIndex(index)}
                      >
                        <span className="absolute -bottom-6 text-xs whitespace-nowrap">Day {item.day}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="pt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">The Science of Biodegradation</h3>
                  <p>
                    Biodegradation is the process by which organic substances are broken down by microorganisms such as
                    bacteria and fungi. For compostable plastics, this process involves several stages:
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium mb-2">1. Deterioration</h4>
                    <p className="text-sm">
                      The initial stage involves physical breakdown due to environmental factors like heat, moisture,
                      and UV radiation. This weakens the polymer structure and increases the surface area for microbial
                      attack.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium mb-2">2. Fragmentation</h4>
                    <p className="text-sm">
                      The polymer chains begin to break down into smaller fragments through processes like hydrolysis,
                      where water molecules break the chemical bonds in the plastic.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium mb-2">3. Assimilation</h4>
                    <p className="text-sm">
                      Microorganisms consume the small fragments and convert them into simpler compounds that can be
                      metabolized by the microbes.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium mb-2">4. Mineralization</h4>
                    <p className="text-sm">
                      The final stage where the plastic is completely converted into carbon dioxide, water, and biomass,
                      leaving no toxic residues or microplastics.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Environmental Factors</h3>
                  <p>Several environmental factors affect the biodegradation rate of compostable plastics:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <span className="font-medium">Temperature:</span> Higher temperatures (50-60°C) in industrial
                      composting accelerate the biodegradation process.
                    </li>
                    <li>
                      <span className="font-medium">Moisture:</span> Adequate moisture is essential for microbial
                      activity and hydrolysis reactions.
                    </li>
                    <li>
                      <span className="font-medium">Microbial Diversity:</span> A diverse population of microorganisms
                      ensures efficient breakdown of different polymer components.
                    </li>
                    <li>
                      <span className="font-medium">Oxygen Levels:</span> Aerobic conditions promote faster and more
                      complete biodegradation.
                    </li>
                    <li>
                      <span className="font-medium">pH Levels:</span> Neutral to slightly acidic conditions (pH 5.5-8)
                      are optimal for microbial activity.
                    </li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-green-100 rounded-lg">
                  <h4 className="font-medium mb-2">AICMT's Compostable Plastics</h4>
                  <p className="text-sm">
                    Our products are designed to biodegrade completely within 180 days in industrial composting
                    conditions, meeting the requirements of IS 17088:2021 and international standards. Through careful
                    material selection and formulation, we ensure that our products break down efficiently while
                    maintaining the performance characteristics needed during their useful life.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
