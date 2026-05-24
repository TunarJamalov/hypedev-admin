import { createClient } from '@/utils/supabase/server'
import { addNote, deleteNote } from './actions'
import styles from './page.module.css'

export default async function NotesPage() {
  const supabase = await createClient()
  
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Qeydlər</h1>
        <p>Layihə üzrə bütün qeydləriniz burada saxlanılır.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.addForm}>
          <h2>Yeni Qeyd</h2>
          <form action={addNote} className={styles.form}>
            <input 
              type="text" 
              name="title" 
              placeholder="Qeydin başlığı" 
              required 
              className={styles.input}
            />
            <textarea 
              name="content" 
              placeholder="Məzmun" 
              className={styles.textarea}
              required
            />
            <button type="submit" className={styles.submitBtn}>Yadda saxla</button>
          </form>
        </div>

        <div className={styles.notesGrid}>
          {notes && notes.length > 0 ? (
            notes.map(note => (
              <div key={note.id} className={styles.noteCard}>
                <div className={styles.noteHeader}>
                  <h3>{note.title}</h3>
                  <form action={async () => {
                    'use server'
                    await deleteNote(note.id)
                  }}>
                    <button type="submit" className={styles.deleteBtn}>Sil</button>
                  </form>
                </div>
                <p className={styles.noteContent}>{note.content}</p>
                <div className={styles.noteFooter}>
                  <span>{new Date(note.created_at).toLocaleDateString('az-AZ')}</span>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>Heç bir qeyd tapılmadı.</p>
          )}
        </div>
      </div>
    </div>
  )
}
