"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// FAQ data with updated MOQ information
const faqData = [
  {
    category: "Product Information",
    questions: [
      {
        question: "What are biodegradable & compostable plastics?",
        answer:
          "Biodegradable & compostable plastics are materials that can break down completely in a composting environment, converting into carbon dioxide, water, and biomass. Unlike conventional plastics, they don&apos;t leave behind microplastics or toxic residues. Our products are made from a blend of PBAT (Polybutylene Adipate Terephthalate) and PLA (Polylactic Acid), which are derived from renewable resources.",
      },
      {
        question: "How long do your products take to decompose?",
        answer:
          "Our biodegradable & compostable plastics typically decompose within 180 days in industrial composting conditions. The exact time can vary based on environmental factors such as temperature, humidity, and microbial activity. In home composting conditions, it may take slightly longer.",
      },
      {
        question: "Are your products food-safe?",
        answer:
          "Yes, our compostable food packaging products are certified food-safe and comply with all relevant regulations for food contact materials. They are free from harmful chemicals and safe for direct contact with food items.",
      },
      {
        question: "What is the shelf life of your products?",
        answer:
          "Our biodegradable & compostable plastic products have a shelf life of approximately 12-18 months when stored in proper conditions (cool, dry place away from direct sunlight). After this period, they may start to show signs of degradation, which is a natural characteristic of biodegradable materials.",
      },
    ],
  },
  {
    category: "Certifications & Compliance",
    questions: [
      {
        question: "What certifications do your products have?",
        answer:
          "Our products are certified by the Central Pollution Control Board (CPCB) of India and comply with IS 17088:2021 standards for compostable plastics. We also have CIPET testing certificates and MSME ZED Bronze certification for our zero efficiency defects production process.",
      },
      {
        question: "Do your products meet international standards?",
        answer:
          "Yes, our products comply with international standards including ISO 17088:2021 for compostable plastics and ASTM D6400 specifications. This ensures our products meet global requirements for biodegradability and compostability.",
      },
      {
        question: "Are your products compliant with Plastic Waste Management Rules?",
        answer:
          "Absolutely. Our products fully comply with the Plastic Waste Management Rules in India, including the latest amendments. We are registered under the Extended Producer Responsibility (EPR) framework and fulfill all regulatory requirements.",
      },
    ],
  },
  {
    category: "Usage & Applications",
    questions: [
      {
        question: "What are the common applications for your products?",
        answer:
          "Our biodegradable & compostable plastics are suitable for a wide range of applications including filler master batches, carry bags, shopping bags, grocery pouches, supermarket pouches with perforation rolls, D-cut garment bags, garbage bags, tiffin sheets, and packaging sheets in rolls form. They can replace conventional plastics in most applications while providing similar functionality with added environmental benefits.",
      },
      {
        question: "Can your products be used for hot food and beverages?",
        answer:
          "Our food packaging products are designed to withstand temperatures up to 85°C (185°F), making them suitable for most hot food applications. However, for extremely hot items or microwave heating, we recommend checking the specific product specifications or contacting our team for guidance.",
      },
      {
        question: "How should your products be disposed of?",
        answer:
          "For optimal environmental benefit, our products should be disposed of in industrial composting facilities where available. They can also be home composted, though this may take longer. If composting is not available, they can go into organic waste collection systems. Even in landfill conditions, they will biodegrade faster than conventional plastics.",
      },
    ],
  },
  {
    category: "Business & Orders",
    questions: [
      {
        question: "What is the minimum order quantity?",
        answer:
          "Our minimum order quantities are: For Granules - Multiples of 40 Kgs, and for Compostable Bags (each size) - 40 Kgs minimum. For custom solutions, please contact our sales team for specific requirements.",
      },
      {
        question: "Do you offer custom printing on your products?",
        answer:
          "Yes, we offer custom printing services for our bags and packaging products. We can print your logo, brand message, or any design using eco-friendly inks that don&apos;t compromise the compostability of the products. Please contact us for design specifications and minimum order quantities for custom printing.",
      },
      {
        question: "What are your delivery timeframes?",
        answer:
          "For standard products, we typically deliver within 7-10 business days after order confirmation. For custom products or large orders, delivery times may be 2-3 weeks. We also offer expedited shipping options for urgent requirements at an additional cost.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship our products internationally. Shipping costs and delivery timeframes vary by destination. Please contact our sales team for specific information about international shipping to your location.",
      },
      {
        question: "How can I become a marketing partner?",
        answer:
          "We welcome marketing partnerships! Please contact us through our inquiry form and select &apos;Be our Marketing Partner&apos; as the inquiry type. Our business development team will get in touch with you to discuss partnership opportunities, terms, and requirements.",
      },
    ],
  },
]

export function FaqAccordion() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="text-gray-500 mt-2">
          Find answers to common questions about our biodegradable & compostable plastic products
        </p>
      </div>

      <div className="space-y-6">
        {faqData.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
              <CardDescription>Common questions about {category.category.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, qIndex) => (
                  <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-4 text-gray-600">{item.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
