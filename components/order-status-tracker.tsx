"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Clock, Package, Truck, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OrderStatusTrackerProps {
  currentStatus: string
  orderDate: string
  estimatedDelivery?: string
  trackingNumber?: string
  showDetails?: boolean
}

const statusSteps = [
  {
    key: 'pending',
    label: 'Order Placed',
    description: 'Your order has been received and is being processed',
    icon: Clock
  },
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    description: 'Your order has been confirmed and is being prepared',
    icon: CheckCircle
  },
  {
    key: 'processing',
    label: 'Processing',
    description: 'Your order is being prepared for shipment',
    icon: Package
  },
  {
    key: 'shipped',
    label: 'Shipped',
    description: 'Your order is on its way to you',
    icon: Truck
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Your order has been delivered successfully',
    icon: CheckCircle
  }
]

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

const getStatusIndex = (status: string) => {
  const index = statusSteps.findIndex(step => step.key === status.toLowerCase())
  return index === -1 ? 0 : index
}

export function OrderStatusTracker({ 
  currentStatus, 
  orderDate, 
  estimatedDelivery, 
  trackingNumber,
  showDetails = true 
}: OrderStatusTrackerProps) {
  const currentIndex = getStatusIndex(currentStatus)
  const isCancelled = currentStatus.toLowerCase() === 'cancelled'

  if (isCancelled) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Order Cancelled</h3>
              <p className="text-sm text-gray-600">This order has been cancelled</p>
            </div>
          </div>
          <Badge className={getStatusColor(currentStatus)}>
            Cancelled
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg">Order Status</h3>
            <p className="text-sm text-gray-600">
              Placed on {new Date(orderDate).toLocaleDateString()}
            </p>
          </div>
          <Badge className={getStatusColor(currentStatus)}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Badge>
        </div>

        {/* Status Timeline */}
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex
            const isCurrent = index === currentIndex
            const IconComponent = step.icon

            return (
              <div key={step.key} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "p-2 rounded-full border-2 transition-colors",
                      isCompleted
                        ? "bg-green-100 border-green-500 text-green-600"
                        : isCurrent
                        ? "bg-blue-100 border-blue-500 text-blue-600"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={cn(
                        "w-0.5 h-8 mt-2 transition-colors",
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h4
                    className={cn(
                      "font-medium transition-colors",
                      isCompleted
                        ? "text-green-600"
                        : isCurrent
                        ? "text-blue-600"
                        : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </h4>
                  {showDetails && (
                    <p
                      className={cn(
                        "text-sm mt-1 transition-colors",
                        isCompleted || isCurrent ? "text-gray-600" : "text-gray-400"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                  {isCurrent && trackingNumber && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border">
                      <p className="text-sm text-blue-800">
                        <strong>Tracking Number:</strong> {trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Estimated Delivery */}
        {estimatedDelivery && currentStatus !== 'delivered' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Estimated Delivery: {new Date(estimatedDelivery).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}