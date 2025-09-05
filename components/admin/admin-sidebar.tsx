"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  HardDrive,
  ImageIcon,
  LayoutDashboard,
  Mail,
  Package,
  Search,
  Settings,
  Shield,
  Users,
  Star,
  MailCheck,
  Award,
  Calendar,
  BookOpen,
  Images,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    {
      name: "Custom Orders",
      href: "/admin/custom-orders",
      icon: Package,
    },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Newsletter", href: "/admin/newsletter", icon: MailCheck },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Stories", href: "/admin/stories", icon: BookOpen },
    { name: "Gallery", href: "/admin/gallery", icon: Images },
    { name: "Factory Tour", href: "/admin/factory-tour", icon: Video },
    { name: "Certifications", href: "/admin/certifications", icon: Award },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "SEO", href: "/admin/seo", icon: Search },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Roles & Permissions", href: "/admin/roles", icon: Shield },
    { name: "Backups", href: "/admin/backups", icon: HardDrive },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>AICMT Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-medium text-primary-foreground">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@aicmt.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
