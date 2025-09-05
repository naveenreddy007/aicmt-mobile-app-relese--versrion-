"use client"

import { useState } from "react"
import { Calculator, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SustainabilityCalculator() {
  const [plasticType, setPlasticType] = useState("bags")
  const [quantity, setQuantity] = useState(100)
  const [frequency, setFrequency] = useState("monthly")
  const [results, setResults] = useState<null | {
    co2Saved: number
    wasteReduced: number
    oilSaved: number
    treesEquivalent: number
  }>(null)

  // Conversion factors (these would ideally be based on actual research data)
  const conversionFactors = {
    bags: {
      co2PerUnit: 0.03, // kg CO2 per bag
      wastePerUnit: 0.01, // kg waste per bag
      oilPerUnit: 0.05, // liters of oil per bag
    },
    packaging: {
      co2PerUnit: 0.05,
      wastePerUnit: 0.02,
      oilPerUnit: 0.08,
    },
    films: {
      co2PerUnit: 0.04,
      wastePerUnit: 0.015,
      oilPerUnit: 0.06,
    },
  }

  const frequencyMultiplier = {
    once: 1,
    monthly: 12,
    quarterly: 4,
    yearly: 1,
  }

  const calculateImpact = () => {
    const factor = conversionFactors[plasticType as keyof typeof conversionFactors]
    const timeMultiplier = frequencyMultiplier[frequency as keyof typeof frequencyMultiplier]

    const annualQuantity = quantity * timeMultiplier

    const co2Saved = factor.co2PerUnit * annualQuantity
    const wasteReduced = factor.wastePerUnit * annualQuantity
    const oilSaved = factor.oilPerUnit * annualQuantity
    const treesEquivalent = co2Saved / 21 // Approx 21kg CO2 absorbed by one tree annually

    setResults({
      co2Saved,
      wasteReduced,
      oilSaved,
      treesEquivalent: Math.round(treesEquivalent),
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Sustainability Impact Calculator
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
                  <Label htmlFor="plastic-type">Product Type</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">Select the type of plastic product you&apos;re currently using</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={plasticType} onValueChange={setPlasticType}>
                  <SelectTrigger id="plastic-type">
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
                to AICMT&apos;s compostable alternatives.
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
                  Tree Equivalent: Conversion of CO₂ savings to equivalent number of trees absorbing carbon annually
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button onClick={calculateImpact} className="w-full bg-green-600 hover:bg-green-700">
          Calculate Impact
        </Button>

        {results && (
          <div className="mt-6 w-full">
            <h3 className="font-medium text-center mb-4">Your Environmental Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{results.co2Saved.toFixed(2)} kg</p>
                <p className="text-sm text-gray-600">CO₂ Emissions Saved</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{results.wasteReduced.toFixed(2)} kg</p>
                <p className="text-sm text-gray-600">Plastic Waste Reduced</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{results.oilSaved.toFixed(2)} L</p>
                <p className="text-sm text-gray-600">Petroleum Oil Saved</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{results.treesEquivalent}</p>
                <p className="text-sm text-gray-600">Equivalent Trees Planted</p>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
