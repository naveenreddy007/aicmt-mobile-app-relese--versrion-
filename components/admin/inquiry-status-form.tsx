"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateInquiry } from "@/app/actions/inquiries"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function InquiryStatusForm({ inquiry }) {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState(inquiry.status || "new")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateInquiry(inquiry.id, { status })

      toast({
        title: "Status Updated",
        description: `Inquiry status changed to ${status}`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update inquiry status",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup value={status} onValueChange={setStatus} className="space-y-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="new" />
          <Label htmlFor="new" className="cursor-pointer">
            New
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="in-progress" id="in-progress" />
          <Label htmlFor="in-progress" className="cursor-pointer">
            In Progress
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="completed" id="completed" />
          <Label htmlFor="completed" className="cursor-pointer">
            Completed
          </Label>
        </div>
      </RadioGroup>

      <Button type="submit" disabled={isSubmitting || status === inquiry.status}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Status"
        )}
      </Button>
    </form>
  )
}
