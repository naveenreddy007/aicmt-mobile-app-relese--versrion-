"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { MoreHorizontal, Edit, Trash2, Eye, FileText } from "lucide-react"
import { toast } from "sonner"

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
import { getCertificates, deleteCertificate, toggleCertificateStatus } from "@/app/actions/certificates"
import { type Certificate } from "@/lib/types/certificates"

export function CertificationsTable() {
  const [certifications, setCertifications] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetchCertifications()
  }, [])

  async function fetchCertifications() {
    try {
      const data = await getCertificates()
      setCertifications(data)
    } catch (error) {
      console.error("Error fetching certifications:", error)
      toast.error("Failed to fetch certifications")
    } finally {
      setLoading(false)
    }
  }

  function handleDeleteCertification(id: string) {
    startTransition(async () => {
      try {
        const result = await deleteCertificate(id)
        if (result.success) {
          setCertifications(certifications.filter(cert => cert.id !== id))
          toast.success("Certification deleted successfully")
        } else {
          toast.error(result.error || "Failed to delete certification")
        }
      } catch (error) {
        console.error("Error deleting certification:", error)
        toast.error("Failed to delete certification")
      }
    })
  }

  function handleToggleStatus(id: string, currentStatus: boolean) {
    startTransition(async () => {
      try {
        const result = await toggleCertificateStatus(id, currentStatus)
        if (result.success) {
          setCertifications(certifications.map(cert => 
            cert.id === id ? { ...cert, is_active: !currentStatus } : cert
          ))
          toast.success(`Certification ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        } else {
          toast.error(result.error || "Failed to update certification status")
        }
      } catch (error) {
        console.error("Error updating certification status:", error)
        toast.error("Failed to update certification status")
      }
    })
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
            <TableHead>Certificate Number</TableHead>
            <TableHead>Issuing Authority</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No certifications found.
                <Link href="/admin/certifications/new" className="ml-2 text-primary hover:underline">
                  Add your first certification!
                </Link>
              </TableCell>
            </TableRow>
          ) : (
            certifications.map((certification) => (
              <TableRow key={certification.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{certification.title}</div>
                    {certification.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {certification.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{certification.certificate_number}</TableCell>
                <TableCell>{certification.issuing_authority}</TableCell>
                <TableCell>
                  {certification.issue_date ? format(new Date(certification.issue_date), "MMM dd, yyyy") : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={certification.is_active ? "default" : "secondary"}>
                    {certification.is_active ? "Active" : "Inactive"}
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
                        <Link href={`/admin/certifications/edit/${certification.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {certification.document_url && (
                        <DropdownMenuItem asChild>
                          <a href={certification.document_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-4 w-4" />
                            View Document
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(certification.id, certification.is_active)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {certification.is_active ? "Deactivate" : "Activate"}
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
                              This action cannot be undone. This will permanently delete the certification.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCertification(certification.id)}
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