import { Suspense } from "react"
import { getAllReviews } from "@/app/actions/reviews"
import { ReviewsTable } from "@/components/admin/reviews-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react"

export const metadata = {
  title: "Manage Reviews | AICMT Admin",
  description: "Manage customer reviews for AICMT products",
}

async function ReviewsContent() {
  const { reviews, error } = await getAllReviews()

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  const reviewsData = reviews || []

  // Calculate stats
  const totalReviews = reviewsData.length
  const pendingReviews = reviewsData.filter(r => r.status === 'pending').length
  const approvedReviews = reviewsData.filter(r => r.status === 'approved').length
  const rejectedReviews = reviewsData.filter(r => r.status === 'rejected').length
  const averageRating = totalReviews > 0
    ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>
            Manage and moderate customer reviews for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewsTable reviews={reviewsData} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reviews Management</h1>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      }>
        <ReviewsContent />
      </Suspense>
    </div>
  )
}
