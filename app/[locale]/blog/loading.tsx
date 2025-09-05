import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function BlogLoading() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-12 w-64 sm:h-14 md:h-16 md:w-96" />
          <Skeleton className="h-6 w-full max-w-[700px] md:h-8" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Main content - Blog posts */}
          <div className="md:col-span-2">
            <div className="grid gap-8">
              {/* Featured post */}
              <Card className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                </CardHeader>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-28" />
                  </div>
                </CardFooter>
              </Card>

              {/* Regular posts */}
              <div className="grid gap-6 sm:grid-cols-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-video w-full" />
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-1">
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </CardHeader>
                      <CardFooter>
                        <Skeleton className="h-9 w-24" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-10" />
                  <Skeleton className="h-9 w-10" />
                  <Skeleton className="h-9 w-10" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Search */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-6 w-24" />
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-12 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
