import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { LayoutDashboard, Briefcase, Calendar, FileText } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Tracktern</h1>
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 font-medium">
            <LayoutDashboard className="w-5 h-5 text-gray-500" /> Dashboard
          </Link>
          <Link href="/applications" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 font-medium">
            <Briefcase className="w-5 h-5 text-gray-500" /> Applications
          </Link>
          <Link href="/kanban" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 font-medium">
            <LayoutDashboard className="w-5 h-5 text-gray-500" /> Kanban Board
          </Link>
          <Link href="/calendar" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 font-medium">
            <Calendar className="w-5 h-5 text-gray-500" /> Calendar
          </Link>
          <Link href="/resumes" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 font-medium">
            <FileText className="w-5 h-5 text-gray-500" /> Resumes
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="md:hidden font-bold text-blue-600">Tracktern</div>
          <div className="ml-auto flex items-center space-x-4">
            <UserButton />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
