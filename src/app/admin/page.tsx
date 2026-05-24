import { createClient } from '@/utils/supabase/server'
import styles from './page.module.css'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: tasks } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
  const { data: meetings } = await supabase.from('meetings').select('*').order('start_time', { ascending: true })
  const { data: notes } = await supabase.from('notes').select('*').order('created_at', { ascending: false }).limit(3)

  const todoCount = tasks?.filter(t => t.status === 'todo').length || 0
  const inProgressCount = tasks?.filter(t => t.status === 'in_progress').length || 0
  const doneCount = tasks?.filter(t => t.status === 'done').length || 0
  const upcomingMeetings = meetings?.filter(m => new Date(m.start_time) >= new Date()) || []

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeBar}>
        <div>
          <h1>Panel</h1>
          <p>Xoş gəldin, <strong>{user?.email?.split('@')[0]}</strong>! İşlərini buradan idarə et.</p>
        </div>
        <Link href="/admin/tasks" className={styles.goToBoard}>Lövhəyə keç →</Link>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>To Do</div>
          <div className={styles.statValue}>{todoCount}</div>
          <div className={styles.statDot} style={{ backgroundColor: '#ef4444' }} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>In Progress</div>
          <div className={styles.statValue}>{inProgressCount}</div>
          <div className={styles.statDot} style={{ backgroundColor: '#f59e0b' }} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Done</div>
          <div className={styles.statValue}>{doneCount}</div>
          <div className={styles.statDot} style={{ backgroundColor: '#22c55e' }} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Yaxınlaşan İclaslar</div>
          <div className={styles.statValue}>{upcomingMeetings.length}</div>
          <div className={styles.statDot} style={{ backgroundColor: '#3b82f6' }} />
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Son Tasklar</h2>
            <Link href="/admin/tasks" className={styles.viewAll}>Hamısı →</Link>
          </div>
          {tasks && tasks.length > 0 ? (
            <div className={styles.taskList}>
              {tasks.slice(0, 6).map((task: any) => (
                <div key={task.id} className={styles.taskRow}>
                  <div className={styles.taskInfo}>
                    <span className={`${styles.dot} ${styles[task.status]}`} />
                    <span className={styles.taskTitle}>{task.title}</span>
                  </div>
                  <span className={`${styles.badge} ${styles[task.status]}`}>
                    {task.status === 'todo' ? 'To Do' : task.status === 'in_progress' ? 'In Progress' : 'Done'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Heç bir task yoxdur.</p>
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Yaxınlaşan İclaslar</h2>
            <Link href="/admin/calendar" className={styles.viewAll}>Hamısı →</Link>
          </div>
          {upcomingMeetings.length > 0 ? (
            <div className={styles.meetingList}>
              {upcomingMeetings.slice(0, 5).map((m: any) => {
                const d = new Date(m.start_time)
                return (
                  <div key={m.id} className={styles.meetingRow}>
                    <div className={styles.meetingDate}>
                      <span className={styles.meetDay}>{d.getDate()}</span>
                      <span className={styles.meetMonth}>{d.toLocaleString('az-AZ', { month: 'short' })}</span>
                    </div>
                    <div className={styles.meetingInfo}>
                      <div className={styles.meetTitle}>{m.title}</div>
                      <div className={styles.meetTime}>{d.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className={styles.empty}>Planlaşdırılmış iclas yoxdur.</p>
          )}
        </div>
      </div>
    </div>
  )
}
