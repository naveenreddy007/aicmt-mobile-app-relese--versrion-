import { CertificationForm } from "@/components/admin/certification-form"
import { getCertificateById } from "@/app/actions/certificates"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Certification | Admin Dashboard",
  description: "Edit certification details",
}

interface EditCertificationPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCertificationPage({ params }: EditCertificationPageProps) {
  const { id } = await params
  const certification = await getCertificateById(id)

  if (!certification) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <CertificationForm certification={certification} />
    </div>
  )
}