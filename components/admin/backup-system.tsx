"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, Download, HardDrive, MoreHorizontal, RefreshCw, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data - this would come from Supabase in the real implementation
const initialBackups = [
  {
    id: "1",
    name: "Daily Backup",
    type: "automatic",
    status: "completed",
    size: "42 MB",
    date: "2023-06-15T12:34:00Z",
    duration: "2m 15s",
  },
  {
    id: "2",
    name: "Weekly Backup",
    type: "automatic",
    status: "completed",
    size: "128 MB",
    date: "2023-06-12T08:00:00Z",
    duration: "5m 32s",
  },
  {
    id: "3",
    name: "Monthly Backup",
    type: "automatic",
    status: "completed",
    size: "256 MB",
    date: "2023-06-01T08:00:00Z",
    duration: "8m 47s",
  },
  {
    id: "4",
    name: "Pre-Update Backup",
    type: "manual",
    status: "completed",
    size: "156 MB",
    date: "2023-05-28T15:45:00Z",
    duration: "6m 12s",
  },
  {
    id: "5",
    name: "Database Only",
    type: "manual",
    status: "completed",
    size: "24 MB",
    date: "2023-05-20T10:15:00Z",
    duration: "1m 48s",
  },
]

export function BackupSystem() {
  const [backups, setBackups] = useState(initialBackups)
  const [activeTab, setActiveTab] = useState("backups")
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [backupToRestore, setBackupToRestore] = useState<string | null>(null)
  const [backupProgress, setBackupProgress] = useState(0)
  const [newBackupName, setNewBackupName] = useState("")
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [restoreInProgress, setRestoreInProgress] = useState(0)
  const [restoreProgress, setRestoreProgress] = useState(0)

  // Schedule settings
  const [dailyBackup, setDailyBackup] = useState(true)
  const [dailyBackupTime, setDailyBackupTime] = useState("00:00")
  const [weeklyBackup, setWeeklyBackup] = useState(true)
  const [weeklyBackupDay, setWeeklyBackupDay] = useState("monday")
  const [weeklyBackupTime, setWeeklyBackupTime] = useState("02:00")
  const [monthlyBackup, setMonthlyBackup] = useState(true)
  const [monthlyBackupDate, setMonthlyBackupDate] = useState<Date | undefined>(new Date())
  const [monthlyBackupTime, setMonthlyBackupTime] = useState("04:00")

  // Retention settings
  const [keepDailyBackups, setKeepDailyBackups] = useState("7")
  const [keepWeeklyBackups, setKeepWeeklyBackups] = useState("4")
  const [keepMonthlyBackups, setKeepMonthlyBackups] = useState("12")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const handleCreateBackup = () => {
    setBackupInProgress(true)
    setBackupProgress(0)

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          // Add new backup to the list
          const newBackup = {
            id: `${backups.length + 1}`,
            name: newBackupName || "Manual Backup",
            type: "manual",
            status: "completed",
            size: "45 MB",
            date: new Date().toISOString(),
            duration: "3m 21s",
          }

          setBackups([newBackup, ...backups])
          setBackupInProgress(false)
          setIsCreatingBackup(false)
          setNewBackupName("")

          return 0
        }
        return prev + 10
      })
    }, 500)
  }

  const handleRestoreBackup = () => {
    if (!backupToRestore) return

    setRestoreInProgress(true)
    setRestoreProgress(0)

    // Simulate restore progress
    const interval = setInterval(() => {
      setRestoreProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setRestoreInProgress(false)
          setIsRestoring(false)
          setBackupToRestore(null)
          return 0
        }
        return prev + 10
      })
    }, 500)
  }

  const handleDeleteBackup = (backupId: string) => {
    setBackups(backups.filter((backup) => backup.id !== backupId))
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium">Backup History</h3>
              <p className="text-sm text-muted-foreground">View and manage your system backups</p>
            </div>
            <Button onClick={() => setIsCreatingBackup(true)}>
              <HardDrive className="mr-2 h-4 w-4" />
              Create Backup
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell>
                      <Badge variant={backup.type === "automatic" ? "outline" : "default"}>
                        {backup.type === "automatic" ? "Scheduled" : "Manual"}
                      </Badge>
                    </TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{formatDate(backup.date)}</TableCell>
                    <TableCell>{backup.duration}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Completed</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setBackupToRestore(backup.id)
                              setIsRestoring(true)
                            }}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteBackup(backup.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Backup Schedule</h3>
            <p className="text-sm text-muted-foreground">Configure automatic backup schedules</p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Daily Backup</h4>
                  <p className="text-sm text-muted-foreground">Create a backup every day</p>
                </div>
                <Switch checked={dailyBackup} onCheckedChange={setDailyBackup} />
              </div>
              {dailyBackup && (
                <div className="grid gap-2">
                  <Label htmlFor="dailyBackupTime">Backup Time</Label>
                  <Input
                    id="dailyBackupTime"
                    type="time"
                    value={dailyBackupTime}
                    onChange={(e) => setDailyBackupTime(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weekly Backup</h4>
                  <p className="text-sm text-muted-foreground">Create a backup once a week</p>
                </div>
                <Switch checked={weeklyBackup} onCheckedChange={setWeeklyBackup} />
              </div>
              {weeklyBackup && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="weeklyBackupDay">Day of Week</Label>
                    <Select value={weeklyBackupDay} onValueChange={setWeeklyBackupDay}>
                      <SelectTrigger id="weeklyBackupDay">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weeklyBackupTime">Backup Time</Label>
                    <Input
                      id="weeklyBackupTime"
                      type="time"
                      value={weeklyBackupTime}
                      onChange={(e) => setWeeklyBackupTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Monthly Backup</h4>
                  <p className="text-sm text-muted-foreground">Create a backup once a month</p>
                </div>
                <Switch checked={monthlyBackup} onCheckedChange={setMonthlyBackup} />
              </div>
              {monthlyBackup && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Day of Month</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {monthlyBackupDate ? format(monthlyBackupDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={monthlyBackupDate}
                          onSelect={setMonthlyBackupDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="monthlyBackupTime">Backup Time</Label>
                    <Input
                      id="monthlyBackupTime"
                      type="time"
                      value={monthlyBackupTime}
                      onChange={(e) => setMonthlyBackupTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Schedule</Button>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Backup Settings</h3>
            <p className="text-sm text-muted-foreground">Configure backup retention and storage settings</p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 border rounded-lg p-4">
              <h4 className="font-medium">Retention Policy</h4>
              <p className="text-sm text-muted-foreground">
                Configure how long backups are kept before being automatically deleted
              </p>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="keepDailyBackups">Keep Daily Backups</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="keepDailyBackups"
                      type="number"
                      min="1"
                      value={keepDailyBackups}
                      onChange={(e) => setKeepDailyBackups(e.target.value)}
                      className="w-20"
                    />
                    <span>days</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="keepWeeklyBackups">Keep Weekly Backups</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="keepWeeklyBackups"
                      type="number"
                      min="1"
                      value={keepWeeklyBackups}
                      onChange={(e) => setKeepWeeklyBackups(e.target.value)}
                      className="w-20"
                    />
                    <span>weeks</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="keepMonthlyBackups">Keep Monthly Backups</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="keepMonthlyBackups"
                      type="number"
                      min="1"
                      value={keepMonthlyBackups}
                      onChange={(e) => setKeepMonthlyBackups(e.target.value)}
                      className="w-20"
                    />
                    <span>months</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 border rounded-lg p-4">
              <h4 className="font-medium">Storage Settings</h4>
              <p className="text-sm text-muted-foreground">Configure where backups are stored</p>

              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="localStorage" checked />
                  <Label htmlFor="localStorage">Store backups locally</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="cloudStorage" />
                  <Label htmlFor="cloudStorage">Store backups in cloud storage (Supabase)</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isCreatingBackup} onOpenChange={setIsCreatingBackup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Backup</DialogTitle>
            <DialogDescription>Create a manual backup of your system</DialogDescription>
          </DialogHeader>
          {backupInProgress ? (
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Creating backup...</span>
                  <span>{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>This may take a few minutes</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="backupName">Backup Name</Label>
                <Input
                  id="backupName"
                  placeholder="e.g., Pre-Update Backup"
                  value={newBackupName}
                  onChange={(e) => setNewBackupName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Backup Components</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="backupDatabase" checked />
                    <Label htmlFor="backupDatabase">Database</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="backupMedia" checked />
                    <Label htmlFor="backupMedia">Media Files</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="backupSettings" checked />
                    <Label htmlFor="backupSettings">Settings</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {!backupInProgress && (
              <>
                <Button variant="outline" onClick={() => setIsCreatingBackup(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBackup}>Create Backup</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isRestoring} onOpenChange={setIsRestoring}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Backup</AlertDialogTitle>
            <AlertDialogDescription>
              {!restoreInProgress
                ? "Are you sure you want to restore this backup? This will replace your current data."
                : "Restoring backup..."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {restoreInProgress && (
            <div className="py-2 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Restoring...</span>
                  <span>{restoreProgress}%</span>
                </div>
                <Progress value={restoreProgress} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>This may take a few minutes. Please do not close this window.</span>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            {!restoreInProgress && (
              <>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRestoreBackup}>Restore</AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
