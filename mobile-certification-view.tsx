import { ArrowLeft, Download, FileText } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MobileCertificationViewWireframe() {
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
        <h1 className="text-lg font-bold">CPCB Certification</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Download className="h-5 w-5" />
          <span className="sr-only">Download</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="aspect-[3/4] bg-gray-100 mb-4 rounded-md"></div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="font-bold">CPCB Certificate</h2>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Valid</span>
              </div>
              <p className="text-sm text-gray-500">
                Certificate Number: AICMT INTERNATIONAL PRIVATE LIMITED/Telangana/578
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Issued Date:</span>
                <span>15 Jan 2023</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Valid Until:</span>
                <span>14 Jan 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="standards">Standards</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium mb-2">Certificate Description</h3>
                <p className="text-sm text-gray-700">
                  This certificate confirms that AICMT International Pvt. Ltd. is authorized to manufacture compostable
                  plastic products in accordance with the Plastic Waste Management Rules. The certification verifies
                  that the products meet the required standards for biodegradability and compostability.
                </p>
              </div>

              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium mb-2">Issuing Authority</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md"></div>
                  <div>
                    <p className="text-sm font-medium">Central Pollution Control Board</p>
                    <p className="text-xs text-gray-500">
                      Ministry of Environment, Forest & Climate Change, Govt. of India
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium mb-2">Authorized Products</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span>Compostable Filler Master Batch (ABP-FMB)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span>Compostable Natural Filler Master Batch (ABP-NFMB)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span>Compostable Pre-Mix Granules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span>Compostable Carry Bags</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testing" className="mt-4">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium mb-2">Testing Summary</h3>
                <p className="text-sm text-gray-700 mb-3">
                  The products have undergone rigorous testing to verify their biodegradability, compostability, and
                  environmental safety.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Biodegradation Rate:</span>
                    <span className="font-medium">91.53%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "91.53%" }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium mb-2">Physical Properties</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Thickness:</span>
                    <span>100 μm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tensile Strength:</span>
                    <span>15 MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Elongation at Break:</span>
                    <span>200%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium mb-2">Chemical Properties</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Heavy Metals:</span>
                    <span className="text-green-600">Pass</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Disintegration:</span>
                    <span className="text-green-600">Pass</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ecotoxicity:</span>
                    <span className="text-green-600">Pass</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compostability:</span>
                    <span className="text-green-600">Pass</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="standards" className="mt-4">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium mb-2">Compliance Standards</h3>
                <ul className="text-sm space-y-3">
                  <li className="space-y-1">
                    <p className="font-medium">IS 17088:2021</p>
                    <p className="text-gray-700">
                      Indian Standard for specifications and testing methods for compostable plastics
                    </p>
                  </li>
                  <li className="space-y-1">
                    <p className="font-medium">ISO 17088:2021</p>
                    <p className="text-gray-700">International standard for compostable plastics</p>
                  </li>
                  <li className="space-y-1">
                    <p className="font-medium">Plastic Waste Management Rules</p>
                    <p className="text-gray-700">Indian government regulations for plastic waste management</p>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium mb-2">Regulatory Framework</h3>
                <p className="text-sm text-gray-700 mb-3">
                  The certification is issued under the following regulatory framework:
                </p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>Environment (Protection) Act, 1986</li>
                  <li>Plastic Waste Management Rules, 2016 (as amended)</li>
                  <li>Extended Producer Responsibility (EPR) guidelines</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      </div>
    </div>
  )
}
