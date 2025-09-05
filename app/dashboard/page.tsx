"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Package, 
  ShoppingCart, 
  Heart, 
  Settings, 
  LogOut,
  Calendar,
  CreditCard,
  MapPin
} from "lucide-react"
import { toast } from "sonner"

interface Order {
  id: string
  created_at: string
  status: string
  total_amount: number
  items: any[]
}

interface Profile {
  id: string
  first_name: string
  last_name: string
  role: string
  phone?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  avatar_url?: string
  company?: string
  position?: string
  bio?: string
  preferences?: any
  created_at?: string
  updated_at?: string
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchUserData()
  }, [user, router])

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
      } else {
        setProfile(profileData)
      }

      // Fetch recent orders (if orders table exists)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (!ordersError) {
        setOrders(ordersData || [])
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-green-100 text-green-600">
                {profile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Customer'}!
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/products')}>
            <CardContent className="flex items-center p-6">
              <Package className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Browse</p>
                <p className="text-lg font-semibold">Products</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/cart')}>
            <CardContent className="flex items-center p-6">
              <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Shopping</p>
                <p className="text-lg font-semibold">Cart</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/wishlist')}>
            <CardContent className="flex items-center p-6">
              <Heart className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">My</p>
                <p className="text-lg font-semibold">Wishlist</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/profile')}>
            <CardContent className="flex items-center p-6">
              <Settings className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Account</p>
                <p className="text-lg font-semibold">Settings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {profile?.role || 'Customer'}
                </Badge>
              </div>
              
              {profile?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone</span>
                  <span className="text-sm font-medium">{profile.phone}</span>
                </div>
              )}
              
              {profile?.address && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-gray-600">Address</span>
                  <span className="text-sm font-medium text-right max-w-[200px]">{profile.address}</span>
                </div>
              )}
              
              <Separator />
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => router.push('/profile')}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total_amount?.toFixed(2) || '0.00'}</p>
                        <Badge 
                          variant={order.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => router.push('/orders')}
                  >
                    View All Orders
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <Button onClick={() => router.push('/products')}>
                    Start Shopping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}