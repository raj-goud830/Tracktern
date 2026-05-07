'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { Briefcase, CheckCircle, Clock, XCircle } from "lucide-react"

export default function DashboardPage() {
  const { data: applications, isLoading } = trpc.application.getAll.useQuery()

  const stats = [
    { name: "Total Applications", value: applications?.length || 0, icon: Briefcase, color: "text-orange-500" },
    { name: "Interviews", value: applications?.filter(a => a.status === "Interview").length || 0, icon: Clock, color: "text-amber-500" },
    { name: "Offers", value: applications?.filter(a => a.status === "Accepted").length || 0, icon: CheckCircle, color: "text-green-500" },
    { name: "Rejected", value: applications?.filter(a => a.status === "Rejected").length || 0, icon: XCircle, color: "text-red-500" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-orange-700">Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{stat.name}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "-" : stat.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <h3 className="text-xl font-bold tracking-tight text-orange-500 mt-8">Recent Applications</h3>
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="p-4 text-center text-gray-500">
          {isLoading ? "Loading..." : "View and manage your applications from the Applications tab."}
        </div>
      </div>
    </div>
  )
}
