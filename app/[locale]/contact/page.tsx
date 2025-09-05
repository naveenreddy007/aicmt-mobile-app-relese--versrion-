import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { createInquiry } from "@/app/actions/inquiries"

export const metadata: Metadata = {
  title: "Contact Us | Biodegradable Products",
  description:
    "Get in touch with our team for inquiries about our biodegradable products, custom solutions, or partnership opportunities.",
}

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions about our biodegradable products? Get in touch with our team.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Our Office</h3>
              <address className="not-italic mt-2 space-y-1 text-muted-foreground">
                <p>123 Green Earth Road</p>
                <p>Eco Industrial Park</p>
                <p>Bengaluru, Karnataka 560001</p>
                <p>India</p>
              </address>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="mt-2 space-y-1 text-muted-foreground">
                <p>Email: info@biodegradable.com</p>
                <p>Phone: +91 80 1234 5678</p>
                <p>Hours: Monday-Friday, 9:00 AM - 5:00 PM IST</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Follow Us</h3>
              <div className="mt-2 flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  LinkedIn
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Facebook
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
            <ContactForm createInquiry={createInquiry} />
          </div>
        </div>
      </div>
    </div>
  )
}
