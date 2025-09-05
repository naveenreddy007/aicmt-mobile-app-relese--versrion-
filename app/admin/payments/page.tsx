import { getAllPayments } from '@/app/actions/payments'
import { PaymentsTable } from '@/components/admin/payments-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default async function PaymentsPage() {
  const paymentsResult = await getAllPayments()
  const payments = paymentsResult.success ? paymentsResult.data : []

  // Calculate payment statistics
  const totalPayments = payments.length
  const totalAmount = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)
  const pendingPayments = payments.filter(p => p.status === 'pending').length
  const completedPayments = payments.filter(p => p.status === 'completed').length

  const stats = [
    {
      title: 'Total Payments',
      value: totalPayments.toString(),
      description: 'All payment records',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Amount',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(totalAmount),
      description: 'Total payment value',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending',
      value: pendingPayments.toString(),
      description: 'Awaiting confirmation',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed',
      value: completedPayments.toString(),
      description: 'Successfully processed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage all payment transactions
        </p>
      </div>

      {/* Payment Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>
            View and manage payment records for all quotations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsTable payments={payments} />
        </CardContent>
      </Card>
    </div>
  )
}