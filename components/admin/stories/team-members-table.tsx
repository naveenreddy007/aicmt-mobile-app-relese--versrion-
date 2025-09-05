"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { TeamMember } from "@/lib/types/stories"
import { deleteTeamMember, toggleTeamMemberStatus } from "@/app/actions/stories"

interface TeamMembersTableProps {
  members: TeamMember[]
}

export function TeamMembersTable({ members }: TeamMembersTableProps) {
  const [isPending, startTransition] = useTransition()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleTeamMemberStatus(id, !currentStatus)
        toast.success(`Team member ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      } catch (error) {
        toast.error('Failed to update team member status')
      }
    })
  }

  const handleDeleteClick = (member: TeamMember) => {
    setMemberToDelete(member)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!memberToDelete) return

    setIsLoading(true)
    try {
      await deleteTeamMember(memberToDelete.id)
      toast.success("Team member deleted successfully")
      setDeleteDialogOpen(false)
      setMemberToDelete(null)
    } catch (error) {
      toast.error("Failed to delete team member")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'leadership':
        return 'bg-purple-100 text-purple-800'
      case 'team':
        return 'bg-blue-100 text-blue-800'
      case 'advisors':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No team members found.</p>
        <Link href="/admin/stories/team/new">
          <Button className="mt-4">Add First Team Member</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Members ({members?.length || 0})</h3>
        <Link href="/admin/stories/team/new">
          <Button>Add Team Member</Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="w-10 h-10 relative rounded-full overflow-hidden">
                    <Image
                      src={member.image_url || '/placeholder-avatar.jpg'}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>
                  <Badge className={getRoleColor(member.role)}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={member.is_active ? "default" : "secondary"}>
                    {member.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(member.id, member.is_active)}
                      disabled={isPending}
                    >
                      {member.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Link href={`/admin/stories/team/${member.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(member)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{memberToDelete?.name}"? This action
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