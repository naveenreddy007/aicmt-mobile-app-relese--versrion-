"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User, AuthError } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resendVerificationEmail: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get session from Supabase
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
          // Continue with null session rather than blocking the app
        }
        setSession(data.session)
        setUser(data.session?.user ?? null)
      } catch (err) {
        console.error("Unexpected error getting session:", err)
        // Set to null session on unexpected errors
        setSession(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'No user')
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }
      
      return { error: null }
    } catch (err) {
      console.error('Unexpected sign in error:', err)
      return { error: { message: 'An unexpected error occurred during sign in' } as AuthError }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName || '',
          },
        },
      })

      if (error) {
        console.error('Signup error:', error)
        return { error }
      }

      // If signup is successful and user is created, create profile
      if (data.user) {
        // Split full name into first and last name
        const nameParts = (fullName || '').split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            role: 'customer',
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Don't return profile error as auth was successful
          // The profile will be created later in the callback if needed
        }
      }

      return { error: null }
    } catch (err) {
      console.error('Unexpected signup error:', err)
      return { error: { message: 'An unexpected error occurred during signup' } as AuthError }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('Google sign in error:', error)
        return { error }
      }
      
      return { error: null }
    } catch (err) {
      console.error('Unexpected Google sign in error:', err)
      return { error: { message: 'An unexpected error occurred during Google sign in' } as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        return { error }
      }
      
      return { error: null }
    } catch (err) {
      console.error('Unexpected sign out error:', err)
      return { error: { message: 'An unexpected error occurred during sign out' } as AuthError }
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })
      
      if (error) {
        console.error('Resend verification error:', error)
        return { error }
      }
      
      return { error: null }
    } catch (err) {
      console.error('Unexpected resend verification error:', err)
      return { error: { message: 'An unexpected error occurred while resending verification email' } as AuthError }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resendVerificationEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
