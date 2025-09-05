"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, Heart } from "lucide-react"
import { ImpactStory } from "@/lib/types/stories"
import { toggleImpactStoryStatus, deleteImpactStory } from "@/app/actions/stories"
import { toast } from "sonner"

interface ImpactStoriesTableProps {
  stories: ImpactStory[]
}

export function ImpactStoriesTable({ stories }: ImpactStoriesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<ImpactStory | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleStatus = async (story: ImpactStory) => {
    setIsLoading(true)
    try {
      await toggleImpactStoryStatus(story.id, !story.is_active)
      toast.success(
        `Impact story ${story.is_active ? "deactivated" : "activated"} successfully`
      )
    } catch (error) {
      toast.error("Failed to update impact story status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!storyToDelete) return

    setIsLoading(true)
    try {
      await deleteImpactStory(storyToDelete.id)
      toast.success("Impact story deleted successfully")
      setDeleteDialogOpen(false)
      setStoryToDelete(null)
    } catch (error) {
      toast.error("Failed to delete impact story")
    } finally {
      setIsLoading(false)
    }
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No impact stories found.</p>
        <Link href="/admin/stories/impact/new">
          <Button className="mt-4">Add First Impact Story</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Impact Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.map((story) => (
              <TableRow key={story.id}>
                <TableCell>
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={story.image_url || "/placeholder-impact.jpg"}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{story.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {story.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{story.category}</Badge>
                </TableCell>
                <TableCell>{story.impact_area || "General"}</TableCell>
                <TableCell>
                  <Badge variant={story.is_active ? "default" : "secondary"}>
                    {story.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(story.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/stories/impact/${story.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(story)}
                        disabled={isLoading}
                      >
                        {story.is_active ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setStoryToDelete(story)
                          setDeleteDialogOpen(true)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Impact Story</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{storyToDelete?.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}