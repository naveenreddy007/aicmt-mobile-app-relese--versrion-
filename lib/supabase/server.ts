import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Main function to create a Supabase client for server components and actions
const createSupabaseServerClientInternal = async () => {
  const cookieStore = await cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// For server components that need async client creation
export const createSupabaseServerClient = createSupabaseServerClientInternal

// Alias for backward compatibility - now uses async version
export const createClient = createSupabaseServerClient
