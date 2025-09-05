"use client"

import Link from "next/link"
import { FileText, ExternalLink } from "lucide-react"

// Mock data - this would come from analytics integration in the real implementation
const popularContent = [
  {
    id: 1,
    title: "Biodegradable Food Packaging Solutions",
    type: "page",
    url: "/products",
    views: 1245,
  },
  {
    id: 2,
    title: "How Biodegradable Plastics Are Changing the Industry",
    type: "blog",
    url: "/blog/biodegradable-plastics-industry",
    views: 987,
  },
  {
    id: 3,
    title: "Certification and Compliance Guide",
    type: "page",
    url: "/certification",
    views: 876,
  },
  {
    id: 4,
    title: "5 Ways to Reduce Plastic Waste in Your Business",
    type: "blog",
    url: "/blog/reduce-plastic-waste-business",
    views: 754,
  },
  {
    id: 5,
    title: "About Our Sustainable Manufacturing Process",
    type: "page",
    url: "/about",
    views: 632,
  },
]

export function PopularContent() {
  return (
    <div className="space-y-4">
      {popularContent.map((content) => (
        <div key={content.id} className="flex items-start space-x-3 rounded-md border p-3">
          <div className="mt-0.5">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{content.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{content.views.toLocaleString()} views</p>
              <Link
                href={content.url}
                target="_blank"
                className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
              >
                <span>View</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
