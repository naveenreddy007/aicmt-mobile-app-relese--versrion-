"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OptimizedImage } from "@/components/optimized-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Palette, Ruler, Package, FileText, Send, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { createCustomOrder } from "@/app/actions/custom-orders"

// Sample customization options
const customizationOptions = {
  sizes: [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "custom", label: "Custom Size" },
  ],
  colors: [
    { value: "natural", label: "Natural", hex: "#F5F5DC" },
    { value: "white", label: "White", hex: "#FFFFFF" },
    { value: "green", label: "Green", hex: "#4CAF50" },
    { value: "blue", label: "Blue", hex: "#2196F3" },
    { value: "black", label: "Black", hex: "#333333" },
    { value: "custom", label: "Custom Color", hex: "#CCCCCC" },
  ],
  thickness: [
    { value: "thin", label: "Thin (15-25 microns)" },
    { value: "medium", label: "Medium (25-40 microns)" },
    { value: "thick", label: "Thick (40-60 microns)" },
    { value: "custom", label: "Custom Thickness" },
  ],
  printingOptions: [
    { value: "none", label: "No Printing" },
    { value: "single", label: "Single Color" },
    { value: "multi", label: "Multi-Color" },
    { value: "full", label: "Full Color" },
  ],
}

// Sample product categories for customization
const customizableProducts = [
  {
    id: "bags",
    name: "Carry Bags",
    image: "/earth-friendly-shopping.png",
    description: "Customizable biodegradable shopping bags for retail and promotional use.",
    features: ["Multiple size options", "Various handle types", "Custom printing available", "Thickness options"],
  },
  {
    id: "packaging",
    name: "Food Packaging",
    image: "/earth-friendly-takeout.png",
    description: "Eco-friendly food containers and packaging solutions for restaurants and food service.",
    features: ["Various container shapes", "Leak-proof options", "Heat-resistant varieties", "Custom branding"],
  },
  {
    id: "films",
    name: "Films & Wraps",
    image: "/clear-eco-pellets.png",
    description: "Biodegradable films and wraps for packaging and agricultural applications.",
    features: [
      "Adjustable transparency",
      "Various thickness options",
      "UV-resistant varieties",
      "Custom widths and lengths",
    ],
  },
]

export function CustomSolutions() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("bags")
  const [activeStep, setActiveStep] = useState(1)
  const [selectedSize, setSelectedSize] = useState("medium")
  const [selectedColor, setSelectedColor] = useState("natural")
  const [selectedThickness, setSelectedThickness] = useState("medium")
  const [selectedPrinting, setSelectedPrinting] = useState("none")
  const [customRequirements, setCustomRequirements] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customSizeValue, setCustomSizeValue] = useState("")
  const [customColorValue, setCustomColorValue] = useState("")
  const [customThicknessValue, setCustomThicknessValue] = useState("")
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    quantity: "",
    timeline: "standard",
    logoFile: null,
    printLocation: "center",
    printOptions: {
      qrCode: false,
      serialNumbers: false,
      embossed: false,
    },
    printNotes: "",
  })

  const handleNextStep = () => {
    setActiveStep(Math.min(3, activeStep + 1))
  }

  const handlePrevStep = () => {
    setActiveStep(Math.max(1, activeStep - 1))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.startsWith("printOptions.")) {
      const optionName = name.split(".")[1]
      setFormData({
        ...formData,
        printOptions: {
          ...formData.printOptions,
          [optionName]: checked,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get the current product
      const product = customizableProducts.find((p) => p.id === activeTab)

      // Prepare the order data
      const orderData = {
        company_name: formData.companyName,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        product_type: activeTab,
        product_name: product.name,
        size: selectedSize === "custom" ? customSizeValue : selectedSize,
        color: selectedColor === "custom" ? customColorValue : selectedColor,
        thickness: selectedThickness === "custom" ? customThicknessValue : selectedThickness,
        printing_option: selectedPrinting,
        quantity: Number.parseInt(formData.quantity) || 0,
        timeline: formData.timeline,
        print_location: selectedPrinting !== "none" ? formData.printLocation : null,
        special_instructions: formData.printNotes,
        additional_requirements: customRequirements,
      }

      // Submit the order
      const result = await createCustomOrder(orderData)

      if (result.success) {
        toast({
          title: "Custom Order Submitted",
          description: "Thank you for your custom order request. We'll get back to you with a quote soon.",
        })

        // Reset form
        setActiveStep(1)
        setSelectedSize("medium")
        setSelectedColor("natural")
        setSelectedThickness("medium")
        setSelectedPrinting("none")
        setCustomRequirements("")
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          quantity: "",
          timeline: "standard",
          logoFile: null,
          printLocation: "center",
          printOptions: {
            qrCode: false,
            serialNumbers: false,
            embossed: false,
          },
          printNotes: "",
        })

        // Redirect to thank you page
        router.push("/thank-you-custom-order")
      } else {
        throw new Error(result.error || "Failed to submit custom order")
      }
    } catch (error) {
      console.error("Error submitting custom order:", error)
      toast({
        title: "Submission Failed",
        description: error.message || "There was a problem submitting your custom order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Settings className="h-6 w-6 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-900">Custom Solutions</h2>
        </div>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Tailor our biodegradable products to your specific requirements with customizable options
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg mb-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/4 flex justify-center">
            <div className="bg-white p-4 rounded-full">
              <Package className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <div className="md:w-3/4">
            <h3 className="text-xl font-bold mb-2">Why Choose Custom Solutions?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Perfectly tailored to your specific needs</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Branded packaging enhances recognition</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Optimized for your exact use case</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Stand out with unique sustainable solutions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          {customizableProducts.map((product) => (
            <TabsTrigger key={product.id} value={product.id}>
              {product.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {customizableProducts.map((product) => (
          <TabsContent key={product.id} value={product.id} className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="rounded-lg overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                      <p className="text-gray-600 mt-1">{product.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">Key Features:</h4>
                      <ul className="mt-2 space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button onClick={() => setActiveStep(1)}>Customize Now</Button>
                    </div>
                  </div>
                </div>

                {activeStep > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Customize Your {product.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            activeStep >= 1 ? "bg-green-600 text-white" : "bg-gray-200"
                          }`}
                        >
                          1
                        </span>
                        <span>Specifications</span>
                        <span className="w-8 h-0.5 bg-gray-200"></span>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            activeStep >= 2 ? "bg-green-600 text-white" : "bg-gray-200"
                          }`}
                        >
                          2
                        </span>
                        <span>Branding</span>
                        <span className="w-8 h-0.5 bg-gray-200"></span>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            activeStep >= 3 ? "bg-green-600 text-white" : "bg-gray-200"
                          }`}
                        >
                          3
                        </span>
                        <span>Request Quote</span>
                      </div>
                    </div>

                    {activeStep === 1 && (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-medium mb-4 flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-green-600" />
                            Size Options
                          </h4>
                          <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="space-y-2">
                            {customizationOptions.sizes.map((size) => (
                              <div key={size.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={size.value} id={`size-${size.value}`} />
                                <Label htmlFor={`size-${size.value}`}>{size.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>

                          {selectedSize === "custom" && (
                            <div className="mt-4 space-y-2">
                              <Label htmlFor="custom-size">Specify Custom Size</Label>
                              <Textarea
                                id="custom-size"
                                value={customSizeValue}
                                onChange={(e) => setCustomSizeValue(e.target.value)}
                                placeholder="Enter dimensions (width x height x depth in cm)"
                                className="h-20"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium mb-4 flex items-center gap-2">
                            <Palette className="h-4 w-4 text-green-600" />
                            Color Options
                          </h4>
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {customizationOptions.colors.map((color) => (
                              <div
                                key={color.value}
                                className={`p-2 border rounded-md cursor-pointer transition-all ${
                                  selectedColor === color.value ? "ring-2 ring-green-600" : ""
                                }`}
                                onClick={() => setSelectedColor(color.value)}
                              >
                                <div className="w-full h-8 rounded mb-1" style={{ backgroundColor: color.hex }}></div>
                                <div className="text-xs text-center">{color.label}</div>
                              </div>
                            ))}
                          </div>

                          {selectedColor === "custom" && (
                            <div className="mt-4 space-y-2">
                              <Label htmlFor="custom-color">Specify Custom Color</Label>
                              <Input
                                id="custom-color"
                                value={customColorValue}
                                onChange={(e) => setCustomColorValue(e.target.value)}
                                placeholder="Enter color name or Pantone code"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium mb-4 flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-green-600" />
                            Thickness Options
                          </h4>
                          <RadioGroup
                            value={selectedThickness}
                            onValueChange={setSelectedThickness}
                            className="space-y-2"
                          >
                            {customizationOptions.thickness.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`thickness-${option.value}`} />
                                <Label htmlFor={`thickness-${option.value}`}>{option.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>

                          {selectedThickness === "custom" && (
                            <div className="mt-4 space-y-2">
                              <Label htmlFor="custom-thickness">Specify Custom Thickness</Label>
                              <Input
                                id="custom-thickness"
                                value={customThicknessValue}
                                onChange={(e) => setCustomThicknessValue(e.target.value)}
                                placeholder="Enter thickness in microns"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex items-end">
                          <Button onClick={handleNextStep} className="w-full">
                            Next: Branding Options
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-4 flex items-center gap-2">
                            <Palette className="h-4 w-4 text-green-600" />
                            Printing Options
                          </h4>
                          <RadioGroup
                            value={selectedPrinting}
                            onValueChange={setSelectedPrinting}
                            className="space-y-2"
                          >
                            {customizationOptions.printingOptions.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`printing-${option.value}`} />
                                <Label htmlFor={`printing-${option.value}`}>{option.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        {selectedPrinting !== "none" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="logo-upload">Upload Your Logo</Label>
                                <Input
                                  id="logo-upload"
                                  type="file"
                                  className="mt-1"
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      logoFile: e.target.files?.[0] || null,
                                    })
                                  }
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Accepted formats: PNG, JPG, SVG. Max size: 5MB
                                </p>
                              </div>

                              <div>
                                <Label htmlFor="print-location">Print Location</Label>
                                <select
                                  id="print-location"
                                  name="printLocation"
                                  value={formData.printLocation}
                                  onChange={handleInputChange}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                >
                                  <option value="center">Center</option>
                                  <option value="top">Top</option>
                                  <option value="bottom">Bottom</option>
                                  <option value="left">Left Side</option>
                                  <option value="right">Right Side</option>
                                  <option value="all">All Over</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label>Additional Printing Options</Label>
                                <div className="space-y-2 mt-1">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="option-qr"
                                      name="printOptions.qrCode"
                                      checked={formData.printOptions.qrCode}
                                      onCheckedChange={(checked) =>
                                        setFormData({
                                          ...formData,
                                          printOptions: {
                                            ...formData.printOptions,
                                            qrCode: !!checked,
                                          },
                                        })
                                      }
                                    />
                                    <label htmlFor="option-qr" className="text-sm">
                                      Include QR Code
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="option-serial"
                                      name="printOptions.serialNumbers"
                                      checked={formData.printOptions.serialNumbers}
                                      onCheckedChange={(checked) =>
                                        setFormData({
                                          ...formData,
                                          printOptions: {
                                            ...formData.printOptions,
                                            serialNumbers: !!checked,
                                          },
                                        })
                                      }
                                    />
                                    <label htmlFor="option-serial" className="text-sm">
                                      Add Serial Numbers
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="option-emboss"
                                      name="printOptions.embossed"
                                      checked={formData.printOptions.embossed}
                                      onCheckedChange={(checked) =>
                                        setFormData({
                                          ...formData,
                                          printOptions: {
                                            ...formData.printOptions,
                                            embossed: !!checked,
                                          },
                                        })
                                      }
                                    />
                                    <label htmlFor="option-emboss" className="text-sm">
                                      Embossed Effect
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="print-notes">Special Instructions</Label>
                                <Textarea
                                  id="print-notes"
                                  name="printNotes"
                                  value={formData.printNotes}
                                  onChange={handleInputChange}
                                  placeholder="Any specific requirements for your printing"
                                  className="mt-1 h-20"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between pt-4">
                          <Button variant="outline" onClick={handlePrevStep} aria-label="Go back to previous step">
                            Back
                          </Button>
                          <Button onClick={handleNextStep} aria-label="Continue to next step">
                            Next: Request Quote
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeStep === 3 && (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-green-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Your Customization Summary</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium block">Product:</span>
                              <span>{product.name}</span>
                            </div>
                            <div>
                              <span className="font-medium block">Size:</span>
                              <span>
                                {selectedSize === "custom"
                                  ? customSizeValue
                                  : customizationOptions.sizes.find((s) => s.value === selectedSize)?.label}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium block">Color:</span>
                              <span>
                                {selectedColor === "custom"
                                  ? customColorValue
                                  : customizationOptions.colors.find((c) => c.value === selectedColor)?.label}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium block">Thickness:</span>
                              <span>
                                {selectedThickness === "custom"
                                  ? customThicknessValue
                                  : customizationOptions.thickness.find((t) => t.value === selectedThickness)?.label}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium block">Printing:</span>
                              <span>
                                {customizationOptions.printingOptions.find((p) => p.value === selectedPrinting)?.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="company-name">Company Name*</Label>
                              <Input
                                id="company-name"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="mt-1"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="contact-name">Contact Person*</Label>
                              <Input
                                id="contact-name"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleInputChange}
                                className="mt-1"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address*</Label>
                              <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                type="email"
                                className="mt-1"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="quantity">Estimated Quantity*</Label>
                              <Input
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                type="number"
                                className="mt-1"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="timeline">Required Timeline*</Label>
                              <select
                                id="timeline"
                                name="timeline"
                                value={formData.timeline}
                                onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                required
                              >
                                <option value="urgent">Urgent (1-2 weeks)</option>
                                <option value="standard">Standard (3-4 weeks)</option>
                                <option value="relaxed">Relaxed (5+ weeks)</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="additional-requirements">Additional Requirements</Label>
                              <Textarea
                                id="additional-requirements"
                                placeholder="Any other specifications or requirements"
                                className="mt-1 h-20"
                                value={customRequirements}
                                onChange={(e) => setCustomRequirements(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button type="button" variant="outline" onClick={handlePrevStep}>
                            Back
                          </Button>
                          <Button type="submit" className="gap-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Submit Request
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/4 flex justify-center">
            <FileText className="h-16 w-16 text-green-600" />
          </div>
          <div className="md:w-3/4">
            <h3 className="text-xl font-bold mb-2">Need More Information?</h3>
            <p className="text-gray-600 mb-4">
              Our team of experts is ready to help you find the perfect custom solution for your specific needs.
              Download our custom solutions brochure or contact us directly for a consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Download Brochure
              </Button>
              <Button className="gap-2" asChild>
                <a href="/contact">
                  <Send className="h-4 w-4" />
                  Contact for Consultation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
