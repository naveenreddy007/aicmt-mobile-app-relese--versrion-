"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample media items - in a real app, these would come from your API
const mediaItems = [
  { id: 1, url: "/sustainable-future-city.png", name: "Sustainable Future City", type: "image" },
  { id: 2, url: "/green-leaf-certificate.png", name: "Green Leaf Certificate", type: "image" },
  { id: 3, url: "/biodegradable-testing.png", name: "Biodegradable Testing", type: "image" },
  { id: 4, url: "/biodegradation-progress.png", name: "Biodegradation Progress", type: "image" },
  { id: 5, url: "/eco-factory-innovation.png", name: "Eco Factory Innovation", type: "image" },
  { id: 6, url: "/clear-eco-pellets.png", name: "Clear Eco Pellets", type: "image" },
  { id: 7, url: "/earth-friendly-shopping.png", name: "Earth Friendly Shopping", type: "image" },
  { id: 8, url: "/earth-friendly-takeout.png", name: "Earth Friendly Takeout", type: "image" },
  { id: 9, url: "/biodegradable-plastic-granules.png", name: "Biodegradable Plastic Granules", type: "image" },
  { id: 10, url: "/clear-biodegradable-pellets.png", name: "Clear Biodegradable Pellets", type: "image" },
  { id: 11, url: "/sustainable-factory-exterior.png", name: "Sustainable Factory Exterior", type: "image" },
  { id: 12, url: "/confident-professional.png", name: "Confident Professional", type: "image" },
]

export function MediaSelector({ selectedImage = "", onSelect }) {
  const [isUploading, setIsUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMedia = mediaItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleUpload = () => {
    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false)
      // In a real app, this would add the newly uploaded image to the list
    }, 2000)
  }

  const handleClearSelection = () => {
    onSelect("")
  }

  return (
    <div className="space-y-4">
      {selectedImage ? (
        <div className="relative border rounded-md p-2">
          <div className="absolute top-4 right-4 z-10">
            <Button variant="destructive" size="icon" onClick={handleClearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative h-[200px] w-full">
            <Image src={selectedImage || "/placeholder.svg"} alt="Selected media" fill className="object-contain" />
          </div>
          <p className="mt-2 text-sm text-center">{selectedImage.split("/").pop()}</p>
        </div>
      ) : (
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="border rounded-md p-4">
            <div className="mb-4">
              <Input placeholder="Search media..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
                    onClick={() => onSelect(item.url)}
                  >
                    <div className="relative h-24 w-full">
                      <Image src={item.url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs truncate">{item.name}</p>
                    </div>
                  </div>
                ))}

                {filteredMedia.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">No media found</div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload" className="border rounded-md p-4">
            <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-md">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Files"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
