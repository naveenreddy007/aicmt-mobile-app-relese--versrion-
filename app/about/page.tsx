import { ArrowLeft, Award, Building, Leaf, Recycle, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About AICMT International</h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl">
            From Nature, to Nature - Our journey towards a sustainable future
          </p>
        </div>

        {/* Vision & Mission */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To be the leading manufacturer of compostable plastics in India, driving the transition from
                conventional plastics to eco-friendly alternatives that return to nature without causing harm.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-green-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To provide high-quality, affordable compostable plastic solutions that meet the diverse needs of our
                customers while contributing to environmental sustainability and reducing plastic pollution.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Company History */}
        <section className="py-12">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold">Our Journey</h2>
            <p className="text-gray-500 max-w-3xl mx-auto">
              Founded by alumni of IIT Kharagpur, AICMT International has grown from a small startup to a leading
              manufacturer of compostable plastics in India.
            </p>
          </div>

          <div className="space-y-12">
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-bold mb-4">The Beginning (2021)</h3>
                <p className="text-gray-600 mb-4">
                  AICMT International was founded with a simple yet powerful concept: What we take from nature should go
                  back to nature. Our founders, alumni of IIT Kharagpur, recognized the urgent need for sustainable
                  alternatives to conventional plastics.
                </p>
                <p className="text-gray-600">
                  Starting with a small production facility and a team of dedicated professionals, we began developing
                  our first compostable plastic formulations.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <Image
                  src="/placeholder.svg?height=300&width=500&query=startup green technology"
                  alt="AICMT Beginnings"
                  width={500}
                  height={300}
                  className="rounded-lg w-full"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div>
                <Image
                  src="/placeholder.svg?height=300&width=500&query=manufacturing facility expansion"
                  alt="AICMT Growth"
                  width={500}
                  height={300}
                  className="rounded-lg w-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Growth & Expansion (2022-2023)</h3>
                <p className="text-gray-600 mb-4">
                  With increasing demand for sustainable packaging solutions, we expanded our production capacity to 100
                  Metric Tons per month and broadened our product range to include various types of compostable
                  plastics.
                </p>
                <p className="text-gray-600">
                  During this period, we also obtained key certifications, including CPCB certification and MSME ZED
                  Bronze certification for our zero efficiency defects production process.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-bold mb-4">Today & Beyond</h3>
                <p className="text-gray-600 mb-4">
                  Today, AICMT International serves over 350 customers across 5 states in India from our 10,000 Square
                  Feet manufacturing facility. We continue to innovate and develop new compostable plastic solutions to
                  meet the evolving needs of our customers.
                </p>
                <p className="text-gray-600">
                  Looking ahead, we aim to expand our reach nationally and internationally, while continuing to invest
                  in research and development to improve the performance and reduce the cost of our compostable
                  plastics.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <Image
                  src="/placeholder.svg?height=300&width=500&query=modern eco friendly manufacturing"
                  alt="AICMT Today"
                  width={500}
                  height={300}
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Manufacturing Facility */}
        <section className="py-12 bg-gray-50 rounded-lg p-6">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold">Our Manufacturing Facility</h2>
            <p className="text-gray-500 max-w-3xl mx-auto">
              State-of-the-art production facility designed for efficiency and sustainability
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <Image
                src="/sustainable-factory-exterior.png"
                alt="AICMT Manufacturing Facility"
                width={600}
                height={400}
                className="rounded-lg w-full"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium">10,000 Square Feet Facility</h3>
                  <p className="text-gray-600">
                    Our spacious manufacturing facility is equipped with the latest technology for producing
                    high-quality compostable plastics.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium">Quality Control</h3>
                  <p className="text-gray-600">
                    Rigorous quality control measures ensure that our products meet the highest standards of performance
                    and compostability.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Recycle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium">Sustainable Operations</h3>
                  <p className="text-gray-600">
                    Our manufacturing processes are designed to minimize waste and energy consumption, reflecting our
                    commitment to sustainability.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium">Skilled Workforce</h3>
                  <p className="text-gray-600">
                    Our team of skilled professionals ensures efficient production and consistent quality across all our
                    products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold">Our Team</h2>
            <p className="text-gray-500 max-w-3xl mx-auto">
              Meet the dedicated professionals behind AICMT International
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src="/placeholder.svg?height=96&width=96&query=professional headshot"
                      alt="Team Member"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-bold text-lg">Rajesh Kumar</h3>
                  <p className="text-gray-500">Founder & CEO</p>
                  <p className="text-sm text-gray-600 mt-4">
                    IIT Kharagpur alumnus with over 15 years of experience in polymer science and sustainable materials.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src="/placeholder.svg?height=96&width=96&query=professional woman headshot"
                      alt="Team Member"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-bold text-lg">Priya Sharma</h3>
                  <p className="text-gray-500">Chief Technology Officer</p>
                  <p className="text-sm text-gray-600 mt-4">
                    Ph.D. in Material Science with expertise in biodegradable polymers and sustainable packaging
                    solutions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src="/placeholder.svg?height=96&width=96&query=professional man headshot"
                      alt="Team Member"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-bold text-lg">Amit Patel</h3>
                  <p className="text-gray-500">Head of Operations</p>
                  <p className="text-sm text-gray-600 mt-4">
                    MBA with specialization in Supply Chain Management and 10+ years of experience in manufacturing
                    operations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sustainability Impact */}
        <section className="py-12 bg-green-50 rounded-lg p-6">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold">Our Impact</h2>
            <p className="text-gray-500 max-w-3xl mx-auto">
              Making a difference for our planet through sustainable alternatives
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Plastic Waste Reduction</CardTitle>
                <Recycle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600 mb-2">500+</p>
                <CardDescription>Tons of conventional plastic waste prevented annually</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Carbon Footprint</CardTitle>
                <Leaf className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600 mb-2">30%</p>
                <CardDescription>Lower carbon footprint compared to conventional plastics</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Sustainable Practices</CardTitle>
                <Building className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600 mb-2">100%</p>
                <CardDescription>Commitment to sustainable manufacturing practices</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Clients Section */}
        <section className="py-12">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold">Our Clients</h2>
            <p className="text-gray-500 max-w-3xl mx-auto">Trusted by businesses across various industries</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
              <Image
                src="/placeholder.svg?height=60&width=120&query=company logo"
                alt="Client Logo"
                width={120}
                height={60}
                className="max-h-12 w-auto"
              />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
              <Image
                src="/placeholder.svg?height=60&width=120&query=retail company logo"
                alt="Client Logo"
                width={120}
                height={60}
                className="max-h-12 w-auto"
              />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
              <Image
                src="/placeholder.svg?height=60&width=120&query=food company logo"
                alt="Client Logo"
                width={120}
                height={60}
                className="max-h-12 w-auto"
              />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
              <Image
                src="/placeholder.svg?height=60&width=120&query=ecommerce company logo"
                alt="Client Logo"
                width={120}
                height={60}
                className="max-h-12 w-auto"
              />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
              <Image
                src="/placeholder.svg?height=60&width=120&query=hospitality company logo"
                alt="Client Logo"
                width={120}
                height={60}
                className="max-h-12 w-auto"
              />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
              <Image
                src="/placeholder.svg?height=60&width=120&query=pharmaceutical company logo"
                alt="Client Logo"
                width={120}
                height={60}
                className="max-h-12 w-auto"
              />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
              <Image
                src="/placeholder.svg?height=60&width=120&query=grocery company logo"
                alt="Client Logo"
                width={120}
                height={60}
                className="max-h-12 w-auto"
              />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
              <Image
                src="/placeholder.svg?height=60&width=120&query=fashion company logo"
                alt="Client Logo"
                width={120}
                height={60}
                className="max-h-12 w-auto"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-green-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us in Creating a Sustainable Future</h2>
          <p className="max-w-3xl mx-auto mb-8">
            Partner with AICMT International to reduce your environmental footprint and contribute to a cleaner, greener
            planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-green-600 hover:bg-gray-100">Contact Us Today</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="text-white border-white hover:bg-green-700">
                Explore Our Products
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
