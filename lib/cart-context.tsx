"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  product_id: string
  product_name: string
  product_price: number
  product_image?: string
  quantity: number
  stock_quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  loading: boolean
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.product_price * item.quantity), 0)

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      refreshCart()
    } else {
      setItems([])
    }
  }, [user])

  const refreshCart = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          products (
            name,
            price,
            image_url,
            stock_quantity
          )
        `)
        .eq('user_id', user.id)

      if (error) {
        console.error('Cart fetch error:', error)
        toast.error('Failed to load cart')
        return
      }

      const cartItems: CartItem[] = data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.products.name,
        product_price: item.products.price,
        product_image: item.products.image_url,
        quantity: item.quantity,
        stock_quantity: item.products.stock_quantity,
      }))

      setItems(cartItems)
    } catch (error) {
      console.error('Error refreshing cart:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast.error('Please log in to add items to cart')
      return
    }

    try {
      // First, get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('name, price, image_url, stock_quantity')
        .eq('id', productId)
        .single()

      if (productError || !product) {
        toast.error('Product not found')
        return
      }

      if (product.stock_quantity < quantity) {
        toast.error('Not enough stock available')
        return
      }

      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Cart check error:', checkError)
        toast.error('Failed to add item to cart')
        return
      }

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.stock_quantity) {
          toast.error('Not enough stock available')
          return
        }

        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id)

        if (updateError) {
          console.error('Cart update error:', updateError)
          toast.error('Failed to update cart')
          return
        }
      } else {
        // Add new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: quantity,
          })

        if (insertError) {
          console.error('Cart insert error:', insertError)
          toast.error('Failed to add item to cart')
          return
        }
      }

      await refreshCart()
      toast.success('Item added to cart!')
    } catch (error) {
      console.error('Error adding item to cart:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return

    if (quantity <= 0) {
      await removeItem(productId)
      return
    }

    try {
      const item = items.find(item => item.product_id === productId)
      if (!item) return

      if (quantity > item.stock_quantity) {
        toast.error('Not enough stock available')
        return
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) {
        console.error('Cart update error:', error)
        toast.error('Failed to update cart')
        return
      }

      await refreshCart()
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const removeItem = async (productId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) {
        console.error('Cart remove error:', error)
        toast.error('Failed to remove item from cart')
        return
      }

      await refreshCart()
      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Error removing item from cart:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Cart clear error:', error)
        toast.error('Failed to clear cart')
        return
      }

      setItems([])
      toast.success('Cart cleared')
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}