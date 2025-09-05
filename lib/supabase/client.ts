"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Singleton instance to prevent multiple GoTrueClient instances
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

// Create a single instance of the Supabase client for use in client components
export const createClient = () => {
  if (!clientInstance) {
    clientInstance = createClientComponentClient<Database>()
  }
  return clientInstance
}
