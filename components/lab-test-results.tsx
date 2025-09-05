"use client"

import { useState } from "react"
import { FileText, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OptimizedImage } from "@/components/optimized-image"

// Test result data from the CIPET report
const testResults = [
  {
    id: "biodegradation",
    title: "Biodegradation Test",
    description: "Results showing biodegradation rate over time",
    results: [
      { parameter: "Biodegradation Rate", value: "91.53%", requirement: "≥90% relative to cellulose" },
      { parameter: "Test Duration", value: "180 days", requirement: "As per IS 17088:2021" },
      { parameter: "Test Method", value: "ISO 17088:2021", requirement: "Standard test method" },
    ],
    images: ["/biodegradation-progress.png"],
    conclusion: "The sample is biodegradable and meets the requirements of IS 17088:2021.",
  },
  {
    id: "ecotoxicity",
    title: "Ecotoxicity Test",
    description: "Plant growth and earthworm survival tests",
    results: [
      { parameter: "Seed Emergence (Monocotyledon)", value: "92%", requirement: ">90% of control" },
      { parameter: "Seed Emergence (Dicotyledon)", value: "92%", requirement: ">90% of control" },
      { parameter: "Earthworm Survival (14 days)", value: ">90%", requirement: ">90% of control" },
      { parameter: "Earthworm Offspring (56 days)", value: ">90%", requirement: ">90% of control" },
    ],
    images: ["/biodegradable-testing.png"],
    conclusion: "The compost produced from the sample is non-toxic to plants and soil organisms.",
  },
  {
    id: "heavy-metals",
    title: "Heavy Metals Analysis",
    description: "Testing for harmful substances",
    results: [
      { parameter: "Lead (Pb)", value: "1.3654 mg/L", requirement: "<100 mg/L" },
      { parameter: "Cadmium (Cd)", value: "1.2245 mg/L", requirement: "<5 mg/L" },
      { parameter: "Mercury (Hg)", value: "0.0102 mg/L", requirement: "<0.15 mg/L" },
      { parameter: "Chromium (Cr)", value: "0.6723 mg/L", requirement: "<50 mg/L" },
      { parameter: "Arsenic (As)", value: "0.0334 mg/L", requirement: "<10 mg/L" },
      { parameter: "Copper (Cu)", value: "1.5732 mg/L", requirement: "<300 mg/L" },
      { parameter: "Nickel (Ni)", value: "0.6821 mg/L", requirement: "<50 mg/L" },
      { parameter: "Zinc (Zn)", value: "1.2923 mg/L", requirement: "<1000 mg/L" },
    ],
    images: [],
    conclusion: "The sample contains heavy metals well below the permissible limits.",
  },
]

export function LabTestResults() {
  const [activeTab, setActiveTab] = useState("biodegradation")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    biodegradation: true,
    ecotoxicity: false,
    "heavy-metals": false,
  })

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Laboratory Test Results</h2>
        <p className="text-gray-500 mt-2">Scientific evidence of our products&apos; compostability and safety</p>
      </div>

      <Tabs defaultValue="biodegradation" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {testResults.map((test) => (
            <TabsTrigger key={test.id} value={test.id}>
              {test.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {testResults.map((test) => (
          <TabsContent key={test.id} value={test.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  {test.title}
                </CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Test Results Table */}
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer py-2 border-b"
                      onClick={() => toggleSection(`${test.id}-results`)}
                    >
                      <h3 className="font-medium">Detailed Test Results</h3>
                      {expandedSections[`${test.id}-results`] ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>

                    {expandedSections[`${test.id}-results`] && (
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Parameter
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Result
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Requirement
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {test.results.map((result, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm text-gray-900">{result.parameter}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{result.value}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{result.requirement}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Pass
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Test Images */}
                  {test.images.length > 0 && (
                    <div>
                      <div
                        className="flex items-center justify-between cursor-pointer py-2 border-b"
                        onClick={() => toggleSection(`${test.id}-images`)}
                      >
                        <h3 className="font-medium">Test Images & Graphs</h3>
                        {expandedSections[`${test.id}-images`] ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>

                      {expandedSections[`${test.id}-images`] && (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {test.images.map((image, index) => (
                            <div key={index} className="border rounded-md overflow-hidden">
                              <OptimizedImage
                                src={image}
                                alt={`${test.title} test image ${index + 1}`}
                                width={400}
                                height={300}
                                className="w-full object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Conclusion */}
                  <div className="bg-green-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Conclusion:</h4>
                    <p>{test.conclusion}</p>
                  </div>

                  {/* Testing Authority */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-3">
                      <OptimizedImage
                        src="/cipet-logo.png"
                        alt="CIPET Logo"
                        width={60}
                        height={60}
                        className="h-10 w-10 object-contain"
                        fallback={
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-500" />
                          </div>
                        }
                      />
                      <div>
                        <p className="font-medium text-sm">Tested by:</p>
                        <p className="text-xs text-gray-500">
                          Central Institute of Petrochemicals Engineering & Technology
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Test Report No.: 002987(S)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
