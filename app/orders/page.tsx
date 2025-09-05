"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { OrderStatusTracker } from '@/components/order-status-tracker'
import { Package, Search, Filter, Eye, Download, Truck, CheckCircle, Clock, X } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  order_items: {
    quantity: number
    products: {
      name: string
      image_url?: string
    }
  }[]
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (!user) {
      redirect('/login')
    }
    
    const loadOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            order_items (
              quantity,
              products (
                name,
                image_url
              )
            )
          `)
          .eq('user_id', user.id)
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
        order.order_items.some(item => 
          item.products.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      day: 'numeric'
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

  const downloadInvoice = async (orderId: string) => {
    try {
      // In a real app, this would generate and download a PDF invoice
      toast.success('Invoice download started')
    } catch (error) {
      toast.error('Failed to download invoice')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders by ID or product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
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
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Highest Amount</SelectItem>
                  <SelectItem value="amount-low">Lowest Amount</SelectItem>
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
              <p className="text-gray-600 mb-6">
                {orders.length === 0 
                  ? 'Start shopping to see your orders here'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {orders.length === 0 && (
                <Link href="/products">
                  <Button>
                    Start Shopping
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Track
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order #{order.id.slice(-8).toUpperCase()} - Tracking Details</DialogTitle>
                            </DialogHeader>
                            <OrderStatusTracker
                              currentStatus={order.status}
                              orderDate={order.created_at}
                              estimatedDelivery={order.estimated_delivery}
                              trackingNumber={order.tracking_number}
                              showDetails={true}
                            />
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {order.order_items?.map((item: any, index: number) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.products?.name} × {item.quantity}</span>
                                    <span>{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-medium">
                                  <span>Total</span>
                                  <span>{formatPrice(order.total_amount)}</span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Placed on {formatDate(order.created_at)}</p>
                        <p>{getTotalItems(order)} item{getTotalItems(order) !== 1 ? 's' : ''}</p>
                        {order.order_items.length > 0 && (
                          <p className="truncate">
                            {order.order_items.slice(0, 2).map(item => item.products.name).join(', ')}
                            {order.order_items.length > 2 && ` +${order.order_items.length - 2} more`}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Order Total */}
                    <div className="text-center lg:text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto"
                        onClick={() => downloadInvoice(order.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {orders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(orders.reduce((sum, order) => sum + order.total_amount, 0))}
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {orders.filter(order => order.status.toLowerCase() === 'delivered').length}
                  </p>
                  <p className="text-sm text-gray-600">Delivered</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {orders.filter(order => ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status.toLowerCase())).length}
                  </p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}