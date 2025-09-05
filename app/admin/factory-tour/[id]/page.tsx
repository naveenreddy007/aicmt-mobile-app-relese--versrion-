import { FactoryTourForm } from "@/components/admin/factory-tour-form"
import { getFactoryTour } from "@/app/actions/factory-tour"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Factory Tour Video | Admin Dashboard",
  description: "Edit factory tour video details",
}

interface EditFactoryTourPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditFactoryTourPage({ params }: EditFactoryTourPageProps) {
  const { id } = await params
  
  try {
    const factoryTour = await getFactoryTour(id)
    
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Edit Factory Tour Video</h1>
        </div>
        
        <FactoryTourForm factoryTour={factoryTour} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}