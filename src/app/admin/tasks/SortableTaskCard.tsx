import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskCard from './TaskCard'

type Task = {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  created_at: string
  profiles?: { first_name: string, last_name: string }
}

export default function SortableTaskCard({ 
  task,
  onEdit,
  onDelete
}: { 
  task: Task
  onEdit?: () => void
  onDelete?: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}
