"use client"

import { useState } from "react"
import { Calculator, Info, Leaf, Droplets, FuelIcon as Oil, Trash2, Car, ShowerHeadIcon as Shower } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AdvancedImpactCalculator() {
  const [productType, setProductType] = useState("bags")
  const [quantity, setQuantity] = useState(100)
  const [frequency, setFrequency] = useState("monthly")
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState(null)

  const calculateImpact = async () => {
    setIsCalculating(true)

    try {
      const response = await fetch("/api/impact-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType, quantity, frequency }),
      })

      if (!response.ok) {
        throw new Error("Failed to calculate impact")
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error calculating impact:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Environmental Impact Calculator
        </CardTitle>
        <CardDescription>Calculate the environmental impact of switching to compostable plastics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="about">About the Data</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="product-type">Product Type</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">Select the type of plastic product you're currently using</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger id="product-type">
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bags">Plastic Bags</SelectItem>
                    <SelectItem value="packaging">Food Packaging</SelectItem>
                    <SelectItem value="films">Plastic Films</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quantity">Quantity</Label>
                  <span className="text-sm text-gray-500">{quantity} units</span>
                </div>
                <Slider
                  id="quantity"
                  min={1}
                  max={1000}
                  step={1}
                  value={[quantity]}
                  onValueChange={(value) => setQuantity(value[0])}
                  className="py-4"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min={1}
                    max={10000}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">units</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Usage Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">One-time purchase</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="about" className="pt-4">
            <div className="space-y-4 text-sm">
              <p>
                This calculator provides an estimate of the environmental impact of switching from conventional plastics
                to AICMT's compostable alternatives.
              </p>
              <p>
                The calculations are based on industry research and lifecycle assessment studies. The actual
                environmental impact may vary based on specific usage patterns, disposal methods, and other factors.
              </p>
              <h4 className="font-medium mt-4">Calculation Methodology:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  CO₂ Savings: Based on the difference in carbon footprint between conventional and compostable plastics
                </li>
                <li>
                  Waste Reduction: Calculated from the weight of plastic waste that would otherwise end up in landfills
                </li>
                <li>Oil Savings: Estimated from the petroleum typically used in conventional plastic production</li>
                <li>
                  Water Usage: Comparison of water consumption in the production of conventional vs. compostable
                  plastics
                </li>
                <li>Equivalents: Conversion of environmental metrics to relatable real-world examples</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button onClick={calculateImpact} className="w-full bg-green-600 hover:bg-green-700" disabled={isCalculating}>
          {isCalculating ? "Calculating..." : "Calculate Impact"}
        </Button>

        {results && (
          <div className="mt-6 w-full">
            <h3 className="font-medium text-center mb-4">Your Environmental Impact</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{results.savings.co2.toFixed(2)} kg</p>
                <p className="text-sm text-gray-600">CO₂ Emissions Saved</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  <Trash2 className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{results.savings.waste.toFixed(2)} kg</p>
                <p className="text-sm text-gray-600">Plastic Waste Reduced</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  <Oil className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{results.savings.oil.toFixed(2)} L</p>
                <p className="text-sm text-gray-600">Petroleum Oil Saved</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{results.savings.water.toFixed(2)} L</p>
                <p className="text-sm text-gray-600">Water Usage Difference</p>
              </div>
            </div>

            <h4 className="font-medium text-center mb-3">Real-World Equivalents</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-3 rounded-lg flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{results.equivalents.treesPlanted}</p>
                  <p className="text-sm text-gray-600">Trees Planted Equivalent</p>
                </div>
              </div>
              <div className="border p-3 rounded-lg flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Trash2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{results.equivalents.plasticBottles}</p>
                  <p className="text-sm text-gray-600">Plastic Bottles Saved</p>
                </div>
              </div>
              <div className="border p-3 rounded-lg flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{results.equivalents.carMiles}</p>
                  <p className="text-sm text-gray-600">Car Miles Equivalent</p>
                </div>
              </div>
              <div className="border p-3 rounded-lg flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Shower className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{results.equivalents.showerMinutes}</p>
                  <p className="text-sm text-gray-600">Minutes of Shower</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
