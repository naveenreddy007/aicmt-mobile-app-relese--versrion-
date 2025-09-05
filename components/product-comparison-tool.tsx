"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

// Product comparison data as requested
const comparisonData = {
  headers: ["Feature", "AICMT Biodegradable & Compostable", "Traditional Plastic", "Paper Products"],
  rows: [
    {
      feature: "Decomposition Time",
      aicmt: "180 days in composting conditions",
      traditional: "500+ years",
      paper: "2-6 weeks",
    },
    {
      feature: "Environmental Impact",
      aicmt: "Zero microplastics, returns to nature",
      traditional: "Persistent pollution, microplastics",
      paper: "Deforestation, high water usage",
    },
    {
      feature: "Strength & Durability",
      aicmt: "High strength, flexible",
      traditional: "Very high strength",
      paper: "Moderate, tears easily when wet",
    },
    {
      feature: "Water Resistance",
      aicmt: "Good water resistance",
      traditional: "Excellent water resistance",
      paper: "Poor water resistance",
    },
    {
      feature: "Food Safety",
      aicmt: "Food grade certified",
      traditional: "Food grade available",
      paper: "Food grade available",
    },
    {
      feature: "Cost Effectiveness",
      aicmt: "Competitive pricing",
      traditional: "Low cost",
      paper: "Moderate cost",
    },
    {
      feature: "Certifications",
      aicmt: "CPCB, CIPET, IS/ISO 17088:2021",
      traditional: "Various industrial standards",
      paper: "FSC, PEFC available",
    },
    {
      feature: "Carbon Footprint",
      aicmt: "Low carbon footprint",
      traditional: "High carbon footprint",
      paper: "Moderate carbon footprint",
    },
    {
      feature: "Recyclability",
      aicmt: "Compostable, not recyclable",
      traditional: "Recyclable but low rates",
      paper: "Highly recyclable",
    },
    {
      feature: "Applications",
      aicmt: "Bags, packaging, films, sheets",
      traditional: "All plastic applications",
      paper: "Limited to dry applications",
    },
  ],
}

export function ProductComparisonTool() {
  // const [selectedComparison, setSelectedComparison] = useState("full")

  const getStatusIcon = (value: string, type: "aicmt" | "traditional" | "paper") => {
    const positiveKeywords = ["zero", "low", "good", "high", "certified", "competitive", "excellent"]
    const negativeKeywords = ["500+", "pollution", "poor", "tears", "high carbon"]

    const lowerValue = value.toLowerCase()

    if (type === "aicmt") {
      return <CheckCircle className="h-4 w-4 text-green-600 inline mr-2" />
    }

    if (negativeKeywords.some((keyword) => lowerValue.includes(keyword))) {
      return <XCircle className="h-4 w-4 text-red-600 inline mr-2" />
    }

    if (positiveKeywords.some((keyword) => lowerValue.includes(keyword))) {
      return <CheckCircle className="h-4 w-4 text-green-600 inline mr-2" />
    }

    return null
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Product Comparison</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Compare AICMT&apos;s biodegradable & compostable products with traditional alternatives
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">Comprehensive Comparison</Badge>
            AICMT vs Traditional Materials
          </CardTitle>
          <CardDescription>
            Detailed comparison of biodegradable & compostable products against traditional plastic and paper
            alternatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {comparisonData.headers.map((header, index) => (
                    <TableHead key={index} className={index === 0 ? "w-[200px]" : "min-w-[200px]"}>
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="bg-green-50">
                      <div className="flex items-start">
                        {getStatusIcon(row.aicmt, "aicmt")}
                        <span>{row.aicmt}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start">
                        {getStatusIcon(row.traditional, "traditional")}
                        <span>{row.traditional}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start">
                        {getStatusIcon(row.paper, "paper")}
                        <span>{row.paper}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Why Choose AICMT?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>CPCB certified biodegradable & compostable</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Decomposes in 180 days naturally</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>No microplastics or toxic residue</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Competitive pricing with environmental benefits</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium">Carbon Footprint Reduction</div>
                <div className="text-2xl font-bold text-green-600">60%</div>
                <div className="text-xs text-gray-500">vs traditional plastic</div>
              </div>
              <div>
                <div className="text-sm font-medium">Waste Reduction</div>
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-xs text-gray-500">complete biodegradation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>• Carry bags & shopping bags</div>
              <div>• Grocery & supermarket pouches</div>
              <div>• Garbage bags</div>
              <div>• Food packaging sheets</div>
              <div>• D-cut garment bags</div>
              <div>• Tiffin sheets</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
