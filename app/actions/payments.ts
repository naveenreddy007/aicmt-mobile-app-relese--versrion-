'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface Payment {
  id: string
  quotation_id: string
  amount: number
  payment_method: string
  reference_number?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_date: string
  notes?: string
  created_at: string
}

export interface PaymentFormData {
  quotation_id: string
  amount: number
  payment_method: string
  reference_number?: string
  notes?: string
  payment_date?: string
}

/**
 * Create a new payment record
 */
export async function createPayment(data: PaymentFormData) {
  const supabase = await createClient()

  try {
    // Insert the payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        quotation_id: data.quotation_id,
        amount: data.amount,
        payment_method: data.payment_method,
        reference_number: data.reference_number,
        notes: data.notes,
        payment_date: data.payment_date || new Date().toISOString(),
        status: 'completed'
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Error creating payment:', paymentError)
      throw new Error('Failed to create payment')
    }

    // Update quotation received_amount
    const { error: updateError } = await supabase.rpc('update_quotation_payment', {
      quotation_id: data.quotation_id,
      payment_amount: data.amount
    })

    if (updateError) {
      console.error('Error updating quotation:', updateError)
      throw new Error('Failed to update quotation balance')
    }

    revalidatePath('/admin/custom-orders')
    revalidatePath('/admin/quotations')
    
    return { success: true, payment }
  } catch (error) {
    console.error('Error in createPayment:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

/**
 * Get all payments for a quotation
 */
export async function getPaymentsByQuotation(quotationId: string) {
  const supabase = await createClient()

  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('quotation_id', quotationId)
      .order('payment_date', { ascending: false })

    if (error) {
      console.error('Error fetching payments:', error)
      throw new Error('Failed to fetch payments')
    }

    return payments as Payment[]
  } catch (error) {
    console.error('Error in getPaymentsByQuotation:', error)
    return []
  }
}

/**
 * Get all payments with quotation details
 */
export async function getAllPayments() {
  const supabase = await createClient()

  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        quotations (
          id,
          bill_number,
          total_amount,
          custom_orders (
            id,
            company_name,
            contact_name
          )
        )
      `)
      .order('payment_date', { ascending: false })

    if (error) {
      console.error('Error fetching all payments:', error)
      throw new Error('Failed to fetch payments')
    }

    return payments
  } catch (error) {
    console.error('Error in getAllPayments:', error)
    return []
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(paymentId: string, status: Payment['status']) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId)

    if (error) {
      console.error('Error updating payment status:', error)
      throw new Error('Failed to update payment status')
    }

    revalidatePath('/admin/custom-orders')
    revalidatePath('/admin/quotations')
    revalidatePath('/admin/payments')
    
    return { success: true }
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

/**
 * Delete a payment (and update quotation balance)
 */
export async function deletePayment(paymentId: string) {
  const supabase = await createClient()

  try {
    // First get the payment details
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('quotation_id, amount')
      .eq('id', paymentId)
      .single()

    if (fetchError || !payment) {
      throw new Error('Payment not found')
    }

    // Delete the payment
    const { error: deleteError } = await supabase
      .from('payments')
      .delete()
      .eq('id', paymentId)

    if (deleteError) {
      console.error('Error deleting payment:', deleteError)
      throw new Error('Failed to delete payment')
    }

    // Update quotation received_amount (subtract the deleted payment)
    const { error: updateError } = await supabase.rpc('update_quotation_payment', {
      quotation_id: payment.quotation_id,
      payment_amount: -payment.amount // Negative to subtract
    })

    if (updateError) {
      console.error('Error updating quotation after deletion:', updateError)
      throw new Error('Failed to update quotation balance')
    }

    revalidatePath('/admin/custom-orders')
    revalidatePath('/admin/quotations')
    revalidatePath('/admin/payments')
    
    return { success: true }
  } catch (error) {
    console.error('Error in deletePayment:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}