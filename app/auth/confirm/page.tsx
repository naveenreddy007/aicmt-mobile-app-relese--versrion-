'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const next = searchParams.get('next') ?? '/dashboard'

        if (!token_hash || !type) {
          setStatus('error')
          setMessage('Invalid confirmation link. Please try again or request a new verification email.')
          return
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any
        })

        if (error) {
          console.error('Email confirmation error:', error)
          setStatus('error')
          setMessage(error.message || 'Failed to confirm email. The link may have expired.')
          return
        }

        if (data.user) {
          setStatus('success')
          setMessage('Email confirmed successfully! Redirecting to your dashboard...')
          
          // Clear any pending verification email from localStorage
          localStorage.removeItem('pendingVerificationEmail')
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push(next)
          }, 2000)
        } else {
          setStatus('error')
          setMessage('Email confirmation failed. Please try again.')
        }
      } catch (err: any) {
        console.error('Confirmation error:', err)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    confirmEmail()
  }, [searchParams, router, supabase.auth])

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Confirming your email...'
      case 'success':
        return 'Email confirmed!'
      case 'error':
        return 'Confirmation failed'
    }
  }

  const getVariant = () => {
    switch (status) {
      case 'success':
        return 'default'
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
            {getIcon()}
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {getTitle()}
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              {status === 'loading' && 'Please wait while we confirm your email address...'}
              {status === 'success' && 'Your account has been successfully verified!'}
              {status === 'error' && 'There was a problem confirming your email address.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant={getVariant()}>
              <AlertDescription className="text-center">
                {message}
              </AlertDescription>
            </Alert>

            {status === 'error' && (
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/auth/verify-email">
                    Request new verification email
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/login">
                    Back to login
                  </Link>
                </Button>
              </div>
            )}

            {status === 'success' && (
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  Go to dashboard
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {status === 'error' && (
          <div className="text-center text-sm text-gray-600">
            <p>
              Still having trouble? Contact{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">
                support
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}