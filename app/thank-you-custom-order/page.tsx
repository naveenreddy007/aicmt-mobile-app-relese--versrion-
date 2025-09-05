import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThankYouCustomOrderPage() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">Thank You for Your Custom Order Request!</h1>
        <p className="text-muted-foreground">
          We've received your custom product request and our team will review it shortly. We'll get back to you with a
          quote within 1-2 business days.
        </p>
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Your request has been logged in our system and assigned a unique ID. You'll receive a confirmation email
            with these details.
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
