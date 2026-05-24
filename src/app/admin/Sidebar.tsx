'use client'

import styles from './layout.module.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '../login/actions'

export default function Sidebar({ userEmail, userInitial }: { userEmail: string, userInitial: string }) {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>⚙️</span> HYPE DEV
      </div>
      
      <div className={styles.navSection} style={{display: 'none'}}></div>

      <nav className={styles.navMenu}>
        <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}>
          <span className={styles.navIcon}>🏠</span> Panel
        </Link>
        
        <div className={styles.navGroup}>
          <div className={styles.navGroupTitle}>
            <span className={styles.navIcon}>📁</span> Lövhələr
          </div>
          <Link href="/admin/tasks" className={`${styles.navLink} ${styles.subLink} ${pathname.includes('/admin/tasks') ? styles.active : ''}`}>
            📄 Tasklar
          </Link>
          <Link href="/admin/calendar" className={`${styles.navLink} ${styles.subLink} ${pathname.includes('/admin/calendar') ? styles.active : ''}`}>
            📅 Təqvim
          </Link>
          <Link href="/admin/notes" className={`${styles.navLink} ${styles.subLink} ${pathname.includes('/admin/notes') ? styles.active : ''}`}>
            📝 Qeydlər
          </Link>
        </div>

        <Link href="/admin/settings" className={`${styles.navLink} ${pathname.includes('/admin/settings') ? styles.active : ''}`}>
          <span className={styles.navIcon}>⚙️</span> Tənzimləmələr
        </Link>
      </nav>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          {userInitial}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{userEmail.split('@')[0]}</div>
          <div className={styles.userEmail}>{userEmail}</div>
        </div>
        <form action={logout} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutBtn} title="Çıxış">⏻</button>
        </form>
      </div>
    </aside>
  )
}
