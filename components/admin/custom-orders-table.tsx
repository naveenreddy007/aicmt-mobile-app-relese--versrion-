"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { updateCustomOrder } from "@/app/actions/custom-orders"
import { assignBillNumber } from "@/app/actions/bill-numbers"
import { useToast } from "@/components/ui/use-toast"

export function CustomOrdersTable({ orders }) {
  const router = useRouter()
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-500 hover:bg-blue-600"
      case "quoted":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "in-production":
        return "bg-purple-500 hover:bg-purple-600"
      case "completed":
        return "bg-green-500 hover:bg-green-600"
      case "cancelled":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCustomOrder(id, { status: newStatus })
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const handleBulkGenerateBillNumbers = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const ordersToUpdate = selectedRows.filter(row => !row.original.bill_number)
    
    if (ordersToUpdate.length === 0) {
      toast({
        title: "No Orders to Update",
        description: "All selected orders already have bill numbers assigned.",
        variant: "destructive",
      })
      return
    }

    try {
      for (const row of ordersToUpdate) {
        await assignBillNumber(row.original.id)
      }
      
      toast({
        title: "Bill Numbers Generated",
        description: `Generated bill numbers for ${ordersToUpdate.length} orders.`,
      })
      
      // Clear selection and refresh
      setRowSelection({})
      router.refresh()
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate bill numbers for selected orders.",
        variant: "destructive",
      })
    }
   }

  const handleGenerateBillNumber = async (orderId) => {
    try {
      await assignBillNumber(orderId)
      toast({
        title: "Bill Number Generated",
        description: "Bill number has been successfully generated for this order.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate bill number for this order.",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "company_name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("company_name")}</div>,
    },
    {
      accessorKey: "bill_number",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Bill Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const billNumber = row.getValue("bill_number")
        return (
          <div className="font-mono text-sm">
            {billNumber ? (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {billNumber}
              </Badge>
            ) : (
              <span className="text-muted-foreground">Not assigned</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "contact_name",
      header: "Contact",
      cell: ({ row }) => <div>{row.getValue("contact_name")}</div>,
    },
    {
      accessorKey: "product_name",
      header: "Product",
      cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => <div className="text-right">{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "quote_amount",
      header: "Quote Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("quote_amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="text-right font-medium">{amount ? formatted : ""}</div>
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment Status",
      cell: ({ row }) => {
        const paymentStatus = row.original.quotations?.[0]?.payment_status || "pending"
        const getPaymentStatusColor = (status) => {
          switch (status) {
            case "paid":
              return "bg-green-500 hover:bg-green-600"
            case "partial":
              return "bg-yellow-500 hover:bg-yellow-600"
            case "pending":
              return "bg-gray-500 hover:bg-gray-600"
            case "overdue":
              return "bg-red-500 hover:bg-red-600"
            default:
              return "bg-gray-500 hover:bg-gray-600"
          }
        }
        return (
          <Badge className={`${getPaymentStatusColor(paymentStatus)} text-white`}>
            {paymentStatus ? paymentStatus.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Pending"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "balance_amount",
      header: "Balance",
      cell: ({ row }) => {
        const quotation = row.original.quotations?.[0]
        if (!quotation) return <div className="text-right text-muted-foreground">-</div>
        
        const totalAmount = parseFloat(quotation.total_amount || 0)
        const receivedAmount = parseFloat(quotation.received_amount || 0)
        const balanceAmount = totalAmount - receivedAmount
        
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(balanceAmount)
        
        const getBalanceColor = () => {
          if (balanceAmount <= 0) return "text-green-600 font-medium"
          if (balanceAmount < totalAmount * 0.5) return "text-yellow-600 font-medium"
          return "text-red-600 font-medium"
        }
        
        return <div className={`text-right ${getBalanceColor()}`}>{formatted}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge className={`${getStatusColor(status)} text-white`}>
            {status ? status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "New"}
          </Badge>
        )
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
      cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original

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
              <DropdownMenuItem onClick={() => router.push(`/admin/custom-orders/${order.id}`)}>
                View Details
              </DropdownMenuItem>
              {!order.bill_number && (
                <DropdownMenuItem onClick={() => handleGenerateBillNumber(order.id)}>
                  Generate Bill Number
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "new")}>Mark as New</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "quoted")}>Mark as Quoted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "in-production")}>
                Mark as In Production
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "completed")}>
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")}>
                Mark as Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by company..."
          value={(table.getColumn("company_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("company_name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({table.getFilteredSelectedRowModel().rows.length}) <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark as Quoted</DropdownMenuItem>
                <DropdownMenuItem>Send Reminders</DropdownMenuItem>
                <DropdownMenuItem onClick={handleBulkGenerateBillNumbers}>
                  Generate Bill Numbers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No custom orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
