import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/components/admin/users-table"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "User Management | Admin Dashboard",
  description: "Manage users and their permissions",
}

// Sample users data
const users = [
  {
    id: "user-001",
    name: "Admin User",
    email: "admin@aicmt.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-14 10:23 AM",
    avatar: "/confident-professional.png",
    initials: "AU",
  },
  {
    id: "user-002",
    name: "Priya Sharma",
    email: "priya@ecofood.com",
    role: "staff",
    status: "active",
    lastLogin: "2023-05-13 03:45 PM",
    avatar: "/confident-leader.png",
    initials: "PS",
  },
  {
    id: "user-003",
    name: "Rajesh Kumar",
    email: "rajesh@greenretail.com",
    role: "customer",
    status: "active",
    lastLogin: "2023-05-12 11:30 AM",
    avatar: "/confident-indian-professional.png",
    initials: "RK",
  },
  {
    id: "user-004",
    name: "Amit Patel",
    email: "amit@greenearth.org",
    role: "customer",
    status: "active",
    lastLogin: "2023-05-10 09:15 AM",
    avatar: "",
    initials: "AP",
  },
  {
    id: "user-005",
    name: "Sunita Reddy",
    email: "sunita@ecoretail.org",
    role: "customer",
    status: "inactive",
    lastLogin: "2023-04-28 02:10 PM",
    avatar: "",
    initials: "SR",
  },
  {
    id: "user-006",
    name: "Vikram Singh",
    email: "vikram@organicharvest.com",
    role: "customer",
    status: "pending",
    lastLogin: "Never",
    avatar: "",
    initials: "VS",
  },
  {
    id: "user-007",
    name: "Neha Gupta",
    email: "neha@greenliving.com",
    role: "staff",
    status: "active",
    lastLogin: "2023-05-14 09:05 AM",
    avatar: "",
    initials: "NG",
  },
]

function getRoleBadge(role) {
  switch (role) {
    case "admin":
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Admin
        </Badge>
      )
    case "staff":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Staff
        </Badge>
      )
    case "customer":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Customer
        </Badge>
      )
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

function getStatusBadge(status) {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Inactive
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Pending
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Editors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  )
}
