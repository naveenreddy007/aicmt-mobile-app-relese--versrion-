"use client"

import { Inter } from "next/font/google"
import Link from "next/link"

import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/i18n/use-language"

import "./globals.css"

// Import the navigation components
import { MainNavigation, MobileNavigation } from "@/components/main-navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-green-600" />
                    <span className="font-bold">AICMT</span>
                  </Link>
                  <MainNavigation />
                  <div className="ml-auto flex items-center gap-2">
                    <LanguageSelector />
                    <MobileNavigation />
                    <Button variant="outline" size="sm" className="hidden md:inline-flex">
                      Request a Quote
                    </Button>
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// Footer component with translations
function Footer() {
  return (
    <LanguageProvider>
      <FooterContent />
    </LanguageProvider>
  )
}

// Separate component to use the language hook
function FooterContent() {
  const { t } = useLanguage()

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">{t("footer.rights")}</p>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
            {t("footer.terms")}
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  )
}
