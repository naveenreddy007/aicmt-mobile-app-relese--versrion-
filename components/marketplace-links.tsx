'use client'

import React from 'react'
import { MarketplaceLink } from '@/types/product'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, ShoppingCart, Store } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface MarketplaceLinksProps {
  links: MarketplaceLink[]
  productName: string
  className?: string
  variant?: 'default' | 'compact' | 'grid'
}

export function MarketplaceLinks({ 
  links, 
  productName, 
  className = '',
  variant = 'default'
}: MarketplaceLinksProps) {
  if (!links || links.length === 0) {
    return null
  }

  const activeLinks = links.filter(link => link.is_active)
  
  if (activeLinks.length === 0) {
    return null
  }

  const handleLinkClick = (link: MarketplaceLink) => {
    // Track analytics if needed
    console.log(`Clicked marketplace link: ${link.marketplace_name} for product: ${productName}`)
    
    // Open in new tab
    window.open(link.marketplace_url, '_blank', 'noopener,noreferrer')
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {activeLinks.map((link, index) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLinkClick(link)}
              className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {link.logo_url && (
                <div className="w-4 h-4 relative">
                  <Image
                    src={link.logo_url}
                    alt={`${link.marketplace_name} logo`}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      // Hide image on error
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <span className="text-xs">{link.marketplace_name}</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${className}`}>
        {activeLinks.map((link, index) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary"
              onClick={() => handleLinkClick(link)}
            >
              <CardContent className="p-4 text-center">
                {link.logo_url && (
                  <div className="w-12 h-12 mx-auto mb-3 relative">
                    <Image
                      src={link.logo_url}
                      alt={`${link.marketplace_name} logo`}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // Show fallback icon on error
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon')
                        if (fallback) fallback.style.display = 'block'
                      }}
                    />
                    <Store className="w-12 h-12 text-gray-400 fallback-icon" style={{ display: 'none' }} />
                  </div>
                )}
                <h4 className="font-medium text-sm mb-2">{link.marketplace_name}</h4>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <ShoppingCart className="w-3 h-3" />
                  <span>Shop Now</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Available on Other Platforms</h3>
        <Badge variant="secondary" className="text-xs">
          {activeLinks.length} {activeLinks.length === 1 ? 'platform' : 'platforms'}
        </Badge>
      </div>
      
      <div className="grid gap-3">
        {activeLinks.map((link, index) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-md transition-all duration-300 hover:bg-accent/50 border hover:border-primary"
              onClick={() => handleLinkClick(link)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {link.logo_url && (
                      <div className="w-8 h-8 relative flex-shrink-0">
                        <Image
                          src={link.logo_url}
                          alt={`${link.marketplace_name} logo`}
                          fill
                          className="object-contain"
                          onError={(e) => {
                            // Show fallback icon on error
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon')
                            if (fallback) fallback.style.display = 'block'
                          }}
                        />
                        <Store className="w-8 h-8 text-gray-400 fallback-icon" style={{ display: 'none' }} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{link.marketplace_name}</h4>
                      <p className="text-sm text-muted-foreground">Shop {productName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Shop Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {activeLinks.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Compare prices and availability across platforms
          </p>
        </div>
      )}
    </div>
  )
}

// Skeleton loader for marketplace links
export function MarketplaceLinksSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'grid' }) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default MarketplaceLinks