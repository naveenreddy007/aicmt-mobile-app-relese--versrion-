"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Mail, User } from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const { signUp, signInWithGoogle } = useAuth()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate full name
    if (!fullName.trim()) {
      toast.error("Please enter your full name")
      setIsLoading(false)
      return
    }

    // Validate email format
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    // Validate password strength
    const passwordError = validatePassword(password)
    if (passwordError) {
      toast.error(passwordError)
      setIsLoading(false)
      return
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password, fullName.trim())

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('User already registered')) {
          toast.error("An account with this email already exists. Please try logging in instead.")
        } else if (error.message.includes('Invalid email')) {
          toast.error("Please enter a valid email address")
        } else if (error.message.includes('Password')) {
          toast.error("Password does not meet requirements")
        } else {
          toast.error(error.message || "Failed to create account")
        }
        return
      }

      // Store email for verification resend functionality
      localStorage.setItem('pendingVerificationEmail', email)
      
      toast.success("Account created successfully! Please check your email to verify your account.")
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      const { error } = await signInWithGoogle()

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error("Failed to sign up with Google")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Register to access exclusive features and content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Sign Up */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-gray-300 hover:bg-gray-50"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="pl-10"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`pl-10 ${
                  emailTouched && !validateEmail(email) 
                    ? "border-red-500 focus:border-red-500" 
                    : emailTouched && validateEmail(email) 
                    ? "border-green-500 focus:border-green-500" 
                    : ""
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                required
              />
            </div>
            {emailTouched && !validateEmail(email) && (
              <p className="text-sm text-red-600">Please enter a valid email address</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`${
                  passwordTouched && validatePassword(password) 
                    ? "border-red-500 focus:border-red-500" 
                    : passwordTouched && !validatePassword(password) 
                    ? "border-green-500 focus:border-green-500" 
                    : ""
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {passwordTouched && validatePassword(password) && (
              <p className="text-sm text-red-600">{validatePassword(password)}</p>
            )}
            {passwordTouched && !validatePassword(password) && (
              <p className="text-sm text-green-600">Password meets all requirements ✓</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={`${
                  confirmPassword && password !== confirmPassword 
                    ? "border-red-500 focus:border-red-500" 
                    : confirmPassword && password === confirmPassword 
                    ? "border-green-500 focus:border-green-500" 
                    : ""
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="text-sm text-green-600">Passwords match ✓</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
