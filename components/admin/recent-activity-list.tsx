import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Mail, Package, Settings, User } from "lucide-react"

// Sample data - in a real app, this would come from your API
const activities = [
  {
    id: 1,
    type: "product",
    action: "created",
    subject: "Eco Carry Bag - Large",
    user: {
      name: "Rajesh Kumar",
      avatar: "/confident-indian-professional.png",
      initials: "RK",
    },
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "inquiry",
    action: "received",
    subject: "Product Information Request",
    user: {
      name: "System",
      avatar: "",
      initials: "S",
    },
    timestamp: "3 hours ago",
  },
  {
    id: 3,
    type: "blog",
    action: "published",
    subject: "Biodegradable Plastics: The Future of Packaging",
    user: {
      name: "Priya Sharma",
      avatar: "/confident-leader.png",
      initials: "PS",
    },
    timestamp: "5 hours ago",
  },
  {
    id: 4,
    type: "user",
    action: "registered",
    subject: "New Customer Account",
    user: {
      name: "System",
      avatar: "",
      initials: "S",
    },
    timestamp: "1 day ago",
  },
  {
    id: 5,
    type: "settings",
    action: "updated",
    subject: "Website SEO Settings",
    user: {
      name: "Admin User",
      avatar: "/confident-professional.png",
      initials: "AU",
    },
    timestamp: "1 day ago",
  },
  {
    id: 6,
    type: "product",
    action: "updated",
    subject: "Food Container - Medium",
    user: {
      name: "Amit Patel",
      avatar: "",
      initials: "AP",
    },
    timestamp: "2 days ago",
  },
]

// More activities for the extended view
const extendedActivities = [
  ...activities,
  {
    id: 7,
    type: "blog",
    action: "drafted",
    subject: "How to Reduce Your Carbon Footprint",
    user: {
      name: "Priya Sharma",
      avatar: "/confident-leader.png",
      initials: "PS",
    },
    timestamp: "2 days ago",
  },
  {
    id: 8,
    type: "inquiry",
    action: "responded",
    subject: "Bulk Order Inquiry",
    user: {
      name: "Rajesh Kumar",
      avatar: "/confident-indian-professional.png",
      initials: "RK",
    },
    timestamp: "3 days ago",
  },
  {
    id: 9,
    type: "settings",
    action: "updated",
    subject: "Payment Gateway Settings",
    user: {
      name: "Admin User",
      avatar: "/confident-professional.png",
      initials: "AU",
    },
    timestamp: "3 days ago",
  },
  {
    id: 10,
    type: "user",
    action: "updated",
    subject: "User Role Permissions",
    user: {
      name: "Admin User",
      avatar: "/confident-professional.png",
      initials: "AU",
    },
    timestamp: "4 days ago",
  },
]

function getActivityIcon(type) {
  switch (type) {
    case "product":
      return <Package className="h-4 w-4" />
    case "inquiry":
      return <Mail className="h-4 w-4" />
    case "blog":
      return <FileText className="h-4 w-4" />
    case "user":
      return <User className="h-4 w-4" />
    case "settings":
      return <Settings className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export function RecentActivityList({ extended = false }) {
  const displayActivities = extended ? extendedActivities : activities.slice(0, 5)

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-medium">{activity.subject}</span>
            </p>
            <p className="flex items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {getActivityIcon(activity.type)}
                <span className="capitalize">{activity.type}</span>
              </span>
              <span className="mx-1">•</span>
              {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
