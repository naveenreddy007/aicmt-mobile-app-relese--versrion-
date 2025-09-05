import { ArrowLeft, Filter, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MobileProductCatalogWireframe() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="#">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Products</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="h-5 w-5" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-4 flex items-center gap-2">
          <Input placeholder="Search products..." className="flex-1" />
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 whitespace-nowrap bg-green-50">
            All Products
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 whitespace-nowrap">
            Granules
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 whitespace-nowrap">
            Carry Bags
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 whitespace-nowrap">
            Food Packaging
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 whitespace-nowrap">
            Garbage Bags
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Product Card 1 */}
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-600">New</Badge>
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2">Compostable Filler Master Batch</h3>
              <p className="text-xs text-gray-500 mt-1">CODE: ABP-FMB</p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button size="sm" className="w-full text-xs">
                View Details
              </Button>
            </CardFooter>
          </Card>

          {/* Product Card 2 */}
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gray-100"></div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2">Compostable Natural Filler Master Batch</h3>
              <p className="text-xs text-gray-500 mt-1">CODE: ABP-NFMB</p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button size="sm" className="w-full text-xs">
                View Details
              </Button>
            </CardFooter>
          </Card>

          {/* Product Card 3 */}
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gray-100"></div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2">Compostable Carry Bags</h3>
              <p className="text-xs text-gray-500 mt-1">Multiple sizes</p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button size="sm" className="w-full text-xs">
                View Details
              </Button>
            </CardFooter>
          </Card>

          {/* Product Card 4 */}
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gray-100"></div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2">Compostable Garbage Bags</h3>
              <p className="text-xs text-gray-500 mt-1">Eco-friendly</p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button size="sm" className="w-full text-xs">
                View Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-white border-t p-2">
        <div className="grid grid-cols-4 gap-1">
          <Button variant="ghost" className="flex flex-col items-center py-2 h-auto">
            <svg className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-2 h-auto bg-gray-100">
            <svg className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="text-xs">Products</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-2 h-auto">
            <svg className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xs">Certifications</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-2 h-auto">
            <svg className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Contact</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
