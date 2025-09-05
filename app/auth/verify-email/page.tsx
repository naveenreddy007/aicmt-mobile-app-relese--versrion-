'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [error, setError] = useState('')
  const { resendVerificationEmail } = useAuth()

  const handleResendEmail = async () => {
    setIsResending(true)
    setError('')
    setResendSuccess(false)

    try {
      // Get email from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search)
      const email = urlParams.get('email') || localStorage.getItem('pendingVerificationEmail')
      
      if (!email) {
        setError('Email address not found. Please try registering again.')
        return
      }

      await resendVerificationEmail(email)
      setResendSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to your email address
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              Please check your email and click the verification link to activate your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resendSuccess && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Verification email sent successfully! Please check your inbox.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600 text-center">
              <p>Didn't receive the email? Check your spam folder or</p>
            </div>

            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
              variant="outline"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </Button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>
            Having trouble? Contact{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">
              support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}