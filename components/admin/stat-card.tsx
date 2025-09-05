import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({ title, value, change, trend, description, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1 text-xs">
          {trend === "up" ? (
            <ArrowUpIcon className="h-3 w-3 mr-1 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-3 w-3 mr-1 text-red-500" />
          )}
          <span className={cn("font-medium", trend === "up" ? "text-green-500" : "text-red-500")}>{change}</span>
          <span className="ml-1 text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
