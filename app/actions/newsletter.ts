"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const SubscriptionSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  source: z.string().optional(),
})

export type SubscriptionState = {
  message?: string | null
  errors?: {
    email?: string[]
    general?: string[]
  }
  success?: boolean
}

export async function subscribeToNewsletter(
  prevState: SubscriptionState,
  formData: FormData,
): Promise<SubscriptionState> {
  const validatedFields = SubscriptionSchema.safeParse({
    email: formData.get("email"),
    source: formData.get("source") || "unknown",
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid email address.",
      success: false,
    }
  }

  const { email, source } = validatedFields.data
  const supabase = await createSupabaseServerClient()

  try {
    // Check if email already exists
    const { data: existingSubscription, error: selectError } = await supabase
      .from("newsletter_subscriptions")
      .select("id, is_subscribed")
      .eq("email", email)
      .single()

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116: no rows found
      console.error("Error checking existing subscription:", selectError)
      return { message: "Database error. Please try again later.", success: false }
    }

    if (existingSubscription) {
      if (existingSubscription.is_subscribed) {
        return { message: "You are already subscribed to our newsletter.", success: true }
      } else {
        // Re-subscribe
        const { error: updateError } = await supabase
          .from("newsletter_subscriptions")
          .update({ is_subscribed: true, unsubscribed_at: null, source, updated_at: new Date().toISOString() })
          .eq("id", existingSubscription.id)

        if (updateError) {
          console.error("Error re-subscribing:", updateError)
          return { message: "Failed to re-subscribe. Please try again.", success: false }
        }
        revalidatePath("/") // Revalidate relevant paths
        return { message: "Successfully re-subscribed to our newsletter!", success: true }
      }
    } else {
      // New subscription
      const { error: insertError } = await supabase
        .from("newsletter_subscriptions")
        .insert({ email, source, is_subscribed: true, subscribed_at: new Date().toISOString() })

      if (insertError) {
        console.error("Error inserting new subscription:", insertError)
        if (insertError.code === "23505") {
          // unique constraint violation
          return { message: "This email is already subscribed.", success: true }
        }
        return { message: "Failed to subscribe. Please try again.", success: false }
      }
      revalidatePath("/") // Revalidate relevant paths
      return { message: "Thank you for subscribing to our newsletter!", success: true }
    }
  } catch (error) {
    console.error("Unexpected error during subscription:", error)
    return { message: "An unexpected error occurred. Please try again.", success: false }
  }
}

// Placeholder for unsubscribe action if needed via a link (would require a token typically)
// For now, unsubscription might be handled via admin or a user profile page.
