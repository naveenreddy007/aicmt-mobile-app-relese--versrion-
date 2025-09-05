"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, MoreHorizontal, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data - this would come from Supabase in the real implementation
const initialPages = [
  {
    id: "1",
    title: "Home",
    url: "/",
    metaTitle: "AICMT International - Biodegradable Plastics Manufacturer",
    metaDescription: "Leading manufacturer of CPCB certified biodegradable and compostable plastics in India.",
    keywords: "biodegradable plastics, compostable plastics, eco-friendly packaging, CPCB certified",
    seoScore: 92,
    lastUpdated: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    title: "About Us",
    url: "/about",
    metaTitle: "About AICMT - Leading Biodegradable Plastics Manufacturer",
    metaDescription:
      "Learn about AICMT International, a leading manufacturer of certified biodegradable plastics in India.",
    keywords: "about AICMT, biodegradable manufacturer, compostable plastics company",
    seoScore: 85,
    lastUpdated: "2023-06-10T14:45:00Z",
  },
  {
    id: "3",
    title: "Products",
    url: "/products",
    metaTitle: "Biodegradable Products - AICMT International",
    metaDescription:
      "Explore our range of certified biodegradable and compostable plastic products for various industries.",
    keywords: "biodegradable products, compostable bags, eco-friendly packaging",
    seoScore: 78,
    lastUpdated: "2023-06-05T09:15:00Z",
  },
  {
    id: "4",
    title: "Certification",
    url: "/certification",
    metaTitle: "CPCB Certified Compostable Plastics - AICMT",
    metaDescription:
      "Our biodegradable plastics are certified by CPCB and meet international standards for compostability.",
    keywords: "CPCB certification, certified compostable, biodegradable standards",
    seoScore: 90,
    lastUpdated: "2023-05-28T16:20:00Z",
  },
  {
    id: "5",
    title: "Blog",
    url: "/blog",
    metaTitle: "Biodegradable Plastics Blog - AICMT International",
    metaDescription: "Stay updated with the latest news and insights about biodegradable plastics and sustainability.",
    keywords: "biodegradable blog, sustainability news, eco-friendly updates",
    seoScore: 88,
    lastUpdated: "2023-05-20T11:10:00Z",
  },
  {
    id: "6",
    title: "Contact",
    url: "/contact",
    metaTitle: "Contact AICMT - Biodegradable Plastics Manufacturer",
    metaDescription:
      "Get in touch with AICMT International for inquiries about our biodegradable and compostable plastic products.",
    keywords: "contact AICMT, biodegradable plastics inquiry, compostable products contact",
    seoScore: 82,
    lastUpdated: "2023-05-15T13:25:00Z",
  },
]

export function SeoManager() {
  const [pages, setPages] = useState(initialPages)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [editPage, setEditPage] = useState<(typeof initialPages)[0] | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const togglePageSelection = (pageId: string) => {
    setSelectedPages((prev) => (prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]))
  }

  const toggleAllPages = () => {
    if (selectedPages.length === filteredPages.length) {
      setSelectedPages([])
    } else {
      setSelectedPages(filteredPages.map((page) => page.id))
    }
  }

  const handleEditPage = (page: (typeof initialPages)[0]) => {
    setEditPage({ ...page })
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editPage) {
      setPages((prev) =>
        prev.map((page) => (page.id === editPage.id ? { ...editPage, lastUpdated: new Date().toISOString() } : page)),
      )
      setIsEditing(false)
      setEditPage(null)
    }
  }

  const getSeoScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-yellow-500"
    if (score >= 70) return "bg-orange-500"
    return "bg-red-500"
  }

  const getSeoScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-500">Excellent</Badge>
    if (score >= 80) return <Badge className="bg-yellow-500">Good</Badge>
    if (score >= 70) return <Badge className="bg-orange-500">Fair</Badge>
    return <Badge className="bg-red-500">Poor</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pages..."
              className="pl-8 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {selectedPages.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedPages.length} selected</span>
            <Button variant="outline" size="sm">
              Bulk Edit
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={filteredPages.length > 0 && selectedPages.length === filteredPages.length}
                  onCheckedChange={toggleAllPages}
                  aria-label="Select all pages"
                />
              </TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Meta Title</TableHead>
              <TableHead>SEO Score</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No pages found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPages.includes(page.id)}
                      onCheckedChange={() => togglePageSelection(page.id)}
                      aria-label={`Select ${page.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{page.title}</div>
                    <div className="text-sm text-muted-foreground">{page.url}</div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{page.metaTitle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={page.seoScore} className="h-2 w-[60px]" />
                      <span>{page.seoScore}/100</span>
                      {getSeoScoreBadge(page.seoScore)}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(page.lastUpdated)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditPage(page)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit SEO
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={page.url} target="_blank" rel="noopener noreferrer">
                            View Page
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isEditing && editPage && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit SEO for {editPage.title}</DialogTitle>
              <DialogDescription>Update the SEO settings for this page</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="metaTitle" className="text-sm font-medium">
                  Meta Title
                </label>
                <Input
                  id="metaTitle"
                  value={editPage.metaTitle}
                  onChange={(e) => setEditPage({ ...editPage, metaTitle: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended length: 50-60 characters. Current: {editPage.metaTitle.length}
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="metaDescription" className="text-sm font-medium">
                  Meta Description
                </label>
                <Input
                  id="metaDescription"
                  value={editPage.metaDescription}
                  onChange={(e) => setEditPage({ ...editPage, metaDescription: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended length: 150-160 characters. Current: {editPage.metaDescription.length}
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="keywords" className="text-sm font-medium">
                  Keywords
                </label>
                <Input
                  id="keywords"
                  value={editPage.keywords}
                  onChange={(e) => setEditPage({ ...editPage, keywords: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
