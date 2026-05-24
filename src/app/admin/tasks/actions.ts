'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendDiscordNotification } from '@/utils/discord'

export async function addTask(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string

  if (!title) return

  const { error } = await supabase
    .from('tasks')
    .insert([{ title, description, status }])

  if (!error) {
    await sendDiscordNotification(
      'YENİ TASK 📋', 
      `**${title}**\n${description || ''}\nStatus: ${status}`,
      15258703 // Yellow color
    );
    revalidatePath('/admin/tasks')
  }
}

export async function updateTaskStatus(id: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (!error) {
    revalidatePath('/admin/tasks')
  }
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (!error) {
    revalidatePath('/admin/tasks')
  }
}

export async function editTask(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  
  if (!title) return

  const { error } = await supabase
    .from('tasks')
    .update({ title, description, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (!error) {
    revalidatePath('/admin/tasks')
  }
}
