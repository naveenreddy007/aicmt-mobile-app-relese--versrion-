import { EventForm } from "@/components/admin/event-form"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Event | Admin Dashboard",
  description: "Edit event details",
}

interface EditEventPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <EventForm event={event} />
    </div>
  )
}