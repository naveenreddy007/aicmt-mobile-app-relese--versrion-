import { FactoryTourForm } from "@/components/admin/factory-tour-form"

export const metadata = {
  title: "Add New Factory Tour Video | Admin Dashboard",
  description: "Add a new factory tour video to the system",
}

export default function NewFactoryTourPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Add New Factory Tour Video</h1>
      </div>
      
      <FactoryTourForm />
    </div>
  )
}