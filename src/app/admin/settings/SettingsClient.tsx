'use client'

import { useState } from 'react'
import { updatePassword } from './actions'
import { createClient } from '@/utils/supabase/client'
import styles from './page.module.css'

type Props = {
  isGoogleLinked: boolean
  googleEmail: string
}

export default function SettingsClient({ isGoogleLinked, googleEmail }: Props) {
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null)
  const [linking, setLinking] = useState(false)
  const [linked, setLinked] = useState(isGoogleLinked)

  const handleSubmit = async (formData: FormData) => {
    setMessage(null)
    const result = await updatePassword(formData)
    
    if (result.error) {
      setMessage({ text: result.error, type: 'error' })
    } else if (result.success) {
      setMessage({ text: result.success, type: 'success' })
    }
  }

  const handleLinkGoogle = async () => {
    setLinking(true)
    const supabase = createClient()
    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'https://www.googleapis.com/auth/calendar.events'
      }
    })
    if (error) {
      alert('Xəta baş verdi: ' + error.message)
      setLinking(false)
    }
    // If no error, browser redirects to Google automatically
  }

  return (
    <div className={styles.settingsCard}>
      <h2>Şifrənin Yenilənməsi</h2>
      <p className={styles.description}>
        Hesabınızın təhlükəsizliyi üçün şifrənizi vaxtaşırı yeniləməyiniz tövsiyə olunur.
      </p>
      
      <form action={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="password">Yeni Şifrə</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Yeni Şifrə (Təkrar)</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            required 
            className={styles.input}
          />
        </div>

        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <button type="submit" className={styles.submitBtn}>Şifrəni Yenilə</button>
      </form>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Google Calendar İnteqrasiyası</h3>
        <p className={styles.description} style={{ marginBottom: '1.25rem' }}>
          Təqvimdə yaratdığınız iclasların şəxsi Google Təqviminizə düşməsi üçün Google hesabınızı əlaqələndirin.
        </p>

        {linked ? (
          <div className={styles.connectedBadge}>
            <span>✅</span>
            <div>
              <strong>Google Hesabı Qoşulub</strong>
              {googleEmail && <p style={{ margin: '0.15rem 0 0', fontSize: '0.85rem', opacity: 0.8 }}>{googleEmail}</p>}
            </div>
          </div>
        ) : (
          <button
            onClick={handleLinkGoogle}
            disabled={linking}
            className={styles.submitBtn}
            style={{ backgroundColor: '#4285F4', color: '#fff', border: 'none', opacity: linking ? 0.7 : 1 }}
          >
            {linking ? 'Yönləndirilir...' : '🔗 Google Hesabını Qoş'}
          </button>
        )}
      </div>
    </div>
  )
}
