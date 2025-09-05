"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, ShoppingCart, User, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainNavigation, MobileNavigation } from "@/components/main-navigation"
import { LanguageSelector } from "@/components/language-selector"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface HeaderProps {
  locale: string
}

export function Header({ locale }: HeaderProps) {
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error("Failed to sign out")
    } else {
      toast.success("Signed out successfully")
      router.push(`/${locale}`)
    }
  }

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center transition-transform duration-200 hover:scale-105">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg">AICMT</span>
        </Link>

        {/* Main Navigation */}
        <MainNavigation />

        {/* Right side items */}
        <div className="ml-auto flex items-center gap-2">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Cart Icon */}
          <Link href={`/${locale}/cart`}>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Authentication */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
                    <AvatarFallback>
                      {user.email ? getUserInitials(user.email) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.user_metadata?.full_name && (
                      <p className="font-medium">{user.user_metadata.full_name}</p>
                    )}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/profile`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/orders`} className="cursor-pointer">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href={`/${locale}/register`}>
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <MobileNavigation locale={locale} />
          </div>

          {/* Request Quote Button */}
          <Link href={`/${locale}/contact`}>
            <Button variant="outline" size="sm" className="hidden md:inline-flex bg-transparent">
              Request a Quote
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}