'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addNote(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('notes')
    .insert([{ title, content, created_by: user.id }])

  if (!error) {
    revalidatePath('/admin/notes')
  }
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (!error) {
    revalidatePath('/admin/notes')
  }
}
