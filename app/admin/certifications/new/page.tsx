import { CertificationForm } from "@/components/admin/certification-form"

export const metadata = {
  title: "Add New Certification | Admin Dashboard",
  description: "Add a new certification to the system",
}

export default function NewCertificationPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Add New Certification</h1>
      </div>
      
      <CertificationForm />
    </div>
  )
}