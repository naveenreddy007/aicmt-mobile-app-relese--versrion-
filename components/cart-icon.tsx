"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

interface CartIconProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  showText?: boolean
  className?: string
}

export function CartIcon({ 
  variant = 'ghost', 
  size = 'default', 
  showText = false,
  className = ''
}: CartIconProps) {
  const { user } = useAuth()
  const { totalItems } = useCart()

  if (!user) {
    return null
  }

  return (
    <Link href="/cart">
      <Button variant={variant} size={size} className={`relative ${className}`}>
        <ShoppingCart className="w-5 h-5" />
        {showText && <span className="ml-2">Cart</span>}
        {totalItems > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  )
}

export default CartIcon