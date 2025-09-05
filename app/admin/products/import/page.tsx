import { ImportForm } from "@/components/admin/import-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductImportPage() {
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Import Products</CardTitle>
          <CardDescription>Add or update products in bulk by uploading a CSV or JSON file.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImportForm />
        </CardContent>
      </Card>
    </div>
  )
}
