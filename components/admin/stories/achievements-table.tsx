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
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, Trophy } from "lucide-react"
import { Achievement } from "@/lib/types/stories"
import { toggleAchievementStatus, deleteAchievement } from "@/app/actions/stories"
import { toast } from "sonner"

interface AchievementsTableProps {
  achievements: Achievement[]
}

export function AchievementsTable({ achievements }: AchievementsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleStatus = async (achievement: Achievement) => {
    setIsLoading(true)
    try {
      await toggleAchievementStatus(achievement.id, !achievement.is_active)
      toast.success(
        `Achievement ${achievement.is_active ? "deactivated" : "activated"} successfully`
      )
    } catch (error) {
      toast.error("Failed to update achievement status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!achievementToDelete) return

    setIsLoading(true)
    try {
      await deleteAchievement(achievementToDelete.id)
      toast.success("Achievement deleted successfully")
      setDeleteDialogOpen(false)
      setAchievementToDelete(null)
    } catch (error) {
      toast.error("Failed to delete achievement")
    } finally {
      setIsLoading(false)
    }
  }

  if (!achievements || achievements.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No achievements found.</p>
        <Link href="/admin/stories/achievements/new">
          <Button className="mt-4">Add First Achievement</Button>
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
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {achievements.map((achievement) => (
              <TableRow key={achievement.id}>
                <TableCell>
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={achievement.image_url || "/placeholder-achievement.jpg"}
                      alt={achievement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{achievement.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{achievement.category}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(achievement.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={achievement.is_active ? "default" : "secondary"}>
                    {achievement.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(achievement.created_at).toLocaleDateString()}
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
                        <Link href={`/admin/stories/achievements/${achievement.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(achievement)}
                        disabled={isLoading}
                      >
                        {achievement.is_active ? (
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
                          setAchievementToDelete(achievement)
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
            <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{achievementToDelete?.title}"? This action
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