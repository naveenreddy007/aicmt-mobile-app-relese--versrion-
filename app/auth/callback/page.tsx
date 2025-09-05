"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed')
          router.push('/login')
          return
        }

        if (data.session?.user) {
          const user = data.session.user
          const isGoogleAuth = user.app_metadata?.provider === 'google'
          const isEmailVerified = user.email_confirmed_at !== null
          
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
            const nameParts = fullName.split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || ''
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                first_name: firstName,
                last_name: lastName,
                role: 'customer',
                avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
              })

            if (insertError) {
              console.error('Profile creation error:', insertError)
              toast.error('Failed to create user profile')
            } else {
              // Show appropriate welcome message based on auth method
              if (isGoogleAuth) {
                toast.success(`Welcome ${user.user_metadata?.name || 'to our platform'}! Your Google account has been connected successfully.`)
              } else if (isEmailVerified) {
                toast.success('Welcome! Your email has been verified and your account is ready.')
              } else {
                toast.success('Welcome! Your account has been created successfully.')
              }
            }
          } else if (profile) {
            // Returning user
            const displayName = profile.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'there'
            if (isGoogleAuth) {
              toast.success(`Welcome back, ${displayName}!`)
            } else {
              toast.success('Welcome back!')
            }
          }

          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        toast.error('An unexpected error occurred')
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we set up your account.</p>
      </div>
    </div>
  )
}