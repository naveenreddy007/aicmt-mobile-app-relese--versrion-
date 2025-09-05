"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { OrderStatusTracker } from '@/components/order-status-tracker'
import { Package, Search, Filter, Eye, Edit, Truck, CheckCircle, Clock, X, User, Mail, Phone, MapPin, Download, Save, Calendar } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  shipping_address: any
  payment_method: string
  notes?: string
  user_id: string
  profiles: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  order_items: {
    id: string
    quantity: number
    price: number
    products: {
      name: string
      image_url?: string
      sku?: string
    }
  }[]
}

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusNotes, setStatusNotes] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!user) {
      redirect('/login')
    }
    
    // Check if user is admin (you might want to add role checking here)
    const loadOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            shipping_address,
            payment_method,
            notes,
            user_id,
            profiles (
              first_name,
              last_name,
              email,
              phone
            ),
            order_items (
              id,
              quantity,
              price,
              products (
                name,
                image_url,
                sku
              )
            )
          `)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error loading orders:', error)
          toast.error('Failed to load orders')
          return
        }
        
        setOrders(data || [])
        setFilteredOrders(data || [])
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    
    loadOrders()
  }, [user])

  useEffect(() => {
    let filtered = [...orders]
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${order.profiles.first_name} ${order.profiles.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_items.some(item => 
          item.products.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.products.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter)
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'amount-high':
          return b.total_amount - a.total_amount
        case 'amount-low':
          return a.total_amount - b.total_amount
        case 'customer':
          return `${a.profiles.first_name} ${a.profiles.last_name}`.localeCompare(`${b.profiles.first_name} ${b.profiles.last_name}`)
        default:
          return 0
      }
    })
    
    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, sortBy])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'confirmed':
      case 'processing':
        return <Package className="w-3 h-3" />
      case 'shipped':
        return <Truck className="w-3 h-3" />
      case 'delivered':
        return <CheckCircle className="w-3 h-3" />
      case 'cancelled':
        return <X className="w-3 h-3" />
      default:
        return <Package className="w-3 h-3" />
    }
  }

  const getTotalItems = (order: Order) => {
    return order.order_items.reduce((total, item) => total + item.quantity, 0)
  }

  const handleStatusUpdate = async (trackingNumber?: string) => {
    if (!selectedOrder || !newStatus) return
    
    setUpdating(true)
    try {
      const updateData: any = { 
        status: newStatus,
        notes: statusNotes || selectedOrder.notes
      }
      
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber
      }
      
      if (newStatus === 'shipped' && !trackingNumber) {
        // Set estimated delivery to 7 days from now for shipped orders
        const estimatedDelivery = new Date()
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)
        updateData.estimated_delivery = estimatedDelivery.toISOString()
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', selectedOrder.id)
      
      if (error) {
        console.error('Error updating order:', error)
        toast.error('Failed to update order status')
        return
      }
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: newStatus, notes: statusNotes || order.notes }
          : order
      ))
      
      toast.success('Order status updated successfully')
      setUpdateDialogOpen(false)
      setSelectedOrder(null)
      setNewStatus('')
      setStatusNotes('')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const openUpdateDialog = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setStatusNotes(order.notes || '')
    setUpdateDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Manage and process customer orders</p>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by order ID, customer name, email, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Highest Amount</SelectItem>
                  <SelectItem value="amount-low">Lowest Amount</SelectItem>
                  <SelectItem value="customer">Customer Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
              </h3>
              <p className="text-gray-600">
                {orders.length === 0 
                  ? 'Orders will appear here when customers place them'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-gray-900">
                          #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{order.profiles.first_name} {order.profiles.last_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Mail className="w-4 h-4" />
                            <span>{order.profiles.email}</span>
                          </div>
                          {order.profiles.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{order.profiles.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-gray-600 mb-1">
                            <strong>Placed:</strong> {formatDate(order.created_at)}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <strong>Items:</strong> {getTotalItems(order)}
                          </p>
                          <p className="text-gray-600">
                            <strong>Payment:</strong> {order.payment_method}
                          </p>
                        </div>
                      </div>
                      
                      {order.order_items.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600 truncate">
                            <strong>Products:</strong> {order.order_items.slice(0, 3).map(item => 
                              `${item.products.name} (${item.quantity}x)`
                            ).join(', ')}
                            {order.order_items.length > 3 && ` +${order.order_items.length - 3} more`}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Order Total */}
                    <div className="text-center xl:text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row xl:flex-col gap-2">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Manage Order #{order.id.slice(-8).toUpperCase()}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Order Status Tracker */}
                            <div>
                              <OrderStatusTracker
                                currentStatus={order.status}
                                orderDate={order.created_at}
                                estimatedDelivery={order.estimated_delivery}
                                trackingNumber={order.tracking_number}
                                showDetails={true}
                              />
                            </div>
                            
                            {/* Order Management */}
                            <div className="space-y-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Update Order Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select 
                                      value={newStatus || order.status} 
                                      onValueChange={setNewStatus}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                   
                                   {(newStatus === 'shipped' || order.status === 'shipped') && (
                                     <div>
                                       <Label htmlFor="tracking">Tracking Number</Label>
                                       <Input
                                         id="tracking"
                                         placeholder="Enter tracking number"
                                         defaultValue={order.tracking_number || ''}
                                         onChange={(e) => setTrackingNumber(e.target.value)}
                                       />
                                     </div>
                                   )}
                                   
                                   <div>
                                     <Label htmlFor="notes">Order Notes</Label>
                                    <Textarea
                                      id="notes"
                                      placeholder="Add notes about this order..."
                                      value={statusNotes}
                                      onChange={(e) => setStatusNotes(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                  
                                  <Button 
                                     onClick={() => {
                                       setSelectedOrder(order)
                                       handleStatusUpdate(trackingNumber)
                                     }}
                                     disabled={updating}
                                     className="w-full"
                                   >
                                     <Save className="w-4 h-4 mr-2" />
                                     {updating ? 'Updating...' : 'Update Order'}
                                   </Button>
                                </CardContent>
                              </Card>
                              
                              {/* Customer Information */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Customer Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{order.profiles ? `${order.profiles.first_name} ${order.profiles.last_name}` : 'N/A'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{order.profiles?.email || 'N/A'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{order.profiles?.phone || 'N/A'}</span>
                                  </div>
                                  {order.shipping_address && (
                                    <div className="flex items-start gap-2">
                                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                      <div className="text-sm">
                                        <div>{order.shipping_address.address}</div>
                                        <div>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</div>
                                        <div>{order.shipping_address.country}</div>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                          
                          {/* Order Items */}
                          <div className="mt-6">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Order Items</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Product</TableHead>
                                      <TableHead>Quantity</TableHead>
                                      <TableHead>Price</TableHead>
                                      <TableHead>Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {order.order_items?.map((item: any, index: number) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.products?.name || 'Unknown Product'}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{formatPrice(item.price)}</TableCell>
                                        <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                <div className="border-t pt-4 mt-4">
                                  <div className="flex justify-between items-center font-semibold">
                                    <span>Total Amount:</span>
                                    <span>{formatPrice(order.total_amount)}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Status Update Dialog */}
        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Order #{selectedOrder.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="font-medium">{selectedOrder.profiles.first_name} {selectedOrder.profiles.last_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any notes about this status update..."
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setUpdateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleStatusUpdate}
                    disabled={updating || !newStatus}
                    className="flex-1"
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Summary Stats */}
        {orders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-yellow-600">
                    {orders.filter(order => order.status.toLowerCase() === 'pending').length}
                  </p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">
                    {orders.filter(order => order.status.toLowerCase() === 'confirmed').length}
                  </p>
                  <p className="text-xs text-gray-600">Confirmed</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">
                    {orders.filter(order => order.status.toLowerCase() === 'processing').length}
                  </p>
                  <p className="text-xs text-gray-600">Processing</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold text-indigo-600">
                    {orders.filter(order => order.status.toLowerCase() === 'shipped').length}
                  </p>
                  <p className="text-xs text-gray-600">Shipped</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {orders.filter(order => order.status.toLowerCase() === 'delivered').length}
                  </p>
                  <p className="text-xs text-gray-600">Delivered</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold text-red-600">
                    {orders.filter(order => order.status.toLowerCase() === 'cancelled').length}
                  </p>
                  <p className="text-xs text-gray-600">Cancelled</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(orders.reduce((sum, order) => sum + order.total_amount, 0))}
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}