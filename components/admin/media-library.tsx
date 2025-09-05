"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Copy, Download, FileText, Filter, ImagePlus, MoreHorizontal, Search, Trash, Upload, X, Image as ImageIcon, Video } from "lucide-react"
import { getMediaItems, deleteMediaItem, uploadMediaFiles } from "@/app/actions/media"
import { toast } from "sonner"

interface MediaFile {
  id: string
  name: string
  type: string
  size: string
  dimensions?: string
  url: string
  uploadedAt: string
}

export function MediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMediaFiles()
  }, [])

  const fetchMediaFiles = async () => {
    try {
      const data = await getMediaItems()
      const formattedFiles: MediaFile[] = data.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size || "Unknown",
        dimensions: file.dimensions,
        url: file.url,
        uploadedAt: file.created_at,
      }))

      setMediaFiles(formattedFiles)
    } catch (error) {
      console.error("Error fetching media files:", error)
      toast.error("Failed to load media files")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || file.type === activeTab
    return matchesSearch && matchesTab
  })

  const confirmDeleteFile = (fileId: string) => {
    setFileToDelete(fileId)
    setDeleteConfirmOpen(true)
  }

  const deleteFile = async () => {
    if (fileToDelete) {
      try {
        const result = await deleteMediaItem(fileToDelete)
        if (result.success) {
          setMediaFiles((prev) => prev.filter((file) => file.id !== fileToDelete))
          toast.success("File deleted successfully")
        } else {
          toast.error(result.error || "Failed to delete file")
        }
      } catch (error) {
        console.error("Error deleting file:", error)
        toast.error("Failed to delete file")
      } finally {
        setFileToDelete(null)
        setDeleteConfirmOpen(false)
        if (selectedFile && selectedFile.id === fileToDelete) {
          setSelectedFile(null)
        }
      }
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      selectedFiles.forEach(file => {
        formData.append("files", file)
      })

      const result = await uploadMediaFiles(formData)
      
      if (result.success) {
        toast.success(`Successfully uploaded ${result.files?.length || 0} file(s)`)
        setSelectedFiles([])
        setUploadDialogOpen(false)
        fetchMediaFiles() // Refresh the media list
      } else {
        toast.error(result.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getImageDimensions = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve(`${img.width}x${img.height}`)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    // In a real implementation, we would show a toast notification
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab("all")}>All Files</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("image")}>Images</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("document")}>Documents</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("video")}>Videos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground">
            Loading media files...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground">
            No files found.
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`group relative rounded-lg border overflow-hidden ${
                selectedFile?.id === file.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedFile(file)}
            >
              {file.type === "image" ? (
                <div className="relative aspect-square">
                  <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex items-center justify-center aspect-square bg-muted">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => copyFileUrl(file.url)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={file.url} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => confirmDeleteFile(file.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="p-2 text-xs truncate">{file.name}</div>
            </div>
          ))
        )}
      </div>

      {selectedFile && (
        <div className="mt-6 border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium">{selectedFile.name}</h3>
            <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
              <span className="sr-only">Close</span>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {selectedFile.type === "image" ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <Image
                    src={selectedFile.url || "/placeholder.svg"}
                    alt={selectedFile.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center aspect-video bg-muted rounded-lg">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">File Details</h4>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="capitalize">{selectedFile.type}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Size</dt>
                    <dd>{selectedFile.size}</dd>
                  </div>
                  {selectedFile.dimensions && (
                    <div>
                      <dt className="text-muted-foreground">Dimensions</dt>
                      <dd>{selectedFile.dimensions}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground">Uploaded</dt>
                    <dd>{formatDate(selectedFile.uploadedAt)}</dd>
                  </div>
                </dl>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">File URL</h4>
                <div className="flex items-center gap-2">
                  <Input value={selectedFile.url} readOnly className="text-xs" />
                  <Button variant="outline" size="icon" onClick={() => copyFileUrl(selectedFile.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href={selectedFile.url} download target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDeleteFile(selectedFile.id)}
                  className="w-full"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteFile}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>Upload new files to your media library</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  id="file-upload" 
                  multiple 
                  onChange={handleFileSelect}
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                />
                <Button asChild variant="secondary" size="sm">
                  <label htmlFor="file-upload">Browse Files</label>
                </Button>
                <p className="mt-2 text-xs text-gray-500">
                  Supported formats: Images, Videos, PDF, Documents (Max 50MB per file)
                </p>
              </div>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {file.type.startsWith('image/') ? (
                           <ImageIcon className="h-4 w-4" />
                        ) : file.type.startsWith('video/') ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setUploadDialogOpen(false)
                setSelectedFiles([])
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} file(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
