"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateInquiry } from "@/app/actions/inquiries"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function InquiryNotesForm({ inquiry }) {
  const router = useRouter()
  const { toast } = useToast()
  const [notes, setNotes] = useState(inquiry.notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateInquiry(inquiry.id, { notes })

      toast({
        title: "Notes Updated",
        description: "Inquiry notes have been saved",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update inquiry notes",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this inquiry..."
        className="min-h-[150px]"
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Notes"
        )}
      </Button>
    </form>
  )
}
