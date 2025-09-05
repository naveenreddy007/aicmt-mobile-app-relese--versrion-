"use client"

import { ArrowLeft, CheckCircle, ExternalLink, Shield, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/use-language"
import { LanguageMeta } from "@/components/language-meta"
import { OptimizedImage } from "@/components/optimized-image"
import { getActiveCertificates, type Certificate } from "@/app/actions/certificates"
import { toast } from "sonner"

export default function CertificationPage() {
  const { t } = useLanguage()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  async function fetchCertificates() {
    try {
      const data = await getActiveCertificates()
      setCertificates(data)
    } catch (error) {
      console.error("Error fetching certificates:", error)
      toast.error("Failed to load certificates")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <LanguageMeta pageName="certification" />

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.backToHome")}
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("certification.title")}</h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl">{t("certification.subtitle")}</p>
        </div>

        <Tabs defaultValue="certifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="certifications" className="pt-6">
            {loading ? (
              <div className="grid gap-8">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-gray-200 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Available</h3>
                <p className="text-gray-500">There are currently no active certificates to display.</p>
              </div>
            ) : (
              <div className="grid gap-8">
                {certificates.map((certificate) => (
                  <Card key={certificate.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-green-600" />
                        {certificate.title}
                      </CardTitle>
                      <CardDescription>{certificate.issuing_authority}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                          <p className="text-gray-600 mb-4">{certificate.description}</p>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">Certificate Number:</span>
                              <Badge variant="outline">{certificate.certificate_number}</Badge>
                            </div>
                            
                            {certificate.issue_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">Issue Date:</span>
                                <span className="text-sm">{format(new Date(certificate.issue_date), "MMM dd, yyyy")}</span>
                              </div>
                            )}
                            
                            {certificate.expiry_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">Expiry Date:</span>
                                <span className="text-sm">{format(new Date(certificate.expiry_date), "MMM dd, yyyy")}</span>
                              </div>
                            )}
                          </div>
                          
                          {certificate.document_url && (
                            <Button asChild variant="outline" className="gap-2">
                              <a href={certificate.document_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                View Certificate
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        {certificate.image_url && (
                          <div className="rounded-lg overflow-hidden border">
                            <OptimizedImage
                              src={certificate.image_url}
                              alt={`${certificate.title} Certificate`}
                              width={400}
                              height={300}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="verification" className="pt-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Verify Product Authenticity</h2>
                <p className="text-gray-600">
                  Use the official CPCB verification portal to verify the authenticity of our compostable plastic
                  products.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-2">Official CPCB Verification Portal</h3>
                      <p className="text-gray-600 mb-4">
                        Click the link below to access the Central Pollution Control Board's official verification
                        dashboard where you can verify our product certifications.
                      </p>
                      <Button asChild className="gap-2">
                        <a
                          href="https://plastic.cpcb.gov.in/compostable/viewdashboardlist"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Verify on CPCB Portal
                        </a>
                      </Button>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-2">How to verify:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                        <li>Click on the CPCB verification link above</li>
                        <li>Search for "AICMT International" in the company list</li>
                        <li>View our certified product details and validity</li>
                        <li>Check the certification status and compliance information</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <h3 className="font-bold mb-2">Need Help with Verification?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you need assistance with product verification or have questions about our certifications, please
                  contact our customer support team.
                </p>
                <Link href="/contact">
                  <Button variant="outline">Contact Support</Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
