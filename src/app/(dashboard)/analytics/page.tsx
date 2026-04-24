'use client'

import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { FileText, Users, Award, Percent } from 'lucide-react'

const COLORS = {
  Applied: '#3b82f6', // blue-500
  Interviewing: '#f59e0b', // amber-500
  Offer: '#10b981', // emerald-500
  Rejected: '#ef4444' // red-500
}

export default function AnalyticsPage() {
  const { data: applications, isLoading } = trpc.application.getAll.useQuery()

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading analytics...</div>
  }

  const totalApps = applications?.length || 0

  // Calculate Status Distribution
  const statusCounts = applications?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
    color: COLORS[status as keyof typeof COLORS] || '#8884d8'
  }))

  // Calculate Activity Over Time (By Month)
  const monthlyCounts = applications?.reduce((acc, app) => {
    const month = new Date(app.createdAt).toLocaleString('default', { month: 'short' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const barData = Object.keys(monthlyCounts).map(month => ({
    month,
    applications: monthlyCounts[month]
  }))

  // Calculate Rates
  const interviews = (statusCounts['Interviewing'] || 0) + (statusCounts['Offer'] || 0) + (statusCounts['Rejected'] || 0) // Approximation if rejected after interview isn't explicit, but let's just use Interviewing + Offer for simplicity
  const offers = statusCounts['Offer'] || 0

  const interviewRate = totalApps > 0 ? ((interviews / totalApps) * 100).toFixed(1) : '0.0'
  const offerRate = totalApps > 0 ? ((offers / totalApps) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Analytics</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApps}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Secured</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Received</CardTitle>
            <Award className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>
            <Percent className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offerRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {totalApps > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
