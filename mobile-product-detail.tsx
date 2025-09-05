import { ArrowLeft, Heart, Share2, ShoppingCart } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function MobileProductDetailWireframe() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white p-4 flex items-center justify-between border-b">
        <Link href="#">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-lg font-bold">Product Details</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Favorite</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Product Image Slider */}
        <div className="relative bg-white">
          <div className="aspect-square bg-gray-100"></div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
            <div className="h-2 w-6 rounded-full bg-green-600"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Compostable Filler Master Batch</h2>
              <p className="text-sm text-gray-500 mt-1">CODE: ABP-FMB</p>
            </div>
            <Badge className="bg-green-600">CPCB Certified</Badge>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-green-50">
              Biodegradable
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              Eco-friendly
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              Compostable
            </Badge>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white mt-2">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4">
              <p className="text-sm text-gray-700">
                Our Compostable Filler Master Batch is a high-quality biodegradable plastic alternative made from a
                blend of PBAT and PLA. It offers excellent mechanical properties while being fully compostable and
                environmentally friendly.
              </p>
            </TabsContent>
            <TabsContent value="specifications" className="p-4">
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex justify-between">
                  <span>Material</span>
                  <span className="font-medium">PBAT + PLA</span>
                </li>
                <li className="flex justify-between">
                  <span>Tensile Strength</span>
                  <span className="font-medium">15 MPa</span>
                </li>
                <li className="flex justify-between">
                  <span>Elongation at Break</span>
                  <span className="font-medium">200%</span>
                </li>
                <li className="flex justify-between">
                  <span>Biodegradation</span>
                  <span className="font-medium">91.53%</span>
                </li>
                <li className="flex justify-between">
                  <span>Certification</span>
                  <span className="font-medium">IS 17088:2021</span>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="applications" className="p-4">
              <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                <li>Blow Films</li>
                <li>Carry Bags</li>
                <li>Shopping Bags</li>
                <li>Roll on Bags</li>
                <li>Grocery Bags</li>
                <li>Garbage Bags</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>

        {/* Certifications Section */}
        <div className="bg-white mt-2 p-4">
          <h3 className="font-bold mb-3">Certifications</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            <div className="min-w-[120px] border rounded-md p-2 flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full mb-2"></div>
              <span className="text-xs text-center">CPCB Certified</span>
            </div>
            <div className="min-w-[120px] border rounded-md p-2 flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full mb-2"></div>
              <span className="text-xs text-center">IS 17088:2021</span>
            </div>
            <div className="min-w-[120px] border rounded-md p-2 flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full mb-2"></div>
              <span className="text-xs text-center">ISO 17088:2021</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white mt-2 p-4">
          <h3 className="font-bold mb-3">Related Products</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-md overflow-hidden">
              <div className="aspect-square bg-gray-100"></div>
              <div className="p-2">
                <h4 className="text-xs font-medium">Compostable Natural Filler Master Batch</h4>
                <p className="text-xs text-gray-500 mt-1">CODE: ABP-NFMB</p>
              </div>
            </div>
            <div className="border rounded-md overflow-hidden">
              <div className="aspect-square bg-gray-100"></div>
              <div className="p-2">
                <h4 className="text-xs font-medium">Compostable Pre-Mix Granules</h4>
                <p className="text-xs text-gray-500 mt-1">Custom formulations</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Request Sample
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700">Get Quote</Button>
        </div>
      </div>
    </div>
  )
}
