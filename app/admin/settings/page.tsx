import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSettings } from "@/components/admin/admin-settings"

export const metadata = {
  title: "Settings | Admin Dashboard",
  description: "Configure system settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure global settings for your website</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminSettings />
        </CardContent>
      </Card>
    </div>
  )
}
