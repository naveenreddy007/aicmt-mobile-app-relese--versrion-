"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { JourneyMilestone } from "@/lib/types/stories"
import {
  deleteJourneyMilestone,
  toggleJourneyMilestoneStatus,
} from "@/app/actions/stories"

interface JourneyMilestonesTableProps {
  milestones: JourneyMilestone[]
}

export function JourneyMilestonesTable({ milestones }: JourneyMilestonesTableProps) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id)
    startTransition(async () => {
      try {
        const result = await deleteJourneyMilestone(id)
        if (result.success) {
          toast.success(`Milestone "${title}" deleted successfully`)
        } else {
          toast.error(result.error || "Failed to delete milestone")
        }
      } catch (error) {
        toast.error("Failed to delete milestone")
      } finally {
        setDeletingId(null)
      }
    })
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean, title: string) => {
    setTogglingId(id)
    startTransition(async () => {
      try {
        const result = await toggleJourneyMilestoneStatus(id, currentStatus)
        if (result.success) {
          toast.success(
            `Milestone "${title}" ${!currentStatus ? "activated" : "deactivated"} successfully`
          )
        } else {
          toast.error(result.error || "Failed to update milestone status")
        }
      } catch (error) {
        toast.error("Failed to update milestone status")
      } finally {
        setTogglingId(null)
      }
    })
  }

  if (!milestones || milestones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Journey Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            No journey milestones have been created yet.
          </p>
          <Link href="/admin/stories/journey/new">
            <Button>Add Your First Milestone</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journey Milestones ({milestones?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((milestone) => (
                <TableRow key={milestone.id}>
                  <TableCell className="font-medium">
                    {milestone.year}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium truncate">{milestone.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm text-muted-foreground truncate">
                        {milestone.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{milestone.display_order}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={milestone.is_active ? "default" : "secondary"}>
                      {milestone.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleToggleStatus(
                            milestone.id,
                            milestone.is_active,
                            milestone.title
                          )
                        }
                        disabled={isPending || togglingId === milestone.id}
                      >
                        {milestone.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Link href={`/admin/stories/journey/${milestone.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending || deletingId === milestone.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the milestone "{milestone.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(milestone.id, milestone.title)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}