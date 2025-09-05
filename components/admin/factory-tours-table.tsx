"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { MoreHorizontal, Edit, Trash2, Eye, Video, ArrowUp, ArrowDown } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

interface FactoryTour {
  id: string
  title: string
  description: string | null
  video_type: 'upload' | 'url'
  video_file_path: string | null
  video_url: string | null
  thumbnail_image: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export function FactoryToursTable() {
  const [tours, setTours] = useState<FactoryTour[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTours()
  }, [])

  async function fetchTours() {
    try {
      const { data, error } = await supabase
        .from("factory_tours")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) throw error
      setTours(data || [])
    } catch (error) {
      console.error("Error fetching factory tours:", error)
      toast({
        title: "Error",
        description: "Failed to fetch factory tours",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function deleteTour(id: string) {
    try {
      const { error } = await supabase
        .from("factory_tours")
        .delete()
        .eq("id", id)

      if (error) throw error

      setTours(tours.filter(tour => tour.id !== id))
      toast({
        title: "Success",
        description: "Factory tour deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting factory tour:", error)
      toast({
        title: "Error",
        description: "Failed to delete factory tour",
        variant: "destructive",
      })
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from("factory_tours")
        .update({ is_active: !currentStatus })
        .eq("id", id)

      if (error) throw error

      setTours(tours.map(tour => 
        tour.id === id ? { ...tour, is_active: !currentStatus } : tour
      ))
      
      toast({
        title: "Success",
        description: `Factory tour ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      })
    } catch (error) {
      console.error("Error updating factory tour status:", error)
      toast({
        title: "Error",
        description: "Failed to update factory tour status",
        variant: "destructive",
      })
    }
  }

  async function updateDisplayOrder(id: string, direction: 'up' | 'down') {
    const currentTour = tours.find(tour => tour.id === id)
    if (!currentTour) return

    const sortedTours = [...tours].sort((a, b) => a.display_order - b.display_order)
    const currentIndex = sortedTours.findIndex(tour => tour.id === id)
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedTours.length - 1)
    ) {
      return
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const targetTour = sortedTours[targetIndex]

    try {
      // Swap display orders
      const { error: error1 } = await supabase
        .from("factory_tours")
        .update({ display_order: targetTour.display_order })
        .eq("id", currentTour.id)

      const { error: error2 } = await supabase
        .from("factory_tours")
        .update({ display_order: currentTour.display_order })
        .eq("id", targetTour.id)

      if (error1 || error2) throw error1 || error2

      // Update local state
      setTours(tours.map(tour => {
        if (tour.id === currentTour.id) {
          return { ...tour, display_order: targetTour.display_order }
        }
        if (tour.id === targetTour.id) {
          return { ...tour, display_order: currentTour.display_order }
        }
        return tour
      }))

      toast({
        title: "Success",
        description: "Display order updated successfully",
      })
    } catch (error) {
      console.error("Error updating display order:", error)
      toast({
        title: "Error",
        description: "Failed to update display order",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Video Type</TableHead>
            <TableHead>Display Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tours.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No factory tours found.
                <Link href="/admin/factory-tour/new" className="ml-2 text-primary hover:underline">
                  Add your first factory tour!
                </Link>
              </TableCell>
            </TableRow>
          ) : (
            tours
              .sort((a, b) => a.display_order - b.display_order)
              .map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        {tour.title}
                      </div>
                      {tour.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {tour.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tour.video_type === 'upload' ? "default" : "secondary"}>
                      {tour.video_type === 'upload' ? 'Uploaded' : 'URL'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{tour.display_order}</span>
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => updateDisplayOrder(tour.id, 'up')}
                          disabled={tours.sort((a, b) => a.display_order - b.display_order)[0]?.id === tour.id}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => updateDisplayOrder(tour.id, 'down')}
                          disabled={tours.sort((a, b) => a.display_order - b.display_order)[tours.length - 1]?.id === tour.id}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tour.is_active ? "default" : "secondary"}>
                      {tour.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(tour.created_at), "MMM dd, yyyy")}
                  </TableCell>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/factory-tour/${tour.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleStatus(tour.id, tour.is_active)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {tour.is_active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the factory tour video.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTour(tour.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}