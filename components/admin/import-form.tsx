"use client"

import type React from "react"

import { useActionState } from "react"
import { importProductsFromCsv, importProductsFromJson } from "@/app/actions/import"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Download, FileJson, FileSpreadsheet } from "lucide-react"

type ActionState = {
  status: "success" | "error"
  message: string
} | null

function SubmitButton({ isPending, children }: { isPending: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
      {isPending ? "Importing..." : children}
    </Button>
  )
}

function ActionResponseMessage({ state }: { state: ActionState }) {
  if (!state) return null

  return (
    <Alert variant={state.status === "error" ? "destructive" : "default"} className="mt-4">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{state.status === "success" ? "Success" : "Error"}</AlertTitle>
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  )
}

export function ImportForm() {
  const [csvState, csvAction, isCsvPending] = useActionState<ActionState, FormData>(importProductsFromCsv, null)
  const [jsonState, jsonAction, isJsonPending] = useActionState<ActionState, FormData>(importProductsFromJson, null)

  return (
    <div className="space-y-8">
      {/* CSV Import Form */}
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <FileSpreadsheet className="mr-2 h-5 w-5" /> Import from CSV
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a CSV file with product data. The `code` column is used to identify existing products for updates.
        </p>
        <form action={csvAction} className="space-y-4">
          <div>
            <Label htmlFor="csv-file">CSV File</Label>
            <Input id="csv-file" name="file" type="file" accept=".csv" required />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SubmitButton isPending={isCsvPending}>Import CSV</SubmitButton>
            <a
              href="/examples/products.csv"
              download
              className="text-sm inline-flex items-center text-blue-600 hover:underline"
            >
              <Download className="mr-1 h-4 w-4" />
              Download Example CSV
            </a>
          </div>
        </form>
        <ActionResponseMessage state={csvState} />
      </div>

      {/* JSON Import Form */}
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <FileJson className="mr-2 h-5 w-5" /> Import from JSON
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a JSON file with an array of product objects. The `code` field is used for updates.
        </p>
        <form action={jsonAction} className="space-y-4">
          <div>
            <Label htmlFor="json-file">JSON File</Label>
            <Input id="json-file" name="file" type="file" accept=".json" required />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SubmitButton isPending={isJsonPending}>Import JSON</SubmitButton>
            <a
              href="/examples/products.json"
              download
              className="text-sm inline-flex items-center text-blue-600 hover:underline"
            >
              <Download className="mr-1 h-4 w-4" />
              Download Example JSON
            </a>
          </div>
        </form>
        <ActionResponseMessage state={jsonState} />
      </div>
    </div>
  )
}
