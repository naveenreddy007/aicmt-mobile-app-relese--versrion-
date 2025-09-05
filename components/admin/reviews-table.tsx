"use client"

import type React from "react"

import { useState } from "react"
import { Star, Check, X, MessageSquare, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { updateReviewStatus, addReviewResponse, deleteReview } from "@/app/actions/reviews"

interface ReviewsTableProps {
  reviews: any[]
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const [filteredReviews, setFilteredReviews] = useState(reviews)
  const [selectedReview, setSelectedReview] = useState<any | null>(null)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Filter reviews by status
  const filterByStatus = (status: string | null) => {
    if (status === null) {
      setFilteredReviews(reviews)
    } else {
      setFilteredReviews(reviews.filter((review) => review.status === status))
    }
  }

  // Handle status update
  const handleStatusUpdate = async (reviewId: string, status: "pending" | "approved" | "rejected") => {
    setIsSubmitting(true)
    try {
      const result = await updateReviewStatus(reviewId, status)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        // Update local state
        setFilteredReviews(
          filteredReviews.map((review) => {
            if (review.id === reviewId) {
              return { ...review, status }
            }
            return review
          }),
        )

        toast({
          title: "Success",
          description: `Review ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "marked as pending"}`,
        })
      }
    } catch (err) {
      console.error("Error updating review status:", err)
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding response
  const handleAddResponse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedReview) return

    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)

      const result = await addReviewResponse(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setIsResponseDialogOpen(false)

        // Update local state
        const response = {
          id: Date.now().toString(),
          review_id: selectedReview.id,
          content: formData.get("content") as string,
          created_at: new Date().toISOString(),
        }

        setFilteredReviews(
          filteredReviews.map((review) => {
            if (review.id === selectedReview.id) {
              return {
                ...review,
                review_responses: [...(review.review_responses || []), response],
              }
            }
            return review
          }),
        )

        toast({
          title: "Success",
          description: "Response added successfully",
        })
      }
    } catch (err) {
      console.error("Error adding response:", err)
      toast({
        title: "Error",
        description: "Failed to add response",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete review
  const handleDeleteReview = async () => {
    if (!selectedReview) return

    setIsSubmitting(true)
    try {
      const result = await deleteReview(selectedReview.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setIsDeleteDialogOpen(false)

        // Update local state
        setFilteredReviews(filteredReviews.filter((review) => review.id !== selectedReview.id))

        toast({
          title: "Success",
          description: "Review deleted successfully",
        })
      }
    } catch (err) {
      console.error("Error deleting review:", err)
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => filterByStatus(null)}>
          All
        </Button>
        <Button variant="outline" size="sm" onClick={() => filterByStatus("pending")}>
          Pending
        </Button>
        <Button variant="outline" size="sm" onClick={() => filterByStatus("approved")}>
          Approved
        </Button>
        <Button variant="outline" size="sm" onClick={() => filterByStatus("rejected")}>
          Rejected
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.products?.name || "Unknown Product"}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      <div className="font-medium">{review.title}</div>
                      <div className="text-sm text-gray-500 truncate">{review.content}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{review.name}</div>
                    <div className="text-sm text-gray-500">{review.email}</div>
                  </TableCell>
                  <TableCell>{format(new Date(review.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedReview(review)
                            setIsResponseDialogOpen(true)
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Respond
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(review.id, "approved")}
                          disabled={review.status === "approved" || isSubmitting}
                        >
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(review.id, "rejected")}
                          disabled={review.status === "rejected" || isSubmitting}
                        >
                          <X className="h-4 w-4 mr-2 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedReview(review)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>Add an official response to this customer review.</DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <form onSubmit={handleAddResponse}>
              <input type="hidden" name="reviewId" value={selectedReview.id} />

              <div className="space-y-4 my-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= selectedReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{selectedReview.title}</span>
                  </div>
                  <p className="text-sm text-gray-700">{selectedReview.content}</p>
                </div>

                <Textarea name="content" placeholder="Write your response here..." rows={5} required />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Response"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4 my-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= selectedReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{selectedReview.title}</span>
                </div>
                <p className="text-sm text-gray-700">{selectedReview.content}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReview} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
