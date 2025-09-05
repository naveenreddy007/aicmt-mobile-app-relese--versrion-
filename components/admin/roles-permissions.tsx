"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Save, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data - this would come from Supabase in the real implementation
const initialRoles = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all features and settings",
    permissions: {
      dashboard: ["view", "edit"],
      products: ["view", "create", "edit", "delete"],
      blog: ["view", "create", "edit", "delete", "publish"],
      inquiries: ["view", "respond", "delete"],
      users: ["view", "create", "edit", "delete"],
      media: ["view", "upload", "edit", "delete"],
      seo: ["view", "edit"],
      analytics: ["view"],
      roles: ["view", "create", "edit", "delete"],
      backups: ["view", "create", "restore", "delete"],
      settings: ["view", "edit"],
    },
  },
  {
    id: "2",
    name: "Editor",
    description: "Can manage content but not system settings",
    permissions: {
      dashboard: ["view"],
      products: ["view", "create", "edit"],
      blog: ["view", "create", "edit", "publish"],
      inquiries: ["view", "respond"],
      users: ["view"],
      media: ["view", "upload", "edit"],
      seo: ["view", "edit"],
      analytics: ["view"],
      roles: [],
      backups: [],
      settings: [],
    },
  },
  {
    id: "3",
    name: "Viewer",
    description: "Read-only access to content",
    permissions: {
      dashboard: ["view"],
      products: ["view"],
      blog: ["view"],
      inquiries: ["view"],
      users: [],
      media: ["view"],
      seo: ["view"],
      analytics: ["view"],
      roles: [],
      backups: [],
      settings: [],
    },
  },
]

const permissionModules = [
  {
    id: "dashboard",
    name: "Dashboard",
    permissions: ["view", "edit"],
  },
  {
    id: "products",
    name: "Products",
    permissions: ["view", "create", "edit", "delete"],
  },
  {
    id: "blog",
    name: "Blog",
    permissions: ["view", "create", "edit", "delete", "publish"],
  },
  {
    id: "inquiries",
    name: "Inquiries",
    permissions: ["view", "respond", "delete"],
  },
  {
    id: "users",
    name: "Users",
    permissions: ["view", "create", "edit", "delete"],
  },
  {
    id: "media",
    name: "Media",
    permissions: ["view", "upload", "edit", "delete"],
  },
  {
    id: "seo",
    name: "SEO",
    permissions: ["view", "edit"],
  },
  {
    id: "analytics",
    name: "Analytics",
    permissions: ["view"],
  },
  {
    id: "roles",
    name: "Roles",
    permissions: ["view", "create", "edit", "delete"],
  },
  {
    id: "backups",
    name: "Backups",
    permissions: ["view", "create", "restore", "delete"],
  },
  {
    id: "settings",
    name: "Settings",
    permissions: ["view", "edit"],
  },
]

export function RolesPermissions() {
  const [roles, setRoles] = useState(initialRoles)
  const [activeTab, setActiveTab] = useState(roles[0].id)
  const [newRoleDialog, setNewRoleDialog] = useState(false)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: {} as Record<string, string[]>,
  })

  const activeRole = roles.find((role) => role.id === activeTab)

  const handlePermissionChange = (moduleId: string, permission: string, checked: boolean) => {
    if (!activeRole) return

    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id === activeRole.id) {
          const updatedPermissions = { ...role.permissions }

          if (checked) {
            updatedPermissions[moduleId] = [...(updatedPermissions[moduleId] || []), permission]
          } else {
            updatedPermissions[moduleId] = (updatedPermissions[moduleId] || []).filter((p) => p !== permission)
          }

          return {
            ...role,
            permissions: updatedPermissions,
          }
        }
        return role
      }),
    )
  }

  const handleNewRolePermissionChange = (moduleId: string, permission: string, checked: boolean) => {
    setNewRole((prev) => {
      const updatedPermissions = { ...prev.permissions }

      if (checked) {
        updatedPermissions[moduleId] = [...(updatedPermissions[moduleId] || []), permission]
      } else {
        updatedPermissions[moduleId] = (updatedPermissions[moduleId] || []).filter((p) => p !== permission)
      }

      return {
        ...prev,
        permissions: updatedPermissions,
      }
    })
  }

  const createNewRole = () => {
    if (!newRole.name) return

    const newRoleWithId = {
      ...newRole,
      id: `${roles.length + 1}`,
    }

    setRoles([...roles, newRoleWithId])
    setActiveTab(newRoleWithId.id)
    setNewRoleDialog(false)
    setNewRole({
      name: "",
      description: "",
      permissions: {},
    })
  }

  const deleteRole = (roleId: string) => {
    if (roles.length <= 1) return

    setRoles(roles.filter((role) => role.id !== roleId))
    setActiveTab(roles[0].id !== roleId ? roles[0].id : roles[1].id)
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            {roles.map((role) => (
              <TabsTrigger key={role.id} value={role.id}>
                {role.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button onClick={() => setNewRoleDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Button>
        </div>

        {roles.map((role) => (
          <TabsContent key={role.id} value={role.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{role.name}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                {roles.length > 1 && (
                  <Button variant="destructive" onClick={() => deleteRole(role.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Role
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-6">
              {permissionModules.map((module) => (
                <Card key={module.id}>
                  <CardHeader className="pb-3">
                    <CardTitle>{module.name}</CardTitle>
                    <CardDescription>Manage {module.name.toLowerCase()} permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {module.permissions.map((permission) => {
                        const isChecked = role.permissions[module.id]?.includes(permission) || false
                        return (
                          <div key={`${module.id}-${permission}`} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${role.id}-${module.id}-${permission}`}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(module.id, permission, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`${role.id}-${module.id}-${permission}`}
                              className="capitalize text-sm font-medium"
                            >
                              {permission}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={newRoleDialog} onOpenChange={setNewRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>Define a new role and its permissions</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="e.g., Content Manager"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Input
                id="roleDescription"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Brief description of this role"
              />
            </div>
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="max-h-[300px] overflow-y-auto border rounded-md p-4">
                {permissionModules.map((module) => (
                  <div key={module.id} className="mb-4">
                    <h4 className="font-medium mb-2">{module.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {module.permissions.map((permission) => {
                        const isChecked = newRole.permissions[module.id]?.includes(permission) || false
                        return (
                          <div key={`new-${module.id}-${permission}`} className="flex items-center space-x-2">
                            <Checkbox
                              id={`new-${module.id}-${permission}`}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handleNewRolePermissionChange(module.id, permission, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`new-${module.id}-${permission}`}
                              className="capitalize text-sm font-medium"
                            >
                              {permission}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewRole} disabled={!newRole.name}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
