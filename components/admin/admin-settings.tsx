"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

export function AdminSettings() {
  // General settings
  const [siteName, setSiteName] = useState("AICMT International")
  const [siteDescription, setSiteDescription] = useState("Leading manufacturer of biodegradable plastics in India")
  const [contactEmail, setContactEmail] = useState("info@aicmt.com")
  const [contactPhone, setContactPhone] = useState("+91 98765 43210")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // SEO settings
  const [defaultTitle, setDefaultTitle] = useState("AICMT International - Biodegradable Plastics Manufacturer")
  const [defaultDescription, setDefaultDescription] = useState(
    "Leading manufacturer of CPCB certified biodegradable and compostable plastics in India.",
  )
  const [defaultKeywords, setDefaultKeywords] = useState(
    "biodegradable plastics, compostable plastics, eco-friendly packaging, CPCB certified",
  )
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("UA-123456789-1")

  // Email settings
  const [smtpHost, setSmtpHost] = useState("smtp.example.com")
  const [smtpPort, setSmtpPort] = useState("587")
  const [smtpUser, setSmtpUser] = useState("notifications@aicmt.com")
  const [smtpPassword, setSmtpPassword] = useState("••••••••••••")
  const [emailFrom, setEmailFrom] = useState("AICMT International <notifications@aicmt.com>")

  // Localization settings
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [timezone, setTimezone] = useState("Asia/Kolkata")
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")
  const [enableMultilingual, setEnableMultilingual] = useState(true)

  const handleSaveSettings = () => {
    // In a real implementation, this would save settings to Supabase
    console.log("Saving settings...")
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="localization">Localization</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="maintenanceMode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="seo" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="defaultTitle">Default Meta Title</Label>
            <Input id="defaultTitle" value={defaultTitle} onChange={(e) => setDefaultTitle(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              Recommended length: 50-60 characters. Current: {defaultTitle.length}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="defaultDescription">Default Meta Description</Label>
            <Textarea
              id="defaultDescription"
              value={defaultDescription}
              onChange={(e) => setDefaultDescription(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Recommended length: 150-160 characters. Current: {defaultDescription.length}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="defaultKeywords">Default Keywords</Label>
            <Input id="defaultKeywords" value={defaultKeywords} onChange={(e) => setDefaultKeywords(e.target.value)} />
            <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input
              id="googleAnalyticsId"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="email" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input id="smtpHost" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input id="smtpPort" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="smtpUser">SMTP Username</Label>
            <Input id="smtpUser" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input
              id="smtpPassword"
              type="password"
              value={smtpPassword}
              onChange={(e) => setSmtpPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="emailFrom">From Email</Label>
            <Input id="emailFrom" value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} />
          </div>

          <div className="flex justify-end">
            <Button variant="outline">Test Email Settings</Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="localization" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="defaultLanguage">Default Language</Label>
            <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
              <SelectTrigger id="defaultLanguage">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="bn">Bengali</SelectItem>
                <SelectItem value="te">Telugu</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
                <SelectItem value="mr">Marathi</SelectItem>
                <SelectItem value="ur">Urdu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="enableMultilingual" checked={enableMultilingual} onCheckedChange={setEnableMultilingual} />
            <Label htmlFor="enableMultilingual">Enable Multilingual Support</Label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
