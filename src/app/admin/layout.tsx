import styles from './layout.module.css'
import { createClient } from '@/utils/supabase/server'
import Sidebar from './Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userEmail = user?.email || 'admin@hypedev.com'
  const userInitial = userEmail.charAt(0).toUpperCase()

  return (
    <div className={styles.adminContainer}>
      <Sidebar userEmail={userEmail} userInitial={userInitial} />
      
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button className={styles.iconBtn}>◰</button>
          </div>
          <div className={styles.headerRight}>
          </div>
        </header>
        
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  )
}
