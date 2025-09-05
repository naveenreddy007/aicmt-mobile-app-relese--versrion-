"use client"

import { useEffect, useState } from "react"
import { getInquiries } from "@/app/actions/inquiries"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RecentInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInquiries = async () => {
      setIsLoading(true)
      const data = await getInquiries()
      setInquiries(data.slice(0, 5)) // Get only the 5 most recent
      setIsLoading(false)
    }

    fetchInquiries()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-500 hover:bg-blue-600"
      case "in-progress":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "completed":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-[300px]">Loading inquiries...</div>
  }

  return (
    <div className="space-y-4">
      {inquiries.length === 0 ? (
        <div className="text-center py-4">No recent inquiries found</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="flex items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{inquiry.name}</h4>
                  <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                <p className="text-sm line-clamp-2">{inquiry.message}</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/inquiries/${inquiry.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/inquiries">View All Inquiries</Link>
        </Button>
      </div>
    </div>
  )
}
