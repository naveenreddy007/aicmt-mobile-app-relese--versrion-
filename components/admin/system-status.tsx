"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download, RefreshCw } from "lucide-react"

export function SystemStatus() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">System Health</h3>
          <Badge variant="outline" className="bg-green-500">
            Healthy
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">CPU Usage</span>
              <span>24%</span>
            </div>
            <Progress value={24} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Memory Usage</span>
              <span>42%</span>
            </div>
            <Progress value={42} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Storage Usage</span>
              <span>68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Database Size</span>
              <span>256 MB</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Recent Backups</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md border p-2">
            <div>
              <p className="text-sm font-medium">Daily Backup</p>
              <p className="text-xs text-muted-foreground">Today at 12:34 PM</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md border p-2">
            <div>
              <p className="text-sm font-medium">Weekly Backup</p>
              <p className="text-xs text-muted-foreground">June 12, 2023</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md border p-2">
            <div>
              <p className="text-sm font-medium">Monthly Backup</p>
              <p className="text-xs text-muted-foreground">June 1, 2023</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Create Manual Backup
        </Button>
      </div>
    </div>
  )
}
