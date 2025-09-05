"use client"

import { useState, useEffect } from "react"
import { Leaf, Droplet, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function SustainabilityImpactCounter() {
  // These would be fetched from your database in a real implementation
  const [plasticSaved, setPlasticSaved] = useState(0)
  const [waterSaved, setWaterSaved] = useState(0)
  const [co2Reduced, setCo2Reduced] = useState(0)

  // Simulate counter animation
  useEffect(() => {
    const targetPlastic = 25000 // kg
    const targetWater = 1250000 // liters
    const targetCo2 = 75000 // kg

    const duration = 2000 // ms
    const steps = 50
    const interval = duration / steps

    const plasticIncrement = targetPlastic / steps
    const waterIncrement = targetWater / steps
    const co2Increment = targetCo2 / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++

      setPlasticSaved(Math.min(Math.round(plasticIncrement * currentStep), targetPlastic))
      setWaterSaved(Math.min(Math.round(waterIncrement * currentStep), targetWater))
      setCo2Reduced(Math.min(Math.round(co2Increment * currentStep), targetCo2))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className="w-full py-12 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Our Environmental Impact</h2>
          <p className="text-gray-600 mt-2">Together with our customers, we&apos;re making a difference</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Trash2 className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">{formatNumber(plasticSaved)} kg</div>
                <h3 className="text-lg font-medium mb-1">Plastic Waste Prevented</h3>
                <p className="text-sm text-gray-500">Traditional plastic kept out of landfills and oceans</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Droplet className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">{formatNumber(waterSaved)} L</div>
                <h3 className="text-lg font-medium mb-1">Water Resources Saved</h3>
                <p className="text-sm text-gray-500">Compared to traditional plastic production processes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">{formatNumber(co2Reduced)} kg</div>
                <h3 className="text-lg font-medium mb-1">CO₂ Emissions Reduced</h3>
                <p className="text-sm text-gray-500">Lower carbon footprint through sustainable practices</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Environmental impact calculations based on industry standards and production data.</p>
          <p>Updated monthly to reflect our growing positive impact.</p>
        </div>
      </div>
    </div>
  )
}
