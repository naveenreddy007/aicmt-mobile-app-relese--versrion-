import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AICMT International - Biodegradable Plastics Manufacturer",
  description: "Leading manufacturer of CPCB certified biodegradable and compostable plastics in India.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" suppressHydrationWarning>
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header locale="en" />
                <main className="flex-1 pt-16">
                  {children}
                </main>
              </div>
              <Toaster position="top-right" richColors />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
