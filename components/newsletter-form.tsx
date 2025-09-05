"use client"

import { useActionState } from "react" // useActionState is from 'react'
import { useFormStatus } from "react-dom" // useFormStatus is from 'react-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { subscribeToNewsletter, type SubscriptionState } from "@/app/actions/newsletter"
import { useEffect, useRef } from "react"
import { toast } from "@/components/ui/use-toast"

interface NewsletterFormProps {
  source?: string
  className?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Subscribing..." : "Subscribe"}
    </Button>
  )
}

export function NewsletterForm({ source = "footer", className }: NewsletterFormProps) {
  const initialState: SubscriptionState = { message: null, errors: {}, success: false }
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
        })
        formRef.current?.reset()
      } else {
        toast({
          title: "Error",
          description: state.message || "An error occurred.",
          variant: "destructive",
        })
      }
    } else if (state.errors?.email) {
      toast({
        title: "Error",
        description: state.errors.email.join(", "),
        variant: "destructive",
      })
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="email-newsletter" className="sr-only">
          Email address
        </Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="email-newsletter"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            aria-describedby="email-newsletter-error"
            className="flex-grow"
          />
          <input type="hidden" name="source" value={source} />
          <SubmitButton />
        </div>
        {state.errors?.email && (
          <p id="email-newsletter-error" className="mt-1 text-sm text-red-500">
            {state.errors.email.join(", ")}
          </p>
        )}
        {state.message && !state.success && !state.errors?.email && (
          <p className="mt-1 text-sm text-red-500">{state.message}</p>
        )}
      </div>
    </form>
  )
}
