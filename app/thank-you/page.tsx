import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThankYouPage() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">Thank You for Your Message!</h1>
        <p className="text-muted-foreground">
          We've received your inquiry and will get back to you as soon as possible. A confirmation has been sent to your
          email address.
        </p>
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Your inquiry has been logged in our system and our team will review it shortly.
          </p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
