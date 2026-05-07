'use client'

import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card } from '@/components/ui/card'
import { Calendar as CalendarIcon, FileText } from 'lucide-react'

const COLUMNS = ['Applied', 'Interviewing', 'Offer', 'Rejected']

export default function KanbanPage() {
  const [isBrowser, setIsBrowser] = useState(false)
  const utils = trpc.useUtils()
  
  const { data: applications, isLoading } = trpc.application.getAll.useQuery()
  const { mutate: updateApplication } = trpc.application.update.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate()
    }
  })

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  if (!isBrowser || isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Kanban board...</div>
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId
    updateApplication({ id: draggableId, status: newStatus })
  }

  const groupedApps = COLUMNS.reduce((acc, col) => {
    acc[col] = applications?.filter(app => app.status === col) || []
    return acc
  }, {} as Record<string, typeof applications>)

  applications?.forEach(app => {
    if (!COLUMNS.includes(app.status)) {
      if (!groupedApps['Applied']) groupedApps['Applied'] = []
      groupedApps['Applied'].push(app)
    }
  })

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-orange-700">Kanban Board</h2>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full min-w-max">
            {COLUMNS.map(column => (
              <div key={column} className="w-80 flex flex-col bg-gray-100/50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4 px-1">{column} ({groupedApps[column]?.length || 0})</h3>
                
                <Droppable droppableId={column}>
                  {(provided) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                      className="flex-1 space-y-3 min-h-[150px]"
                    >
                      {groupedApps[column]?.map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided) => (
                            <Card 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 bg-white shadow-sm border border-gray-200 hover:border-orange-300 transition-colors cursor-grab active:cursor-grabbing"
                            >
                              <div className="font-semibold text-gray-900">{app.role}</div>
                              <div className="text-lg text-gray-500 mb-3">{app.company}</div>
                              
                              <div className="flex items-center gap-4 text-base text-gray-500 mt-2 border-t pt-2 border-gray-100">
                                {app.deadline && (
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    <span>{new Date(app.deadline).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {app.resumeId && (
                                  <div className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    <span>Resume</span>
                                  </div>
                                )}
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
