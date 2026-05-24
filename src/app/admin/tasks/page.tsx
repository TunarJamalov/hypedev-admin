import { createClient } from '@/utils/supabase/server'
import KanbanBoard from './KanbanBoard'
import styles from './page.module.css'

export default async function TasksPage() {
  const supabase = await createClient()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, profiles(first_name, last_name)')
    .order('created_at', { ascending: false })

  return (
    <div className={styles.container}>
      <div className={styles.projectHeader}>
        <div>
          <h1 className={styles.projectTitle}>Tasks</h1>
          <p className={styles.projectSub}>Board created {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      <div className={styles.tabsBar} style={{display: 'none'}}></div>

      <div className={styles.boardContainer}>
        <KanbanBoard initialTasks={tasks || []} />
      </div>
    </div>
  )
}
