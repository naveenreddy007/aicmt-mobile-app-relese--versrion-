"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OptimizedImage } from "@/components/optimized-image"

export function CertificationVerifier() {
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationResult, setVerificationResult] = useState<null | {
    valid: boolean
    product?: string
    certificateNumber?: string
    issuedDate?: string
    expiryDate?: string
  }>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  // This would connect to your actual database in production
  const handleVerify = () => {
    setIsVerifying(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Demo verification - in production, this would check against your database
      if (verificationCode.startsWith("AICMT") || verificationCode.startsWith("CP")) {
        setVerificationResult({
          valid: true,
          product: "Compostable Carry Bags",
          certificateNumber: "CPCB/PBAT-PLA/2023/01",
          issuedDate: "21-03-2023",
          expiryDate: "20-03-2025",
        })
      } else {
        setVerificationResult({
          valid: false,
        })
      }
      setIsVerifying(false)
    }, 1500)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-green-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Product Authenticity</CardTitle>
          <CardDescription>
            Enter the verification code from your AICMT product to confirm its authenticity and certification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="verification-code" className="text-sm font-medium">
                Verification Code
              </label>
              <div className="flex gap-2">
                <Input
                  id="verification-code"
                  placeholder="e.g., AICMT-2023-12345 or CP-2023-67890"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleVerify}
                  disabled={!verificationCode || isVerifying}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                  {!isVerifying && <Search className="ml-2 h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                The verification code can be found on the product packaging or certificate
              </p>
            </div>

            {verificationResult && (
              <div className={`rounded-lg p-4 ${verificationResult.valid ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-center gap-3 mb-3">
                  {verificationResult.valid ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <h3 className="font-bold text-green-700">Authentic AICMT Product</h3>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-6 w-6 text-red-600" />
                      <h3 className="font-bold text-red-700">Unverified Product</h3>
                    </>
                  )}
                </div>

                {verificationResult.valid ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Product:</div>
                      <div>{verificationResult.product}</div>

                      <div className="font-medium">Certificate Number:</div>
                      <div>{verificationResult.certificateNumber}</div>

                      <div className="font-medium">Issued Date:</div>
                      <div>{verificationResult.issuedDate}</div>

                      <div className="font-medium">Valid Until:</div>
                      <div>{verificationResult.expiryDate}</div>
                    </div>

                    <div className="flex items-center justify-center mt-4">
                      <OptimizedImage
                        src="/green-leaf-certificate.png"
                        alt="CPCB Certificate Thumbnail"
                        width={100}
                        height={140}
                        className="border rounded-md"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">
                    We couldn't verify this product. Please check the verification code and try again, or contact our
                    customer support for assistance.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col text-center text-sm text-gray-500 border-t p-4">
          <p>All authentic AICMT products have a unique verification code.</p>
          <p>
            If you suspect a counterfeit product, please report it to{" "}
            <span className="font-medium">info@aicmtinternational.com</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
