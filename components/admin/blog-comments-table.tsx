"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle, MoreHorizontal, Trash2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
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
import { approveComment, deleteComment } from "@/app/actions/blog"
import type { BlogComment } from "@/app/actions/blog"

interface ExtendedBlogComment extends BlogComment {
  post_title?: string
}

export function BlogCommentsTable({ initialComments }: { initialComments: ExtendedBlogComment[] }) {
  const router = useRouter()
  const [comments, setComments] = useState<ExtendedBlogComment[]>(initialComments)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<ExtendedBlogComment | null>(null)

  const columns: ColumnDef<ExtendedBlogComment>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "content",
      header: "Comment",
      cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("content")}</div>,
    },
    {
      accessorKey: "post_title",
      header: "Post",
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.original.post_title || "Unknown Post"}</div>,
    },
    {
      accessorKey: "is_approved",
      header: "Status",
      cell: ({ row }) => {
        const isApproved = row.getValue("is_approved") as boolean
        return (
          <Badge variant={isApproved ? "success" : "outline"} className="capitalize">
            {isApproved ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
            {isApproved ? "Approved" : "Pending"}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(String(row.getValue(id)))
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string
        return <div className="text-sm">{format(new Date(date), "MMM d, yyyy")}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const comment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {!comment.is_approved && (
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      const result = await approveComment(comment.id)
                      if (result.error) {
                        toast({
                          title: "Error",
                          description: result.error,
                          variant: "destructive",
                        })
                      } else {
                        setComments(comments.map((c) => (c.id === comment.id ? { ...c, is_approved: true } : c)))
                        toast({
                          title: "Comment Approved",
                          description: "The comment has been approved successfully.",
                        })
                      }
                    } catch (error) {
                      console.error("Error approving comment:", error)
                      toast({
                        title: "Error",
                        description: "Failed to approve the comment. Please try again.",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCommentToDelete(comment)
                  setDeleteDialogOpen(true)
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: comments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleDeleteComment = async () => {
    if (!commentToDelete) return

    try {
      const result = await deleteComment(commentToDelete.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setComments(comments.filter((comment) => comment.id !== commentToDelete.id))
        toast({
          title: "Comment deleted",
          description: "The comment has been deleted successfully.",
        })
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete the comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setCommentToDelete(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by name or email..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button
            variant={table.getColumn("is_approved")?.getFilterValue() === "true" ? "default" : "outline"}
            onClick={() => {
              const currentFilter = table.getColumn("is_approved")?.getFilterValue()
              if (currentFilter === "true") {
                table.getColumn("is_approved")?.setFilterValue(undefined)
              } else {
                table.getColumn("is_approved")?.setFilterValue("true")
              }
            }}
            size="sm"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approved
          </Button>
          <Button
            variant={table.getColumn("is_approved")?.getFilterValue() === "false" ? "default" : "outline"}
            onClick={() => {
              const currentFilter = table.getColumn("is_approved")?.getFilterValue()
              if (currentFilter === "false") {
                table.getColumn("is_approved")?.setFilterValue(undefined)
              } else {
                table.getColumn("is_approved")?.setFilterValue("false")
              }
            }}
            size="sm"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Pending
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No comments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this comment. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
