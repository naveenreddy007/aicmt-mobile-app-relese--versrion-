"use client"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/i18n/use-language"

export function MainNavigation({ locale }: { locale: string }) {
  const { t } = useLanguage()
  const { user } = useAuth()

  const publicNavItems = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/products`, label: t("nav.products") },
    { href: `/${locale}/certifications`, label: t("nav.certifications") },
    { href: `/${locale}/about`, label: t("nav.about") },
    { href: `/${locale}/contact`, label: t("nav.contact") },
    { href: `/${locale}/blog`, label: t("nav.blog") },
  ]

  const authenticatedNavItems = [
    { href: `/dashboard`, label: "Dashboard" },
    { href: `/profile`, label: "Profile" },
    { href: `/orders`, label: "Orders" },
  ]

  const navItems = user ? [...publicNavItems, ...authenticatedNavItems] : publicNavItems

  return (
    <nav className="hidden md:flex gap-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export function MobileNavigation({ locale }: { locale: string }) {
  const { t } = useLanguage()
  const { user } = useAuth()

  const publicNavItems = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/products`, label: t("nav.products") },
    { href: `/${locale}/certifications`, label: t("nav.certifications") },
    { href: `/${locale}/about`, label: t("nav.about") },
    { href: `/${locale}/contact`, label: t("nav.contact") },
    { href: `/${locale}/blog`, label: t("nav.blog") },
  ]

  const authenticatedNavItems = [
    { href: `/dashboard`, label: "Dashboard" },
    { href: `/profile`, label: "Profile" },
    { href: `/orders`, label: "Orders" },
  ]

  const navItems = user ? [...publicNavItems, ...authenticatedNavItems] : publicNavItems

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-10 w-10 transition-all duration-200 hover:bg-primary/10 active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 transition-transform duration-200" />
          <span className="sr-only">{t("common.menu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/20">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg">AICMT</span>
            </div>
            <nav className="flex flex-col gap-6 flex-1">
              {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg font-medium transition-all duration-200 hover:text-primary hover:translate-x-2 border-b border-transparent hover:border-primary/20 pb-3 flex items-center gap-3"
              >
                {item.label}
              </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
    </Sheet>
  )
}
