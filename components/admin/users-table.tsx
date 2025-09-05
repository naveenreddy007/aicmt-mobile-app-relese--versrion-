"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, MoreHorizontal, Search, Trash } from "lucide-react"

// Mock data - this would come from Supabase in the real implementation
const initialUsers = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "admin",
    status: "active",
    lastActive: "2023-06-15T10:30:00Z",
    avatar: "/confident-professional.png",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "admin",
    status: "active",
    lastActive: "2023-06-14T14:45:00Z",
    avatar: "/confident-leader.png",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    role: "editor",
    status: "active",
    lastActive: "2023-06-13T09:15:00Z",
    avatar: "/confident-indian-professional.png",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    role: "editor",
    status: "inactive",
    lastActive: "2023-06-01T16:20:00Z",
    avatar: "/coding-commute.png",
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    role: "editor",
    status: "active",
    lastActive: "2023-06-10T11:10:00Z",
    avatar: "/confident-professional.png",
  },
]

export function UsersTable() {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const confirmDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setDeleteConfirmOpen(true)
  }

  const deleteUser = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete))
      setSelectedUsers((prev) => prev.filter((id) => id !== userToDelete))
      setUserToDelete(null)
      setDeleteConfirmOpen(false)
    }
  }

  const bulkDeleteUsers = () => {
    setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
    setSelectedUsers([])
  }

  const changeUserStatus = (userId: string, newStatus: string) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>
      case "editor":
        return <Badge className="bg-blue-500">Editor</Badge>
      case "viewer":
        return <Badge className="bg-green-500">Viewer</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedUsers.length} selected</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectedUsers.forEach((userId) => {
                  changeUserStatus(userId, "active")
                })
                setSelectedUsers([])
              }}
            >
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectedUsers.forEach((userId) => {
                  changeUserStatus(userId, "inactive")
                })
                setSelectedUsers([])
              }}
            >
              Deactivate
            </Button>
            <Button variant="destructive" size="sm" onClick={bulkDeleteUsers}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                  onCheckedChange={toggleAllUsers}
                  aria-label="Select all users"
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                      aria-label={`Select ${user.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{formatDate(user.lastActive)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/edit/${user.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "active" ? (
                          <DropdownMenuItem onClick={() => changeUserStatus(user.id, "inactive")}>
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => changeUserStatus(user.id, "active")}>
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => confirmDeleteUser(user.id)}>
                          <Trash className="mr-2 h-4 w-4" />
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

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
