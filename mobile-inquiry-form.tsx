import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function MobileInquiryFormWireframe() {
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
        <h1 className="text-lg font-bold">Request a Quote</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="bg-white rounded-md border p-4 mb-4">
          <p className="text-sm text-gray-700">
            Fill out the form below to request a quote for our compostable plastic products. Our team will get back to
            you within 24 hours.
          </p>
        </div>

        <form className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Contact Information</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Enter your full name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input id="company" placeholder="Enter your company name" required />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="Enter your email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="Enter your phone number" required />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Product Information</h2>

            <div className="space-y-2">
              <Label htmlFor="product-type">Product Type *</Label>
              <Select required>
                <SelectTrigger id="product-type">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="granules">Compostable Granules</SelectItem>
                  <SelectItem value="bags">Compostable Bags</SelectItem>
                  <SelectItem value="packaging">Food Packaging</SelectItem>
                  <SelectItem value="custom">Custom Solution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity Range *</Label>
              <RadioGroup defaultValue="small">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small" className="font-normal">
                    Small (1-100 kg)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="font-normal">
                    Medium (101-500 kg)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large" className="font-normal">
                    Large (501-1000 kg)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bulk" id="bulk" />
                  <Label htmlFor="bulk" className="font-normal">
                    Bulk (1000+ kg)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications or Requirements</Label>
              <Textarea
                id="specifications"
                placeholder="Please provide any specific requirements or specifications for your order"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Additional Information</h2>

            <div className="space-y-2">
              <Label htmlFor="timeline">Expected Timeline *</Label>
              <Select required>
                <SelectTrigger id="timeline">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate (1-2 weeks)</SelectItem>
                  <SelectItem value="short">Short-term (3-4 weeks)</SelectItem>
                  <SelectItem value="medium">Medium-term (1-2 months)</SelectItem>
                  <SelectItem value="long">Long-term (3+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hear-about">How did you hear about us?</Label>
              <Select>
                <SelectTrigger id="hear-about">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="search">Search Engine</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="event">Trade Show/Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Comments</Label>
              <Textarea
                id="message"
                placeholder="Any additional information you'd like to share"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </form>
      </main>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <Send className="h-4 w-4 mr-2" />
          Submit Inquiry
        </Button>
      </div>
    </div>
  )
}
