'use client'

import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { addMeeting, deleteMeeting } from './actions'
import styles from './page.module.css'

type Meeting = {
  id: string
  title: string
  description?: string
  start_time: string
  end_time: string
}

export default function CalendarClient({ initialMeetings }: { initialMeetings: Meeting[] }) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formTime, setFormTime] = useState('09:00')

  const events = meetings.map(m => ({
    id: m.id,
    title: m.title,
    start: m.start_time,
    end: m.end_time,
    extendedProps: { description: m.description },
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
  }))

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr)
    setSelectedMeeting(null)
    setFormTitle('')
    setFormDesc('')
    setFormTime('09:00')
    setShowModal(true)
  }

  const handleEventClick = (info: any) => {
    const m = meetings.find(m => m.id === info.event.id)
    if (m) {
      setSelectedMeeting(m)
      setFormTitle(m.title)
      setFormDesc(m.description || '')
      setSelectedDate(m.start_time.split('T')[0])
      setFormTime(new Date(m.start_time).toTimeString().slice(0, 5))
      setShowModal(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('title', formTitle)
    formData.set('description', formDesc)
    formData.set('date', selectedDate)
    formData.set('time', formTime)
    await addMeeting(formData)
    
    // Optimistic UI
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: formTitle,
      description: formDesc,
      start_time: new Date(`${selectedDate}T${formTime}:00`).toISOString(),
      end_time: new Date(`${selectedDate}T${formTime}:00`).toISOString(),
    }
    setMeetings(prev => [...prev, newMeeting])
    setShowModal(false)
  }

  const handleDelete = async () => {
    if (!selectedMeeting) return
    await deleteMeeting(selectedMeeting.id)
    setMeetings(prev => prev.filter(m => m.id !== selectedMeeting.id))
    setShowModal(false)
  }

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.calendarBox}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="100%"
          editable={false}
          selectable={true}
        />
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedMeeting ? 'İclas Məlumatları' : 'Yeni İclas'}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Başlıq</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="İclasın mövzusu"
                  required
                  className={styles.input}
                  readOnly={!!selectedMeeting}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Gündəlik / Qeyd</label>
                <textarea
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Əlavə məlumat"
                  className={styles.textarea}
                  readOnly={!!selectedMeeting}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tarix</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className={styles.input}
                    readOnly={!!selectedMeeting}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Vaxt</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    className={styles.input}
                    readOnly={!!selectedMeeting}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                {!selectedMeeting ? (
                  <button type="submit" className={styles.saveBtn}>Yadda saxla</button>
                ) : (
                  <button type="button" onClick={handleDelete} className={styles.deleteBtn}>İclası Sil</button>
                )}
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Bağla</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
