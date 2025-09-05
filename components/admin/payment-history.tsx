'use client'

import { useEffect, useState } from 'react'
import { getPaymentsByQuotation } from '@/app/actions/payments'
import { PaymentsTable } from './payments-table'
import { Loader2 } from 'lucide-react'

interface PaymentHistoryProps {
  quotationId: string
}

export function PaymentHistoryForQuotation({ quotationId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true)
        const result = await getPaymentsByQuotation(quotationId)
        
        if (result.success) {
          setPayments(result.data || [])
        } else {
          setError(result.error || 'Failed to fetch payments')
        }
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (quotationId) {
      fetchPayments()
    }
  }, [quotationId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading payments...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No payments recorded yet.</p>
      </div>
    )
  }

  return <PaymentsTable payments={payments} showQuotationInfo={false} />
}