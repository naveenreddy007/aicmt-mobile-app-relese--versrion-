import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CertificationsTable } from "@/components/admin/certifications-table"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Certifications Management | Admin Dashboard",
  description: "Manage certifications and compliance documents",
}

export default function CertificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
          <p className="text-muted-foreground">
            Manage your certifications and compliance documents
          </p>
        </div>
        <Link href="/admin/certifications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Certifications</CardTitle>
          <CardDescription>
            View and manage all certifications and compliance documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CertificationsTable />
        </CardContent>
      </Card>
    </div>
  )
}