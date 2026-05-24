import { login } from './actions'
import styles from './page.module.css'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const params = await searchParams;
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span>⚙️</span>
          <span>HYPE DEV</span>
        </div>
        <h2 className={styles.title}>Xoş gəldiniz</h2>
        <p className={styles.subtitle}>Admin panelinə daxil olun</p>

        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="email@example.com" required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Şifrə</label>
            <input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>

          {params?.message && (
            <div className={styles.errorMessage}>{params.message}</div>
          )}
          
          <button formAction={login} className={styles.loginBtn}>Daxil ol</button>
        </form>
      </div>
    </div>
  )
}
