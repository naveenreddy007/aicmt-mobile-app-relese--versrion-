"use client"

import type React from "react"

import Link from "next/link"
import { ArrowRight, Twitter, MessageCircle, CopyIcon as CopyLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

interface PostCardActionsProps {
  slug: string
  title: string
  className?: string
}

export function PostCardActions({ slug, title, className }: PostCardActionsProps) {
  const { toast } = useToast()
  const [currentBaseUrl, setCurrentBaseUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentBaseUrl(window.location.origin)
    }
  }, [])

  const postUrl = currentBaseUrl ? `${currentBaseUrl}/blog/${slug}` : `/blog/${slug}` // Fallback to relative URL

  const handleCopyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Prevent link navigation if inside an <a> tag
    e.stopPropagation()
    navigator.clipboard.writeText(postUrl)
    toast({
      title: "Link Copied!",
      description: "The article link has been copied to your clipboard.",
    })
  }

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + postUrl)}`

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 ${className}`}>
      <Link href={`/blog/${slug}`} passHref legacyBehavior>
        <Button variant="outline" size="sm" asChild>
          <a>
            Read More
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </Link>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8">
          <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8">
          <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
            <MessageCircle className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyLink}
          className="rounded-full h-8 w-8"
          aria-label="Copy post link"
        >
          <CopyLinkIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
