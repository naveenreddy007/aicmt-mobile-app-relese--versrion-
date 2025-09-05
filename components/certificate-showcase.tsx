"use client"

import { useState } from "react"
import { FileText, Download, ZoomIn, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OptimizedImage } from "@/components/optimized-image"

// Certificate data
const certificates = [
  {
    id: "cpcb",
    title: "CPCB Certificate",
    description: "Central Pollution Control Board certification for compostable plastics",
    image: "/green-leaf-certificate.png",
    issueDate: "March 21, 2023",
    validUntil: "March 20, 2025",
    certNumber: "CPCB/PBAT-PLA/2023/01",
    downloadUrl: "#",
  },
  {
    id: "cipet",
    title: "CIPET Test Report",
    description: "Central Institute of Petrochemicals Engineering & Technology test results",
    image: "/biodegradable-testing.png",
    issueDate: "March 21, 2023",
    validUntil: "March 20, 2025",
    certNumber: "TR.NO.: 002987(S)",
    downloadUrl: "#",
  },
  {
    id: "msme",
    title: "MSME ZED Bronze",
    description: "Ministry of Micro, Small & Medium Enterprises Zero Defect Zero Effect certification",
    image: "/green-leaf-certificate.png", // Replace with actual MSME certificate
    issueDate: "April 15, 2023",
    validUntil: "April 14, 2025",
    certNumber: "MSME-ZED/2023/BR/0123",
    downloadUrl: "#",
  },
]

export function CertificateShowcase() {
  const [activeTab, setActiveTab] = useState("cpcb")
  const [showModal, setShowModal] = useState(false)
  const [modalImage, setModalImage] = useState("")

  const openModal = (image: string) => {
    setModalImage(image)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Our Certifications</h2>
        <p className="text-gray-500 mt-2">Verified and certified by recognized authorities</p>
      </div>

      <Tabs defaultValue="cpcb" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {certificates.map((cert) => (
            <TabsTrigger key={cert.id} value={cert.id}>
              {cert.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {certificates.map((cert) => (
          <TabsContent key={cert.id} value={cert.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  {cert.title}
                </CardTitle>
                <CardDescription>{cert.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div
                    className="relative border rounded-md overflow-hidden cursor-pointer group"
                    onClick={() => openModal(cert.image)}
                  >
                    <OptimizedImage
                      src={cert.image}
                      alt={cert.title}
                      width={400}
                      height={560}
                      className="w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white rounded-full p-2">
                        <ZoomIn className="h-5 w-5 text-gray-700" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Certificate Number:</div>
                      <div>{cert.certNumber}</div>

                      <div className="font-medium">Issue Date:</div>
                      <div>{cert.issueDate}</div>

                      <div className="font-medium">Valid Until:</div>
                      <div>{cert.validUntil}</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">What this certification means:</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Our products meet stringent quality and safety standards</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Verified biodegradability and compostability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Compliance with environmental regulations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Regular audits ensure consistent quality</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="flex gap-2 bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                closeModal()
              }}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="max-h-[90vh] overflow-auto">
              <OptimizedImage
                src={modalImage}
                alt="Certificate full view"
                width={800}
                height={1120}
                className="w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
