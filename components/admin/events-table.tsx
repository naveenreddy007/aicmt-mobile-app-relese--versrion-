"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { MoreHorizontal, Edit, Trash2, Eye, Calendar, Star } from "lucide-react"
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

interface Event {
  id: string
  title: string
  description: string
  content: string
  event_date: string | null
  location: string | null
  image_url: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export function EventsTable() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function deleteEvent(id: string) {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id)

      if (error) throw error

      setEvents(events.filter(event => event.id !== id))
      toast({
        title: "Success",
        description: "Event deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from("events")
        .update({ is_active: !currentStatus })
        .eq("id", id)

      if (error) throw error

      setEvents(events.map(event => 
        event.id === id ? { ...event, is_active: !currentStatus } : event
      ))
      
      toast({
        title: "Success",
        description: `Event ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      })
    } catch (error) {
      console.error("Error updating event status:", error)
      toast({
        title: "Error",
        description: "Failed to update event status",
        variant: "destructive",
      })
    }
  }

  async function toggleFeatured(id: string, currentFeatured: boolean) {
    try {
      const { error } = await supabase
        .from("events")
        .update({ is_featured: !currentFeatured })
        .eq("id", id)

      if (error) throw error

      setEvents(events.map(event => 
        event.id === id ? { ...event, is_featured: !currentFeatured } : event
      ))
      
      toast({
        title: "Success",
        description: `Event ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
      })
    } catch (error) {
      console.error("Error updating event featured status:", error)
      toast({
        title: "Error",
        description: "Failed to update event featured status",
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
            <TableHead>Event Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No events found.
                <Link href="/admin/events/new" className="ml-2 text-primary hover:underline">
                  Add your first event!
                </Link>
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="flex items-center gap-2">
                      {event.title}
                      {event.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    {event.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {event.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {event.event_date ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.event_date), "MMM dd, yyyy HH:mm")}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{event.location || "-"}</TableCell>
                <TableCell>
                  <Badge variant={event.is_featured ? "default" : "secondary"}>
                    {event.is_featured ? "Featured" : "Regular"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={event.is_active ? "default" : "secondary"}>
                    {event.is_active ? "Active" : "Inactive"}
                  </Badge>
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
                        <Link href={`/admin/events/edit/${event.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleFeatured(event.id, event.is_featured)}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        {event.is_featured ? "Unfeature" : "Feature"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleStatus(event.id, event.is_active)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {event.is_active ? "Deactivate" : "Activate"}
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
                              This action cannot be undone. This will permanently delete the event.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteEvent(event.id)}
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