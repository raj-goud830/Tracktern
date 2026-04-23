'use client'

import { trpc } from '@/lib/trpc'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function CalendarPage() {
  const { data: applications, isLoading } = trpc.application.getAll.useQuery()

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading calendar...</div>
  }

  const events = applications
    ?.filter(app => app.deadline)
    .map(app => {
      const date = new Date(app.deadline!)
      return {
        id: app.id,
        title: `${app.company} - ${app.role}`,
        start: date,
        end: date,
        allDay: true,
        resource: app,
      }
    }) || []

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Application Deadlines</h2>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1 min-h-[500px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'agenda']}
          eventPropGetter={() => ({
            className: '!bg-blue-600 !border-none !rounded text-white px-2 py-1 text-sm',
          })}
        />
      </div>
    </div>
  )
}
