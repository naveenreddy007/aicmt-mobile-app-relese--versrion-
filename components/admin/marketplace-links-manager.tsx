'use client'

import React, { useState, useEffect } from 'react'
import { MarketplaceLink, Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  GripVertical, 
  Store,
  Save,
  X,
  Upload,
  Link as LinkIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'sonner'
import {
  getProductMarketplaceLinks,
  createMarketplaceLink,
  updateMarketplaceLink,
  deleteMarketplaceLink,
  toggleMarketplaceLinkStatus,
  reorderMarketplaceLinks,
  bulkCreateMarketplaceLinks
} from '@/app/actions/marketplace-links'

interface MarketplaceLinksManagerProps {
  product: Product
  onUpdate?: () => void
}

interface MarketplaceLinkForm {
  marketplace_name: string
  marketplace_url: string
  logo_url: string
  is_active: boolean
}

const MARKETPLACE_TEMPLATES = [
  {
    name: 'Amazon',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    url_pattern: 'https://amazon.in/dp/'
  },
  {
    name: 'Flipkart',
    logo_url: 'https://img.icons8.com/color/48/flipkart.png',
    url_pattern: 'https://flipkart.com/'
  },
  {
    name: 'Zepto',
    logo_url: 'https://zepto.com/favicon.ico',
    url_pattern: 'https://zepto.com/'
  },
  {
    name: 'Myntra',
    logo_url: 'https://img.icons8.com/color/48/myntra.png',
    url_pattern: 'https://myntra.com/'
  },
  {
    name: 'Nykaa',
    logo_url: 'https://img.icons8.com/color/48/nykaa.png',
    url_pattern: 'https://nykaa.com/'
  },
  {
    name: 'Swiggy',
    logo_url: 'https://img.icons8.com/color/48/swiggy.png',
    url_pattern: 'https://swiggy.com/'
  }
]

export function MarketplaceLinksManager({ product, onUpdate }: MarketplaceLinksManagerProps) {
  // Guard clause to prevent errors when product is not available
  if (!product) {
    return null
  }

  const [links, setLinks] = useState<MarketplaceLink[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<MarketplaceLink | null>(null)
  const [formData, setFormData] = useState<MarketplaceLinkForm>({
    marketplace_name: '',
    marketplace_url: '',
    logo_url: '',
    is_active: true
  })

  useEffect(() => {
    if (product?.id) {
      loadMarketplaceLinks()
    }
  }, [product?.id])

  const loadMarketplaceLinks = async () => {
    if (!product?.id) return
    
    try {
      setLoading(true)
      const result = await getProductMarketplaceLinks(product.id)
      if (result.success && result.data) {
        setLinks(result.data)
      } else {
        toast.error('Failed to load marketplace links')
      }
    } catch (error) {
      console.error('Error loading marketplace links:', error)
      toast.error('Failed to load marketplace links')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.marketplace_name.trim() || !formData.marketplace_url.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      let result
      if (editingLink) {
        result = await updateMarketplaceLink(editingLink.id, formData)
      } else {
        result = await createMarketplaceLink({
          product_id: product.id!,
          ...formData
        })
      }

      if (result.success) {
        toast.success(editingLink ? 'Link updated successfully' : 'Link created successfully')
        await loadMarketplaceLinks()
        resetForm()
        setIsDialogOpen(false)
        onUpdate?.()
      } else {
        toast.error(result.error || 'Failed to save link')
      }
    } catch (error) {
      console.error('Error saving marketplace link:', error)
      toast.error('Failed to save link')
    }
  }

  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this marketplace link?')) {
      return
    }

    try {
      const result = await deleteMarketplaceLink(linkId)
      if (result.success) {
        toast.success('Link deleted successfully')
        await loadMarketplaceLinks()
        onUpdate?.()
      } else {
        toast.error(result.error || 'Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting marketplace link:', error)
      toast.error('Failed to delete link')
    }
  }

  const handleToggleStatus = async (linkId: string, isActive: boolean) => {
    try {
      const result = await toggleMarketplaceLinkStatus(linkId, isActive)
      if (result.success) {
        toast.success(`Link ${isActive ? 'activated' : 'deactivated'} successfully`)
        await loadMarketplaceLinks()
        onUpdate?.()
      } else {
        toast.error(result.error || 'Failed to update link status')
      }
    } catch (error) {
      console.error('Error toggling link status:', error)
      toast.error('Failed to update link status')
    }
  }

  const handleBulkCreate = async () => {
    if (!product?.id) return
    
    try {
      const result = await bulkCreateMarketplaceLinks(product.id, MARKETPLACE_TEMPLATES)
      if (result.success) {
        toast.success('Template links created successfully')
        await loadMarketplaceLinks()
        onUpdate?.()
      } else {
        toast.error(result.error || 'Failed to create template links')
      }
    } catch (error) {
      console.error('Error creating template links:', error)
      toast.error('Failed to create template links')
    }
  }

  const resetForm = () => {
    setFormData({
      marketplace_name: '',
      marketplace_url: '',
      logo_url: '',
      is_active: true
    })
    setEditingLink(null)
  }

  const openEditDialog = (link: MarketplaceLink) => {
    setEditingLink(link)
    setFormData({
      marketplace_name: link.marketplace_name,
      marketplace_url: link.marketplace_url,
      logo_url: link.logo_url || '',
      is_active: link.is_active
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const applyTemplate = (template: typeof MARKETPLACE_TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      marketplace_name: template.name,
      logo_url: template.logo_url,
      marketplace_url: template.url_pattern
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Marketplace Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Marketplace Links
            <Badge variant="secondary">{links.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkCreate}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Add Templates
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingLink ? 'Edit Marketplace Link' : 'Add Marketplace Link'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="marketplace_name">Marketplace Name *</Label>
                    <Input
                      id="marketplace_name"
                      value={formData.marketplace_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, marketplace_name: e.target.value }))}
                      placeholder="e.g., Amazon, Flipkart"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marketplace_url">Product URL *</Label>
                    <Input
                      id="marketplace_url"
                      type="url"
                      value={formData.marketplace_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, marketplace_url: e.target.value }))}
                      placeholder="https://amazon.in/dp/product-id"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      type="url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  
                  {!editingLink && (
                    <div className="space-y-2">
                      <Label>Quick Templates</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {MARKETPLACE_TEMPLATES.map((template) => (
                          <Button
                            key={template.name}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => applyTemplate(template)}
                            className="text-xs"
                          >
                            {template.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      {editingLink ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No marketplace links added yet</p>
            <p className="text-sm">Add links to help customers find this product on other platforms</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {links.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border ${link.is_active ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                          {link.logo_url && (
                            <div className="w-8 h-8 relative flex-shrink-0">
                              <Image
                                src={link.logo_url}
                                alt={`${link.marketplace_name} logo`}
                                fill
                                className="object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{link.marketplace_name}</h4>
                              <Badge variant={link.is_active ? 'default' : 'secondary'} className="text-xs">
                                {link.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {link.marketplace_url}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(link.marketplace_url, '_blank')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Switch
                            checked={link.is_active}
                            onCheckedChange={(checked) => handleToggleStatus(link.id, checked)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(link)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(link.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MarketplaceLinksManager