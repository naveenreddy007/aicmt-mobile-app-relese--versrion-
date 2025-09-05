"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Image, Plus, ExternalLink } from "lucide-react"
import { GalleryManager } from "@/components/admin/gallery-manager"
import { OptimizedImage } from "@/components/optimized-image"
import Link from "next/link"
import type { GalleryItem } from "@/app/actions/gallery"
import type { MediaItem } from "@/app/actions/media"

interface StoriesData {
  journey: any[]
  team: any[]
  achievements: any[]
  impact: any[]
}

interface StoriesGalleryManagerProps {
  initialGalleryItems: GalleryItem[]
  initialMediaItems: MediaItem[]
  initialStoriesData: StoriesData
}

export function StoriesGalleryManager({
  initialGalleryItems,
  initialMediaItems,
  initialStoriesData
}: StoriesGalleryManagerProps) {
  const [activeTab, setActiveTab] = useState("gallery")

  const storyCategories = [
    {
      id: "journey",
      title: "Our Journey",
      data: initialStoriesData.journey,
      adminPath: "/admin/stories/journey"
    },
    {
      id: "team",
      title: "Our Team",
      data: initialStoriesData.team,
      adminPath: "/admin/stories/team"
    },
    {
      id: "achievements",
      title: "Achievements",
      data: initialStoriesData.achievements,
      adminPath: "/admin/stories/achievements"
    },
    {
      id: "impact",
      title: "Our Impact",
      data: initialStoriesData.impact,
      adminPath: "/admin/stories/impact"
    }
  ]

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Gallery Management
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Stories Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
                <p className="text-gray-600">
                  Manage images displayed in the frontend gallery by category.
                </p>
              </div>
              <Link href="/admin/gallery">
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Full Gallery Admin
                </Button>
              </Link>
            </div>
            
            <GalleryManager 
              initialGalleryItems={initialGalleryItems}
              initialMediaItems={initialMediaItems}
            />
          </div>
        </TabsContent>

        <TabsContent value="stories" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Stories Management</h2>
                <p className="text-gray-600">
                  Manage content for different story categories displayed on the frontend.
                </p>
              </div>
              <Link href="/admin/stories">
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Full Stories Admin
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {storyCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        {category.title}
                      </CardTitle>
                      <Badge variant="secondary">
                        {category.data.length} items
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.data.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            {category.data.slice(0, 4).map((item, index) => (
                              <div key={index} className="aspect-square overflow-hidden rounded-md bg-gray-100">
                                <OptimizedImage
                                  src={item.image_url || "/placeholder.jpg"}
                                  alt={item.title || item.name || "Story item"}
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          {category.data.length > 4 && (
                            <p className="text-sm text-gray-500 text-center">
                              +{category.data.length - 4} more items
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No {category.title.toLowerCase()} items yet</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Link href={category.adminPath} className="flex-1">
                          <Button variant="outline" className="w-full flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Manage {category.title}
                          </Button>
                        </Link>
                        <Link href={`${category.adminPath}/new`}>
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Add
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/admin/stories/journey/new">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Journey Milestone
                    </Button>
                  </Link>
                  <Link href="/admin/stories/team/new">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Team Member
                    </Button>
                  </Link>
                  <Link href="/admin/stories/achievements/new">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Achievement
                    </Button>
                  </Link>
                  <Link href="/admin/stories/impact/new">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Impact Story
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}