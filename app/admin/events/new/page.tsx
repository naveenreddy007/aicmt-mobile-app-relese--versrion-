import { EventForm } from "@/components/admin/event-form"

export const metadata = {
  title: "Add New Event | Admin Dashboard",
  description: "Add a new event to the system",
}

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Add New Event</h1>
      </div>
      
      <EventForm />
    </div>
  )
}