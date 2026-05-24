import React from 'react'

type Task = {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  created_at: string
  profiles?: { first_name: string, last_name: string }
}

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete 
}: { 
  task: Task
  onEdit?: () => void
  onDelete?: () => void
}) {
  const date = new Date(task.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
  
  return (
    <div style={{
      backgroundColor: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '0.5rem',
      padding: '1rem',
      cursor: 'grab',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#e5e5e5', fontWeight: 500, wordBreak: 'break-word' }}>
          {task.title}
        </h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {onEdit && (
            <button 
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={(e) => { e.stopPropagation(); onEdit(); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem', opacity: 0.6 }}
              title="Redaktə et"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button 
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={(e) => { e.stopPropagation(); onDelete(); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem', opacity: 0.6 }}
              title="Sil"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

        <span style={{ color: '#888888', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          📅 {date}
        </span>
      </div>

      {task.profiles && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
          <span style={{ color: '#666', fontSize: '0.8rem' }}>👤</span>
          <span style={{ color: '#888888', fontSize: '0.75rem' }}>
            {`${task.profiles.first_name || ''} ${task.profiles.last_name || ''}`}
          </span>
        </div>
      )}
    </div>
  )
}
