'use client'

import React, { useState } from 'react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { updateTaskStatus, addTask, deleteTask, editTask } from './actions'
import SortableTaskCard from './SortableTaskCard'
import TaskCard from './TaskCard'

type Task = {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  created_at: string
  profiles?: { first_name: string; last_name: string }
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#ef4444' },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'done', title: 'Done', color: '#22c55e' },
]

function Column({
  col,
  tasks,
  onAddClick,
  onEditTask,
  onDeleteTask
}: {
  col: { id: string; title: string; color: string }
  tasks: Task[]
  onAddClick: (status: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}) {
  const { setNodeRef } = useDroppable({
    id: col.id,
    data: { type: 'Column', column: col },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column' }}
    >
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '0.75rem',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '300px',
          gap: '0.75rem',
        }}
      >
        {/* Column Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: col.color, display: 'inline-block' }} />
            <h3 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--foreground)', fontWeight: 600 }}>
              {col.title}
            </h3>
            <span
              style={{
                backgroundColor: '#2a2a2a',
                color: 'var(--foreground-muted)',
                fontSize: '0.7rem',
                padding: '1px 7px',
                borderRadius: '1rem',
              }}
            >
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => onAddClick(col.id)}
            style={{
              background: 'none',
              border: '1px solid #2a2a2a',
              color: 'var(--foreground-muted)',
              borderRadius: '0.35rem',
              width: 26,
              height: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: 1,
            }}
            title="Yeni task əlavə et"
          >
            +
          </button>
        </div>

        {/* Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} onDelete={() => onDeleteTask(task.id)} />
            ))}
          </SortableContext>
          {tasks.length === 0 && (
            <div
              style={{
                border: '1px dashed #2a2a2a',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                textAlign: 'center',
                color: '#444',
                fontSize: '0.8rem',
              }}
            >
              Buraya task sürüşdürün
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Add Task Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalStatus, setModalStatus] = useState('todo')
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [saving, setSaving] = useState(false)

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const openModal = (status: string) => {
    setEditingTask(null)
    setModalStatus(status)
    setNewTitle('')
    setNewDesc('')
    setShowModal(true)
  }

  const handleEditClick = (task: Task) => {
    setEditingTask(task)
    setNewTitle(task.title)
    setNewDesc(task.description || '')
    setModalStatus(task.status)
    setShowModal(true)
  }

  const handleDeleteClick = async (id: string) => {
    if (confirm('Bu taskı silmək istədiyinizə əminsiniz?')) {
      setTasks(prev => prev.filter(t => t.id !== id))
      await deleteTask(id)
    }
  }

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setSaving(true)

    const fd = new FormData()
    fd.set('title', newTitle.trim())
    fd.set('description', newDesc.trim())
    fd.set('status', modalStatus)

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, title: newTitle.trim(), description: newDesc.trim(), status: modalStatus as Task['status'] } : t))
      setShowModal(false)
      await editTask(editingTask.id, fd)
      if (editingTask.status !== modalStatus) {
         await updateTaskStatus(editingTask.id, modalStatus)
      }
    } else {
      const optimistic: Task = {
        id: `temp-${Date.now()}`,
        title: newTitle.trim(),
        description: newDesc.trim(),
        status: modalStatus as Task['status'],
        created_at: new Date().toISOString(),
      }
      setTasks((prev) => [optimistic, ...prev])
      setShowModal(false)
      await addTask(fd)
    }

    setSaving(false)
    setEditingTask(null)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === event.active.id) || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const isOverTask = over.data.current?.type === 'Task'
    const isOverColumn = over.data.current?.type === 'Column'

    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === active.id)
      if (activeIndex === -1) return prev

      const updated = [...prev]

      if (isOverTask) {
        const overIndex = prev.findIndex((t) => t.id === over.id)
        if (updated[activeIndex].status !== updated[overIndex].status) {
          updated[activeIndex] = { ...updated[activeIndex], status: updated[overIndex].status }
        }
        return arrayMove(updated, activeIndex, overIndex)
      }

      if (isOverColumn) {
        updated[activeIndex] = { ...updated[activeIndex], status: over.id as Task['status'] }
        return arrayMove(updated, activeIndex, activeIndex)
      }

      return prev
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const movedTask = tasks.find((t) => t.id === active.id)
    if (movedTask) {
      await updateTaskStatus(movedTask.id, movedTask.status)
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: '1.5rem', height: '100%', width: '100%', overflowX: 'auto' }}>
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              col={col}
              tasks={tasks.filter((t) => t.status === col.id)}
              onAddClick={openModal}
              onEditTask={handleEditClick}
              onDeleteTask={handleDeleteClick}
            />
          ))}
        </div>
        <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
      </DndContext>

      {/* Add Task Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '1rem',
              padding: '1.75rem',
              width: '100%',
              maxWidth: 440,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#e5e5e5' }}>
                {editingTask ? 'Taskı Redaktə et' : 'Yeni Task'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>Başlıq *</label>
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Task adı"
                  required
                  style={{
                    background: '#111',
                    border: '1px solid #2a2a2a',
                    borderRadius: '0.5rem',
                    color: '#e5e5e5',
                    padding: '0.65rem 0.75rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>Təsvir</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Geniş açıqlama (opsional)"
                  rows={3}
                  style={{
                    background: '#111',
                    border: '1px solid #2a2a2a',
                    borderRadius: '0.5rem',
                    color: '#e5e5e5',
                    padding: '0.65rem 0.75rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>Status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  style={{
                    background: '#111',
                    border: '1px solid #2a2a2a',
                    borderRadius: '0.5rem',
                    color: '#e5e5e5',
                    padding: '0.65rem 0.75rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'none',
                    border: '1px solid #2a2a2a',
                    borderRadius: '0.5rem',
                    color: '#888',
                    padding: '0.6rem 1.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: '#e5e5e5',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#111',
                    padding: '0.6rem 1.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  {saving ? (editingTask ? 'Yadda saxlanılır...' : 'Əlavə edilir...') : (editingTask ? 'Yadda Saxla' : 'Əlavə et')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
