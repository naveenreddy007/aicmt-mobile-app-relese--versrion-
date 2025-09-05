"use client"

import { Check, X } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ProductComparison() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Product Comparison</h2>
        <p className="text-gray-500 mt-2">Compare our compostable plastics with conventional alternatives</p>
      </div>

      <Tabs defaultValue="bags" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bags">Carry Bags</TabsTrigger>
          <TabsTrigger value="packaging">Food Packaging</TabsTrigger>
          <TabsTrigger value="films">Films & Wraps</TabsTrigger>
        </TabsList>

        <TabsContent value="bags" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compostable vs. Conventional Carry Bags</CardTitle>
              <CardDescription>See how our compostable carry bags compare to conventional plastic bags</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Feature</TableHead>
                    <TableHead>AICMT Compostable Bags</TableHead>
                    <TableHead>Conventional Plastic Bags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Raw Materials</TableCell>
                    <TableCell>PBAT + PLA (plant-based and fossil sources)</TableCell>
                    <TableCell>Polyethylene (fossil fuel-based)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">End of Life</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Fully biodegradable within 180 days
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        Persists for 500+ years, creates microplastics
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Strength</TableCell>
                    <TableCell>Comparable to conventional plastic</TableCell>
                    <TableCell>High tensile strength</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Water Resistance</TableCell>
                    <TableCell>Good water resistance during use</TableCell>
                    <TableCell>Excellent water resistance</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Heat Resistance</TableCell>
                    <TableCell>Up to 65°C</TableCell>
                    <TableCell>Up to 120°C</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Shelf Life</TableCell>
                    <TableCell>12-18 months</TableCell>
                    <TableCell>Several years</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Environmental Impact</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Low environmental impact, returns to nature
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        High environmental impact, pollution
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Carbon Footprint</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        30% lower carbon footprint
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        Higher carbon footprint
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Regulatory Compliance</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Complies with plastic bans and regulations
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        Banned in many regions
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cost</TableCell>
                    <TableCell>Slightly higher initial cost</TableCell>
                    <TableCell>Lower initial cost</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Printability</TableCell>
                    <TableCell>Good printability with eco-friendly inks</TableCell>
                    <TableCell>Excellent printability</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packaging" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compostable vs. Conventional Food Packaging</CardTitle>
              <CardDescription>Compare our compostable food packaging with traditional alternatives</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Feature</TableHead>
                    <TableHead>AICMT Compostable Packaging</TableHead>
                    <TableHead>Conventional Plastic Packaging</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Raw Materials</TableCell>
                    <TableCell>PBAT + PLA (plant-based and fossil sources)</TableCell>
                    <TableCell>PP, PS, PET (fossil fuel-based)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">End of Life</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Fully biodegradable within 180 days
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        Persists for hundreds of years
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Food Safety</TableCell>
                    <TableCell>Certified food-safe, no harmful chemicals</TableCell>
                    <TableCell>Food-safe but may contain BPA or phthalates</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Heat Resistance</TableCell>
                    <TableCell>Up to 85°C</TableCell>
                    <TableCell>Varies by type (70-220°C)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Oil/Grease Resistance</TableCell>
                    <TableCell>Good resistance to oils and greases</TableCell>
                    <TableCell>Excellent resistance to oils and greases</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Transparency</TableCell>
                    <TableCell>Available in transparent options</TableCell>
                    <TableCell>Excellent transparency options</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Shelf Life</TableCell>
                    <TableCell>12-18 months</TableCell>
                    <TableCell>Several years</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Waste Management</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Can be composted with food waste
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        Food contamination makes recycling difficult
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Environmental Impact</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Low environmental impact
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        High environmental impact
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cost</TableCell>
                    <TableCell>Moderately higher cost</TableCell>
                    <TableCell>Lower cost</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="films" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compostable vs. Conventional Films & Wraps</CardTitle>
              <CardDescription>See how our compostable films compare to traditional plastic films</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Feature</TableHead>
                    <TableHead>AICMT Compostable Films</TableHead>
                    <TableHead>Conventional Plastic Films</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Raw Materials</TableCell>
                    <TableCell>PBAT + PLA blend</TableCell>
                    <TableCell>LDPE, HDPE, PVC (fossil fuel-based)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">End of Life</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Fully biodegradable within 180 days
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        Persists for hundreds of years
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tensile Strength</TableCell>
                    <TableCell>Good (15 MPa)</TableCell>
                    <TableCell>Excellent (20-40 MPa)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Elongation at Break</TableCell>
                    <TableCell>200%</TableCell>
                    <TableCell>300-600%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Transparency</TableCell>
                    <TableCell>Good transparency options available</TableCell>
                    <TableCell>Excellent transparency</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Barrier Properties</TableCell>
                    <TableCell>Moderate oxygen and moisture barrier</TableCell>
                    <TableCell>Excellent barrier properties</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Heat Sealability</TableCell>
                    <TableCell>Good heat sealing properties</TableCell>
                    <TableCell>Excellent heat sealing properties</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">UV Resistance</TableCell>
                    <TableCell>Limited UV resistance</TableCell>
                    <TableCell>Can be formulated for high UV resistance</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Environmental Impact</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Low environmental impact
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        High environmental impact
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Regulatory Compliance</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        Complies with plastic regulations
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4" />
                        Increasingly restricted by regulations
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cost</TableCell>
                    <TableCell>Higher cost</TableCell>
                    <TableCell>Lower cost</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
