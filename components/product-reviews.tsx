"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, MessageSquare, ImageIcon, User } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OptimizedImage } from "@/components/optimized-image"
import { getProductReviews, markReviewHelpful } from "@/app/actions/reviews"
import { ReviewForm } from "@/components/review-form"

interface ReviewImage {
  id: string
  image_url: string
}

interface Review {
  id: string
  rating: number
  title: string
  name: string
  is_verified_purchase: boolean
  created_at: string
  content: string
  helpful_count: number
  review_images?: ReviewImage[]
  review_responses?: Array<{ content: string }>
}

interface ProductReviewsProps {
  productId: string
  productName: string
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0],
  })
  const { toast } = useToast()

  // Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      setLoading(true)
      try {
        const result = await getProductReviews(productId)
        if (result.error) {
          setError(result.error)
        } else if (result.reviews) {
          setReviews(result.reviews)

          // Calculate stats
          const total = result.reviews.length
          if (total > 0) {
            const sum = result.reviews.reduce((acc: number, review: any) => acc + (review.rating || 0), 0)
            const average = sum / total

            // Calculate distribution
            const distribution = [0, 0, 0, 0, 0]
            result.reviews.forEach((review: any) => {
              if (review.rating && review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating - 1]++
              }
            })

            setStats({
              average,
              total,
              distribution,
            })
          }
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
        setError("Failed to load reviews")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  // Handle marking a review as helpful
  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const result = await markReviewHelpful(reviewId)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        // Update the review in the local state
        setReviews(
          reviews.map((review) => {
            if (review.id === reviewId) {
              return { ...review, helpful_count: (review.helpful_count || 0) + 1 }
            }
            return review
          }),
        )

        toast({
          title: "Thank you!",
          description: "You marked this review as helpful",
        })
      }
    } catch (err) {
      console.error("Error marking review as helpful:", err)
      toast({
        title: "Error",
        description: "Failed to mark review as helpful",
        variant: "destructive",
      })
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full py-8">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-8">
      <Tabs defaultValue="reviews">
        <TabsList className="mb-6">
          <TabsTrigger value="reviews">Reviews ({stats.total})</TabsTrigger>
          <TabsTrigger value="write">Write a Review</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          {/* Review Summary */}
          {stats.total > 0 ? (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold mb-2">{stats.average.toFixed(1)}</div>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(stats.average) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">Based on {stats.total} reviews</div>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = stats.distribution[rating - 1]
                      const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0

                      return (
                        <div key={rating} className="flex items-center">
                          <div className="w-12 text-sm text-gray-600">{rating} stars</div>
                          <div className="flex-1 mx-3 h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-10 text-sm text-gray-600">{count}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg mb-8">
              <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
              <p className="text-gray-500 mb-4">Be the first to review this product</p>
              <Button onClick={() => document.querySelector('[data-value="write"]')?.click()}>Write a Review</Button>
            </div>
          )}

          {/* Review List */}
          {reviews.length > 0 && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <h3 className="font-semibold">{review.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <User className="h-3 w-3" />
                          <span>{review.name}</span>
                          {review.is_verified_purchase && (
                            <span className="text-green-600 text-xs font-medium">Verified Purchase</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{format(new Date(review.created_at), "MMM d, yyyy")}</div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <p className="text-gray-700 whitespace-pre-line">{review.content}</p>

                    {/* Review Images */}
                    {review.review_images && review.review_images.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center gap-1 text-sm font-medium mb-2">
                          <ImageIcon className="h-4 w-4" />
                          <span>Images from this review</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {review.review_images.map((image: ReviewImage) => (
                            <div key={image.id} className="w-20 h-20 rounded-md overflow-hidden border">
                              <OptimizedImage
                                src={image.image_url}
                                alt="Review image"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Response */}
                    {review.review_responses && review.review_responses.length > 0 && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-md">
                        <div className="flex items-center gap-1 text-sm font-medium text-blue-700 mb-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>Response from AICMT</span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.review_responses[0].content}</p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-0 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => handleMarkHelpful(review.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful_count || 0})
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="write">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Write a Review for {productName}</h3>
              <p className="text-gray-500">Share your experience with this product</p>
            </CardHeader>
            <CardContent>
              <ReviewForm productId={productId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
