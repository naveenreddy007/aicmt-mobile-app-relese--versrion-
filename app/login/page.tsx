"use client"

import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Main Content */}
        <main className="flex items-center justify-center min-h-screen px-6 py-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mt-2 text-gray-600">
              Sign in to access your account and manage your eco-friendly journey
            </p>
          </div>
          
          <LoginForm />
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              New to AICMT?{" "}
              <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}