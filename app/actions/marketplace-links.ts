'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { MarketplaceLink } from '@/types/product'

export interface CreateMarketplaceLinkData {
  product_id: string
  marketplace_name: string
  marketplace_url: string
  logo_url?: string
  display_order?: number
  is_active?: boolean
}

export interface UpdateMarketplaceLinkData {
  id: string
  marketplace_name?: string
  marketplace_url?: string
  logo_url?: string
  display_order?: number
  is_active?: boolean
}

/**
 * Get all marketplace links for a product
 */
export async function getProductMarketplaceLinks(productId: string): Promise<MarketplaceLink[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('product_marketplace_links')
    .select('*')
    .eq('product_id', productId)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('marketplace_name', { ascending: true })
  
  if (error) {
    console.error('Error fetching marketplace links:', error)
    throw new Error('Failed to fetch marketplace links')
  }
  
  return data || []
}

/**
 * Get all marketplace links for a product (including inactive ones) - Admin only
 */
export async function getAllProductMarketplaceLinks(productId: string): Promise<MarketplaceLink[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('product_marketplace_links')
    .select('*')
    .eq('product_id', productId)
    .order('display_order', { ascending: true })
    .order('marketplace_name', { ascending: true })
  
  if (error) {
    console.error('Error fetching all marketplace links:', error)
    throw new Error('Failed to fetch marketplace links')
  }
  
  return data || []
}

/**
 * Create a new marketplace link
 */
export async function createMarketplaceLink(data: CreateMarketplaceLinkData) {
  const supabase = createClient()
  
  // Validate URL format
  if (!data.marketplace_url.match(/^https?:\/\/.+/)) {
    throw new Error('Invalid URL format. URL must start with http:// or https://')
  }
  
  // Check if marketplace already exists for this product
  const { data: existing } = await supabase
    .from('product_marketplace_links')
    .select('id')
    .eq('product_id', data.product_id)
    .eq('marketplace_name', data.marketplace_name)
    .single()
  
  if (existing) {
    throw new Error(`Marketplace link for ${data.marketplace_name} already exists for this product`)
  }
  
  const { data: result, error } = await supabase
    .from('product_marketplace_links')
    .insert({
      product_id: data.product_id,
      marketplace_name: data.marketplace_name,
      marketplace_url: data.marketplace_url,
      logo_url: data.logo_url,
      display_order: data.display_order || 0,
      is_active: data.is_active !== false // Default to true
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating marketplace link:', error)
    throw new Error('Failed to create marketplace link')
  }
  
  revalidatePath('/admin/products')
  revalidatePath(`/products/${data.product_id}`)
  
  return result
}

/**
 * Update an existing marketplace link
 */
export async function updateMarketplaceLink(data: UpdateMarketplaceLinkData) {
  const supabase = createClient()
  
  // Validate URL format if provided
  if (data.marketplace_url && !data.marketplace_url.match(/^https?:\/\/.+/)) {
    throw new Error('Invalid URL format. URL must start with http:// or https://')
  }
  
  const updateData: any = {}
  if (data.marketplace_name !== undefined) updateData.marketplace_name = data.marketplace_name
  if (data.marketplace_url !== undefined) updateData.marketplace_url = data.marketplace_url
  if (data.logo_url !== undefined) updateData.logo_url = data.logo_url
  if (data.display_order !== undefined) updateData.display_order = data.display_order
  if (data.is_active !== undefined) updateData.is_active = data.is_active
  
  const { data: result, error } = await supabase
    .from('product_marketplace_links')
    .update(updateData)
    .eq('id', data.id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating marketplace link:', error)
    throw new Error('Failed to update marketplace link')
  }
  
  revalidatePath('/admin/products')
  revalidatePath('/products')
  
  return result
}

/**
 * Delete a marketplace link
 */
export async function deleteMarketplaceLink(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('product_marketplace_links')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting marketplace link:', error)
    throw new Error('Failed to delete marketplace link')
  }
  
  revalidatePath('/admin/products')
  revalidatePath('/products')
}

/**
 * Toggle marketplace link active status
 */
export async function toggleMarketplaceLinkStatus(id: string, isActive: boolean) {
  const supabase = createClient()
  
  const { data: result, error } = await supabase
    .from('product_marketplace_links')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error toggling marketplace link status:', error)
    throw new Error('Failed to toggle marketplace link status')
  }
  
  revalidatePath('/admin/products')
  revalidatePath('/products')
  
  return result
}

/**
 * Reorder marketplace links for a product
 */
export async function reorderMarketplaceLinks(productId: string, linkIds: string[]) {
  const supabase = createClient()
  
  // Update display_order for each link
  const updates = linkIds.map((id, index) => 
    supabase
      .from('product_marketplace_links')
      .update({ display_order: index })
      .eq('id', id)
      .eq('product_id', productId)
  )
  
  const results = await Promise.all(updates)
  
  // Check for errors
  const errors = results.filter(result => result.error)
  if (errors.length > 0) {
    console.error('Error reordering marketplace links:', errors)
    throw new Error('Failed to reorder marketplace links')
  }
  
  revalidatePath('/admin/products')
  revalidatePath(`/products/${productId}`)
}

/**
     * Get popular marketplace templates for quick setup
     */
    export async function getMarketplaceTemplates() {
  return [
    {
      name: 'Amazon',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      url_template: 'https://amazon.in/s?k={product_name}'
    },
    {
      name: 'Flipkart',
      logo_url: 'https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png',
      url_template: 'https://flipkart.com/search?q={product_name}'
    },
    {
      name: 'Zepto',
      logo_url: 'https://cdn.zeptonow.com/web-static-assets-prod/artifacts/9b4b6d7d8b8c8f8e8d8c8f8e8d8c8f8e.svg',
      url_template: 'https://zepto.com/search?q={product_name}'
    },
    {
      name: 'Myntra',
      logo_url: 'https://constant.myntassets.com/web/assets/img/MyntraWebSprite_27_01_2021.png',
      url_template: 'https://myntra.com/{product_name}'
    },
    {
      name: 'Nykaa',
      logo_url: 'https://images-static.nykaa.com/media/catalog/product/n/y/nykaa-logo.svg',
      url_template: 'https://nykaa.com/search?q={product_name}'
    },
    {
      name: 'BigBasket',
      logo_url: 'https://www.bigbasket.com/media/uploads/p/l/40034954_4-bigbasket-logo.jpg',
      url_template: 'https://bigbasket.com/ps/?q={product_name}'
    }
  ]
}

/**
 * Bulk create marketplace links from templates
 */
export async function createMarketplaceLinksFromTemplate(
  productId: string, 
  productName: string, 
  marketplaceNames: string[]
) {
  const templates = getMarketplaceTemplates()
  const selectedTemplates = templates.filter(t => marketplaceNames.includes(t.name))
  
  const createPromises = selectedTemplates.map((template, index) => 
    createMarketplaceLink({
      product_id: productId,
      marketplace_name: template.name,
      marketplace_url: template.url_template.replace('{product_name}', encodeURIComponent(productName)),
      logo_url: template.logo_url,
      display_order: index,
      is_active: true
    })
  )
  
  try {
    const results = await Promise.allSettled(createPromises)
    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length
    
    return {
      successful,
      failed,
      total: selectedTemplates.length
    }
  } catch (error) {
    console.error('Error creating marketplace links from template:', error)
    throw new Error('Failed to create marketplace links from template')
  }
}

/**
 * Bulk create marketplace links for a product
 */
export async function bulkCreateMarketplaceLinks(
  productId: string,
  links: Omit<CreateMarketplaceLinkData, 'product_id'>[]
) {
  const supabase = createClient()

  const linksToCreate = links.map(link => ({
    ...link,
    product_id: productId,
  }))

  const { data, error } = await supabase
    .from('product_marketplace_links')
    .insert(linksToCreate)
    .select()

  if (error) {
    console.error('Error bulk creating marketplace links:', error)
    throw new Error('Failed to bulk create marketplace links')
  }

  revalidatePath('/admin/products')
  revalidatePath(`/products/${productId}`)

  return data
}