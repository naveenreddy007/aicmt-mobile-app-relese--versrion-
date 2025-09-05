"use client"

import React, { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Truck, Shield, ArrowLeft, Lock, Smartphone, Building, Wallet } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { createRazorpayOrder, verifyRazorpayPayment } from '@/lib/razorpay'

// Declare Razorpay interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentInfo {
  method: 'card' | 'paypal' | 'bank'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })
  
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review

  useEffect(() => {
    if (!user) {
      redirect('/login')
    }
    
    if (items.length === 0) {
      redirect('/cart')
    }
    
    // Load user profile to pre-fill shipping info
    const loadUserProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setUserProfile(data)
        setShippingInfo(prev => ({
          ...prev,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: user.email || '',
          phone: data.phone || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zip_code || '',
          country: data.country || 'US'
        }))
      }
    }
    
    loadUserProfile()
  }, [user, items])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const calculateTax = () => totalPrice * 0.08
  const calculateShipping = () => totalPrice > 50 ? 0 : 9.99
  const calculateTotal = () => totalPrice + calculateTax() + calculateShipping()

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate shipping info
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode']
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof ShippingInfo])
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required shipping information')
      return
    }
    
    setStep(2)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (paymentInfo.method === 'card') {
      const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName']
      const missingFields = requiredFields.filter(field => !paymentInfo[field as keyof PaymentInfo])
      
      if (missingFields.length > 0) {
        toast.error('Please fill in all payment information')
        return
      }
    }
    
    setStep(3)
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please log in to place an order')
      return
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    setLoading(true)
    
    try {
      // Create Razorpay order
      const orderAmount = Math.round(calculateTotal() * 100) // Convert to paise
      const razorpayOrderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          amount: orderAmount,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          shipping_info: shippingInfo,
          items: items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product_price
          }))
        })
      })
      
      if (!razorpayOrderResponse.ok) {
        throw new Error('Failed to create Razorpay order')
      }
      
      const { razorpay_order, order_id } = await razorpayOrderResponse.json()
      
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        
        await new Promise((resolve) => {
          script.onload = resolve
        })
      }
      
      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpay_order.amount,
        currency: razorpay_order.currency,
        name: 'E-Commerce Store',
        description: 'Order Payment',
        order_id: razorpay_order.id,
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone
        },
        theme: {
          color: '#2563eb'
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order_id
              })
            })
            
            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }
            
            const verifyData = await verifyResponse.json()
            
            if (verifyData.success) {
              // Clear cart
              await clearCart()
              
              toast.success('Payment successful! Order placed.')
              
              // Redirect to order confirmation
              window.location.href = `/orders/${order_id}`
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled')
            setLoading(false)
          }
        }
      }
      
      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()
      
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to initiate payment. Please try again.')
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            step >= stepNumber 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  const renderShippingForm = () => (
    <form onSubmit={handleShippingSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={shippingInfo.firstName}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={shippingInfo.lastName}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={shippingInfo.email}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={shippingInfo.phone}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={shippingInfo.city}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={shippingInfo.state}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={shippingInfo.zipCode}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Link href="/cart">
          <Button type="button" variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
        </Link>
        <Button type="submit">
          Continue to Payment
        </Button>
      </div>
    </form>
  )

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Choose Payment Method</Label>
        <p className="text-sm text-gray-600 mt-1">Secure payment powered by Razorpay</p>
      </div>
      
      {/* Payment Method Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium">Cards</h3>
                <p className="text-sm text-gray-600">Credit & Debit Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium">UPI</h3>
                <p className="text-sm text-gray-600">Pay using UPI apps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-medium">Net Banking</h3>
                <p className="text-sm text-gray-600">All major banks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-medium">Wallets</h3>
                <p className="text-sm text-gray-600">Paytm, PhonePe & more</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Security Features */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">Secure Payment</span>
        </div>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 256-bit SSL encryption</li>
          <li>• PCI DSS compliant</li>
          <li>• No card details stored</li>
          <li>• Instant refunds available</li>
        </ul>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setStep(1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shipping
        </Button>
        <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
          Review Order
        </Button>
      </div>
    </div>
  )

  const renderOrderReview = () => (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                {item.product_image ? (
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    width={64}
                    height={64}
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-xs">No Image</div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.product_name}</h4>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.product_price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Shipping & Payment Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
              <p>{shippingInfo.address}</p>
              <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
              <p>{shippingInfo.country}</p>
              <p>{shippingInfo.email}</p>
              {shippingInfo.phone && <p>{shippingInfo.phone}</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Razorpay Secure Payment</span>
              </div>
              <p className="text-gray-600">Multiple payment options available:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span>Cards</span>
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  <span>UPI</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  <span>Net Banking</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  <span>Wallets</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Terms Agreement */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreeToTerms}
          onCheckedChange={setAgreeToTerms}
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        </Label>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setStep(2)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Payment
        </Button>
        <Button 
          onClick={handlePlaceOrder} 
          disabled={!agreeToTerms || loading}
          className="bg-green-600 hover:bg-green-700"
        >
          <Lock className="w-4 h-4 mr-2" />
          {loading ? 'Processing...' : `Place Order - ${formatPrice(calculateTotal())}`}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in just a few steps</p>
        </div>
        
        {renderStepIndicator()}
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {step === 1 && <><Truck className="w-5 h-5" /> Shipping Information</>}
                  {step === 2 && <><CreditCard className="w-5 h-5" /> Payment Information</>}
                  {step === 3 && <><Shield className="w-5 h-5" /> Review Order</>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {step === 1 && renderShippingForm()}
                {step === 2 && renderPaymentForm()}
                {step === 3 && renderOrderReview()}
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{calculateShipping() === 0 ? 'Free' : formatPrice(calculateShipping())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(calculateTax())}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Secure SSL encryption
                  </p>
                  <p className="flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Free shipping on orders over $50
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}