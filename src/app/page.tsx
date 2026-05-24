import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Hype Dev</div>
        <div className={styles.navLinks}>
          <a href="#about">Haqqımızda</a>
          <a href="#projects">Layihələr</a>
          <a href="#contact">Əlaqə</a>
          {/* Admin panelinə keçid (Yalnız subdomendən fərqli olaraq birbaşa link, ya da test üçün) */}
          <Link href="/admin" className={styles.adminLink}>Admin Panel</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Gələcəyin rəqəmsal həlləri<br /><span className={styles.highlight}>Hype Dev</span> ilə.</h1>
          <p className={styles.description}>
            Biz, Ruhlan və Tunar olaraq, ən müasir texnologiyalarla premium veb layihələr və 
            tətbiqlər hazırlayırıq. İdeyalarınızı reallığa çevirmək üçün buradayıq.
          </p>
          <div className={styles.ctaGroup}>
            <a href="#projects" className={styles.primaryBtn}>İşlərimizə baxın</a>
            <a href="#contact" className={styles.secondaryBtn}>Bizimlə əlaqə</a>
          </div>
        </section>

        <section id="about" className={styles.aboutSection}>
          <h2>Biz Kimik?</h2>
          <div className={styles.team}>
            <div className={styles.teamCard}>
              <div className={styles.avatarPlaceholder}>R</div>
              <h3>Ruhlan</h3>
              <p>Data analitik. Verilənlərin analizi və dəyərləndirilməsi üzrə ixtisaslaşıb.</p>
            </div>
            <div className={styles.teamCard}>
              <div className={styles.avatarPlaceholder}>T</div>
              <h3>Tunar</h3>
              <p>Backend Developer. PHP, Node.js və mürəkkəb arxa plan sistemləri üzrə ixtisaslaşıb.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Hype Dev. Bütün hüquqlar qorunur.</p>
      </footer>
    </div>
  )
}
