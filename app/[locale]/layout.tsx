import type React from "react"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Suspense } from "react"
import "../globals.css"
import { Footer } from "@/components/footer"
import { IntroExperienceWrapper } from "@/components/intro-experience-wrapper"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AICMT International - Compostable Plastics",
  description: "CPCB Certified Manufacturer of Compostable Plastics",
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <html lang={locale} dir={locale === "ur" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <LanguageProvider initialLocale={locale}>
            <AuthProvider>
              <CartProvider>
                <Suspense fallback={null}>
                  <IntroExperienceWrapper>
                    <div className="flex min-h-screen flex-col">
                      <Header locale={locale} />
                      <main className="flex-1">
                        <PageTransitionWrapper>{children}</PageTransitionWrapper>
                      </main>
                      <Footer locale={locale} />
                    </div>
                  </IntroExperienceWrapper>
                </Suspense>
                <Toaster />
                <Analytics />
                <SpeedInsights />
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
