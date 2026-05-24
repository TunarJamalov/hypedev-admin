import { createClient } from '@/utils/supabase/server'
import CalendarClient from './CalendarClient'
import styles from './page.module.css'

export default async function CalendarPage() {
  const supabase = await createClient()

  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .order('start_time', { ascending: true })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Təqvim</h1>
        <p>Tarixi klikləyərək yeni iclas əlavə edin. İclasa klikləyin ətraflı baxmaq və ya silmək üçün.</p>
      </div>
      <CalendarClient initialMeetings={meetings || []} />
    </div>
  )
}
