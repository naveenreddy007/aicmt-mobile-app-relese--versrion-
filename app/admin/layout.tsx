import type React from "react"
import AdminAuthWrapper from "@/components/admin/admin-auth-wrapper"
import { AdminLayoutClient } from "@/components/admin/admin-layout-client"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthWrapper>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </AdminAuthWrapper>
  )
}
