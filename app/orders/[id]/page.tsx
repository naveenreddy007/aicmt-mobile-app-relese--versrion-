"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Package, Truck, CreditCard, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  products: {
    name: string
    image_url?: string
    description?: string
  }
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  created_at: string
  shipping_address: any
  payment_method: string
  tracking_number?: string
  order_items: OrderItem[]
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setOrderId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!user || !orderId) {
      if (!user) redirect('/login')
      return
    }
    
    const loadOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                name,
                image_url,
                description
              )
            )
          `)
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single()
        
        if (error) {
          console.error('Error loading order:', error)
          toast.error('Order not found')
          return
        }
        
        setOrder(data)
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    
    loadOrder()
  }, [user, orderId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'confirmed':
        return <Package className="w-4 h-4" />
      case 'processing':
        return <Package className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const downloadInvoice = async () => {
    try {
      // In a real app, this would generate and download a PDF invoice
      toast.success('Invoice download started')
    } catch (error) {
      toast.error('Failed to download invoice')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been received.</p>
          </div>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order #{order.id.slice(-8).toUpperCase()}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span className="capitalize">{order.payment_method}</span>
                </div>
                {order.tracking_number && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Tracking Number</h3>
                    <p className="text-sm text-gray-600 font-mono">{order.tracking_number}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Total</h3>
                <p className="text-2xl font-bold text-green-600">{formatPrice(order.total_amount)}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={downloadInvoice}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.products.image_url ? (
                      <Image
                        src={item.products.image_url}
                        alt={item.products.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.products.name}</h4>
                    {item.products.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.products.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(item.price)}</p>
                    <p className="text-sm text-gray-600">each</p>
                    <p className="text-sm font-medium text-green-600 mt-1">
                      Total: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Order Total</span>
              <span className="text-2xl font-bold text-green-600">{formatPrice(order.total_amount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                </div>
              </div>
              
              {order.status !== 'pending' && (
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status.toLowerCase())
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    <Package className={`w-4 h-4 ${
                      ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status.toLowerCase())
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-600">Your order has been confirmed and is being prepared</p>
                  </div>
                </div>
              )}
              
              {['shipped', 'delivered'].includes(order.status.toLowerCase()) && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Shipped</p>
                    <p className="text-sm text-gray-600">Your order is on its way</p>
                    {order.tracking_number && (
                      <p className="text-sm text-blue-600">Tracking: {order.tracking_number}</p>
                    )}
                  </div>
                </div>
              )}
              
              {order.status.toLowerCase() === 'delivered' && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Delivered</p>
                    <p className="text-sm text-gray-600">Your order has been delivered successfully</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}