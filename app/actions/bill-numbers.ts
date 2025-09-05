'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Generate a unique bill number for a custom order
 * Format: BILL-YYYY-XXX (e.g., BILL-2024-001)
 */
export async function generateBillNumber(): Promise<{ success: boolean; billNumber?: string; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Call the database function to generate the bill number
    const { data, error } = await supabase.rpc('generate_bill_number')
    
    if (error) {
      console.error('Error generating bill number:', error)
      return { success: false, error: 'Failed to generate bill number' }
    }
    
    return { success: true, billNumber: data }
  } catch (error) {
    console.error('Error in generateBillNumber:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Assign a bill number to a custom order
 */
export async function assignBillNumber(customOrderId: string): Promise<{ success: boolean; billNumber?: string; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // First, check if the order already has a bill number
    const { data: existingOrder, error: fetchError } = await supabase
      .from('custom_orders')
      .select('bill_number')
      .eq('id', customOrderId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching custom order:', fetchError)
      return { success: false, error: 'Failed to fetch custom order' }
    }
    
    if (existingOrder.bill_number) {
      return { success: true, billNumber: existingOrder.bill_number }
    }
    
    // Generate a new bill number
    const billNumberResult = await generateBillNumber()
    if (!billNumberResult.success || !billNumberResult.billNumber) {
      return billNumberResult
    }
    
    // Update the custom order with the bill number
    const { error: updateError } = await supabase
      .from('custom_orders')
      .update({ bill_number: billNumberResult.billNumber })
      .eq('id', customOrderId)
    
    if (updateError) {
      console.error('Error updating custom order with bill number:', updateError)
      return { success: false, error: 'Failed to assign bill number to order' }
    }
    
    // Revalidate the custom orders pages
    revalidatePath('/admin/custom-orders')
    revalidatePath(`/admin/custom-orders/${customOrderId}`)
    
    return { success: true, billNumber: billNumberResult.billNumber }
  } catch (error) {
    console.error('Error in assignBillNumber:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get all custom orders with their bill numbers and payment information
 */
export async function getCustomOrdersWithBillNumbers() {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('custom_orders')
      .select(`
        *,
        quotations (
          id,
          total_amount,
          received_amount,
          payment_status,
          created_at
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching custom orders:', error)
      return { success: false, error: 'Failed to fetch custom orders' }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error in getCustomOrdersWithBillNumbers:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}