"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface StoriesBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function StoriesBreadcrumb({ items, className }: StoriesBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      <Link 
        href="/admin" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      <ChevronRight className="h-4 w-4" />
      
      <Link 
        href="/admin/stories" 
        className="hover:text-foreground transition-colors"
      >
        Stories
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href && !item.current ? (
            <Link 
              href={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              item.current && "text-foreground font-medium"
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
