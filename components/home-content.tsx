"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Leaf, Shield, Award, Globe, ChevronDown } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OptimizedImage } from "@/components/optimized-image"
import { VideoPlayer } from "@/components/video-player"

export function HomeContent() {
  const [currentSlogan, setCurrentSlogan] = useState(0)

  const slogans = [
    "From Nature to Nature",
    "Plastic Pollution Ends Here",
    "Choose Earth, Choose Biodegradable",
    "Green Solutions for a Better Tomorrow",
    "Nature&apos;s Way Forward",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [slogans.length])

  return (
    <div className="relative">
      {/* Hero Section with Nature Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="/lush-tropical-foliage.png"
            alt="Green Nature Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container px-4 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Animated Slogan */}
            <div className="h-20 flex items-center justify-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold transition-all duration-1000 transform">
                {slogans[currentSlogan]}
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Leading manufacturer of biodegradable & compostable plastic solutions. CPCB certified products that return
              to nature safely.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/products">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 text-lg bg-transparent"
                >
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">100%</div>
                <div className="text-green-100">Biodegradable & Compostable</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">CPCB</div>
                <div className="text-green-100">Certified Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">180</div>
                <div className="text-green-100">Days to Decompose</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white/70" />
          </div>
        </div>
      </section>

      {/* Factory Tour Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Take a Factory Tour</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we manufacture biodegradable & compostable plastic products with cutting-edge technology
            </p>
          </div>

          <VideoPlayer
            src="/videos/factory-tour.mp4"
            title="AICMT International Factory Tour"
            poster="/sustainable-factory-exterior.png"
            className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
          />
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-800 mb-4">About AICMT International</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Founded by Alumni of IIT Kharagpur & IBS Dehradun
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                AICMT International was founded by distinguished alumni from premier institutions - IIT Kharagpur and
                IBS Dehradun. Our vision is to create sustainable plastic alternatives that protect our environment
                while meeting industrial needs.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                With state-of-the-art manufacturing facilities and rigorous quality control, we produce CPCB certified
                biodegradable & compostable plastic products that decompose naturally within 180 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about">
                  <Button className="gap-2">
                    Learn More About Us
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/certification">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Shield className="h-4 w-4" />
                    View Certifications
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <OptimizedImage
                  src="/eco-factory-innovation.png"
                  alt="AICMT International Manufacturing Facility"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <OptimizedImage
                    src="/images/process/manufacturing-biodegradable.png"
                    alt="Production Floor"
                    width={300}
                    height={200}
                    className="w-full"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <OptimizedImage
                    src="/images/process/quality-testing.png"
                    alt="Quality Control Lab"
                    width={300}
                    height={200}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-green-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AICMT International?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading the way in sustainable plastic solutions with innovation, quality, and environmental
              responsibility
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">100% Natural</h3>
                <p className="text-gray-600">Made from renewable resources, completely biodegradable & compostable</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">CPCB Certified</h3>
                <p className="text-gray-600">All products certified by Central Pollution Control Board</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
                <p className="text-gray-600">Founded by IIT & IBS alumni with rigorous quality standards</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Global Impact</h3>
                <p className="text-gray-600">Contributing to a plastic-free world, one product at a time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Corporate Office</h3>
              <p className="text-gray-300 leading-relaxed">
                Flat No 201, 2nd Floor, Basaveswara Nilayam, Plot No 05, Above Vijaya Diagnostics, Near ALEAP Circle,
                Pragathi Nagar, Hyderabad, Telangana – 500 090
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-4">Manufacturing Unit</h3>
              <p className="text-gray-300 leading-relaxed">
                Plot No 77/A, Kondapur Industrial Park, Kondapur Village, Manoharabad Mandal, Medak (Dist), Telangana –
                502102
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-300">
                <p>Email: info@aicmtinternational.com</p>
                <p>Phone: +91-7075500868 / +91-7358536074</p>
                <p>WhatsApp: +91-7578007116</p>
                <p>Office Hours: Monday – Saturday, 10:00AM – 5:00PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
