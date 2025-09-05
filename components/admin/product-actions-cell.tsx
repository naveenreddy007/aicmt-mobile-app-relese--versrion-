"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Eye, MoreHorizontal, Trash, Loader2 } from "lucide-react"
import { useState } from "react"

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { deleteProduct } from "@/app/actions/products" // Assuming you have this server action

interface ProductActionsCellProps {
  productId: string
  productName: string
}

export function ProductActionsCell({ productId, productName }: ProductActionsCellProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteProduct(productId)
      if (result.error) {
        toast({
          title: "Error Deleting Product",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Product Deleted",
          description: `"${productName}" has been successfully deleted.`,
        })
        // No need to call router.refresh() here, revalidatePath in server action handles it
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the product.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsAlertOpen(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/products/${productId}`} target="_blank" className="flex items-center w-full">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/products/edit/${productId}`} className="flex items-center w-full">
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsAlertOpen(true)}
            className="text-red-600 focus:text-red-700 focus:bg-red-50"
          >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />}
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              <span className="font-semibold"> {productName}</span> and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, delete product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
