"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { seedProducts } from "@/app/actions/seed"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSeedProducts = async () => {
    setIsSeeding(true)
    try {
      const result = await seedProducts()
      setResult(result)
      toast({
        title: "Seeding successful",
        description: `Added ${result.count} products to the database.`,
      })
    } catch (error) {
      console.error("Error seeding products:", error)
      toast({
        title: "Seeding failed",
        description: "Failed to seed products. See console for details.",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Database Seed Utility</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seed Products</CardTitle>
            <CardDescription>Add sample products to the database for testing and development purposes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This will add 5 sample products to your database with various categories and properties.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSeedProducts} disabled={isSeeding}>
              {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSeeding ? "Seeding..." : "Seed Products"}
            </Button>
          </CardFooter>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Seed Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
