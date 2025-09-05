'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getQuotationStats } from '@/app/actions/quotations'

interface QuotationStats {
  total: number
  pending: number
  approved: number
  monthly: { month: string; total: number }[]
}

export default function QuotationAnalytics() {
  const [stats, setStats] = useState<QuotationStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getQuotationStats()
        setStats(result)
      } catch (err) {
        setError('Failed to load quotation statistics.')
        console.error(err)
      }
    }

    fetchStats()
  }, [])

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quotation Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quotation Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation Analytics</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Total Quotations</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Approved</h3>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={stats.monthly}>
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}