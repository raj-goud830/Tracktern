'use client'
import { useState } from 'react'
import { trpc } from "@/lib/trpc"
import { AddApplicationDialog } from "@/components/applications/add-application-dialog"
import { EditApplicationDialog } from "@/components/applications/edit-application-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2 } from "lucide-react"

export default function ApplicationsPage() {
  const { data: applications, isLoading } = trpc.application.getAll.useQuery()
  const utils = trpc.useUtils()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const { mutate: deleteApp } = trpc.application.delete.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate()
    }
  })

 const filteredApplications = applications?.filter(
  (app: {
    company: string
    role: string
    status: string
  }) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || app.status === statusFilter

    return matchesSearch && matchesStatus
  }
)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-orange-700">Applications</h2>
        <AddApplicationDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-5 rounded-md border shadow-sm">
        <Input 
          placeholder="Search company or role..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm p-5 text-lg md:text-lg"
        />
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'All')}>
          <SelectTrigger className="w-[180px] p-5 text-lg md:text-lg">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="text-lg">All Statuses</SelectItem>
            <SelectItem value="Applied" className="text-lg">Applied</SelectItem>
            <SelectItem value="Interviewing" className="text-lg">Interviewing</SelectItem>
            <SelectItem value="Offer" className="text-lg">Offer</SelectItem>
            <SelectItem value="Rejected" className="text-lg">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <Table className="text-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading applications...</TableCell>
              </TableRow>
            ) : filteredApplications?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">No applications match your search.</TableCell>
              </TableRow>
            ) : (
              filteredApplications?.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.company}</TableCell>
                  <TableCell>{app.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-base font-semibold
                      ${app.status === 'Applied' ? 'bg-orange-100 text-orange-500' : ''}
                      ${app.status === 'Interview' ? 'bg-amber-100 text-amber-800' : ''}
                      ${app.status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
                      ${app.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditApplicationDialog application={app} />
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm("Are you sure you want to delete this application?")) {
                          deleteApp({ id: app.id })
                        }
                      }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
