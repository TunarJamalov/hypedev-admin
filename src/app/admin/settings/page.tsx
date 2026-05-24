import SettingsClient from './SettingsClient'
import styles from './page.module.css'
import { createClient } from '@/utils/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  let isGoogleLinked = false
  let googleEmail = ''
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.identities) {
      const googleIdentity = user.identities.find(id => id.provider === 'google')
      isGoogleLinked = !!googleIdentity
      googleEmail = googleIdentity?.identity_data?.email || ''
    }
  } catch (e) {
    // ignore
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ayarlar</h1>
        <p>Hesab tənzimləmələrini və şəxsi məlumatları idarə edin.</p>
      </div>

      <div className={styles.content}>
        <SettingsClient isGoogleLinked={isGoogleLinked} googleEmail={googleEmail} />
      </div>
    </div>
  )
}
