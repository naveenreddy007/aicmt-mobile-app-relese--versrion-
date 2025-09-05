import { CheckCircle2, Clock, FileText, Mail, Package, User } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// Sample data - in a real app, this would come from your API
const tasks = [
  {
    id: 1,
    title: "Respond to Urgent Inquiry",
    description: "From GreenRetail Solutions regarding bulk order",
    type: "inquiry",
    priority: "high",
    dueDate: "Today",
    completed: false,
  },
  {
    id: 2,
    title: "Prepare Sample Shipment",
    description: "For EcoFood Packaging - 3 product variants",
    type: "product",
    priority: "medium",
    dueDate: "Tomorrow",
    completed: false,
  },
  {
    id: 3,
    title: "Update Product Catalog",
    description: "Add new food packaging products",
    type: "product",
    priority: "medium",
    dueDate: "This week",
    completed: false,
  },
  {
    id: 4,
    title: "Review Blog Draft",
    description: "Biodegradable Plastics in Food Industry",
    type: "blog",
    priority: "low",
    dueDate: "This week",
    completed: false,
  },
  {
    id: 5,
    title: "Approve New User Accounts",
    description: "3 pending approval requests",
    type: "user",
    priority: "medium",
    dueDate: "This week",
    completed: true,
  },
]

function getTaskIcon(type) {
  switch (type) {
    case "product":
      return <Package className="h-4 w-4" />
    case "inquiry":
      return <Mail className="h-4 w-4" />
    case "blog":
      return <FileText className="h-4 w-4" />
    case "user":
      return <User className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

function getPriorityColor(priority, completed) {
  if (completed) return "bg-gray-100 text-gray-500"

  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700"
    case "medium":
      return "bg-yellow-100 text-yellow-700"
    case "low":
      return "bg-blue-100 text-blue-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export function TaskList() {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn("flex items-start gap-3 rounded-lg border p-3", task.completed && "opacity-60")}
        >
          <Checkbox id={`task-${task.id}`} checked={task.completed} />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`task-${task.id}`}
                className={cn(
                  "text-sm font-medium leading-none",
                  task.completed && "line-through text-muted-foreground",
                )}
              >
                {task.title}
              </label>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  getPriorityColor(task.priority, task.completed),
                )}
              >
                {task.priority}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{task.description}</p>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {getTaskIcon(task.type)}
                <span className="capitalize">{task.type}</span>
              </span>
              <span className="mx-1">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.dueDate}
              </span>
              {task.completed && (
                <>
                  <span className="mx-1">•</span>
                  <span className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
