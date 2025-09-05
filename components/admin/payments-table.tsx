"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import { useToast } from "@/hooks/use-toast"
import { 
  updatePaymentStatus, 
  deletePayment, 
  type Payment 
} from "@/app/actions/payments"
import { 
  MoreHorizontal, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  RotateCcw
} from "lucide-react"
import { format } from "date-fns"

interface PaymentsTableProps {
  payments: Payment[]
  showQuotationInfo?: boolean
}

export function PaymentsTable({ payments, showQuotationInfo = false }: PaymentsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()

  const handleStatusUpdate = async (paymentId: string, status: Payment['status']) => {
    setLoading(true)
    try {
      const result = await updatePaymentStatus(paymentId, status)
      
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Payment status has been updated to ${status}.`,
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update payment status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPayment) return
    
    setLoading(true)
    try {
      const result = await deletePayment(selectedPayment.id)
      
      if (result.success) {
        toast({
          title: "Payment Deleted",
          description: "Payment has been deleted and quotation balance updated.",
        })
        setDeleteDialogOpen(false)
        setSelectedPayment(null)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete payment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Payment['status']) => {
    const variants = {
      completed: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      pending: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      failed: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
      refunded: { variant: "outline" as const, icon: RotateCcw, color: "text-blue-600" }
    }
    
    const config = variants[status]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatPaymentMethod = (method: string) => {
    return method.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No payments recorded yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
              {showQuotationInfo && <TableHead>Bill Number</TableHead>}
              <TableHead>Notes</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="font-medium">
                  ${payment.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {formatPaymentMethod(payment.payment_method)}
                </TableCell>
                <TableCell>
                  {payment.reference_number || '-'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(payment.status)}
                </TableCell>
                {showQuotationInfo && (
                  <TableCell>
                    {/* Add bill number if available from joined data */}
                    -
                  </TableCell>
                )}
                <TableCell className="max-w-[200px] truncate">
                  {payment.notes || '-'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {payment.status !== 'completed' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(payment.id, 'completed')}
                          disabled={loading}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      {payment.status !== 'pending' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(payment.id, 'pending')}
                          disabled={loading}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Mark as Pending
                        </DropdownMenuItem>
                      )}
                      {payment.status !== 'failed' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(payment.id, 'failed')}
                          disabled={loading}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Mark as Failed
                        </DropdownMenuItem>
                      )}
                      {payment.status !== 'refunded' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(payment.id, 'refunded')}
                          disabled={loading}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Mark as Refunded
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPayment(payment)
                          setDeleteDialogOpen(true)
                        }}
                        disabled={loading}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Payment
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
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment of ${selectedPayment?.amount.toFixed(2)}? 
              This will update the quotation balance and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete Payment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}