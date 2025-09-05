"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createQuotation } from "@/app/actions/custom-orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function QuotationForm({ orderId }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    notes: "",
    quote_reference: `Q-${orderId.slice(0, 8).toUpperCase()}`,
    quote_sent_at: new Date(),
    quote_valid_until: new Date(new Date().setDate(new Date().getDate() + 30)),
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.amount || isNaN(Number.parseFloat(formData.amount)) || Number.parseFloat(formData.amount) <= 0) {
        throw new Error("Please enter a valid amount")
      }
      if (!formData.quote_reference) {
        throw new Error("Please enter a quote reference")
      }
      if (!formData.quote_sent_at) {
        throw new Error("Please select a sent date")
      }
      if (!formData.quote_valid_until) {
        throw new Error("Please select a valid until date")
      }

      // Submit the quotation
      const result = await createQuotation(orderId, {
        amount: Number.parseFloat(formData.amount),
        notes: formData.notes,
        quote_reference: formData.quote_reference,
        quote_sent_at: formData.quote_sent_at.toISOString(),
        quote_valid_until: formData.quote_valid_until.toISOString(),
      })

      if (result.success) {
        toast({
          title: "Quotation Created",
          description: `Quotation ${result.quoteReference} has been created successfully.`,
        })
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to create quotation")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the quotation.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="quote_reference">Quote Reference</Label>
          <Input
            id="quote_reference"
            name="quote_reference"
            value={formData.quote_reference}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Quotation Amount ($)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quote_sent_at">Sent Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.quote_sent_at && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.quote_sent_at ? format(formData.quote_sent_at, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.quote_sent_at}
                onSelect={(date) => setFormData({ ...formData, quote_sent_at: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quote_valid_until">Valid Until</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.quote_valid_until && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.quote_valid_until ? format(formData.quote_valid_until, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.quote_valid_until}
                onSelect={(date) => setFormData({ ...formData, quote_valid_until: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Quotation Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Enter any additional information, terms, or conditions for this quotation..."
          value={formData.notes}
          onChange={handleInputChange}
          rows={5}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Quotation"
          )}
        </Button>
      </div>
    </form>
  )
}
